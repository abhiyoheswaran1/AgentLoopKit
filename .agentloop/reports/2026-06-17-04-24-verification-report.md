# Verification Report

- Timestamp: `2026-06-17T02:24:20.184Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-report-and-badge-redaction.md`
- Title: `Add built CLI smoke coverage for report and badge redaction`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  755 passed (755)
   Start at  04:24:21
   Duration  117.01s (transform 1.75s, setup 0ms, import 6.28s, tests 1238.06s, environment 16ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     484.93 KB
ESM dist/cli/index.js.map 908.89 KB
ESM ⚡️ Build success in 41ms
DTS Build start
DTS ⚡️ Build success in 911ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.35.2
Version smoke passed.
Release-proof completion smoke passed.
SchemaStore smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Forced home-directory dry-run warning smoke passed.
Init smoke passed.
GitHub metadata dry-run smoke passed.
Harness upgrade smoke passed.
Doctor smoke passed.
Create-task smoke passed.
Task lifecycle smoke passed.
Task-command post-verification smoke passed.
Verify smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Artifact run split smoke passed.
Ship report artifact smoke passed.
Report and badge redaction smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Policy pack inventory smoke passed.
Install-agent preservation smoke passed.
Install-agent redaction smoke passed.
Nested cwd smoke passed.
CLI smoke passed.
```

### task: `npm test -- tests/distribution-artifacts.test.ts -t "report and badge redaction"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts -t report and badge redaction


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 19 skipped (20)
   Start at  04:26:38
   Duration  139ms (transform 15ms, setup 0ms, import 22ms, tests 2ms, environment 0ms)

```

### task: `npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  04:26:39
   Duration  138ms (transform 15ms, setup 0ms, import 21ms, tests 8ms, environment 0ms)

```

### task: `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
