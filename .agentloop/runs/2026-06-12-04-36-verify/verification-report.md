# Verification Report

- Timestamp: `2026-06-12T02:30:54.297Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `b9de4f8`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-add-ship-github-comment-output.md`
- Title: `Add ship GitHub comment output`
- Task type: `feature`
- Status: `review`




## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  47 passed (47)
      Tests  407 passed (407)
   Start at  04:31:00
   Duration  151.72s (transform 323ms, setup 0ms, import 2.09s, tests 1479.02s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 lint /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 typecheck /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 build /Users/abhyoh/local dev folder/Apps/AgentLoopKit
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     297.67 KB
ESM dist/cli/index.js.map 567.67 KB
ESM ⚡️ Build success in 32ms
DTS Build start
DTS ⚡️ Build success in 817ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/ship.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run tests/ship.test.ts tests/cli-docs-drift.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  04:33:57
   Duration  20.69s (transform 48ms, setup 0ms, import 141ms, tests 22.73s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.27.0 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  47 passed (47)
      Tests  407 passed (407)
   Start at  04:34:27
   Duration  143.31s (transform 413ms, setup 0ms, import 2.19s, tests 1416.35s, environment 3ms)

```

## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
