# Verification Report

- Timestamp: `2026-06-15T20:20:47.297Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `23c4020`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-15-smoke-ship-report-artifact-filters.md`
- Title: `Smoke ship report artifact filters`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.33.0 test
> vitest run tests/artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  22:20:51
   Duration  82.49s (transform 39ms, setup 0ms, import 97ms, tests 82.01s, environment 0ms)

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
ESM dist/cli/index.js     415.51 KB
ESM dist/cli/index.js.map 788.88 KB
ESM ⚡️ Build success in 29ms
DTS Build start
DTS ⚡️ Build success in 958ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.33.0
Version smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Init smoke passed.
Harness upgrade smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Verify smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Ship report artifact smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
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

Markdown links OK (2019 file(s) checked).
```

## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
