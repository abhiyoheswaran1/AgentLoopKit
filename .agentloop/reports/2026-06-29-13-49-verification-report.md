# Verification Report

- Timestamp: `2026-06-29T11:49:39.599Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `3da60ac0`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-29-release-agentloopkit-0-47-1.md`
- Title: `Release AgentLoopKit 0.47.1`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 typecheck
> tsc --noEmit

```

### task: `npm run test:unit`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts tests/context-contract.test.ts tests/baseframe.test.ts tests/ready.test.ts tests/loop-contract.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  30 passed (30)
      Tests  222 passed (222)
   Start at  13:49:54
   Duration  229.54s (transform 326ms, setup 0ms, import 1.14s, tests 734.91s, environment 2ms)

```

### task: `npm run test:integration`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 test:integration
> vitest run tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts tests/create-task.test.ts tests/verification.test.ts tests/ship.test.ts tests/prepare-pr.test.ts tests/maintainer-check.test.ts tests/release-check.test.ts tests/dogfood-script.test.ts tests/release-smoke.test.ts tests/published-smoke-script.test.ts tests/mcp-server.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  13 passed (13)
      Tests  267 passed (267)
   Start at  13:53:47
   Duration  405.84s (transform 381ms, setup 0ms, import 1.24s, tests 1563.42s, environment 1ms)

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"index":"src/index.ts","cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/index.js         140.48 KB
ESM dist/cli/index.js     727.21 KB
ESM dist/index.js.map     366.25 KB
ESM dist/cli/index.js.map 1.33 MB
ESM ⚡️ Build success in 44ms
DTS Build start
DTS ⚡️ Build success in 2219ms
DTS dist/cli/index.d.ts 13.00 B
DTS dist/index.d.ts     20.71 KB
```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.47.1
Public docs checked: 81
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (5395 file(s) checked).
```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 dogfood
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
AgentLoopKit: task="Release AgentLoopKit 0.47.1" status="in-progress"; verification=missing; run="handoff 11 files"; tree=dirty (9; 8 non-evidence, 1 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.47.1
Public docs checked: 81
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
  Present topics: `agent-start`, `loop-control`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `agent-start`, `loop-control`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `agent-start`, `loop-control`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `agent-start`, `loop-control`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current agent-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gates
$ npx --no-

[output truncated: showing first 2500 and last 2500 characters of 11654 total]

red.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.

## agentflight session status
$ npx --yes agentflight status
AgentFlight status

Task:
Add AgentLoopKit loop contracts and readiness gates

Session duration:
2214 minutes

Changed files:
9

Changed areas:
- docs: CHANGELOG.md, FINAL_HANDOFF.md, ROADMAP.md, docs/launch-checklist.md, docs/npm-publishing.md, docs/release-status.md, .agentloop/tasks/2026-06-29-release-agentloopkit-0-47-1.md
- dependencies: package.json
- unknown: server.json

Risk: medium
- Dependency or package metadata changed.

Verification Evidence:
5 passed, 0 failed
- passed: npm run test:unit (exit 0, 70408ms)
- passed: npm run test:integration (exit 0, 204317ms)
- passed: npm run typecheck (exit 0, 3027ms)
- passed: npm run lint (exit 0, 3837ms)
- passed: npm run build (exit 0, 4094ms)

Review first:
1. package.json
   Why: dependency metadata changed
   Focus: Check install/build impact and dependency risk first.
2. server.json
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. .agentloop/tasks/2026-06-29-release-agentloopkit-0-47-1.md
   Why: docs file
   Focus: Check accuracy and scope of documentation changes.
4. CHANGELOG.md
   Why: docs file
   Focus: Check accuracy and scope of documentation changes.
5. docs/launch-checklist.md
   Why: docs file
   Focus: Check accuracy and scope of documentation changes.

Proof gaps:
- none

Latest snapshot:
- 2026-06-27T23:12:32.292Z
- Note: Loop contracts and readiness gates ready for review
- Risk: high
- Changed files: 35

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

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.47.1 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.47.1
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-B9sedq/pack/agentloopkit-0.47.1.tgz
README has no stale exact version pins.
Public docs hygiene passed for 81 public docs and 2 harness files.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed init symlink guard smoke passed.
Packed task archive symlink guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### task: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
