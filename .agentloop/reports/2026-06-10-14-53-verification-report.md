# Verification Report

- Timestamp: 2026-06-10T12:53:24.995Z
- Repo: AgentLoopKit
- Git branch: main
- Git commit: a049e2c
- Working tree: dirty
- Overall status: pass


## Task Context
- Path: .agentloop/tasks/2026-06-10-refresh-readme-vhs-demo.md
- Title: Refresh README VHS demo
- Task type: docs
- Status: in-progress



## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.5 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  30 passed (30)
      Tests  133 passed (133)
   Start at  14:53:27
   Duration  35.86s (transform 266ms, setup 0ms, import 1.89s, tests 294.23s, environment 2ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.5 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.5 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.5 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
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
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 1007ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run smoke:release`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.5 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.24.5
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-FA0CQL/pack/agentloopkit-0.24.5.tgz
README pins match package version.
Packed binary version smoke passed.
Packed init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

### custom: `npx pnpm@10.12.1 check:links`

- Exit code: 0
- Status: pass

```text

> agentloopkit@0.24.5 check:links /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsx scripts/check-markdown-links.ts

Markdown links OK (587 file(s) checked).
```

### custom: `node scripts/prepublish-check.mjs`

- Exit code: 0
- Status: pass

```text
Prepublish metadata check passed.
```

### custom: `npx projscan doctor --format markdown`

- Exit code: 0
- Status: pass

```text
# Project Health Report

**Health Score: A (97/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ℹ️ **Unused exports in scripts/smoke-packed-release.mjs** - 4 named exports (assertReadmePins, createSmokeSteps, runReleaseSmoke, isDirectRun) but nothing in the project imports this file. Dead code or awaiting wiring?
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
