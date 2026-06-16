# Verification Report

- Timestamp: `2026-06-16T00:53:27.600Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `ca31f03`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-make-prepare-pr-output-markdown-safe.md`
- Title: `Make prepare-pr output Markdown-safe`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/prepare-pr.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/prepare-pr.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:53:28
   Duration  8.87s (transform 59ms, setup 0ms, import 121ms, tests 8.64s, environment 0ms)

```

### task: `npm test -- tests/prepare-pr.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/prepare-pr.test.ts tests/cli-docs-drift.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  02:53:37
   Duration  9.32s (transform 100ms, setup 0ms, import 211ms, tests 9.49s, environment 0ms)

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

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (2210 file(s) checked).
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
ESM dist/cli/index.js     427.08 KB
ESM dist/cli/index.js.map 806.14 KB
ESM ⚡️ Build success in 36ms
DTS Build start
DTS ⚡️ Build success in 1298ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  62 passed (62)
      Tests  608 passed (608)
   Start at  02:53:56
   Duration  71.04s (transform 2.60s, setup 0ms, import 11.93s, tests 699.00s, environment 9ms)

```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
