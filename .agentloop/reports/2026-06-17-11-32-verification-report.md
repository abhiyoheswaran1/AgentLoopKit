# Verification Report

- Timestamp: `2026-06-17T09:32:20.103Z`
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
### lint: `npx pnpm@10.12.1 lint`

- Exit code: 1

```text
> agentloopkit@0.35.2 lint [git-root]
> eslint .
[git-root]/tests/task-state.test.ts
  150:26  error  'taskPath' is assigned a value but never used  @typescript-eslint/no-unused-vars
✖ 1 problem (1 error, 0 warnings)
 ELIFECYCLE  Command failed with exit code 1.
```

### post-verification: `npm run dogfood:strict`

- Exit code: 1

```text
- [`pass`] `Task contract`: `Filter task list by status` - `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- [`fail`] `Verification report`: `Overall status: fail` - `.agentloop/reports/2026-06-17-11-32-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-17-11-24-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `2739 changed file(s) detected (105 non-evidence, 2634 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
## Next Action
Run `agentloop verify --task .agentloop/tasks/2026-06-17-filter-task-list-by-status.md`.
Run verification and fix failures before review.
Dogfood gate failed: review evidence gates failed with exit code 1
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  790 passed (790)
   Start at  11:32:21
   Duration  236.12s (transform 1.04s, setup 0ms, import 4.38s, tests 1885.12s, environment 9ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .


[git-root]/tests/task-state.test.ts
  150:26  error  'taskPath' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)

 ELIFECYCLE  Command failed with exit code 1.
```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

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
ESM ⚡️ Build success in 62ms
DTS Build start
DTS ⚡️ Build success in 1170ms
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
   Start at  11:36:32
   Duration  4.76s (transform 111ms, setup 0ms, import 194ms, tests 4.36s, environment 0ms)

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
   Start at  11:36:38
   Duration  4.17s (transform 76ms, setup 0ms, import 121ms, tests 3.94s, environment 0ms)

```

### task: `npm test -- tests/task-state.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/task-state.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  76 passed (76)
   Start at  11:36:43
   Duration  74.34s (transform 89ms, setup 0ms, import 156ms, tests 74.07s, environment 0ms)

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
ESM ⚡️ Build success in 38ms
DTS Build start
DTS ⚡️ Build success in 1184ms
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
AgentLoopKit: task="Filter task list by status" status="in-progress"; verification=fail; run="ship 92/100"; tree=dirty (2739; 105 non-evidence, 2634 AgentLoop evidence); next="agentloop verify"
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
- Changed files: `2739; 105 non-evidence, 2634 AgentLoop evidence`

## Gates

- [`pass`] `Task contract`: `Filter task list by status` - `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- [`fail`] `Verification report`: `Overall status: fail` - `.agentloop/reports/2026-06-17-11-32-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-17-11-24-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `2739 changed file(s) detected (105 non-evidence, 2634 AgentLoop evidence).`
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
