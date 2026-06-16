# Verification Report

- Timestamp: `2026-06-16T11:03:24.698Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `06fa4eb`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-fix-stale-generated-artifact-ordering.md`
- Title: `Fix stale generated artifact ordering`
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
      Tests  649 passed (649)
   Start at  13:03:31
   Duration  249.53s (transform 2.45s, setup 0ms, import 10.02s, tests 2220.93s, environment 8ms)

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
ESM dist/cli/index.js     440.41 KB
ESM dist/cli/index.js.map 828.52 KB
ESM ⚡️ Build success in 71ms
DTS Build start
DTS ⚡️ Build success in 2578ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/artifacts.test.ts tests/status.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 test
> vitest run tests/artifacts.test.ts tests/status.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  58 passed (58)
   Start at  13:08:07
   Duration  128.38s (transform 256ms, setup 0ms, import 644ms, tests 205.46s, environment 0ms)

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
ESM dist/cli/index.js     440.41 KB
ESM dist/cli/index.js.map 828.52 KB
ESM ⚡️ Build success in 80ms
DTS Build start
DTS ⚡️ Build success in 2781ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
