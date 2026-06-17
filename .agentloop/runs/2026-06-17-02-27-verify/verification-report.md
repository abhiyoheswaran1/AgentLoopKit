# Verification Report

- Timestamp: `2026-06-17T00:26:34.666Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-github-metadata-safety-guard-to-maintenance-check.md`
- Title: `Add GitHub metadata safety guard to maintenance check`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/maintenance-check-script.test.ts -t "maintenance check includes GitHub metadata safety tests"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts -t maintenance check includes GitHub metadata safety tests


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 4 skipped (5)
   Start at  02:26:35
   Duration  131ms (transform 15ms, setup 0ms, import 21ms, tests 2ms, environment 0ms)

```

### task: `npm test -- tests/maintenance-check-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  02:26:36
   Duration  139ms (transform 15ms, setup 0ms, import 22ms, tests 3ms, environment 0ms)

```

### task: `npm run maintenance:check`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.35.2 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/public-docs-hygiene.test.ts (5 tests) 27ms
 ✓ tests/config.test.ts (8 tests) 40ms
 ✓ tests/project-detection.test.ts (7 tests) 47ms
 ✓ tests/safety.test.ts (4 tests) 21ms
 ✓ tests/autonomous-dogfood.test.ts (10 tests) 83ms
 ✓ tests/dogfood-start-script.test.ts (6 tests) 69ms
 ✓ tests/package-scripts.test.ts (4 tests) 35ms
 ✓ tests/github-action-runner.test.ts (5 tests) 25ms
 ✓ tests/roadmap-channels.test.ts (2 tests) 6ms
 ✓ tests/schema.test.ts (1 test) 3ms
 ✓ tests/package-manager.test.ts (3 tests) 14ms
 ✓ tests/markdown-format.test.ts (3 tests) 3ms
 ✓ tests/package-metadata.test.ts (1 test) 6ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 4ms
 ✓ tests/maintenance-check-script.test.ts (5 tests) 7ms
 ✓ tests/slug.test.ts (1 test) 4ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 919ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  917ms
 ✓ tests/schemastore.test.ts (4 tests) 1109ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  1073ms
 ✓ tests/template-renderer.test.ts (2 tests) 7ms
 ✓ tests/task-contract.test.ts (1 test) 2ms
 ✓ tests/version.test.ts (2 tests) 2021ms
     ✓ prints the package version  1462ms
     ✓ prints the package version as JSON when requested  558ms
 ✓ tests/github-metadata.test.ts (9 tests) 2214ms
     ✓ exposes read-only local JSON import through the CLI  994ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  1080ms
 ✓ tests/policy-packs.test.ts (11 tests) 3948ms
     ✓ exposes policy pack list, show, and apply through the 

[output truncated: showing first 2500 and last 2500 characters of 17732 total]

nstall tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Add GitHub metadata safety guard to maintenance check` (`in-progress`) - `.agentloop/tasks/2026-06-17-add-github-metadata-safety-guard-to-maintenance-check.md`
- Latest verification: missing
- Gates: `fail`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `57` AgentFlight placeholder task(s), `473` verification report(s), `749` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-02-22-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (1547; 81 non-evidence, 1466 AgentLoop evidence)`

## Recent Runs

- `handoff` `1540` changed file(s) (`81` non-evidence, `1459` AgentLoop evidence) - `2026-06-17-02-23-handoff-2`
- `handoff` `1535` changed file(s) (`81` non-evidence, `1454` AgentLoop evidence) - `2026-06-17-02-23-handoff`
- `ship` `92`/100 - `1526` changed file(s) (`81` non-evidence, `1445` AgentLoop evidence) - `2026-06-17-02-22-ship`

## Next Action

Run `agentloop verify`.

A task exists, but no verification report was found.

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

Maintenance check passed.
```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

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
ESM dist/cli/index.js     476.76 KB
ESM dist/cli/index.js.map 893.22 KB
ESM ⚡️ Build success in 30ms
DTS Build start
DTS ⚡️ Build success in 902ms
DTS dist/cli/index.d.ts 13.00 B
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
AgentLoopKit: task="Add GitHub metadata safety guard to maintenance check" status="in-progress"; verification=pass; run="handoff 1540 files"; tree=dirty (1548; 81 non-evidence, 1467 AgentLoop evidence); next="agentloop task done"
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

## review evi

[output truncated: showing first 2500 and last 2500 characters of 9372 total]

nce check` (`in-progress`) - `.agentloop/tasks/2026-06-17-add-github-metadata-safety-guard-to-maintenance-check.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-02-26-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `57` AgentFlight placeholder task(s), `474` verification report(s), `749` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-02-22-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (1548; 81 non-evidence, 1467 AgentLoop evidence)`

## Recent Runs

- `handoff` `1540` changed file(s) (`81` non-evidence, `1459` AgentLoop evidence) - `2026-06-17-02-23-handoff-2`
- `handoff` `1535` changed file(s) (`81` non-evidence, `1454` AgentLoop evidence) - `2026-06-17-02-23-handoff`
- `ship` `92`/100 - `1526` changed file(s) (`81` non-evidence, `1445` AgentLoop evidence) - `2026-06-17-02-22-ship`

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

### post-verification: `npx --yes agentflight verify -- npm test -- tests/maintenance-check-script.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/maintenance-check-script.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260617-002459-add-github-metadata-safety-guard-to-maintenance-check/verification-1.stdout.txt
- stderr: .agentflight/evidence/af-20260617-002459-add-github-metadata-safety-guard-to-maintenance-check/verification-1.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  02:27:34
   Duration  143ms (transform 16ms, setup 0ms, import 23ms, tests 3ms, environment 0ms)
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
