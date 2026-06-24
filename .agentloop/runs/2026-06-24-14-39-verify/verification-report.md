# Verification Report

- Timestamp: `2026-06-24T12:30:02.337Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `9966b6dc`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-release-agentloopkit-0-42-0.md`
- Title: `Release AgentLoopKit 0.42.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `npm run release-flow`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 release-flow
> node scripts/prepublish-check.mjs && npm run lint && npm run typecheck && npm run test:release && npm run build && npm run check:public-docs && npm run check:links && npm run dogfood && npm run smoke:release

Prepublish metadata check passed.

> agentloopkit@0.42.0 lint
> eslint .


> agentloopkit@0.42.0 typecheck
> tsc --noEmit


> agentloopkit@0.42.0 test:release
> npm test


> agentloopkit@0.42.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  71 passed (71)
      Tests  910 passed (910)
   Start at  14:30:20
   Duration  399.84s (transform 3.51s, setup 0ms, import 12.16s, tests 1561.48s, environment 10ms)


> agentloopkit@0.42.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     594.80 KB
ESM dist/cli/index.js.map 1.09 MB
ESM ⚡️ Build success in 169ms
DTS Build start
DTS ⚡️ Build success in 3170ms
DTS dist/cli/index.d.ts 13.00 B

> agentloopkit@0.42.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.42.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

> agentloopkit@0.42.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (5080 file(s) checked).

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
AgentLoopKit: task="Release AgentLoopKit 0.42.0" status="in-progress"; verification=missing; run="handoff 98 files"; tree=dirty (104; 40 non-evidence, 64 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.42.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --redact-paths
# AgentLoopKit Har

[output truncated: showing first 2500 and last 2500 characters of 16076 total]

 failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
5. src/core/doctor.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

Proof gaps:
- blocking: A verification command failed and must be fixed or rerun successfully: npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
  Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

Latest snapshot:
- No snapshots recorded.

Readiness: Blocked by failed verification
Reason: A verification command failed and must be fixed or rerun successfully: npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

Next action:
Fix the failed command, then rerun agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.

> agentloopkit@0.42.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.42.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-zPmQ8g/pack/agentloopkit-0.42.0.tgz
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
