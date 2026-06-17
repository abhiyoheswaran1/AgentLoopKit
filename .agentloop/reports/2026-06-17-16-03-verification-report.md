# Verification Report

- Timestamp: `2026-06-17T14:03:23.505Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-17-separate-agentloop-evidence-churn-in-release-check-2.md`
- Title: `Separate AgentLoop evidence churn in release-check`
- Task type: `feature`
- Status: `in-progress`




## Failure Summary
### test: `npx pnpm@10.12.1 test`

- Exit code: 143

```text
> agentloopkit@0.35.2 test [git-root]
> vitest run
 RUN  v4.1.8 [git-root]
 ELIFECYCLE  Test failed. See above for more details.
Command timed out after 180000ms.
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 143
- Status: fail
- Timed out: yes


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]

 ELIFECYCLE  Test failed. See above for more details.
Command timed out after 180000ms.
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
ESM dist/cli/index.js     492.94 KB
ESM dist/cli/index.js.map 923.79 KB
ESM ⚡️ Build success in 55ms
DTS Build start
DTS ⚡️ Build success in 2143ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/release-check.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/release-check.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  16:06:45
   Duration  67.79s (transform 78ms, setup 0ms, import 155ms, tests 67.39s, environment 0ms)

```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Fix failing commands before claiming completion.
