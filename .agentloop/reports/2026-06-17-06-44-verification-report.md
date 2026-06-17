# Verification Report

- Timestamp: `2026-06-17T04:44:32.914Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-release-check-redaction-2.md`
- Title: `Add built CLI smoke coverage for release-check redaction`
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
      Tests  767 passed (767)
   Start at  06:44:34
   Duration  161.72s (transform 1.07s, setup 0ms, import 4.36s, tests 1496.56s, environment 4ms)

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
ESM dist/cli/index.js     485.03 KB
ESM dist/cli/index.js.map 909.04 KB
ESM ⚡️ Build success in 41ms
DTS Build start
DTS ⚡️ Build success in 1022ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/distribution-artifacts.test.ts -t "release-check redaction"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts -t release-check redaction


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 31 skipped (32)
   Start at  06:47:28
   Duration  155ms (transform 22ms, setup 0ms, import 31ms, tests 3ms, environment 0ms)

```

### task: `npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  06:47:29
   Duration  166ms (transform 23ms, setup 0ms, import 31ms, tests 16ms, environment 0ms)

```

### task: `npx prettier --check scripts/smoke-cli.mjs tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
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
ESM dist/cli/index.js     485.03 KB
ESM dist/cli/index.js.map 909.04 KB
ESM ⚡️ Build success in 37ms
DTS Build start
DTS ⚡️ Build success in 1033ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.35.2
Version smoke passed.
Release-proof completion smoke passed.
Release-proof HEAD tag smoke passed.
Release-check redaction smoke passed.
Generated artifact filename ordering smoke passed.
Fish task archive completion smoke passed.
SchemaStore smoke passed.
Missing config smoke passed.
Init dry-run smoke passed.
Forced home-directory dry-run warning smoke passed.
Init smoke passed.
GitHub metadata dry-run smoke passed.
Harness upgrade smoke passed.
Doctor smoke passed.
Doctor redaction smoke passed.
Create-task smoke passed.
Task-list JSON groups smoke passed.
Task-doctor redaction smoke passed.
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
CI summary redaction smoke passed.
Release-notes redaction smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger redaction smoke passed.
Run ledger smoke passed.
Prepare-pr smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Policy pack inventory smoke passed.
Policy pack redaction smoke passed.
Install-agent preservation smoke passed.
Install-agent redaction smoke passed.
Nested cwd smoke passed.
Stale task state recovery smoke passed.
CLI smoke passed.
```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
