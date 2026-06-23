# Verification Report

- Timestamp: `2026-06-23T07:16:01.199Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `d5f4631e`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- Title: `Release AgentLoopKit 0.40.0`
- Task type: `release`
- Status: `in-progress`




## Failure Summary
### task: `npm run release-flow`

- Exit code: 1

```text
- [`pass`] `Task contract`: `Release AgentLoopKit 0.40.0` - `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- [`fail`] `Verification report`: `Latest verification report predates the current task. Rerun verification.` - `.agentloop/reports/2026-06-22-22-19-verification-report.md`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.` - `.agentloop/handoffs/2026-06-22-22-21-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `83 changed file(s) detected (34 non-evidence, 49 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
## Next Action
Run `agentloop verify --task .agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`.
Run verification and fix failures before review.
Dogfood gate failed: review evidence gates failed with exit code 1
```


## Commands Run
### task: `npm run release-flow`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.40.0 release-flow
> node scripts/prepublish-check.mjs && npm run lint && npm run typecheck && npm run test:release && npm run build && npm run check:public-docs && npm run check:links && npm run dogfood:strict && npm run smoke:release && node dist/cli/index.js release-check --strict --redact-paths

Prepublish metadata check passed.

> agentloopkit@0.40.0 lint
> eslint .


> agentloopkit@0.40.0 typecheck
> tsc --noEmit


> agentloopkit@0.40.0 test:release
> npm test


> agentloopkit@0.40.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  70 passed (70)
      Tests  899 passed (899)
   Start at  09:16:21
   Duration  1012.63s (transform 907ms, setup 0ms, import 4.33s, tests 3615.80s, environment 5ms)


> agentloopkit@0.40.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     572.60 KB
ESM dist/cli/index.js.map 1.05 MB
ESM ⚡️ Build success in 39ms
DTS Build start
DTS ⚡️ Build success in 1270ms
DTS dist/cli/index.d.ts 13.00 B

> agentloopkit@0.40.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

> agentloopkit@0.40.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4979 file(s) checked).

> agentloopkit@0.40.0 dogfood:strict
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
AgentLoopKit: task="Release AgentLoopKit 0.40.0" status="in-progress"; verification=missing; run="ship 92/100"; tree=dirty (83; 34 non-evidence, 49 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-

[output truncated: showing first 2500 and last 2500 characters of 5229 total]

t.json`
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
- Git: `main` @ `d5f4631e`
- Git root: `[git-root]`
- Git target: `root directory`
- Changed files: `83; 34 non-evidence, 49 AgentLoop evidence`

## Gates

- [`pass`] `Task contract`: `Release AgentLoopKit 0.40.0` - `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- [`fail`] `Verification report`: `Latest verification report predates the current task. Rerun verification.` - `.agentloop/reports/2026-06-22-22-19-verification-report.md`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.` - `.agentloop/handoffs/2026-06-22-22-21-pr-summary.md`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `83 changed file(s) detected (34 non-evidence, 49 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`

## Next Action

Run `agentloop verify --task .agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`.

Run verification and fix failures before review.


Dogfood gate failed: review evidence gates failed with exit code 1
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Fix failing commands before claiming completion.
