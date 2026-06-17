# Verification Report

- Timestamp: `2026-06-17T00:44:45.221Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-schemastore-consistency-tests-to-maintenance-check.md`
- Title: `Add SchemaStore consistency tests to maintenance check`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  738 passed (738)
   Start at  02:44:46
   Duration  93.96s (transform 1.92s, setup 0ms, import 6.73s, tests 983.37s, environment 8ms)

```

### task: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 lint [git-root]
> eslint .

```

### task: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck [git-root]
> tsc --noEmit

```

### task: `npx pnpm@10.12.1 build`

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
ESM dist/cli/index.js     476.76 KB
ESM dist/cli/index.js.map 893.22 KB
ESM ⚡️ Build success in 39ms
DTS Build start
DTS ⚡️ Build success in 927ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm test -- tests/maintenance-check-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  02:46:30
   Duration  186ms (transform 18ms, setup 0ms, import 25ms, tests 3ms, environment 0ms)

```

### task: `npm run maintenance:check`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.35.2 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/dogfood-start-script.test.ts (6 tests) 22ms
 ✓ tests/autonomous-dogfood.test.ts (10 tests) 30ms
 ✓ tests/safety.test.ts (4 tests) 26ms
 ✓ tests/public-docs-hygiene.test.ts (9 tests) 91ms
 ✓ tests/project-detection.test.ts (7 tests) 47ms
 ✓ tests/schema.test.ts (1 test) 5ms
 ✓ tests/package-manager.test.ts (3 tests) 21ms
 ✓ tests/package-scripts.test.ts (4 tests) 7ms
 ✓ tests/config.test.ts (8 tests) 44ms
 ✓ tests/package-metadata.test.ts (1 test) 4ms
 ✓ tests/github-action-runner.test.ts (5 tests) 6ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 764ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  763ms
 ✓ tests/slug.test.ts (1 test) 3ms
 ✓ tests/template-renderer.test.ts (2 tests) 5ms
 ✓ tests/roadmap-channels.test.ts (2 tests) 9ms
 ✓ tests/markdown-format.test.ts (3 tests) 4ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 3ms
 ✓ tests/maintenance-check-script.test.ts (6 tests) 8ms
 ✓ tests/task-contract.test.ts (1 test) 2ms
 ✓ tests/schemastore.test.ts (4 tests) 988ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  968ms
 ✓ tests/version.test.ts (2 tests) 1517ms
     ✓ prints the package version  998ms
     ✓ prints the package version as JSON when requested  517ms
 ✓ tests/github-metadata.test.ts (9 tests) 2006ms
     ✓ exposes read-only local JSON import through the CLI  1000ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  945ms
 ✓ tests/policy-packs.test.ts (11 tests) 3648ms
     ✓ exposes policy pack list, show, and apply through the CLI  

[output truncated: showing first 2500 and last 2500 characters of 18109 total]

tall tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Add SchemaStore consistency tests to maintenance check` (`in-progress`) - `.agentloop/tasks/2026-06-17-add-schemastore-consistency-tests-to-maintenance-check.md`
- Latest verification: missing
- Gates: `fail`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `60` AgentFlight placeholder task(s), `476` verification report(s), `759` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-02-41-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (1628; 82 non-evidence, 1546 AgentLoop evidence)`

## Recent Runs

- `handoff` `1621` changed file(s) (`82` non-evidence, `1539` AgentLoop evidence) - `2026-06-17-02-42-handoff-2`
- `handoff` `1616` changed file(s) (`82` non-evidence, `1534` AgentLoop evidence) - `2026-06-17-02-42-handoff`
- `ship` `92`/100 - `1607` changed file(s) (`82` non-evidence, `1525` AgentLoop evidence) - `2026-06-17-02-41-ship`

## Next Action

Run `agentloop verify`.

A task exists, but no verification report was found.

## Safety

This snapshot is read-only. It does not run commands, write files, include full Markdown artifact bodies, read `.env` contents, or call external APIs.


## agentflight session health
$ npx --yes agentflight doctor
AgentFlight Doctor

Overall: OK

- OK Node.js version: v26.3.0 satisfies AgentFlight's Node.js 20+ target.
- OK npm availability: npm 11.16.0 is available.
- OK git availability: git is available.
- OK repository root: [git-root]
- OK package manager: pnpm
- OK .agentflight presence: .agentflight exists.
- OK config validity: .agentflight/config.json is valid.
- OK .agentflight writable: .agentflight is writable.
- OK current session: A current session exists.
- OK ProjScan availability: ProjScan is available.
- OK AgentLoopKit availability: AgentLoopKit is available.
- OK test script: npm run test is configured.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!

Dogfood gate passed.

Maintenance check passed.
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
