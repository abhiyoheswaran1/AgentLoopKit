# Verification Report

- Timestamp: `2026-06-16T23:26:53.024Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-artifacts-run-evidence-split-2.md`
- Title: `Add built CLI smoke coverage for artifacts run evidence split`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  01:26:53
   Duration  138ms (transform 13ms, setup 0ms, import 19ms, tests 6ms, environment 0ms)

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
ESM dist/cli/index.js     476.26 KB
ESM dist/cli/index.js.map 892.33 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 890ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.35.2
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Harness upgrade smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Artifact run split smoke passed.
Ship report artifact smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

## Post-Verification Gates
### post-verification: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 dogfood
> node scripts/dogfood.mjs

# AgentLoopKit Dogfood Gate
Mode: default

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Add built CLI smoke coverage for artifacts run evidence split" status="in-progress"; verification=pass; run="handoff 1257 files"; tree=dirty (1267; 79 non-evidence, 1188 AgentLoop evidence); next="agentloop handoff"
Reason: Task and verification evidence exist, and the working tree has changes.

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
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths
# Agent

[output truncated: showing first 2500 and last 2500 characters of 9205 total]

Review Context

- Active task: `Add built CLI smoke coverage for artifacts run evidence split` (`in-progress`) - `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-artifacts-run-evidence-split-2.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-01-26-verification-report.md`
- Gates: `warn`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `46` AgentFlight placeholder task(s), `462` verification report(s), `716` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-01-22-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (1267; 79 non-evidence, 1188 AgentLoop evidence)`

## Recent Runs

- `handoff` `1257` changed file(s) (`77` non-evidence, `1180` AgentLoop evidence) - `2026-06-17-01-23-handoff-2`
- `handoff` `1252` changed file(s) (`77` non-evidence, `1175` AgentLoop evidence) - `2026-06-17-01-23-handoff`
- `ship` `92`/100 - `1243` changed file(s) (`77` non-evidence, `1166` AgentLoop evidence) - `2026-06-17-01-22-ship`

## Next Action

Run `agentloop handoff`.

Task and verification evidence exist, and the working tree has changes.

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

### post-verification: `npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/distribution-artifacts.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260616-232542-add-built-cli-smoke-coverage-for-artifacts-run-evidence-split/verification-1.stdout.txt
- stderr: .agentflight/evidence/af-20260616-232542-add-built-cli-smoke-coverage-for-artifacts-run-evidence-split/verification-1.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  01:27:24
   Duration  154ms (transform 13ms, setup 0ms, import 20ms, tests 6ms, environment 0ms)
```

### post-verification: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
