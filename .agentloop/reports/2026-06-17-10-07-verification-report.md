# Verification Report

- Timestamp: `2026-06-17T08:07:44.326Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-add-npm-status-safety-tests-to-maintenance-check.md`
- Title: `Add npm-status safety tests to maintenance check`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/maintenance-check-script.test.ts -t "npm status safety"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts -t npm status safety


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 7 skipped (8)
   Start at  10:07:45
   Duration  201ms (transform 18ms, setup 0ms, import 28ms, tests 2ms, environment 0ms)

```

### task: `npx prettier --check scripts/maintenance-check.mjs tests/maintenance-check-script.test.ts docs/maintenance-guards.md README.md`

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

### task: `npm test -- tests/maintenance-check-script.test.ts tests/npm-status.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/maintenance-check-script.test.ts tests/npm-status.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  2 passed (2)
      Tests  24 passed (24)
   Start at  10:07:49
   Duration  10.15s (transform 57ms, setup 0ms, import 110ms, tests 9.92s, environment 0ms)

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

 ✓ tests/dogfood-start-script.test.ts (6 tests) 18ms
 ✓ tests/safety.test.ts (4 tests) 30ms
 ✓ tests/autonomous-dogfood.test.ts (10 tests) 34ms
 ✓ tests/config.test.ts (8 tests) 47ms
 ✓ tests/public-docs-hygiene.test.ts (9 tests) 137ms
 ✓ tests/package-scripts.test.ts (4 tests) 5ms
 ✓ tests/project-detection.test.ts (7 tests) 18ms
 ✓ tests/package-manager.test.ts (3 tests) 6ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 1080ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  1079ms
 ✓ tests/github-action-runner.test.ts (5 tests) 3ms
 ✓ tests/roadmap-channels.test.ts (2 tests) 3ms
 ✓ tests/slug.test.ts (1 test) 2ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 5ms
 ✓ tests/schema.test.ts (1 test) 5ms
 ✓ tests/package-metadata.test.ts (1 test) 4ms
 ✓ tests/markdown-format.test.ts (3 tests) 3ms
 ✓ tests/maintenance-check-script.test.ts (8 tests) 8ms
 ✓ tests/template-renderer.test.ts (2 tests) 2ms
 ✓ tests/task-contract.test.ts (1 test) 2ms
 ✓ tests/version.test.ts (2 tests) 3422ms
     ✓ prints the package version  1759ms
     ✓ prints the package version as JSON when requested  1662ms
 ✓ tests/schemastore.test.ts (5 tests) 8992ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  1557ms
     ✓ accepts redact-paths without changing SchemaStore output  7421ms
 ✓ tests/github-metadata.test.ts (10 tests) 9994ms
     ✓ exposes read-only local JSON import through the CLI  1519ms
     ✓ accepts redact-paths in GitHub import without changing JSON output  6423ms
     ✓ keeps imported titles and output paths on one line in hu

[output truncated: showing first 2500 and last 2500 characters of 20850 total]

ntloop/tasks/2026-06-17-add-npm-status-safety-tests-to-maintenance-check.md`
- Latest verification: `pass` - `.agentloop/reports/2026-06-17-10-03-verification-report.md`
- Gates: `pass`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `100` AgentFlight placeholder task(s), `523` verification report(s), `871` handoff(s)
- Latest ship score: `92`/100 - `.agentloop/reports/2026-06-17-09-57-ship-report.md`
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (2619; 104 non-evidence, 2515 AgentLoop evidence)`

## Recent Runs

- `verify` `pass` - `2616` changed file(s) (`104` non-evidence, `2512` AgentLoop evidence) - `2026-06-17-10-07-verify`
- `handoff` `2608` changed file(s) (`104` non-evidence, `2504` AgentLoop evidence) - `2026-06-17-09-57-handoff-2`
- `ship` `92`/100 - `2599` changed file(s) (`104` non-evidence, `2495` AgentLoop evidence) - `2026-06-17-09-57-ship`

## Next Action

Run `agentloop task done`.

Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

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
