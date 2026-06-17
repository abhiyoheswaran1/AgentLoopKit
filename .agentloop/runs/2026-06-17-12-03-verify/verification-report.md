# Verification Report

- Timestamp: `2026-06-17T09:58:04.226Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-task-list-status-filter.md`
- Title: `Add built CLI smoke coverage for task list status filter`
- Task type: `tests`
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
      Tests  791 passed (791)
   Start at  11:58:05
   Duration  226.60s (transform 888ms, setup 0ms, import 3.81s, tests 1969.89s, environment 5ms)

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
ESM ⚡️ Build success in 33ms
DTS Build start
DTS ⚡️ Build success in 1014ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/distribution-artifacts.test.ts -t "task list status filter"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts -t task list status filter


 RUN  v4.1.8 [git-root]


 Test Files  1 skipped (1)
      Tests  49 skipped (49)
   Start at  12:02:06
   Duration  240ms (transform 22ms, setup 0ms, import 30ms, tests 0ms, environment 0ms)

```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.35.2
Version smoke passed.
Npm-status captured registry smoke passed.
Release-proof completion smoke passed.
Release-proof HEAD tag smoke passed.
Release-check redaction smoke passed.
Generated artifact filename ordering smoke passed.
Fish task archive completion smoke passed.
Template and completion command smoke passed.
SchemaStore smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Forced home-directory dry-run warning smoke passed.
Init smoke passed.
GitHub metadata dry-run smoke passed.
Harness upgrade smoke passed.
Doctor smoke passed.
Doctor redaction smoke passed.
Create-task smoke passed.
Task-list JSON groups smoke passed.
Task-list status filter smoke passed.
Task-show redaction smoke passed.
Task-doctor redaction smoke passed.
Task lifecycle smoke passed.
Task-command post-verification smoke passed.
Verify smoke passed.
Verify redaction smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates redaction smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Artifacts redaction smoke passed.
Artifact run split smoke passed.
Ship report artifact smoke passed.
Report and badge redaction smoke passed.
CI summary redaction smoke passed.
Release-notes redaction smoke passed.
Status and next redaction smoke passed.
Review-context redaction smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger redaction smoke passed.
Run ledger smoke passed.
Handoff redaction smoke passed.
Summarize redaction smoke passed.
Ship redaction smoke passed.
Prepare-pr smoke passed.
Prepare-pr redaction smoke passed.
Maintainer-check redaction smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Task-doctor archived task evidence smoke passed.
Policy command redaction smoke passed.
Policy pack inventory smoke passed.
Policy pack redaction smoke passed.
Install-agent preservation smoke passed.
Install-agent redaction smoke passed.
Nested cwd smoke passed.
Stale task state recovery smoke passed.
CLI smoke passed.
```

### task: `npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  12:03:21
   Duration  242ms (transform 24ms, setup 0ms, import 32ms, tests 18ms, environment 0ms)

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
ESM ⚡️ Build success in 36ms
DTS Build start
DTS ⚡️ Build success in 987ms
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
AgentLoopKit: task="Add built CLI smoke coverage for task list status filter" status="in-progress"; verification=pass; run="ship 92/100"; tree=dirty (2762; 105 non-evidence, 2657 AgentLoop evidence); next="agentloop task done"
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

#

[output truncated: showing first 2500 and last 2500 characters of 9462 total]

ress`) - `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-task-list-status-filter.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-11-58-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `108` AgentFlight placeholder task(s), `535` verification report(s), `887` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-11-54-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (2762; 105 non-evidence, 2657 AgentLoop evidence)`

## Recent Runs

- `ship` `92`/100 - `2751` changed file(s) (`105` non-evidence, `2646` AgentLoop evidence) - `2026-06-17-11-54-ship`
- `verify` `pass` - `2747` changed file(s) (`105` non-evidence, `2642` AgentLoop evidence) - `2026-06-17-11-53-verify`
- `verify` `fail` - `2743` changed file(s) (`105` non-evidence, `2638` AgentLoop evidence) - `2026-06-17-11-45-verify`

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
