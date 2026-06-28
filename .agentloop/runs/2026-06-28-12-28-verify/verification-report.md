# Verification Report

- Timestamp: `2026-06-28T10:08:05.892Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `d62b303e`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-28-release-agentloopkit-0-46-0.md`
- Title: `Release AgentLoopKit 0.46.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `npm run release-flow`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.46.0 release-flow
> node scripts/prepublish-check.mjs && npm run lint && npm run typecheck && npm run test:release && npm run build && npm run check:public-docs && npm run check:links && npm run dogfood && npm run smoke:release

Prepublish metadata check passed.

> agentloopkit@0.46.0 lint
> eslint .


> agentloopkit@0.46.0 typecheck
> tsc --noEmit


> agentloopkit@0.46.0 test:release
> npm test


> agentloopkit@0.46.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  74 passed (74)
      Tests  994 passed (994)
   Start at  12:08:23
   Duration  1101.17s (transform 754ms, setup 0ms, import 4.01s, tests 4349.58s, environment 4ms)


> agentloopkit@0.46.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"index":"src/index.ts","cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/index.js         129.91 KB
ESM dist/cli/index.js     715.85 KB
ESM dist/index.js.map     346.79 KB
ESM dist/cli/index.js.map 1.31 MB
ESM ⚡️ Build success in 56ms
DTS Build start
DTS ⚡️ Build success in 2215ms
DTS dist/cli/index.d.ts 13.00 B
DTS dist/index.d.ts     18.80 KB

> agentloopkit@0.46.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.46.0
Public docs checked: 81
Repo harness files checked: 2
Public docs hygiene passed.

> agentloopkit@0.46.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (5350 file(s) checked).

> agentloopkit@0.46.0 dogfood
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
AgentLoopKit: task="Release AgentLoopKit 0.46.0" status="in-progress"; verification=missing; run="handoff 36 files"; tree=dirty (47; 25 non-evidence, 22 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.46.0
Public docs checked: 81
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilit

[output truncated: showing first 2500 and last 2500 characters of 14492 total]

 (exit 0, 70408ms)
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
3. src/cli/commands/loop.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/core/loop-contract.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/loop-runner.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

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

> agentloopkit@0.46.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.46.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-c1E9mT/pack/agentloopkit-0.46.0.tgz
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


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
