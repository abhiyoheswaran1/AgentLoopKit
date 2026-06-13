# Verification Report

- Timestamp: `2026-06-13T04:25:53.488Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `7e09000`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-13-treat-ship-runs-as-fresh-handoff-evidence.md`
- Title: `Treat ship runs as fresh handoff evidence`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### custom: `npm test -- tests/check-gates.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 test
> vitest run tests/check-gates.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  06:25:57
   Duration  144.00s (transform 54ms, setup 0ms, import 114ms, tests 143.52s, environment 0ms)

```

### custom: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 typecheck
> tsc --noEmit

```

### custom: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /Users/abhyoh/local dev folder/Apps/AgentLoopKit/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     335.85 KB
ESM dist/cli/index.js.map 637.75 KB
ESM ⚡️ Build success in 28ms
DTS Build start
DTS ⚡️ Build success in 820ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.28.7
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

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
