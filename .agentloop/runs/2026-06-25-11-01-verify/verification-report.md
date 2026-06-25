# Verification Report

- Timestamp: `2026-06-25T08:36:11.011Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `637b843c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-25-release-agentloopkit-0-43-0.md`
- Title: `Release AgentLoopKit 0.43.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `npm run maintenance:check`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.43.0 maintenance:check
> node scripts/maintenance-check.mjs


## unit tests
$ npm run test:unit

> agentloopkit@0.43.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts


 RUN  v4.1.8 [git-root]

 ✓ tests/schemastore.test.ts (5 tests) 14768ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  2584ms
     ✓ accepts redact-paths without changing SchemaStore output  12164ms
 ✓ tests/github-metadata.test.ts (10 tests) 17245ms
     ✓ exposes read-only local JSON import through the CLI  2414ms
     ✓ accepts redact-paths in GitHub import without changing JSON output  9930ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  4877ms
 ✓ tests/version.test.ts (2 tests) 5076ms
     ✓ prints the package version  2670ms
     ✓ prints the package version as JSON when requested  2405ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 2414ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  2413ms
 ✓ tests/dogfood-start-script.test.ts (9 tests) 623ms
     ✓ help output lists supported task types  604ms
 ✓ tests/public-docs-hygiene.test.ts (14 tests) 53ms
 ✓ tests/project-detection.test.ts (9 tests) 28ms
 ✓ tests/autonomous-dogfood.test.ts (12 tests) 25ms
 ✓ tests/safety.test.ts (5 tests) 17ms
 ✓ tests/config.test.ts (8 tests) 16ms
 ✓ tests/roadmap-channels.test.ts (5 tests) 20ms
 ✓ tests/package-manager.test.ts (3 tests) 7ms
 ✓ tests/package-metadata.test.ts (3 tests) 11ms
 ✓ tests/readiness-score.test.ts (7 tests) 8ms
 ✓ tests/product-positioning.test.ts (1 test) 4ms
 ✓ tests/maintenance-check-script.test.ts (8 tests) 4ms
 ✓ tests/package-scripts.test.ts (4 tests) 4ms
 ✓ tests/post-verification-gates.test.ts (20 tests)

[output truncated: showing first 2500 and last 2500 characters of 27574 total]

s, src/mcp/server.ts, src/core/agent-readiness.ts, src/core/run-artifacts.ts, src/core/run-types.ts, src/core/safe-markdown-file.ts
- tests: tests/agent-start.test.ts, tests/context-contract.test.ts, tests/doctor.test.ts, tests/guard.test.ts, tests/init.test.ts, tests/markdown-format.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/prepare-pr.test.ts, tests/review-context.test.ts, tests/runs.test.ts, tests/safety.test.ts, tests/ship.test.ts, tests/upgrade-harness.test.ts

Risk: medium
- Dependency or package metadata changed.

Verification Evidence:
0 passed, 0 failed
- No verification runs recorded.

Review first:
1. package.json
   Why: dependency metadata changed; no passing test evidence
   Focus: Check install/build impact and dependency risk first.
   Suggested proof: agentflight verify -- npm run typecheck
2. server.json
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/cli/commands/context.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/cli/commands/doctor.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/cli/commands/guard.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

Proof gaps:
- warning: Dependency files changed without install, build, typecheck, or test evidence.
  Suggested proof: agentflight verify -- npm run typecheck
- warning: Test files changed without passing test evidence.
  Suggested proof: agentflight verify -- npm test

Latest snapshot:
- No snapshots recorded.

Readiness: Needs verification
Reason: Dependency files changed without install, build, typecheck, or test evidence.

Next action:
Run agentflight verify -- npm run typecheck

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

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.43.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  71 passed (71)
      Tests  965 passed (965)
   Start at  10:44:22
   Duration  1003.01s (transform 1.35s, setup 0ms, import 5.76s, tests 3609.22s, environment 6ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.43.0 typecheck
> tsc --noEmit

```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.43.0 lint
> eslint .

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.43.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     640.01 KB
ESM dist/cli/index.js.map 1.17 MB
ESM ⚡️ Build success in 323ms
DTS Build start
DTS ⚡️ Build success in 3939ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `agentloop release-check --redact-paths`

- Exit code: 0
- Status: pass


```text
# AgentLoopKit Release Check

- Overall status: `warn`
- Strict mode: `disabled`
- Package: `agentloopkit@0.43.0`
- Git: `main` @ `637b843c`
- Changed files: `407` (`83` non-evidence, `324` AgentLoop evidence)

## Checks

- [`pass`] `Package metadata`: `package.json declares agentloopkit@0.43.0` - `package.json`
- [`pass`] `Changelog section`: `CHANGELOG.md includes 0.43.0.` - `CHANGELOG.md`
- [`pass`] `Changelog Unreleased`: `No pending Unreleased entries detected.` - `CHANGELOG.md`
- [`warn`] `Verification report`: `Latest verification report predates the current task. Rerun verification.` - `.agentloop/reports/2026-06-24-23-09-verification-report.md`
- [`pass`] `Handoff summary`: `Reviewer handoff found.` - `.agentloop/handoffs/2026-06-24-23-11-pr-summary.md`
- [`pass`] `Release notes`: `Deterministic release notes found for package version 0.43.0.` - `.agentloop/handoffs/2026-06-25-10-35-release-notes.md`
- [`pass`] `Release scripts`: `Required and recommended release scripts exist.` - `package.json`
- [`pass`] `Package safety`: `No preinstall/install/postinstall scripts detected.` - `package.json`
- [`pass`] `Git repository`: `Inside a git repository.`
- [`pass`] `Git target`: `Current directory is the Git root.`
- [`warn`] `Working tree`: `407 changed file(s) detected (83 non-evidence file(s), 324 AgentLoop evidence file(s)).`
- [`pass`] `Release delta`: `Local tag v0.43.0 is not present yet; release delta starts after version preparation.`
- [`pass`] `Release tag`: `Local tag v0.43.0 is not present yet.`

## Next Action

Run `agentloop verify`.

A passing verification report is required.

## Safety

This command reads local release metadata, local AgentLoop evidence, and local git state only. It does not publish packages, create tags, create GitHub releases, call external APIs, read npm tokens, read .env contents, upload files, or change package metadata.

```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
