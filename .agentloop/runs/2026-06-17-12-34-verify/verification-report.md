# Verification Report

- Timestamp: `2026-06-17T10:28:13.912Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-stale-artifact-limits-2.md`
- Title: `Add built CLI smoke coverage for stale artifact limits`
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
      Tests  793 passed (793)
   Start at  12:28:15
   Duration  228.52s (transform 1.36s, setup 0ms, import 5.12s, tests 2231.08s, environment 6ms)

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
ESM ⚡️ Build success in 54ms
DTS Build start
DTS ⚡️ Build success in 1160ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/distribution-artifacts.test.ts -t "stale artifact limit smoke"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts -t stale artifact limit smoke


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 50 skipped (51)
   Start at  12:32:22
   Duration  231ms (transform 28ms, setup 0ms, import 38ms, tests 3ms, environment 0ms)

```

### task: `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
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
GitHub metadata write smoke passed.
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
Stale artifact limit smoke passed.
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
GitHub metadata review-surface smoke passed.
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
      Tests  51 passed (51)
   Start at  12:33:44
   Duration  347ms (transform 29ms, setup 0ms, import 38ms, tests 23ms, environment 0ms)

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
ESM ⚡️ Build success in 144ms
DTS Build start
DTS ⚡️ Build success in 1492ms
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
AgentLoopKit: task="Add built CLI smoke coverage for stale artifact limits" status="in-progress"; verification=pass; run="ship 92/100"; tree=dirty (2792; 105 non-evidence, 2687 AgentLoop evidence); next="agentloop task done"
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

## 

[output truncated: showing first 2500 and last 2500 characters of 9450 total]

ogress`) - `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-stale-artifact-limits-2.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-12-28-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `110` AgentFlight placeholder task(s), `537` verification report(s), `891` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-12-20-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (2792; 105 non-evidence, 2687 AgentLoop evidence)`

## Recent Runs

- `ship` `92`/100 - `2781` changed file(s) (`105` non-evidence, `2676` AgentLoop evidence) - `2026-06-17-12-20-ship`
- `verify` `pass` - `2777` changed file(s) (`105` non-evidence, `2672` AgentLoop evidence) - `2026-06-17-12-17-verify`
- `ship` `92`/100 - `2766` changed file(s) (`105` non-evidence, `2661` AgentLoop evidence) - `2026-06-17-12-04-ship`

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
