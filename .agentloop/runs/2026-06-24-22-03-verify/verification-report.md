# Verification Report

- Timestamp: `2026-06-24T20:02:02.809Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `637b843c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-avoid-misleading-prepare-pr-verification-gaps.md`
- Title: `Avoid misleading prepare-pr verification gaps`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit -- tests/prepare-pr.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts tests/prepare-pr.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  27 passed (27)
      Tests  181 passed (181)
   Start at  22:02:04
   Duration  39.65s (transform 442ms, setup 0ms, import 1.22s, tests 105.50s, environment 2ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 typecheck
> tsc --noEmit

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     636.01 KB
ESM dist/cli/index.js.map 1.17 MB
ESM ⚡️ Build success in 71ms
DTS Build start
DTS ⚡️ Build success in 1298ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 dogfood
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
AgentLoopKit: task="Avoid misleading prepare-pr verification gaps" status="in-progress"; verification=pass; run="ship 92/100"; tree=dirty (321; 68 non-evidence, 253 AgentLoop evidence); next="agentloop task done"
Reason: Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.42.0
Public docs checked: 79
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
- Current template version: `2`
- Local template version: `2`

## Harness Files

- `current`: `AGENTS.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current agent-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call exte

[output truncated: showing first 2500 and last 2500 characters of 14499 total]

c/core/review-context.ts, src/core/runs.ts, src/core/upgrade-harness.ts, src/core/verification-report-sections.ts, src/mcp/server.ts, src/core/agent-readiness.ts, src/core/run-artifacts.ts, src/core/run-types.ts
- tests: tests/agent-start.test.ts, tests/context-contract.test.ts, tests/doctor.test.ts, tests/init.test.ts, tests/markdown-format.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/prepare-pr.test.ts, tests/review-context.test.ts, tests/runs.test.ts, tests/upgrade-harness.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
6 passed, 0 failed
- passed: npm run test:unit -- tests/prepare-pr.test.ts (exit 0, 33033ms)
- passed: npm run lint (exit 0, 3698ms)
- passed: npm run test:unit -- tests/prepare-pr.test.ts (exit 0, 30653ms)
- passed: npm run lint (exit 0, 3751ms)
- passed: npm run test:unit -- tests/prepare-pr.test.ts (exit 0, 40258ms)
- passed: npm run lint (exit 0, 4291ms)

Review first:
1. src/cli/commands/context.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. src/cli/commands/doctor.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/cli/commands/runs.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/core/agent-readiness.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/agent-start.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

Proof gaps:
- none

Latest snapshot:
- No snapshots recorded.

Readiness: Ready for review
Reason: Verification evidence matches the observed review risk.

Next action:
Generate or share the AgentFlight report/replay and request scoped human review.

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.
```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 lint
> eslint .

```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
