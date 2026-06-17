# Artifact Latest AgentFlight Placeholder Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `agentloop artifacts` choose `tasks.latest` from ordinary task contracts only while preserving AgentFlight placeholder reporting.

**Architecture:** `getArtifactInventory()` already splits AgentFlight placeholders from ordinary tasks. The fix should use the ordinary task list for `tasks.latest`, keep `agentFlightPlaceholders.latest` based on placeholders, and let existing Markdown and JSON renderers consume those fields without broader behavior changes.

**Tech Stack:** TypeScript, Node.js, Vitest, execa CLI tests, AgentLoopKit artifact inventory helpers.

---

### Task 1: Add RED Artifact Inventory Coverage

**Files:**
- Modify: `tests/artifacts.test.ts`

- [x] **Step 1: Update mixed ordinary/placeholder task expectation**

Change the existing `separates AgentFlight placeholder task artifacts from ordinary task counts` test so the ordinary task is the latest ordinary task even when a newer AgentFlight placeholder exists:

```ts
expect(inventory.tasks).toMatchObject({
  count: 1,
  byStatus: {
    'in-progress': 1,
  },
  latest: {
    path: '.agentloop/tasks/2026-06-10-real-task.md',
    title: 'Real task',
    status: 'in-progress',
  },
  agentFlightPlaceholders: {
    count: 1,
    latest: {
      path: '.agentloop/tasks/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory.md',
      title,
      status: 'deferred',
      source: 'agentflight-placeholder',
    },
  },
});
```

Update Markdown assertions in the same test:

```ts
expect(markdownResult.stdout).toContain('- Tasks: 1 total (`in-progress`: 1)');
expect(markdownResult.stdout).toContain('- AgentFlight placeholder tasks: 1 preserved');
expect(markdownResult.stdout).toContain(
  '- Latest task: `Real task` (`in-progress`) - `.agentloop/tasks/2026-06-10-real-task.md`',
);
expect(latestTaskResult.stdout).toContain(
  '- Latest task: `Real task` (`in-progress`) - `.agentloop/tasks/2026-06-10-real-task.md`',
);
```

- [x] **Step 2: Add placeholder-only regression test**

Add a test after the mixed task test:

```ts
test('does not use AgentFlight placeholders as latest task when no ordinary tasks exist', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeConfig(dir);
  const title = 'Only placeholder task';
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/2026-06-16-only-placeholder-task.md',
    agentFlightPlaceholderMarkdown(title),
    '2026-06-16T09:00:00.000Z',
  );

  const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
    cwd: dir,
    reject: false,
  });
  const markdownResult = await execa(tsxPath, [cliPath, 'artifacts'], {
    cwd: dir,
    reject: false,
  });
  const latestTaskResult = await execa(
    tsxPath,
    [cliPath, 'artifacts', '--type', 'task', '--latest'],
    {
      cwd: dir,
      reject: false,
    },
  );

  expect(jsonResult.exitCode).toBe(0);
  expect(markdownResult.exitCode).toBe(0);
  expect(latestTaskResult.exitCode).toBe(0);
  const inventory = JSON.parse(jsonResult.stdout);
  expect(inventory.tasks).toMatchObject({
    count: 0,
    byStatus: {},
    latest: null,
    agentFlightPlaceholders: {
      count: 1,
      latest: {
        path: '.agentloop/tasks/2026-06-16-only-placeholder-task.md',
        title,
        status: 'deferred',
        source: 'agentflight-placeholder',
      },
    },
  });
  expect(markdownResult.stdout).toContain('- Tasks: 0 total');
  expect(markdownResult.stdout).toContain('- AgentFlight placeholder tasks: 1 preserved');
  expect(markdownResult.stdout).toContain('- Latest task: not found');
  expect(latestTaskResult.stdout).toContain('No task artifacts found.');
});
```

- [x] **Step 3: Run RED test**

Run:

```bash
npm test -- tests/artifacts.test.ts
```

Expected: FAIL because `inventory.tasks.latest` and Markdown latest task still point at the AgentFlight placeholder.

### Task 2: Implement Minimal Inventory Fix

**Files:**
- Modify: `src/core/artifacts.ts`
- Test: `tests/artifacts.test.ts`

- [x] **Step 1: Change latest task source**

In `getArtifactInventory()`, change:

```ts
latest: taskArtifacts.at(-1) ?? null,
```

to:

```ts
latest: tasks.at(-1) ?? null,
```

- [x] **Step 2: Run focused GREEN test**

Run:

```bash
npm test -- tests/artifacts.test.ts
```

Expected: PASS.

### Task 3: Document Public CLI Behavior

**Files:**
- Modify: `docs/cli-reference.md`

- [x] **Step 1: Clarify task latest semantics**

In the `artifacts` command description, add that ordinary latest task selection excludes AgentFlight placeholder contracts while placeholder count/latest metadata remains available under the preserved placeholder section.

- [x] **Step 2: Run public-doc checks**

Run:

```bash
npm run check:public-docs
```

Expected: PASS.

### Task 4: Bug Pass and Verification

**Files:**
- No planned source edits unless verification reveals a defect.

- [x] **Step 1: Run manual bug pass commands**

Run:

```bash
npx --no-install tsx src/cli/index.ts artifacts --json
npx --no-install tsx src/cli/index.ts artifacts --type task --latest
```

Expected: `tasks.latest` is an ordinary task or `null`; preserved placeholders remain under `agentFlightPlaceholders`.

- [x] **Step 2: Run task verification commands**

Run:

```bash
npm test -- tests/artifacts.test.ts
npm run typecheck
npm run lint
npm run build
npm test
```

Expected: PASS.

- [x] **Step 3: Run AgentLoop verification and post-verification gate**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-exclude-agentflight-placeholders-from-artifact-latest-task.md --task-commands --write-run --redact-paths --progress
npm run dogfood:strict
```

Expected: PASS.
