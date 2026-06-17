# Verification Report

- Timestamp: `2026-06-17T16:37:57.307Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `a3debbaf`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-17-prepare-agentloopkit-0-36-1-patch-release.md`
- Title: `Prepare AgentLoopKit 0.36.1 patch release`
- Task type: `release`
- Status: `in-progress`




## Failure Summary
### test: `npx pnpm@10.12.1 test`

- Exit code: 143

```text
> agentloopkit@0.36.1 test [git-root]
> vitest run
 RUN  v4.1.8 [git-root]
 ELIFECYCLE  Test failed. See above for more details.
Command timed out after 300000ms.
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 143
- Status: fail
- Timed out: yes


```text

> agentloopkit@0.36.1 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]

 ELIFECYCLE  Test failed. See above for more details.
Command timed out after 300000ms.
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
ESM ⚡️ Build success in 39ms
DTS Build start
DTS ⚡️ Build success in 1097ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Fix failing commands before claiming completion.
