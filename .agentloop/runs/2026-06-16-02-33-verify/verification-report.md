# Verification Report

- Timestamp: `2026-06-16T00:33:04.657Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `4973799`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-make-ship-output-markdown-safe.md`
- Title: `Make ship output Markdown-safe`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/ship.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/ship.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  02:33:05
   Duration  7.07s (transform 153ms, setup 0ms, import 260ms, tests 6.66s, environment 0ms)

```

### task: `npm test -- tests/ship.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/ship.test.ts tests/cli-docs-drift.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  11 passed (11)
   Start at  02:33:12
   Duration  7.05s (transform 155ms, setup 0ms, import 288ms, tests 7.21s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 lint
> eslint .

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.33.0
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     426.55 KB
ESM dist/cli/index.js.map 805.46 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 899ms
DTS dist/cli/index.d.ts 13.00 B
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
