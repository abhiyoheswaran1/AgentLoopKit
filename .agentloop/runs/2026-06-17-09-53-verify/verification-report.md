# Verification Report

- Timestamp: `2026-06-17T07:52:28.882Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-built-cli-smoke-coverage-for-npm-status-captured-registry-mode.md`
- Title: `Add built CLI smoke coverage for npm-status captured registry mode`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/distribution-artifacts.test.ts -t "npm-status captured registry"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts -t npm-status captured registry


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 45 skipped (46)
   Start at  09:52:29
   Duration  201ms (transform 23ms, setup 0ms, import 31ms, tests 3ms, environment 0ms)

```

### task: `npx prettier --check tests/distribution-artifacts.test.ts scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
```

### task: `git diff --name-only -- package.json pnpm-lock.yaml CHANGELOG.md .github/workflows`

- Exit code: 0
- Status: pass


```text
(no output)
```

### task: `npm test -- tests/distribution-artifacts.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/distribution-artifacts.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  09:52:33
   Duration  219ms (transform 26ms, setup 0ms, import 34ms, tests 19ms, environment 0ms)

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
ESM ⚡️ Build success in 34ms
DTS Build start
DTS ⚡️ Build success in 1071ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `node scripts/smoke-cli.mjs`

- Exit code: 0
- Status: pass


```text
CLI smoke for agentloopkit@0.35.2
Version smoke passed.
Npm-status captured registry smoke passed.
Release-proof completion smoke passed.
Release-proof HEAD tag smoke passed.
Release-check redaction smoke passed.
Generated artifact filename ordering smoke passed.
Fish task archive completion smoke passed.
Template and completion command smoke passed.
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
Verify redaction smoke passed.
Verify progress smoke passed.
Handoff smoke passed.
Check-gates redaction smoke passed.
Check-gates smoke passed with status pass.
Ship smoke passed.
Artifacts redaction smoke passed.
Artifact run split smoke passed.
Ship report artifact smoke passed.
Report and badge redaction smoke passed.
CI summary redaction smoke passed.
Release-notes redaction smoke passed.
Status and next redaction smoke passed.
Review-context redaction smoke passed.
Review-context smoke passed.
Run ledger limit smoke passed.
Run ledger redaction smoke passed.
Run ledger smoke passed.
Handoff redaction smoke passed.
Summarize redaction smoke passed.
Ship redaction smoke passed.
Prepare-pr smoke passed.
Prepare-pr redaction smoke passed.
Maintainer-check redaction smoke passed.
Maintainer-check smoke passed with status warn.
Task done smoke passed.
Policy command redaction smoke passed.
Policy pack inventory smoke passed.
Policy pack redaction smoke passed.
Install-agent preservation smoke passed.
Install-agent redaction smoke passed.
Nested cwd smoke passed.
Stale task state recovery smoke passed.
CLI smoke passed.
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
