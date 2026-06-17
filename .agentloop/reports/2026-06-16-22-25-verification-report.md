# Verification Report

- Timestamp: `2026-06-16T20:25:44.096Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-exclude-parked-tasks-from-artifact-latest-task.md`
- Title: `Exclude parked tasks from artifact latest task`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  22:25:44
   Duration  21.66s (transform 46ms, setup 0ms, import 104ms, tests 21.44s, environment 0ms)

```

### task: `npm test -- tests/status.test.ts tests/review-context.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/status.test.ts tests/review-context.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  37 passed (37)
   Start at  22:26:06
   Duration  25.01s (transform 164ms, setup 0ms, import 303ms, tests 27.02s, environment 0ms)

```

### task: `npm test -- tests/public-docs-hygiene.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/public-docs-hygiene.test.ts tests/cli-docs-drift.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  6 passed (6)
   Start at  22:26:32
   Duration  601ms (transform 87ms, setup 0ms, import 130ms, tests 402ms, environment 0ms)

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

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     466.06 KB
ESM dist/cli/index.js.map 873.61 KB
ESM ⚡️ Build success in 34ms
DTS Build start
DTS ⚡️ Build success in 896ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  699 passed (699)
   Start at  22:26:39
   Duration  84.48s (transform 2.48s, setup 0ms, import 11.59s, tests 779.74s, environment 11ms)

```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
