# Verification Report

- Timestamp: `2026-06-17T10:40:28.878Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-preflight-dogfood-start-task-type-before-agentflight-2.md`
- Title: `Preflight dogfood-start task type before AgentFlight`
- Task type: `bugfix`
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
      Tests  796 passed (796)
   Start at  12:40:30
   Duration  239.51s (transform 906ms, setup 0ms, import 4.35s, tests 2326.31s, environment 5ms)

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
ESM ⚡️ Build success in 69ms
DTS Build start
DTS ⚡️ Build success in 965ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/dogfood-start-script.test.ts -t "task type"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/dogfood-start-script.test.ts -t task type


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  3 passed | 6 skipped (9)
   Start at  12:44:43
   Duration  355ms (transform 27ms, setup 0ms, import 65ms, tests 92ms, environment 0ms)

```

### task: `npx prettier --check scripts/dogfood-start.mjs tests/dogfood-start-script.test.ts`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
```

### task: `npm test -- tests/dogfood-start-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/dogfood-start-script.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  12:44:46
   Duration  410ms (transform 21ms, setup 0ms, import 59ms, tests 114ms, environment 0ms)

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
ESM ⚡️ Build success in 42ms
DTS Build start
DTS ⚡️ Build success in 1002ms
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
AgentLoopKit: task="Preflight dogfood-start task type before AgentFlight" status="in-progress"; verification=pass; run="ship 92/100"; tree=dirty (2812; 105 non-evidence, 2707 AgentLoop evidence); next="agentloop task done"
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

## re

[output truncated: showing first 2500 and last 2500 characters of 9427 total]

(`in-progress`) - `.agentloop/tasks/2026-06-17-preflight-dogfood-start-task-type-before-agentflight-2.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-12-40-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `111` AgentFlight placeholder task(s), `538` verification report(s), `893` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-12-36-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (2812; 105 non-evidence, 2707 AgentLoop evidence)`

## Recent Runs

- `ship` `92`/100 - `2800` changed file(s) (`105` non-evidence, `2695` AgentLoop evidence) - `2026-06-17-12-36-ship`
- `handoff` `2795` changed file(s) (`105` non-evidence, `2690` AgentLoop evidence) - `2026-06-17-12-36-handoff`
- `verify` `pass` - `2792` changed file(s) (`105` non-evidence, `2687` AgentLoop evidence) - `2026-06-17-12-34-verify`

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
