# Verification Report

- Timestamp: `2026-06-24T06:24:01.319Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `792edea2`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-release-agentloopkit-0-41-0.md`
- Title: `Release AgentLoopKit 0.41.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `npm run release-flow`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 release-flow
> node scripts/prepublish-check.mjs && npm run lint && npm run typecheck && npm run test:release && npm run build && npm run check:public-docs && npm run check:links && npm run dogfood && npm run smoke:release

Prepublish metadata check passed.

> agentloopkit@0.41.0 lint
> eslint .


> agentloopkit@0.41.0 typecheck
> tsc --noEmit


> agentloopkit@0.41.0 test:release
> npm test


> agentloopkit@0.41.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  71 passed (71)
      Tests  906 passed (906)
   Start at  08:24:19
   Duration  382.18s (transform 4.49s, setup 0ms, import 18.42s, tests 1447.94s, environment 23ms)


> agentloopkit@0.41.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     592.46 KB
ESM dist/cli/index.js.map 1.09 MB
ESM ⚡️ Build success in 119ms
DTS Build start
DTS ⚡️ Build success in 5789ms
DTS dist/cli/index.d.ts 13.00 B

> agentloopkit@0.41.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.41.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

> agentloopkit@0.41.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (5031 file(s) checked).

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
AgentLoopKit: task="Release AgentLoopKit 0.41.0" status="in-progress"; verification=missing; run="ship 92/100"; tree=dirty (107; 43 non-evidence, 64 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

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
# AgentLoopKit Harness 

[output truncated: showing first 2500 and last 2500 characters of 15085 total]

ge.json
   Why: dependency metadata changed; no passing test evidence
   Focus: Check install/build impact and dependency risk first.
   Suggested proof: agentflight verify -- npm run typecheck
2. server.json
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/cli/commands/start.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/agent-start.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

Proof gaps:
- warning: Dependency files changed without install, build, typecheck, or test evidence.
  Suggested proof: agentflight verify -- npm run typecheck
- warning: Test files changed without passing test evidence.
  Suggested proof: agentflight verify -- npm test

Latest snapshot:
- No snapshots recorded.

Readiness: Needs verification
Reason: Dependency files changed without install, build, typecheck, or test evidence.

Next action:
Run agentflight verify -- npm run typecheck

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.

> agentloopkit@0.41.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.41.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-KWoPtB/pack/agentloopkit-0.41.0.tgz
README has no stale exact version pins.
Public docs hygiene passed for 78 public docs and 2 harness files.
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
