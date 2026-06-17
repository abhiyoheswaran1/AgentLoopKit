# Verification Report

- Timestamp: `2026-06-17T00:55:05.729Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-guard-ship-scoring-from-github-metadata-2.md`
- Title: `Guard ship scoring from GitHub metadata`
- Task type: `test-generation`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/maintenance-check-script.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  02:55:06
   Duration  249ms (transform 17ms, setup 0ms, import 25ms, tests 4ms, environment 0ms)

```

### task: `npm test -- tests/ship.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/ship.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  02:55:07
   Duration  9.90s (transform 122ms, setup 0ms, import 199ms, tests 9.57s, environment 0ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.35.2
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npx prettier --check scripts/maintenance-check.mjs tests/maintenance-check-script.test.ts tests/ship.test.ts README.md docs/maintenance-guards.md .agentloop/tasks/2026-06-17-guard-ship-scoring-from-github-metadata-2.md`

- Exit code: 0
- Status: pass


```text
Checking formatting...
All matched files use Prettier code style!
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

 ✓ tests/safety.test.ts (4 tests) 66ms
 ✓ tests/autonomous-dogfood.test.ts (10 tests) 64ms
 ✓ tests/project-detection.test.ts (7 tests) 49ms
 ✓ tests/config.test.ts (8 tests) 118ms
 ✓ tests/public-docs-hygiene.test.ts (9 tests) 194ms
 ✓ tests/dogfood-start-script.test.ts (6 tests) 77ms
 ✓ tests/schema.test.ts (1 test) 6ms
 ✓ tests/package-metadata.test.ts (1 test) 12ms
 ✓ tests/package-manager.test.ts (3 tests) 15ms
 ✓ tests/package-scripts.test.ts (4 tests) 28ms
 ✓ tests/roadmap-channels.test.ts (2 tests) 6ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 11ms
 ✓ tests/github-action-runner.test.ts (5 tests) 6ms
 ✓ tests/maintenance-check-script.test.ts (7 tests) 9ms
 ✓ tests/slug.test.ts (1 test) 4ms
 ✓ tests/schemastore.test.ts (4 tests) 1439ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  1411ms
 ✓ tests/template-renderer.test.ts (2 tests) 2ms
 ✓ tests/markdown-format.test.ts (3 tests) 4ms
 ✓ tests/task-contract.test.ts (1 test) 3ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 1104ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  1103ms
 ✓ tests/version.test.ts (2 tests) 2172ms
     ✓ prints the package version  1322ms
     ✓ prints the package version as JSON when requested  849ms
 ✓ tests/github-metadata.test.ts (9 tests) 2899ms
     ✓ exposes read-only local JSON import through the CLI  1138ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  1609ms
 ✓ tests/policy-packs.test.ts (11 tests) 5292ms
     ✓ exposes policy pack list, show, and apply throug

[output truncated: showing first 2500 and last 2500 characters of 18902 total]

eview context
$ npx --no-install tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Guard ship scoring from GitHub metadata` (`in-progress`) - `.agentloop/tasks/2026-06-17-guard-ship-scoring-from-github-metadata-2.md`
- Latest verification: missing
- Gates: `fail`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `61` AgentFlight placeholder task(s), `477` verification report(s), `762` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-02-47-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (1653; 82 non-evidence, 1571 AgentLoop evidence)`

## Recent Runs

- `handoff` `1646` changed file(s) (`82` non-evidence, `1564` AgentLoop evidence) - `2026-06-17-02-48-handoff-2`
- `handoff` `1641` changed file(s) (`82` non-evidence, `1559` AgentLoop evidence) - `2026-06-17-02-48-handoff`
- `ship` `92`/100 - `1632` changed file(s) (`82` non-evidence, `1550` AgentLoop evidence) - `2026-06-17-02-47-ship`

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
