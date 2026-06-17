# Verification Report

- Timestamp: `2026-06-17T14:52:36.875Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-prepare-agentloopkit-0-36-0-release.md`
- Title: `Prepare AgentLoopKit 0.36.0 release`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.0 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  63 passed (63)
      Tests  813 passed (813)
   Start at  16:52:39
   Duration  239.19s (transform 691ms, setup 0ms, import 3.48s, tests 2545.67s, environment 4ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.0 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.0 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.0 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     493.80 KB
ESM dist/cli/index.js.map 925.41 KB
ESM ⚡️ Build success in 46ms
DTS Build start
DTS ⚡️ Build success in 1077ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run maintenance:check`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.36.0 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.36.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/project-detection.test.ts (7 tests) 15ms
 ✓ tests/public-docs-hygiene.test.ts (10 tests) 118ms
 ✓ tests/roadmap-channels.test.ts (5 tests) 31ms
 ✓ tests/safety.test.ts (4 tests) 30ms
 ✓ tests/dogfood-start-script.test.ts (9 tests) 174ms
 ✓ tests/autonomous-dogfood.test.ts (11 tests) 40ms
 ✓ tests/github-action-runner.test.ts (5 tests) 4ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 3ms
 ✓ tests/maintenance-check-script.test.ts (8 tests) 5ms
 ✓ tests/config.test.ts (8 tests) 15ms
 ✓ tests/package-manager.test.ts (3 tests) 6ms
 ✓ tests/package-metadata.test.ts (1 test) 2ms
 ✓ tests/markdown-format.test.ts (3 tests) 2ms
 ✓ tests/package-scripts.test.ts (4 tests) 4ms
 ✓ tests/task-contract.test.ts (1 test) 2ms
 ✓ tests/schema.test.ts (1 test) 3ms
 ✓ tests/slug.test.ts (1 test) 2ms
 ✓ tests/template-renderer.test.ts (2 tests) 4ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 1990ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  1988ms
 ✓ tests/version.test.ts (2 tests) 3153ms
     ✓ prints the package version  1362ms
     ✓ prints the package version as JSON when requested  1790ms
 ✓ tests/schemastore.test.ts (5 tests) 10073ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  1831ms
     ✓ accepts redact-paths without changing SchemaStore output  8226ms
 ✓ tests/github-metadata.test.ts (10 tests) 11355ms
     ✓ exposes read-only local JSON import through the CLI  1632ms
     ✓ accepts redact-paths in GitHub import without changing JSON output  6444ms
     ✓ keeps imported titles and output paths on one line 

[output truncated: showing first 2500 and last 2500 characters of 20632 total]

 tsx src/cli/index.ts review-context --redact-paths
# AgentLoopKit Review Context

- Active task: `Prepare AgentLoopKit 0.36.0 release` (`in-progress`) - `.agentloop/tasks/2026-06-17-prepare-agentloopkit-0-36-0-release.md`
- Latest verification: `fail` - `.agentloop/reports/2026-06-17-16-44-verification-report.md`
- Gates: `fail`
- Policy status: `8` current, `0` modified, `0` missing, `0` extra
- Artifacts: `3` task(s), `132` AgentFlight placeholder task(s), `559` verification report(s), `926` handoff(s)
- Latest ship score: none
- GitHub metadata: missing - `.agentloop/github/context.json`
- Working tree: `dirty (3165; 120 non-evidence, 3045 AgentLoop evidence)`

## Recent Runs

- `verify` `fail` - `3160` changed file(s) (`118` non-evidence, `3042` AgentLoop evidence) - `2026-06-17-16-50-verify`
- `handoff` `3149` changed file(s) (`115` non-evidence, `3034` AgentLoop evidence) - `2026-06-17-16-40-handoff`
- `verify` `pass` - `3146` changed file(s) (`115` non-evidence, `3031` AgentLoop evidence) - `2026-06-17-16-39-verify`

## Next Action

Run `agentloop verify`.

The latest verification report failed. Fix the failures and rerun verification.

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
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
