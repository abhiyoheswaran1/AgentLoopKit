# Verification Report

- Timestamp: `2026-06-12T16:46:11.151Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `276dc1d`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-12-smoke-test-bounded-run-output.md`
- Title: `Smoke test bounded run output`
- Task type: `tests`
- Status: `in-progress`




## Commands Run
### task: `npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.3 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  18:46:14
   Duration  523ms (transform 13ms, setup 0ms, import 19ms, tests 8ms, environment 0ms)

```

### task: `npm run build && node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.3 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     323.74 KB
ESM dist/cli/index.js.map 616.10 KB
ESM ⚡️ Build success in 26ms
DTS Build start
DTS ⚡️ Build success in 897ms
DTS dist/cli/index.d.ts 13.00 B
CLI smoke for agentloopkit@0.28.3
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.3 test
> vitest run


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  51 passed (51)
      Tests  453 passed (453)
   Start at  18:47:04
   Duration  193.26s (transform 390ms, setup 0ms, import 2.34s, tests 1853.47s, environment 3ms)

```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
