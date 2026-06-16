# Stale Task State Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect stale AgentLoop task pointers and guide agents back to the current repo work without scanning the whole repository or dumping long context.

**Architecture:** Add a bounded task-state health layer on top of existing task lifecycle code. `task doctor`, `status`, and `next` should read `.agentloop/state.json`, a capped set of task files, recent reports, and recent run records, then produce concise recovery recommendations. A read-only recovery command should print suggested next task-state actions, but it must not mutate files unless the user runs existing explicit task commands.

**Tech Stack:** TypeScript, Node.js file-system APIs, Commander, existing `src/core/task-state.ts`, existing `src/core/status.ts`, existing run/report helpers, Vitest.

---

## File Structure

- Modify `src/core/task-state.ts` to expose safe state-pointer details and add task-state diagnostics.
- Modify `src/core/status.ts` so `status` and `next` can include stale-state recommendations.
- Modify `src/cli/commands/task.ts` so `agentloop task doctor` prints stale-state diagnostics.
- Create `src/core/task-state-recovery.ts` if diagnostics become too large for `task-state.ts`; keep it pure and read-only.
- Modify `tests/task-state.test.ts` for task doctor and recovery diagnostics.
- Modify `tests/status.test.ts` and `tests/next.test.ts` for status and next-action behavior.
- Modify `docs/status.md`, `docs/upgrading-existing-repos.md`, and `AGENTLOOP.md` for recovery guidance.

## Bounded Evidence Rules

Use these caps in the first implementation:

- Inspect at most 25 active task files in `.agentloop/tasks/`.
- Inspect at most 25 archived task files in `.agentloop/tasks/archive/`.
- Inspect at most 10 run directories in `.agentloop/runs/`, sorted by run id descending.
- Inspect at most 10 verification reports in `.agentloop/reports/`, sorted by timestamped filename descending.
- Read at most 64 KB from any Markdown or JSON file.
- Never scan arbitrary repo files, devlogs, changelogs, `.env` files, dependency folders, or home-directory trees.
- Never infer work from prose outside `.agentloop/` in v1.

## Diagnostic Rules

Add diagnostics for these cases:

- `active-task-missing`: `.agentloop/state.json` points at a missing task file.
- `active-task-archived`: `.agentloop/state.json` points at an archived task file.
- `active-task-terminal`: active task exists but status is `done`, `completed`, or `verified`.
- `active-task-deferred`: active task exists but status is `deferred`.
- `active-task-older-than-runs`: active task is older than recent runs or reports and there is no newer open task.
- `recent-evidence-without-active-task`: recent runs or reports exist, but no active task is pinned.

Each diagnostic should include:

- `id`
- `severity`: `warn`
- `message`
- `recommendation`
- `commands`
- `evidence`: compact file refs only, no copied report bodies

## Task 1: Expose Safe State Pointer Details

**Files:**
- Modify `src/core/task-state.ts`
- Test: `tests/task-state.test.ts`

- [ ] **Step 1: Write the failing test**

Add a test that creates `.agentloop/state.json` pointing to a missing Markdown file and expects `inspectTaskDirectory()` to return a stale-state diagnostic.

```ts
test('task doctor warns when active state points to a missing task', async () => {
  const { dir, config } = await createTaskStateFixture();
  await writeFile(
    path.join(dir, '.agentloop/state.json'),
    JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/missing.md' }, null, 2),
  );

  const result = await inspectTaskDirectory({ cwd: dir, config });

  expect(result.overallStatus).toBe('warn');
  expect(result.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 'active-task-missing',
        severity: 'warn',
        path: '.agentloop/tasks/missing.md',
      }),
    ]),
  );
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: the new test fails because `active-task-missing` is not part of `TaskDoctorDiagnostic['id']` and `inspectTaskDirectory()` does not inspect unresolved state pointers.

- [ ] **Step 3: Add read-only state pointer diagnostics**

Implementation shape:

```ts
type TaskStatePointerDiagnostic = {
  id:
    | 'active-task-missing'
    | 'active-task-archived'
    | 'active-task-terminal'
    | 'active-task-deferred'
    | 'active-task-older-than-runs'
    | 'recent-evidence-without-active-task';
  severity: 'warn';
  path: string;
  title: string;
  status: string;
  message: string;
  recommendation: string;
  commands?: string[];
  evidence?: string[];
};
```

Use `readState()`, `resolveTaskPath(... strict: false)`, `pathExists()`, and `readTaskMetadata()` only. Do not write `state.json` from diagnostics.

- [ ] **Step 4: Run focused test and confirm GREEN**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: the missing active-task diagnostic test passes.

## Task 2: Detect Terminal, Deferred, And Archived Active Tasks

**Files:**
- Modify `src/core/task-state.ts`
- Test: `tests/task-state.test.ts`

- [ ] **Step 1: Write failing tests**

Add three tests:

```ts
test('task doctor warns when active state points to an archived task', async () => {
  const { dir, config } = await createTaskStateFixture();
  await mkdir(path.join(dir, '.agentloop/tasks/archive'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/tasks/archive/2026-06-16-old.md'),
    '# Old Task\n\n- Status: done\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/state.json'),
    JSON.stringify({
      version: 1,
      activeTaskPath: '.agentloop/tasks/archive/2026-06-16-old.md',
    }),
  );

  const result = await inspectTaskDirectory({ cwd: dir, config });

  expect(result.diagnostics).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: 'active-task-archived' })]),
  );
});

test('task doctor warns when active state points to a terminal task', async () => {
  const { dir, config } = await createTaskStateFixture();
  await writeFile(path.join(dir, '.agentloop/tasks/done.md'), '# Done\n\n- Status: done\n');
  await writeFile(
    path.join(dir, '.agentloop/state.json'),
    JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/done.md' }),
  );

  const result = await inspectTaskDirectory({ cwd: dir, config });

  expect(result.diagnostics).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: 'active-task-terminal' })]),
  );
});

test('task doctor warns when active state points to a deferred task', async () => {
  const { dir, config } = await createTaskStateFixture();
  await writeFile(
    path.join(dir, '.agentloop/tasks/parked.md'),
    '# Parked\n\n- Status: deferred\n',
  );
  await writeFile(
    path.join(dir, '.agentloop/state.json'),
    JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/parked.md' }),
  );

  const result = await inspectTaskDirectory({ cwd: dir, config });

  expect(result.diagnostics).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: 'active-task-deferred' })]),
  );
});
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: the new diagnostic IDs are missing or not emitted.

- [ ] **Step 3: Implement the diagnostics**

Recommendations:

- Missing task: `Run \`agentloop task clear\`, then \`agentloop task set <path>\` for the current task or \`agentloop create-task\` for new work.`
- Archived active task: `Run \`agentloop task clear\`; archived tasks are kept as evidence, not active work.`
- Terminal active task: `Run \`agentloop task archive <path>\` after verification and handoff, or \`agentloop task clear\` if it is already archived elsewhere.`
- Deferred active task: `Run \`agentloop task clear\` or \`agentloop task set <path>\` for the current open task.`

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: all new stale-state diagnostics pass.

## Task 3: Add Bounded Recent Evidence Scan

**Files:**
- Create `src/core/task-state-recovery.ts` if it keeps `task-state.ts` smaller.
- Modify `src/core/task-state.ts`
- Test: `tests/task-state.test.ts`

- [ ] **Step 1: Write failing tests for capped evidence**

Add tests that create recent run/report files newer than an active task and expect a warning with compact evidence refs.

```ts
test('task doctor warns when active task is older than recent run evidence', async () => {
  const { dir, config } = await createTaskStateFixture();
  await writeFile(path.join(dir, '.agentloop/tasks/old.md'), '# Old\n\n- Status: in-progress\n');
  await writeFile(
    path.join(dir, '.agentloop/state.json'),
    JSON.stringify({ version: 1, activeTaskPath: '.agentloop/tasks/old.md' }),
  );
  await mkdir(path.join(dir, '.agentloop/runs/2026-06-16-20-00-verify'), { recursive: true });
  await writeFile(
    path.join(dir, '.agentloop/runs/2026-06-16-20-00-verify/metadata.json'),
    JSON.stringify({ id: '2026-06-16-20-00-verify', kind: 'verify' }),
  );

  const result = await inspectTaskDirectory({ cwd: dir, config });

  expect(result.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 'active-task-older-than-runs',
        evidence: expect.arrayContaining([
          '.agentloop/runs/2026-06-16-20-00-verify/metadata.json',
        ]),
      }),
    ]),
  );
});
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: no recent-evidence diagnostic exists yet.

- [ ] **Step 3: Implement capped evidence helpers**

Implementation rules:

- Use `readdir(..., { withFileTypes: true })`.
- Sort run directory names descending and take 10.
- Sort report filenames descending and take 10.
- Use `stat()` mtime only as a fallback; prefer timestamped names.
- Read only `metadata.json` for runs and at most the first 64 KB if needed.
- Do not parse or print report bodies.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: capped recent evidence diagnostics pass.

## Task 4: Wire Status And Next Recommendations

**Files:**
- Modify `src/core/status.ts`
- Test: `tests/status.test.ts`
- Test: `tests/next.test.ts`

- [ ] **Step 1: Write failing status and next tests**

Add tests where `state.json` points to a missing task and recent run evidence exists.

Expected human output:

```md
- Active task: stale pointer - `.agentloop/tasks/missing.md`

## Next Action

Run `agentloop task doctor`.
```

Expected JSON shape:

```ts
expect(status.nextAction.command).toBe('agentloop task doctor');
expect(status.nextAction.reason).toContain('active task pointer is stale');
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

```bash
npm test -- tests/status.test.ts tests/next.test.ts
```

Expected: status and next do not recommend task doctor for stale active pointers.

- [ ] **Step 3: Implement recommendation wiring**

Keep `status` and `next` read-only. They should reuse the same diagnostic helper used by `task doctor`, then prefer stale-state recovery recommendations before normal task progression recommendations.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run:

```bash
npm test -- tests/status.test.ts tests/next.test.ts
```

Expected: stale-state recommendations pass without changing existing clean-repo next-action tests.

## Task 5: Add Read-Only Recovery Guidance

**Files:**
- Modify `src/cli/commands/task.ts`
- Test: `tests/task-state.test.ts`

- [ ] **Step 1: Write a failing CLI test**

Add a CLI test that runs:

```bash
agentloop task doctor
```

Expected output:

```md
# Task Doctor

- Overall status: warn

## Diagnostics

- `active-task-missing` in `.agentloop/tasks/missing.md`: Active task pointer points to a missing task contract.
  - Recommendation: Run `agentloop task clear`, then set or create the current task.
  - Commands:
    - `agentloop task clear`
    - `agentloop task set <path>`
    - `agentloop create-task`
```

- [ ] **Step 2: Run the CLI test and confirm RED**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: CLI output does not include the new recovery commands yet.

- [ ] **Step 3: Print recovery commands**

Reuse existing Markdown-safe inline formatting helpers in `src/cli/commands/task.ts`. Keep output compact. Do not include full report excerpts or run metadata bodies.

- [ ] **Step 4: Run the CLI test and confirm GREEN**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: task doctor prints compact recovery commands.

## Task 6: Docs And Harness Updates

**Files:**
- Modify `docs/status.md`
- Modify `docs/upgrading-existing-repos.md`
- Modify `AGENTLOOP.md`
- Modify `src/templates/root/AGENTLOOP.md`

- [ ] **Step 1: Update user docs**

Add a concise section:

```md
## Recovering Stale Task State

Run `agentloop task doctor` when an agent reports old task context, when `.agentloop/state.json` points at a missing task, or when recent reports exist without a current task contract.

AgentLoopKit keeps this recovery check bounded. It reads the active task pointer, current task files, archived task filenames, recent run metadata, and recent report filenames. It does not scan the whole repository, read `.env` files, call external services, or infer task history from arbitrary prose.
```

- [ ] **Step 2: Update generated harness guidance**

Add one sentence to `src/templates/root/AGENTLOOP.md`:

```md
If the active task looks stale or mismatched with recent reports, run `agentloop task doctor` before using long devlogs or changelogs as task context.
```

- [ ] **Step 3: Run docs checks**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Expected: public docs hygiene and Markdown links pass.

## Task 7: Verification And Dogfood

- [ ] **Step 1: Run focused tests**

```bash
npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts
```

- [ ] **Step 2: Run static checks**

```bash
npm run typecheck
npm run lint
```

- [ ] **Step 3: Run AgentLoopKit verification**

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md --task-commands --only-task-commands --write-run --redact-paths --progress
```

- [ ] **Step 4: Run dogfood and dependency tools**

```bash
npm run dogfood:strict
npx --yes agentflight verify -- npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts
npx --yes projscan --format markdown doctor
```

- [ ] **Step 5: Generate handoff evidence**

```bash
npx --no-install tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md --write-run --redact-paths
```

- [ ] **Step 6: Commit**

```bash
git add src/core/task-state.ts src/core/status.ts src/cli/commands/task.ts tests/task-state.test.ts tests/status.test.ts tests/next.test.ts docs/status.md docs/upgrading-existing-repos.md AGENTLOOP.md src/templates/root/AGENTLOOP.md .agentloop
git commit -m "feat: detect stale agentloop task state"
```

Do not cut a release unless the user approves the release after verification.

## Self-Review Notes

- This plan keeps v1 deterministic and local-only.
- It does not scan arbitrary repo prose, changelogs, devlogs, home folders, `.env` files, dependency folders, or network services.
- It preserves explicit user control by recommending existing task commands instead of mutating state during diagnostics.
- It gives agents compact file references instead of long copied context, which keeps token use predictable.
