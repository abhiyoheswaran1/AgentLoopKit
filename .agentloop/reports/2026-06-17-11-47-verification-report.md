# Verification Report

- Timestamp: `2026-06-17T09:47:04.992Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- Title: `Filter task list by status`
- Task type: `feature`
- Status: `in-progress`





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
   Start at  11:47:06
   Duration  226.44s (transform 1.12s, setup 0ms, import 4.39s, tests 1954.81s, environment 5ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

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
ESM ⚡️ Build success in 59ms
DTS Build start
DTS ⚡️ Build success in 1062ms
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
   Start at  11:51:07
   Duration  4.76s (transform 96ms, setup 0ms, import 168ms, tests 4.38s, environment 0ms)

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
   Start at  11:51:13
   Duration  4.10s (transform 83ms, setup 0ms, import 130ms, tests 3.77s, environment 0ms)

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
   Start at  11:51:19
   Duration  87.43s (transform 85ms, setup 0ms, import 153ms, tests 86.94s, environment 0ms)

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
ESM ⚡️ Build success in 56ms
DTS Build start
DTS ⚡️ Build success in 1321ms
DTS dist/cli/index.d.ts 13.00 B
```

## Post-Verification Gates
### post-verification: `npm run dogfood:strict`

- Exit code: 0
- Status: pass


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
AgentLoopKit: task="Filter task list by status" status="in-progress"; verification=pass; run="verify fail"; tree=dirty (2747; 105 non-evidence, 2642 AgentLoop evidence); next="agentloop task done"
Reason: Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

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
$ npx 

[output truncated: showing first 2500 and last 2500 characters of 9197 total]

task list by status` (`in-progress`) - `.agentloop/tasks/2026-06-17-filter-task-list-by-status.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-11-47-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `107` AgentFlight placeholder task(s), `534` verification report(s), `885` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-11-24-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (2747; 105 non-evidence, 2642 AgentLoop evidence)`

## Recent Runs

- `verify` `fail` - `2743` changed file(s) (`105` non-evidence, `2638` AgentLoop evidence) - `2026-06-17-11-45-verify`
- `verify` `fail` - `2739` changed file(s) (`105` non-evidence, `2634` AgentLoop evidence) - `2026-06-17-11-38-verify`
- `ship` `92`/100 - `2728` changed file(s) (`105` non-evidence, `2623` AgentLoop evidence) - `2026-06-17-11-24-ship`

## Next Action

Run `agentloop task done`.

Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## Safety

This snapshot is read-only. It does not run commands, write files, include full Markdown artifact bodies, read `.env` contents, or call external APIs.


## agentflight session health
$ npx --yes agentflight doctor
AgentFlight Doctor

Overall: OK

- OK Node.js version: v26.3.0 satisfies AgentFlight's Node.js 20+ target.
- OK npm availability: npm 11.16.0 is available.
- OK git availability: git is available.
- OK repository root: [git-root]
- OK package manager: pnpm
- OK .agentflight presence: .agentflight exists.
- OK config validity: .agentflight/config.json is valid.
- OK .agentflight writable: .agentflight is writable.
- OK current session: A current session exists.
- OK ProjScan availability: ProjScan is available.
- OK AgentLoopKit availability: AgentLoopKit is available.
- OK test script: npm run test is configured.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!

Dogfood gate passed.
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
