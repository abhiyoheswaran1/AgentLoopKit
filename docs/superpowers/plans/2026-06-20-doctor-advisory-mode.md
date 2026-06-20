# Doctor Advisory Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an explicit advisory mode for `agentloop doctor` so onboarding and trial scripts can show diagnostics without failing the shell.

**Architecture:** Keep doctor diagnostics in `src/core/doctor.ts` and make advisory mode a visible property of the result. The CLI should pass the flag through and use it only to suppress non-zero process exit, while leaving `overallStatus` untouched.

**Tech Stack:** TypeScript CLI, Commander, Vitest, Markdown docs.

---

### Task 1: TDD For Advisory Doctor

**Files:**

- Modify: `tests/doctor.test.ts`

- [x] **Step 1: Add the failing JSON behavior test**

Add this test in the `doctor` describe block:

```ts
test('advisory mode exits zero while keeping failing JSON diagnostics', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);

  const defaultResult = await execa(tsxPath, [cliPath, 'doctor', '--json'], {
    cwd: dir,
    reject: false,
  });
  const advisoryResult = await execa(tsxPath, [cliPath, 'doctor', '--advisory', '--json'], {
    cwd: dir,
    reject: false,
  });

  expect(defaultResult.exitCode).toBe(1);
  const defaultDoctor = JSON.parse(defaultResult.stdout);
  expect(defaultDoctor.overallStatus).toBe('fail');
  expect(defaultDoctor.advisory).toBe(false);

  expect(advisoryResult.exitCode).toBe(0);
  const advisoryDoctor = JSON.parse(advisoryResult.stdout);
  expect(advisoryDoctor.overallStatus).toBe('fail');
  expect(advisoryDoctor.advisory).toBe(true);
  expect(advisoryDoctor.checks).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'agentloop.config.json',
        status: 'fail',
      }),
    ]),
  );
});
```

- [x] **Step 2: Add the failing human output test**

Add this test in the `doctor` describe block:

```ts
test('advisory mode labels human output and keeps failure details', async () => {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await initGitRepository(dir);

  const result = await execa(tsxPath, [cliPath, 'doctor', '--advisory', '--redact-paths'], {
    cwd: dir,
    reject: false,
  });

  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain('- Overall status: `fail`');
  expect(result.stdout).toContain('- Advisory mode: `enabled`');
  expect(result.stdout).toContain('- [`fail`] `agentloop.config.json`:');
  expect(result.stdout).toContain('Run `agentloop init`');
});
```

- [x] **Step 3: Run the focused tests and confirm they fail because the flag is missing**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/doctor.test.ts -t "advisory mode"
```

Expected: FAIL because `--advisory` is not implemented.

### Task 2: Implement Advisory Mode

**Files:**

- Modify: `src/core/doctor.ts`
- Modify: `src/cli/commands/doctor.ts`

- [x] **Step 1: Extend the doctor result type**

Add `advisory: boolean` to `DoctorResult` and `advisory?: boolean` to `runDoctor` options.

- [x] **Step 2: Render advisory mode**

In `runDoctor`, compute:

```ts
const advisory = options.advisory ?? false;
```

Add this line after strict mode in the Markdown header:

```md
- Advisory mode: `enabled`
```

when advisory is true, and `disabled` otherwise.

- [x] **Step 3: Return advisory mode in JSON**

Return `advisory` in the `DoctorResult`.

- [x] **Step 4: Add the CLI option and exit-code logic**

In `doctorCommand`, add:

```ts
.option('--advisory', 'print diagnostics without failing the process')
```

Pass `advisory: options.advisory === true` into `runDoctor`.

Set non-zero exit only when advisory mode is not enabled:

```ts
if (!options.advisory && result.overallStatus === 'fail') process.exitCode = 1;
```

- [x] **Step 5: Run focused doctor tests**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/doctor.test.ts
```

Expected: PASS.

### Task 3: Documentation And Product Evidence

**Files:**

- Modify: `docs/cli-reference.md`
- Modify: `docs/real-repo-trials.md`
- Modify: `README.md`
- Modify: `.agentloop/backlog.md`
- Modify: `DECISIONS.md`
- Modify: `CHANGELOG.md`

- [x] **Step 1: Update CLI reference**

Document `agentloop doctor --advisory` and explain that advisory mode keeps diagnostics and status intact while exiting `0`.

- [x] **Step 2: Update real-repo trial checklist**

Change the first preflight command to:

```bash
npx --yes agentloopkit@latest doctor --advisory --redact-paths
```

Add one sentence explaining that trial preflight is advisory, while `doctor` and `doctor --strict` remain suitable gates.

- [x] **Step 3: Update README command list**

Mention `--advisory` near doctor examples where first-run or existing-repo update commands are shown.

- [x] **Step 4: Update backlog, decisions, and changelog**

Record the internal research cycle and unreleased behavior change. Do not claim real user feedback.

### Task 4: Verification And Handoff

**Files:**

- Modify: `.agentloop/tasks/2026-06-20-make-doctor-pre-init-safe-for-copy-paste-trials.md`

- [x] **Step 1: Run task verification commands**

Run:

```bash
npx --no-install agentloop verify --task .agentloop/tasks/2026-06-20-make-doctor-pre-init-safe-for-copy-paste-trials.md --task-commands --only-task-commands --progress --timeout-ms 900000 --write-run --redact-paths
```

- [x] **Step 2: Run post-verification gates**

Run:

```bash
npx --no-install agentloop ship --redact-paths
npm run dogfood:strict
```

- [x] **Step 3: Close task evidence**

If verification and gates pass, run:

```bash
npx --no-install agentloop task done
npx --no-install agentloop task archive .agentloop/tasks/2026-06-20-make-doctor-pre-init-safe-for-copy-paste-trials.md
```

## Self-Review

- Spec coverage: covers advisory CLI behavior, exit-code compatibility, docs, research evidence, and verification.
- Placeholder scan: no TODO, TBD, or vague implementation steps.
- Type consistency: `advisory` is the same property name in CLI options, core result, JSON output, docs, and tests.
