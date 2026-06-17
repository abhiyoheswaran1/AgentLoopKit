# Verification Report

- Timestamp: `2026-06-17T13:04:46.732Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-guard-backlog-implemented-decisions-2.md`
- Title: `Guard backlog implemented decisions`
- Task type: `docs`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/roadmap-channels.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/roadmap-channels.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  15:04:48
   Duration  410ms (transform 17ms, setup 0ms, import 24ms, tests 14ms, environment 0ms)

```

### task: `npm run dogfood`

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
AgentLoopKit: task="Guard backlog implemented decisions" status="in-progress"; verification=missing; run="ship 92/100"; tree=dirty (3001; 110 non-evidence, 2891 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

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

- Overall status: `fail`
- Strict 

[output truncated: showing first 2500 and last 2500 characters of 9267 total]

default mode.

## agent review context
$ npx --no-install tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Guard backlog implemented decisions` (`in-progress`) - `.agentloop/tasks/2026-06-17-guard-backlog-implemented-decisions-2.md`
- Latest verification: missing
- Gates: `fail`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `120` AgentFlight placeholder task(s), `546` verification report(s), `912` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-14-51-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (3001; 110 non-evidence, 2891 AgentLoop evidence)`

## Recent Runs

- `ship` `92`/100 - `2990` changed file(s) (`109` non-evidence, `2881` AgentLoop evidence) - `2026-06-17-14-51-ship`
- `handoff` `2985` changed file(s) (`109` non-evidence, `2876` AgentLoop evidence) - `2026-06-17-14-48-handoff`
- `verify` `pass` - `2982` changed file(s) (`109` non-evidence, `2873` AgentLoop evidence) - `2026-06-17-14-47-verify`

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
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
