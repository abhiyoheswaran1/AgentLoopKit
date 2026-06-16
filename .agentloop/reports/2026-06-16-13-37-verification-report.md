# Verification Report

- Timestamp: `2026-06-16T11:37:58.263Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `b3e782e`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-clarify-release-proof-when-head-is-after-tag.md`
- Title: `Clarify release proof when HEAD is after tag`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  650 passed (650)
   Start at  13:38:03
   Duration  209.39s (transform 1.65s, setup 0ms, import 7.76s, tests 2139.19s, environment 7ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     441.29 KB
ESM dist/cli/index.js.map 829.98 KB
ESM ⚡️ Build success in 56ms
DTS Build start
DTS ⚡️ Build success in 1936ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/release-proof.test.ts tests/autonomous-dogfood.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 test
> vitest run tests/release-proof.test.ts tests/autonomous-dogfood.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  13:41:58
   Duration  35.29s (transform 77ms, setup 0ms, import 161ms, tests 34.72s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 lint
> eslint .

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     441.29 KB
ESM dist/cli/index.js.map 829.98 KB
ESM ⚡️ Build success in 57ms
DTS Build start
DTS ⚡️ Build success in 2274ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
