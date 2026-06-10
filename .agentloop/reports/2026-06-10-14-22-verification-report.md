# Verification Report

- Timestamp: 2026-06-10T12:22:03.636Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: b39c2f0
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-10-add-release-smoke-script.md
- Title: Add release smoke script
- Task type: feature
- Status: in-progress



## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.4 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  30 passed (30)
      Tests  133 passed (133)
   Start at  14:22:07
   Duration  31.82s (transform 284ms, setup 0ms, import 2.00s, tests 251.72s, environment 2ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.4 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.4 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.4 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     142.07 KB
ESM dist/cli/index.js.map 270.57 KB
ESM ⚡️ Build success in 32ms
DTS Build start
DTS ⚡️ Build success in 908ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.4 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.24.4
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-5V2BJf/pack/agentloopkit-0.24.4.tgz
README pins match package version.
Packed binary version smoke passed.
Packed init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
