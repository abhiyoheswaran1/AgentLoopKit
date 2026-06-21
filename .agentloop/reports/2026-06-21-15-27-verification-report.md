# Verification Report

- Timestamp: `2026-06-21T13:27:14.417Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `32aec524`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-21-release-agentloopkit-0-38-0.md`
- Title: `Release AgentLoopKit 0.38.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### test: `npx pnpm@10.12.1 test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 test [git-root]
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  65 passed (65)
      Tests  874 passed (874)
   Start at  15:27:20
   Duration  1474.29s (transform 836ms, setup 0ms, import 3.71s, tests 5846.71s, environment 3ms)

```

### lint: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 lint [git-root]
> eslint .

```

### typecheck: `npx pnpm@10.12.1 typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 typecheck [git-root]
> tsc --noEmit

```

### build: `npx pnpm@10.12.1 build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.38.0 build [git-root]
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     513.90 KB
ESM dist/cli/index.js.map 963.20 KB
ESM ⚡️ Build success in 33ms
DTS Build start
DTS ⚡️ Build success in 1058ms
DTS dist/cli/index.d.ts 13.00 B
```

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

 ✓ tests/schemastore.test.ts (5 tests) 14468ms
     ✓ prints SchemaStore catalog entry from the CLI without writing files  2608ms
     ✓ accepts redact-paths without changing SchemaStore output  11847ms
 ✓ tests/github-metadata.test.ts (10 tests) 17329ms
     ✓ exposes read-only local JSON import through the CLI  2260ms
     ✓ accepts redact-paths in GitHub import without changing JSON output  9807ms
     ✓ keeps imported titles and output paths on one line in human output while preserving JSON values  5241ms
 ✓ tests/version.test.ts (2 tests) 4790ms
     ✓ prints the package version  2386ms
     ✓ prints the package version as JSON when requested  2403ms
 ✓ tests/cli-docs-drift.test.ts (1 test) 2747ms
     ✓ public command surface is reflected in help, README, CLI reference, and completions  2747ms
 ✓ tests/dogfood-start-script.test.ts (9 tests) 343ms
     ✓ help output lists supported task types  332ms
 ✓ tests/public-docs-hygiene.test.ts (14 tests) 47ms
 ✓ tests/safety.test.ts (4 tests) 10ms
 ✓ tests/autonomous-dogfood.test.ts (12 tests) 19ms
 ✓ tests/project-detection.test.ts (7 tests) 13ms
 ✓ tests/roadmap-channels.test.ts (5 tests) 19ms
 ✓ tests/config.test.ts (8 tests) 12ms
 ✓ tests/package-manager.test.ts (3 tests) 6ms
 ✓ tests/package-metadata.test.ts (3 tests) 6ms
 ✓ tests/product-positioning.test.ts (1 test) 5ms
 ✓ tests/readiness-score.test.ts (7 tests) 5ms
 ✓ tests/maintenance-check-script.test.ts (8 tests) 4ms
 ✓ tests/github-action-runner.test.ts (5 tests) 3ms
 ✓ tests/package-scripts.test.ts (4 tests) 4ms


[output truncated: showing first 2500 and last 2500 characters of 33368 total]

 impact and dependency risk first.
   Suggested proof: agentflight verify -- "npm test -- tests/artifacts.test.ts"
3. scripts/dogfood-start.mjs
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- "npm test -- tests/artifacts.test.ts"
4. scripts/dogfood.mjs
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- "npm test -- tests/artifacts.test.ts"
5. scripts/maintenance-check.mjs
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- "npm test -- tests/artifacts.test.ts"

Proof gaps:
- blocking: A verification command failed and must be fixed or rerun successfully: "npm test -- tests/artifacts.test.ts"
  Suggested proof: agentflight verify -- "npm test -- tests/artifacts.test.ts"
- warning: Config or CI files changed without lint, typecheck, or build evidence.
  Suggested proof: agentflight verify -- npm run typecheck

Latest snapshot:
- 2026-06-21T12:38:14.573Z
- Note: Completed status/next loop guidance: status and next now surface .agentloop/loops/<type>.md for active/latest open tasks with additive JSON loopGuidance; full AgentLoop verify, strict dogfood, and AgentFlight status/next verification passed.
- Risk: medium
- Changed files: 152

Readiness: Blocked by failed verification
Reason: A verification command failed and must be fixed or rerun successfully: "npm test -- tests/artifacts.test.ts"

Next action:
Fix the failed command, then rerun agentflight verify -- "npm test -- tests/artifacts.test.ts"

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

### task: `npx --no-install tsx src/cli/index.ts npm-status --agentloopkit`

- Exit code: 0
- Status: pass


```text
# npm Status

- Package: `agentloopkit`
- Local version: `0.38.0`
- npm latest: `0.37.0`
- Registry contains local version: no
- Registry versions: `0.1.0`, `0.1.1`, `0.24.0`, `0.24.1`, `0.24.2`, `0.24.3`, `0.24.4`, `0.24.5`, `0.25.0`, `0.26.0`, `0.26.1`, `0.26.2`, `0.26.3`, `0.26.4`, `0.26.5`, `0.27.0`, `0.28.0`, `0.28.1`, `0.28.2`, `0.28.3`, `0.28.4`, `0.28.5`, `0.28.6`, `0.28.7`, `0.29.0`, `0.30.0`, `0.31.0`, `0.32.0`, `0.32.1`, `0.33.0`, `0.34.0`, `0.34.1`, `0.35.0`, `0.35.1`, `0.35.2`, `0.36.0`, `0.36.1`, `0.36.2`, `0.37.0`
- Status: npm latest differs from local package version

## Recommendation

Publish the current source version after npm authentication or trusted publishing works. Do not backfill stale intermediate versions from the current checkout.

## Safety

This command only runs `npm view --json agentloopkit version versions` unless `--registry-json` is provided. AgentLoopKit does not read npm token files directly, but npm may use normal npm configuration when the live registry check runs. It does not publish packages, create tags, create GitHub releases, read .env files, upload files, or change package metadata.

```


## Not Run
- Nothing skipped.

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
