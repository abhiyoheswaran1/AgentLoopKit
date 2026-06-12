# Verification Report

- Timestamp: `2026-06-12T09:54:36.794Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `4aa036e`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-clean-stale-0-28-0-harness-release-guidance.md`
- Title: `Clean stale 0.28.0 harness release guidance`
- Task type: `docs`
- Status: `in-progress`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  48 passed (48)
      Tests  417 passed (417)
   Start at  11:54:42
   Duration  169.56s (transform 373ms, setup 0ms, import 2.53s, tests 1693.43s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     312.39 KB
ESM dist/cli/index.js.map 595.14 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 848ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/release-smoke.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test
> vitest run tests/release-smoke.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  11:57:56
   Duration  407ms (transform 20ms, setup 0ms, import 28ms, tests 13ms, environment 0ms)

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  48 passed (48)
      Tests  417 passed (417)
   Start at  11:58:10
   Duration  168.74s (transform 369ms, setup 0ms, import 2.36s, tests 1673.13s, environment 3ms)

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     312.39 KB
ESM dist/cli/index.js.map 595.14 KB
ESM ⚡️ Build success in 32ms
DTS Build start
DTS ⚡️ Build success in 909ms
DTS dist/cli/index.d.ts 13.00 B
```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
