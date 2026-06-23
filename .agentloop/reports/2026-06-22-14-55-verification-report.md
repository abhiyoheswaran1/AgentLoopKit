# Verification Report

- Timestamp: `2026-06-22T12:55:01.740Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `d5f4631e`
- Working tree: `dirty`
- Overall status: pass






## Commands Run
### custom: `npm run test:quick`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 test:quick
> npm run test:unit


> agentloopkit@0.39.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  26 passed (26)
      Tests  164 passed (164)
   Start at  14:55:07
   Duration  67.05s (transform 221ms, setup 0ms, import 687ms, tests 145.93s, environment 1ms)

```

### custom: `npm run test:integration`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 test:integration
> vitest run tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts tests/create-task.test.ts tests/verification.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/maintainer-check.test.ts tests/release-check.test.ts tests/dogfood-script.test.ts tests/release-smoke.test.ts tests/published-smoke-script.test.ts tests/mcp-server.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  13 passed (13)
      Tests  248 passed (248)
   Start at  14:56:19
   Duration  282.43s (transform 298ms, setup 0ms, import 1.06s, tests 1106.57s, environment 1ms)

```

### custom: `npx pnpm@10.12.1 vitest run tests/agent-installation.test.ts tests/artifacts.test.ts tests/badge.test.ts tests/check-gates.test.ts tests/ci-summary.test.ts tests/cli-explain-diff.test.ts tests/completion.test.ts tests/context-contract.test.ts`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  8 passed (8)
      Tests  118 passed (118)
   Start at  15:01:07
   Duration  209.39s (transform 195ms, setup 0ms, import 680ms, tests 662.26s, environment 0ms)

```

### custom: `npx pnpm@10.12.1 vitest run tests/distribution-artifacts.test.ts tests/evidence-map.test.ts tests/examples.test.ts tests/git.test.ts tests/guard.test.ts tests/handoff.test.ts tests/html-report.test.ts tests/list-templates.test.ts tests/markdown-links.test.ts`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  9 passed (9)
      Tests  116 passed (116)
   Start at  15:04:41
   Duration  92.13s (transform 144ms, setup 0ms, import 483ms, tests 246.48s, environment 0ms)

```

### custom: `npx pnpm@10.12.1 vitest run tests/mcp-tools.test.ts tests/next.test.ts tests/npm-status.test.ts tests/policy.test.ts tests/pr-summary.test.ts tests/prepublish-check.test.ts tests/redaction.test.ts tests/release-notes.test.ts tests/resume-pack.test.ts`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  9 passed (9)
      Tests  105 passed (105)
   Start at  15:06:19
   Duration  189.20s (transform 213ms, setup 0ms, import 681ms, tests 513.37s, environment 0ms)

```

### custom: `npx pnpm@10.12.1 vitest run tests/review-context.test.ts tests/runs.test.ts tests/status.test.ts tests/task-archive.test.ts tests/task-state.test.ts --maxWorkers=1 --test-timeout=60000 --hook-timeout=60000`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  5 passed (5)
      Tests  148 passed (148)
   Start at  15:09:34
   Duration  724.53s (transform 207ms, setup 0ms, import 537ms, tests 722.07s, environment 0ms)

```

### custom: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 lint [git-root]
> eslint .

```

### custom: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 typecheck [git-root]
> tsc --noEmit

```

### custom: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 build [git-root]
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
ESM ⚡️ Build success in 38ms
DTS Build start
DTS ⚡️ Build success in 1013ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 dogfood
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
AgentLoopKit: task="Build AgentLoop Context Contract v1" status="in-progress"; verification=missing; run="handoff 3 files"; tree=dirty (32; 23 non-evidence, 9 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.39.0
Public docs checked: 78
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
- Strict mo

[output truncated: showing first 2500 and last 2500 characters of 12192 total]

ycle-196.md, .agentloop/tasks/2026-06-22-build-agentloop-context-contract-v1-2.md, .agentloop/tasks/2026-06-22-build-agentloop-context-contract-v1.md, docs/context.md, docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md
- unknown: src/cli/index.ts, src/core/completions.ts, src/core/mcp-tools.ts, src/mcp/server.ts, src/cli/commands/context.ts, src/core/context-contract.ts
- tests: tests/cli-docs-drift.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/context-contract.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
2 passed, 0 failed
- passed: npx pnpm@10.12.1 vitest run tests/context-contract.test.ts tests/mcp-server.test.ts tests/mcp-tools.test.ts tests/cli-docs-drift.test.ts (exit 0, 31792ms)
- passed: npx pnpm@10.12.1 vitest run tests/context-contract.test.ts tests/mcp-server.test.ts tests/mcp-tools.test.ts tests/cli-docs-drift.test.ts tests/redaction.test.ts (exit 0, 30872ms)

Review first:
1. src/cli/commands/context.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/core/completions.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/core/context-contract.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/mcp-tools.ts
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


## Not Run
- test: `npx pnpm@10.12.1 test`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
