# Verification Report

- Timestamp: `2026-06-16T23:34:25.839Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-warn-on-forced-home-directory-init.md`
- Title: `Warn on forced home-directory init`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/init.test.ts -t "home directory"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/init.test.ts -t home directory


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  3 passed | 24 skipped (27)
   Start at  01:34:26
   Duration  315ms (transform 73ms, setup 0ms, import 137ms, tests 64ms, environment 0ms)

```

### task: `npm test -- tests/init.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/init.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  01:34:27
   Duration  6.34s (transform 67ms, setup 0ms, import 127ms, tests 6.10s, environment 0ms)

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
AgentLoopKit: task="Warn on forced home-directory init" status="in-progress"; verification=pass; run="handoff 1284 files"; tree=dirty (1293; 80 non-evidence, 1213 AgentLoop evidence); next="agentloop handoff"
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
# AgentLoopKit Gates

- Overall st

[output truncated: showing first 2500 and last 2500 characters of 8942 total]

cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Warn on forced home-directory init` (`in-progress`) - `.agentloop/tasks/2026-06-17-warn-on-forced-home-directory-init.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-01-34-verification-report.md`
- Gates: `warn`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `47` AgentFlight placeholder task(s), `463` verification report(s), `719` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-01-27-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (1293; 80 non-evidence, 1213 AgentLoop evidence)`

## Recent Runs

- `handoff` `1284` changed file(s) (`79` non-evidence, `1205` AgentLoop evidence) - `2026-06-17-01-29-handoff`
- `handoff` `1279` changed file(s) (`79` non-evidence, `1200` AgentLoop evidence) - `2026-06-17-01-28-handoff`
- `ship` `92`/100 - `1270` changed file(s) (`79` non-evidence, `1191` AgentLoop evidence) - `2026-06-17-01-27-ship`

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

### post-verification: `npx --yes agentflight verify -- npm test -- tests/init.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/init.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260616-233139-warn-on-forced-home-directory-init/verification-1.stdout.txt
- stderr: .agentflight/evidence/af-20260616-233139-warn-on-forced-home-directory-init/verification-1.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/init.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  01:34:52
   Duration  7.37s (transform 73ms, setup 0ms, import 139ms, tests 7.12s, environment 0ms)
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
