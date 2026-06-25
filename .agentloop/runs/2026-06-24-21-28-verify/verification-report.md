# Verification Report

- Timestamp: `2026-06-24T19:26:41.518Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `637b843c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-bound-mcp-handoff-listing-work-2.md`
- Title: `Bound MCP handoff listing work`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit -- tests/markdown-format.test.ts tests/prepare-pr.test.ts tests/mcp-tools.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts tests/markdown-format.test.ts tests/prepare-pr.test.ts tests/mcp-tools.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  28 passed (28)
      Tests  187 passed (187)
   Start at  21:26:42
   Duration  56.33s (transform 503ms, setup 0ms, import 1.51s, tests 141.88s, environment 3ms)

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
ESM dist/cli/index.js     632.33 KB
ESM dist/cli/index.js.map 1.16 MB
ESM ⚡️ Build success in 70ms
DTS Build start
DTS ⚡️ Build success in 1411ms
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
AgentLoopKit: task="Bound MCP handoff listing work" status="in-progress"; verification=missing; run="ship 92/100"; tree=dirty (264; 66 non-evidence, 198 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

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

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths
# Age

[output truncated: showing first 2500 and last 2500 characters of 13905 total]

4-agentloop-start-usefulness-proof.md
- unknown: src/cli/commands/context.ts, src/cli/commands/doctor.ts, src/cli/commands/runs.ts, src/core/agent-start.ts, src/core/context-contract.ts, src/core/doctor.ts, src/core/evidence-map.ts, src/core/markdown-format.ts, src/core/mcp-tools.ts, src/core/prepare-pr.ts, src/core/review-context.ts, src/core/runs.ts, src/core/upgrade-harness.ts, src/mcp/server.ts, src/core/agent-readiness.ts, src/core/run-artifacts.ts, src/core/run-types.ts
- tests: tests/agent-start.test.ts, tests/context-contract.test.ts, tests/doctor.test.ts, tests/init.test.ts, tests/markdown-format.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/prepare-pr.test.ts, tests/review-context.test.ts, tests/runs.test.ts, tests/upgrade-harness.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
1 passed, 0 failed
- passed: npm run test:unit -- tests/mcp-tools.test.ts (exit 0, 37698ms)

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


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
