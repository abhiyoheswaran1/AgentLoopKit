# Task List AgentFlight Placeholder Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make human `agentloop task list` output show real task contracts before preserved AgentFlight placeholder contracts.

**Architecture:** Keep `listTasks` and JSON output unchanged so scripts still receive the same flat task array. Group only the human renderer in `src/cli/commands/task.ts`, printing ordinary tasks under `Task contracts:` and exact AgentFlight placeholders under a separate `AgentFlight placeholders:` section.

**Tech Stack:** TypeScript, Commander CLI, Vitest, existing Markdown inline formatter.

---

### Task 1: Human Task List Grouping

**Files:**
- Modify: `tests/task-state.test.ts`
- Modify: `src/cli/commands/task.ts`
- Modify: `docs/cli-reference.md`
- Modify: `docs/status.md`

- [x] **Step 1: Write the failing CLI regression test**

Add a test near the existing AgentFlight task-list output coverage in `tests/task-state.test.ts`:

```ts
test('groups AgentFlight placeholders after ordinary task contracts in task list output', async () => {
  const { dir } = await createTaskStateFixture();
  const placeholderTitle = 'Group AgentFlight placeholders in task list';
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-16-group-agentflight-placeholders-in-task-list-2.md'),
    agentFlightPlaceholderMarkdown(placeholderTitle),
  );
  await writeFile(
    path.join(dir, '.agentloop/tasks/2026-06-16-real-deferred.md'),
    '# Real deferred\n\n- Status: deferred\n',
  );

  const result = await execa(tsxPath, [cliPath, 'task', 'list'], {
    cwd: dir,
    timeout: CLI_PROCESS_TIMEOUT_MS,
  });

  const realIndex = result.stdout.indexOf('`Real deferred` (`deferred`)');
  const sectionIndex = result.stdout.indexOf('AgentFlight placeholders:');
  const placeholderIndex = result.stdout.indexOf(
    '`Group AgentFlight placeholders in task list` (`deferred`, `AgentFlight placeholder`)',
  );
  expect(realIndex).toBeGreaterThan(-1);
  expect(sectionIndex).toBeGreaterThan(realIndex);
  expect(placeholderIndex).toBeGreaterThan(sectionIndex);
  expect(result.stdout).toContain(
    '  `.agentloop/tasks/2026-06-16-group-agentflight-placeholders-in-task-list-2.md`',
  );
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: FAIL because current human output prints AgentFlight placeholders inline before the ordinary real deferred task.

- [x] **Step 3: Implement human-only grouping**

In `src/cli/commands/task.ts`, change `printTasks` after the empty-state branch to split tasks before printing:

```ts
const placeholderTasks = tasks.filter((task) => task.source === 'agentflight-placeholder');
const ordinaryTasks = tasks.filter((task) => task.source !== 'agentflight-placeholder');

if (ordinaryTasks.length > 0) {
  console.log('Task contracts:');
  for (const task of ordinaryTasks) {
    printTaskListItem(task);
  }
}

if (placeholderTasks.length > 0) {
  if (ordinaryTasks.length > 0) console.log('');
  console.log('AgentFlight placeholders:');
  for (const task of placeholderTasks) {
    printTaskListItem(task);
  }
}
```

Extract the existing per-task rendering into a small `printTaskListItem(task: ListedTask)` helper so status labels stay exactly the same:

```ts
function printTaskListItem(task: ListedTask) {
  const marker = task.active ? '*' : '-';
  const activeLabel = task.active ? ' active' : '';
  const statusLabel =
    task.source === 'agentflight-placeholder'
      ? `${inlineCode(task.status)}, ${inlineCode('AgentFlight placeholder')}`
      : inlineCode(task.status);
  console.log(`${marker} ${inlineCode(task.title)} (${statusLabel})${activeLabel}`);
  console.log(`  ${inlineCode(task.path)}`);
}
```

- [x] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: PASS for the new regression and existing task-state coverage.

- [x] **Step 5: Update public docs**

Update `docs/cli-reference.md` and `docs/status.md` to say human `task list` groups exact AgentFlight placeholder contracts into a separate preserved section, while `task list --json` keeps the flat task array.

- [x] **Step 6: Run verification and bug pass**

Run:

```bash
npm run typecheck
npm run lint
npm test
npx --no-install tsx src/cli/index.ts task list
```

Expected: all checks pass, and manual output shows real task contracts before `AgentFlight placeholders:`.

### Self-Review

- Spec coverage: task contract acceptance criteria map to the CLI regression, renderer change, JSON non-change, and docs update.
- Placeholder scan: no `TBD` or undefined implementation references remain.
- Scope check: this is one renderer-only task; no task-state, status, next, archive, JSON, release, or AgentFlight behavior changes are planned.
