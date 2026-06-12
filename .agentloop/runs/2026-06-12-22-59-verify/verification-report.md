# Verification Report

- Timestamp: `2026-06-12T20:56:50.222Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `5bf0d9e`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-release-agentloopkit-0-28-6-patch.md`
- Title: `Release AgentLoopKit 0.28.6 patch`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass


```text
Prepublish metadata check passed.
```

### task: `npm test -- tests/release-check.test.ts tests/release-smoke.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.6 test
> vitest run tests/release-check.test.ts tests/release-smoke.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  2 passed (2)
      Tests  26 passed (26)
   Start at  22:56:55
   Duration  77.73s (transform 63ms, setup 0ms, import 132ms, tests 77.26s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.6 typecheck
> tsc --noEmit

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.6 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     326.47 KB
ESM dist/cli/index.js.map 621.21 KB
ESM ⚡️ Build success in 24ms
DTS Build start
DTS ⚡️ Build success in 836ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run smoke:release`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.6 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.28.6
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-GzTq8a/pack/agentloopkit-0.28.6.tgz
README has no stale exact version pins.
Public docs have no stale version pins or unsupported public claims.
ROADMAP current release state matches package metadata.
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
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
