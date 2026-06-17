# Verification Report

- Timestamp: `2026-06-17T08:33:34.736Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-accept-redacted-task-show-output-flag-2.md`
- Title: `Accept redacted task show output flag`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/task-state.test.ts -t "task show"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/task-state.test.ts -t task show


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 70 skipped (71)
   Start at  10:33:36
   Duration  4.75s (transform 96ms, setup 0ms, import 176ms, tests 4.29s, environment 0ms)

```

### task: `npx prettier --check src/cli/commands/task.ts tests/task-state.test.ts docs/cli-reference.md docs/task-contracts.md docs/status.md README.md`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
```

### task: `git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows`

- Exit code: 0
- Status: pass


```text
(no output)
```

### task: `npm test -- tests/task-state.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/task-state.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  71 passed (71)
   Start at  10:33:43
   Duration  98.70s (transform 103ms, setup 0ms, import 191ms, tests 98.30s, environment 0ms)

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
ESM dist/cli/index.js     485.38 KB
ESM dist/cli/index.js.map 909.83 KB
ESM ⚡️ Build success in 74ms
DTS Build start
DTS ⚡️ Build success in 2192ms
DTS dist/cli/index.d.ts 13.00 B
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
AgentLoopKit: task="Accept redacted task show output flag" status="in-progress"; verification=missing; run="verify pass"; tree=dirty (2654; 105 non-evidence, 2549 AgentLoop evidence); next="agentloop verify"
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
- Stric

[output truncated: showing first 2500 and last 2500 characters of 9299 total]

t mode.

## agent review context
$ npx --no-install tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Accept redacted task show output flag` (`in-progress`) - `.agentloop/tasks/2026-06-17-accept-redacted-task-show-output-flag-2.md`
- Latest verification: missing
- Gates: `fail`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `102` AgentFlight placeholder task(s), `526` verification report(s), `874` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-10-10-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (2654; 105 non-evidence, 2549 AgentLoop evidence)`

## Recent Runs

- `verify` `pass` - `2651` changed file(s) (`105` non-evidence, `2546` AgentLoop evidence) - `2026-06-17-10-32-verify`
- `verify` `pass` - `2647` changed file(s) (`105` non-evidence, `2542` AgentLoop evidence) - `2026-06-17-10-29-verify`
- `handoff` `2637` changed file(s) (`104` non-evidence, `2533` AgentLoop evidence) - `2026-06-17-10-11-handoff`

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
