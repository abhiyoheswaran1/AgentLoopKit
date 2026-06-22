# Verification Report

- Timestamp: `2026-06-22T06:16:52.933Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `08219cdf`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-22-stabilize-unreleased-batch-and-run-real-repo-trials.md`
- Title: `Stabilize unreleased batch and run real repo trials`
- Task type: `tests`
- Status: `in-progress`





## Commands Run
### task: `npm run maintenance:check`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.38.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/schemastore.test.ts (5 tests) 17660ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  3551ms
     ✓ accepts redact-paths without changing SchemaStore output  14098ms
 ✓ tests/github-metadata.test.ts (10 tests) 18406ms
     ✓ exposes read-only local JSON import through the CLI  2505ms
     ✓ accepts redact-paths in GitHub import without changing JSON output  10435ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  5448ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 2739ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  2738ms
 ✓ tests/dogfood-start-script.test.ts (9 tests) 334ms
     ✓ help output lists supported task types  323ms
 ✓ tests/autonomous-dogfood.test.ts (12 tests) 16ms
 ✓ tests/version.test.ts (2 tests) 4714ms
     ✓ prints the package version  2551ms
     ✓ prints the package version as JSON when requested  2162ms
 ✓ tests/project-detection.test.ts (9 tests) 27ms
 ✓ tests/public-docs-hygiene.test.ts (14 tests) 38ms
 ✓ tests/roadmap-channels.test.ts (5 tests) 16ms
 ✓ tests/config.test.ts (8 tests) 12ms
 ✓ tests/safety.test.ts (4 tests) 10ms
 ✓ tests/package-metadata.test.ts (3 tests) 6ms
 ✓ tests/readiness-score.test.ts (7 tests) 5ms
 ✓ tests/package-manager.test.ts (3 tests) 5ms
 ✓ tests/product-positioning.test.ts (1 test) 4ms
 ✓ tests/github-action-runner.test.ts (5 tests) 4ms
 ✓ tests/package-scripts.test.ts (4 tests) 3ms
 ✓ tests/maintenance-check-script.test.ts (8 tests) 4ms

[output truncated: showing first 2500 and last 2500 characters of 25677 total]

rpowers/specs/2026-06-21-evidence-map-design.md
- unknown: src/cli/index.ts, src/core/agentloop-evidence.ts, src/core/artifact-paths.ts, src/core/completions.ts, src/core/prepare-pr.ts, src/core/project-detection.ts, src/core/review-context.ts, src/core/ship.ts, src/cli/commands/explain-diff.ts, src/cli/commands/guard.ts, src/cli/commands/resume-pack.ts, src/core/context-budget.ts, src/core/evidence-map.ts, src/core/guard.ts, src/core/resume-pack.ts
- tests: tests/cli-docs-drift.test.ts, tests/doctor.test.ts, tests/prepare-pr.test.ts, tests/project-detection.test.ts, tests/review-context.test.ts, tests/ship.test.ts, tests/cli-explain-diff.test.ts, tests/evidence-map.test.ts, tests/guard.test.ts, tests/resume-pack.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
0 passed, 0 failed
- No verification runs recorded.

Review first:
1. src/cli/commands/explain-diff.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. src/cli/commands/guard.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/cli/commands/resume-pack.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/agentloop-evidence.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

Proof gaps:
- warning: Test files changed without passing test evidence.
  Suggested proof: agentflight verify -- npm test

Latest snapshot:
- No snapshots recorded.

Readiness: Needs verification
Reason: Test files changed without passing test evidence.

Next action:
Run agentflight verify -- npm test

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.

Maintenance check passed.
```

### task: `npm test -- tests/doctor.test.ts tests/project-detection.test.ts tests/guard.test.ts tests/resume-pack.test.ts tests/review-context.test.ts tests/evidence-map.test.ts tests/cli-explain-diff.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 test
> vitest run tests/doctor.test.ts tests/project-detection.test.ts tests/guard.test.ts tests/resume-pack.test.ts tests/review-context.test.ts tests/evidence-map.test.ts tests/cli-explain-diff.test.ts tests/cli-docs-drift.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  8 passed (8)
      Tests  52 passed (52)
   Start at  08:23:55
   Duration  139.03s (transform 176ms, setup 0ms, import 635ms, tests 377.13s, environment 0ms)

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 lint
> eslint .

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 typecheck
> tsc --noEmit

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     553.92 KB
ESM dist/cli/index.js.map 1.02 MB
ESM ⚡️ Build success in 37ms
DTS Build start
DTS ⚡️ Build success in 1075ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `git diff --check`

- Exit code: 0
- Status: pass


```text
(no output)
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
