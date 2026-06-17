# Verification Report

- Timestamp: `2026-06-16T19:16:34.184Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-separate-agentloop-evidence-churn-in-maintainer-check.md`
- Title: `Separate AgentLoop evidence churn in maintainer check`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  688 passed (688)
   Start at  21:16:35
   Duration  65.48s (transform 2.67s, setup 0ms, import 10.01s, tests 676.01s, environment 9ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     460.82 KB
ESM dist/cli/index.js.map 864.58 KB
ESM ⚡️ Build success in 29ms
DTS Build start
DTS ⚡️ Build success in 908ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/maintainer-check.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintainer-check.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  21:17:50
   Duration  5.74s (transform 86ms, setup 0ms, import 154ms, tests 5.47s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint
> eslint .

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  688 passed (688)
   Start at  21:18:01
   Duration  63.36s (transform 2.70s, setup 0ms, import 10.05s, tests 647.50s, environment 10ms)

```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
