# Verification Report

- Timestamp: `2026-06-16T21:43:46.483Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-16-ignore-agentloop-evidence-in-agentflight-changed-file-filters-2.md`
- Title: `Ignore AgentLoop evidence in AgentFlight changed-file filters`
- Task type: `feature`
- Status: `in-progress`




## Failure Summary
### post-verification: `npm run dogfood:strict`

- Exit code: 1

```text
- [`pass`] `Task contract`: `Ignore AgentLoop evidence in AgentFlight changed-file filters` - `.agentloop/tasks/2026-06-16-ignore-agentloop-evidence-in-agentflight-changed-file-filters-2.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-16-23-43-verification-report.md`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.` - `.agentloop/handoffs/2026-06-16-23-37-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `790 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
## Next Action
Run `agentloop handoff`.
Write a reviewer handoff after verification.
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
      Tests  706 passed (706)
   Start at  23:43:47
   Duration  79.42s (transform 2.09s, setup 0ms, import 9.08s, tests 837.87s, environment 5ms)

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
ESM dist/cli/index.js     467.74 KB
ESM dist/cli/index.js.map 876.60 KB
ESM ⚡️ Build success in 47ms
DTS Build start
DTS ⚡️ Build success in 1066ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  23:45:18
   Duration  146ms (transform 20ms, setup 0ms, import 19ms, tests 15ms, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint
> eslint .

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
ESM dist/cli/index.js     467.74 KB
ESM dist/cli/index.js.map 876.60 KB
ESM ⚡️ Build success in 27ms
DTS Build start
DTS ⚡️ Build success in 883ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  706 passed (706)
   Start at  23:45:24
   Duration  79.58s (transform 2.07s, setup 0ms, import 9.29s, tests 834.40s, environment 5ms)

```

## Post-Verification Gates
### post-verification: `npx --yes agentflight verify -- npm test -- tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text
AgentFlight verification

passed: npm test -- tests/autonomous-dogfood.test.ts
Evidence saved:
- stdout: .agentflight/evidence/af-20260616-214044-ignore-agentloop-evidence-in-agentflight-changed-file-filters/verification-2.stdout.txt
- stderr: .agentflight/evidence/af-20260616-214044-ignore-agentloop-evidence-in-agentflight-changed-file-filters/verification-2.stderr.txt

> agentloopkit@0.35.2 test
> vitest run tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  23:46:46
   Duration  195ms (transform 27ms, setup 0ms, import 24ms, tests 20ms, environment 0ms)
```

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
AgentLoopKit: task="Ignore AgentLoop evidence in AgentFlight changed-file filters" status="in-progress"; verification=pass; run="handoff 781 files"; tree=dirty (790); next="agentloop handoff"
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
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths --strict
# AgentLoopKit Gates

- Overall status: `fail`
- Strict mode: `enabled (warnings fail)`
- Git: `main` @ `370a9fe`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `790`

## Gates

- [`pass`] `Task contract`: `Ignore AgentLoop evidence in AgentFlight changed-file filters` - `.agentloop/tasks/2026-06-16-ignore-agentloop-evidence-in-agentflight-changed-file-filters-2.md`
- [`pass`] `Verification report`: `Overall status: pass` - `.agentloop/reports/2026-06-16-23-43-verification-report.md`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.` - `.agentloop/handoffs/2026-06-16-23-37-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `790 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`

## Next Action

Run `agentloop handoff`.

Write a reviewer handoff after verification.


Dogfood gate failed: review evidence gates failed with exit code 1
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

### post-verification: `npx --yes agentflight doctor`

- Exit code: 0
- Status: pass


```text
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
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Fix failing commands before claiming completion.
