# Verification Report

- Timestamp: `2026-06-17T14:44:59.075Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: fail


## Task Context
- Path: `.agentloop/tasks/2026-06-17-prepare-agentloopkit-0-36-0-release.md`
- Title: `Prepare AgentLoopKit 0.36.0 release`
- Task type: `release`
- Status: `in-progress`




## Failure Summary
### test: `npx pnpm@10.12.1 test`

- Exit code: 1

```text
    321|         version,
    322|       }),
    323|     ).not.toThrow();
       |           ^
    324|   });
    325|
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 62 passed (63)
      Tests  1 failed | 812 passed (813)
   Start at  16:45:02
   Duration  276.01s (transform 1.28s, setup 0ms, import 5.06s, tests 2584.33s, environment 4ms)
 ELIFECYCLE  Test failed. See above for more details.
```

### custom: `npm run maintenance:check`

- Exit code: 1

```text
     ✓ CLI rejects invalid --only values before reading proof files  2184ms
     ✓ CLI prints JSON warning instead of crashing when MCP metadata is absent  2714ms
     ✓ CLI rejects captured proof files that look like env files without printing contents  3286ms
 Test Files  24 passed (24)
      Tests  147 passed (147)
   Start at  16:49:56
   Duration  38.29s (transform 437ms, setup 0ms, import 1.20s, tests 92.78s, environment 2ms)
## public docs hygiene
$ npm run check:public-docs
> agentloopkit@0.36.0 check:public-docs
> node scripts/public-docs-hygiene.mjs
Public docs hygiene failed: ROADMAP.md current state is stale: expected current public release v0.36.0.
```


## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.36.0 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]

 ❯ tests/release-smoke.test.ts (28 tests | 1 failed) 37ms
     × current roadmap release state matches package metadata 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/release-smoke.test.ts > release smoke script helpers > current roadmap release state matches package metadata
AssertionError: expected [Function] to not throw an error but 'Error: ROADMAP.md current state is st…' was thrown

- Expected:
undefined

+ Received:
"Error: ROADMAP.md current state is stale: expected current public release v0.36.0."

 ❯ tests/release-smoke.test.ts:323:11
    321|         version,
    322|       }),
    323|     ).not.toThrow();
       |           ^
    324|   });
    325|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 62 passed (63)
      Tests  1 failed | 812 passed (813)
   Start at  16:45:02
   Duration  276.01s (transform 1.28s, setup 0ms, import 5.06s, tests 2584.33s, environment 4ms)

 ELIFECYCLE  Test failed. See above for more details.
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
ESM ⚡️ Build success in 64ms
DTS Build start
DTS ⚡️ Build success in 1082ms
DTS dist/cli/index.d.ts 13.00 B
```

### custom: `npm run maintenance:check`

- Exit code: 1
- Status: fail


```text

> agentloopkit@0.36.0 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.36.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/public-docs-hygiene.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/roadmap-channels.test.ts (5 tests) 46ms
 ✓ tests/config.test.ts (8 tests) 16ms
 ✓ tests/autonomous-dogfood.test.ts (11 tests) 52ms
 ✓ tests/public-docs-hygiene.test.ts (10 tests) 124ms
 ✓ tests/project-detection.test.ts (7 tests) 36ms
 ✓ tests/safety.test.ts (4 tests) 29ms
 ✓ tests/package-manager.test.ts (3 tests) 7ms
 ✓ tests/github-action-runner.test.ts (5 tests) 8ms
 ✓ tests/maintenance-check-script.test.ts (8 tests) 8ms
 ✓ tests/package-scripts.test.ts (4 tests) 5ms
 ✓ tests/schema.test.ts (1 test) 4ms
 ✓ tests/dogfood-start-script.test.ts (9 tests) 560ms
     ✓ help output lists supported task types  544ms
 ✓ tests/post-verification-gates.test.ts (20 tests) 6ms
 ✓ tests/markdown-format.test.ts (3 tests) 2ms
 ✓ tests/template-renderer.test.ts (2 tests) 2ms
 ✓ tests/task-contract.test.ts (1 test) 2ms
 ✓ tests/slug.test.ts (1 test) 3ms
 ✓ tests/package-metadata.test.ts (1 test) 5ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 1919ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  1918ms
 ✓ tests/version.test.ts (2 tests) 4470ms
     ✓ prints the package version  2088ms
     ✓ prints the package version as JSON when requested  2380ms
 ✓ tests/schemastore.test.ts (5 tests) 11419ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  2241ms
     ✓ accepts redact-paths without changing SchemaStore output  9161ms
 ✓ tests/github-metadata.test.ts (10 tests) 14064ms
     ✓ exposes read-only local JSON import through the CLI  2223ms
     ✓ accepts redact-paths in GitHub import without changing JSON output  8695ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  3126ms
 ✓ tests/policy-packs.test.ts (12 tests) 22046ms
     ✓ exposes policy pack list, show, and apply through the CLI  6097ms
     ✓ accepts redact-paths on policy pack commands without changing JSON output  11447ms
     ✓ prints policy pack human output values containing line breaks on one Markdown line  4452ms
 ✓ tests/release-proof.test.ts (14 tests) 37942ms
     ✓ reports pass when captured release evidence matches the local version  3994ms
     ✓ reports when current HEAD differs from the local version tag  5855ms
     ✓ warns when a post-release channel is missing matching evidence  2871ms
     ✓ warns when the local release tag is missing even if channel proof matches  2588ms
     ✓ warns when the GitHub Marketplace listing is not published  2792ms
     ✓ warns instead of crashing when MCP Registry metadata is not configured  2580ms
     ✓ checks only the requested release proof channel  1895ms
     ✓ renders release proof package and channel values on one markdown line  1311ms
     ✓ renders release proof channel URLs on one markdown line  1272ms
     ✓ CLI prints JSON release proof from captured fixture files  2458ms
     ✓ CLI prints selected channel proof with --only  2140ms
     ✓ CLI rejects invalid --only values before reading proof files  2184ms
     ✓ CLI prints JSON warning instead of crashing when MCP metadata is absent  2714ms
     ✓ CLI rejects captured proof files that look like env files without printing contents  3286ms

 Test Files  24 passed (24)
      Tests  147 passed (147)
   Start at  16:49:56
   Duration  38.29s (transform 437ms, setup 0ms, import 1.20s, tests 92.78s, environment 2ms)


## public docs hygiene
$ npm run check:public-docs

> agentloopkit@0.36.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

Public docs hygiene failed: ROADMAP.md current state is stale: expected current public release v0.36.0.
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
- Fix failing commands before claiming completion.
