# Verification Report

- Timestamp: `2026-06-16T02:36:38.053Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `bdba437`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-16-make-upgrade-harness-output-markdown-safe.md`
- Title: `Make upgrade-harness output Markdown-safe`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/upgrade-harness.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/upgrade-harness.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  04:36:38
   Duration  3.58s (transform 75ms, setup 0ms, import 138ms, tests 3.32s, environment 0ms)

```

### task: `npm test -- tests/upgrade-harness.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/upgrade-harness.test.ts tests/cli-docs-drift.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  7 passed (7)
   Start at  04:36:42
   Duration  3.67s (transform 124ms, setup 0ms, import 252ms, tests 3.80s, environment 0ms)

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

Markdown links OK (2282 file(s) checked).
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
ESM dist/cli/index.js     428.39 KB
ESM dist/cli/index.js.map 807.41 KB
ESM ⚡️ Build success in 32ms
DTS Build start
DTS ⚡️ Build success in 910ms
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
      Tests  618 passed (618)
   Start at  04:36:54
   Duration  76.92s (transform 2.13s, setup 0ms, import 10.70s, tests 783.57s, environment 16ms)

```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
