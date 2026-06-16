# Verification Report

- Timestamp: `2026-06-16T12:04:47.252Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `7fbeca7`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-strengthen-github-metadata-maintenance-gate.md`
- Title: `Strengthen GitHub metadata maintenance gate`
- Task type: `tests`
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
   Start at  14:04:51
   Duration  175.86s (transform 2.21s, setup 0ms, import 8.69s, tests 1868.37s, environment 6ms)

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
ESM ⚡️ Build success in 73ms
DTS Build start
DTS ⚡️ Build success in 1943ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/github-metadata.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 test
> vitest run tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/github-metadata.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  3 passed (3)
      Tests  17 passed (17)
   Start at  14:08:05
   Duration  3.12s (transform 98ms, setup 0ms, import 223ms, tests 2.75s, environment 0ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.34.1 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.34.1
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
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
ESM ⚡️ Build success in 37ms
DTS Build start
DTS ⚡️ Build success in 1356ms
DTS dist/cli/index.d.ts 13.00 B
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
