# Verification Report

- Timestamp: `2026-06-17T09:39:11.988Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- Title: `Filter task list by status`
- Task type: `feature`
- Status: `in-progress`




## Failure Summary
### test: `npx pnpm@10.12.1 test`

- Exit code: 1

```text
     96|     const { dir, config } = await createTaskStateFixture();
     97|
     98|     const active = await setActiveTask({ cwd: dir, config, taskPath });
       |                                                            ^
     99|
    100|     expect(active.path).toBe('.agentloop/tasks/2026-06-09-demo.md');
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 62 passed (63)
      Tests  1 failed | 789 passed (790)
   Start at  11:39:14
   Duration  242.63s (transform 941ms, setup 0ms, import 4.24s, tests 1872.90s, environment 5ms)
 ELIFECYCLE  Test failed. See above for more details.
```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 2

```text
> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit
tests/task-state.test.ts(98,60): error TS2552: Cannot find name 'taskPath'. Did you mean 'tsxPath'?
tests/task-state.test.ts(101,64): error TS2552: Cannot find name 'taskPath'. Did you mean 'tsxPath'?
 ELIFECYCLE  Command failed with exit code 2.
```

### task: `npm test -- tests/task-state.test.ts`

- Exit code: 1

```text
 ❯ tests/task-state.test.ts:98:60
     96|     const { dir, config } = await createTaskStateFixture();
     97|
     98|     const active = await setActiveTask({ cwd: dir, config, taskPath });
       |                                                            ^
     99|
    100|     expect(active.path).toBe('.agentloop/tasks/2026-06-09-demo.md');
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed (1)
      Tests  1 failed | 75 passed (76)
   Start at  11:43:40
   Duration  70.10s (transform 85ms, setup 0ms, import 209ms, tests 69.69s, environment 0ms)
```

### post-verification: `npm run dogfood:strict`

- Exit code: 1

```text
- [`pass`] `Task contract`: `Filter task list by status` - `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- [`fail`] `Verification report`: `Overall status: fail` - `.agentloop/reports/2026-06-17-11-39-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-17-11-24-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `2743 changed file(s) detected (105 non-evidence, 2638 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
## Next Action
Run `agentloop verify --task .agentloop/tasks/2026-06-17-filter-task-list-by-status.md`.
Run verification and fix failures before review.
Dogfood gate failed: review evidence gates failed with exit code 1
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]

 ❯ tests/task-state.test.ts (76 tests | 1 failed) 81968ms
     × sets, reads, and clears an active task path 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/task-state.test.ts > task state > sets, reads, and clears an active task path
ReferenceError: taskPath is not defined
 ❯ tests/task-state.test.ts:98:60
     96|     const { dir, config } = await createTaskStateFixture();
     97|
     98|     const active = await setActiveTask({ cwd: dir, config, taskPath });
       |                                                            ^
     99|
    100|     expect(active.path).toBe('.agentloop/tasks/2026-06-09-demo.md');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 62 passed (63)
      Tests  1 failed | 789 passed (790)
   Start at  11:39:14
   Duration  242.63s (transform 941ms, setup 0ms, import 4.24s, tests 1872.90s, environment 5ms)

 ELIFECYCLE  Test failed. See above for more details.
```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 2
- Status: fail


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

tests/task-state.test.ts(98,60): error TS2552: Cannot find name 'taskPath'. Did you mean 'tsxPath'?
tests/task-state.test.ts(101,64): error TS2552: Cannot find name 'taskPath'. Did you mean 'tsxPath'?
 ELIFECYCLE  Command failed with exit code 2.
```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     487.97 KB
ESM dist/cli/index.js.map 914.13 KB
ESM ⚡️ Build success in 65ms
DTS Build start
DTS ⚡️ Build success in 1208ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/task-state.test.ts -t "task list status"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/task-state.test.ts -t task list status


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  4 passed | 72 skipped (76)
   Start at  11:43:32
   Duration  3.54s (transform 94ms, setup 0ms, import 182ms, tests 3.19s, environment 0ms)

```

### task: `npm test -- tests/completion.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/completion.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  11:43:36
   Duration  2.59s (transform 93ms, setup 0ms, import 143ms, tests 2.32s, environment 0ms)

```

### task: `npm test -- tests/task-state.test.ts`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.35.2 test
> vitest run tests/task-state.test.ts


 RUN  v4.1.8 [git-root]

 ❯ tests/task-state.test.ts (76 tests | 1 failed) 69692ms
     × sets, reads, and clears an active task path 8ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/task-state.test.ts > task state > sets, reads, and clears an active task path
ReferenceError: taskPath is not defined
 ❯ tests/task-state.test.ts:98:60
     96|     const { dir, config } = await createTaskStateFixture();
     97|
     98|     const active = await setActiveTask({ cwd: dir, config, taskPath });
       |                                                            ^
     99|
    100|     expect(active.path).toBe('.agentloop/tasks/2026-06-09-demo.md');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 75 passed (76)
   Start at  11:43:40
   Duration  70.10s (transform 85ms, setup 0ms, import 209ms, tests 69.69s, environment 0ms)

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     487.97 KB
ESM dist/cli/index.js.map 914.13 KB
ESM ⚡️ Build success in 60ms
DTS Build start
DTS ⚡️ Build success in 1009ms
DTS dist/cli/index.d.ts 13.00 B
```

## Post-Verification Gates
### post-verification: `npm run dogfood:strict`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.35.2 dogfood:strict
> node scripts/dogfood.mjs --strict

# AgentLoopKit Dogfood Gate
Mode: strict

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Filter task list by status" status="in-progress"; verification=fail; run="verify fail"; tree=dirty (2743; 105 non-evidence, 2638 AgentLoop evidence); next="agentloop verify"
Reason: The latest verification report failed. Fix the failures and rerun verification.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.35.2
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --redact-paths
# AgentLoopKit Harness Upgrade

- Overall status: `pass`
- Dry run: `no`
- Writes files: `no`
- Target: `[agentloop-root]`

## Manifest

- `current`: `.agentloop/manifest.json`
- Current template version: `1`
- Local template version: `1`

## Harness Files

- `current`: `AGENTS.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current review-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `fail`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `370a9fe`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `2743; 105 non-evidence, 2638 AgentLoop evidence`

## Gates

- [`pass`] `Task contract`: `Filter task list by status` - `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- [`fail`] `Verification report`: `Overall status: fail` - `.agentloop/reports/2026-06-17-11-39-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-17-11-24-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `2743 changed file(s) detected (105 non-evidence, 2638 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`

## Next Action

Run `agentloop verify --task .agentloop/tasks/2026-06-17-filter-task-list-by-status.md`.

Run verification and fix failures before review.


Dogfood gate failed: review evidence gates failed with exit code 1
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Fix failing commands before claiming completion.
