# Verification Report

- Timestamp: `2026-06-13T04:58:39.526Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `e3f28b0`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-13-report-post-ship-gate-state.md`
- Title: `Report post-ship gate state`
- Task type: `bugfix`
- Status: `in-progress`





## Commands Run
### custom: `npm test -- tests/ship.test.ts tests/check-gates.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 test
> vitest run tests/ship.test.ts tests/check-gates.test.ts


 RUN  v4.1.8 /Users/abhyoh/local dev folder/Apps/AgentLoopKit


 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  06:58:43
   Duration  147.11s (transform 66ms, setup 0ms, import 180ms, tests 208.62s, environment 0ms)

```

### custom: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 typecheck
> tsc --noEmit

```

### custom: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 lint
> eslint .

```

### custom: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.28.7 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (1586 file(s) checked).
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
ESM dist/cli/index.js     337.18 KB
ESM dist/cli/index.js.map 640.23 KB
ESM ⚡️ Build success in 25ms
DTS Build start
DTS ⚡️ Build success in 869ms
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

### custom: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
