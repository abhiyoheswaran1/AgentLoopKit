# Verification Report

- Timestamp: `2026-06-24T10:12:32.416Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `9966b6dc`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-harden-agentloop-start-truth-consistency-2.md`
- Title: `Harden AgentLoop Start truth consistency`
- Task type: `feature`
- Status: `review`





## Commands Run
### task: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  71 passed (71)
      Tests  909 passed (909)
   Start at  12:12:34
   Duration  215.61s (transform 2.15s, setup 0ms, import 7.78s, tests 840.35s, environment 6ms)

```

### task: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 lint [git-root]
> eslint .

```

### task: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 typecheck [git-root]
> tsc --noEmit

```

### task: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     594.27 KB
ESM dist/cli/index.js.map 1.09 MB
ESM ⚡️ Build success in 59ms
DTS Build start
DTS ⚡️ Build success in 1176ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  26 passed (26)
      Tests  164 passed (164)
   Start at  12:16:22
   Duration  10.46s (transform 471ms, setup 0ms, import 1.27s, tests 31.98s, environment 2ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 typecheck
> tsc --noEmit

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.41.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 dogfood
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
AgentLoopKit: task="Harden AgentLoop Start truth consistency" status="review"; verification=pass; run="handoff 27 files"; tree=dirty (32; 13 non-evidence, 19 AgentLoop evidence); next="agentloop task done"
Reason: Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.41.0
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
$ npx --no-i

[output truncated: showing first 2500 and last 2500 characters of 11595 total]

nfigured.
- OK lint script: npm run lint is configured.

## agentflight session status
$ npx --yes agentflight status
AgentFlight status

Task:
Harden AgentLoop Start truth consistency

Session duration:
28 minutes

Changed files:
15

Changed areas:
- docs: CHANGELOG.md, DECISIONS.md, README.md, docs/cli-reference.md, docs/context.md, docs/mcp.md, .agentloop/tasks/2026-06-24-harden-agentloop-start-truth-consistency-2.md, .agentloop/tasks/2026-06-24-harden-agentloop-start-truth-consistency.md, docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md, docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md
- unknown: src/core/context-contract.ts, src/core/evidence-map.ts, src/core/evidence.ts
- tests: tests/agent-start.test.ts, tests/context-contract.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
2 passed, 0 failed
- passed: npm run test:unit (exit 0, 16870ms)
- passed: npm run typecheck (exit 0, 3129ms)

Review first:
1. src/core/context-contract.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. src/core/evidence-map.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/core/evidence.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. tests/agent-start.test.ts
   Why: tests file
   Focus: Check whether tests cover the changed behavior.
5. tests/context-contract.test.ts
   Why: tests file
   Focus: Check whether tests cover the changed behavior.

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
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
