# Verification Report

- Timestamp: `2026-06-17T16:49:33.482Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `a3debbaf`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-prepare-agentloopkit-0-36-1-patch-release.md`
- Title: `Prepare AgentLoopKit 0.36.1 patch release`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  64 passed (64)
      Tests  819 passed (819)
   Start at  18:49:37
   Duration  257.82s (transform 832ms, setup 0ms, import 3.84s, tests 2743.37s, environment 4ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.1 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     494.72 KB
ESM dist/cli/index.js.map 927.17 KB
ESM ⚡️ Build success in 32ms
DTS Build start
DTS ⚡️ Build success in 1072ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
