# Verification Report

- Timestamp: `2026-06-24T21:09:04.436Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `637b843c`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-run-parallel-unreleased-batch-bug-hunt.md`
- Title: `Run parallel unreleased-batch bug hunt`
- Task type: `security-review`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit -- tests/doctor.test.ts tests/guard.test.ts tests/context-contract.test.ts tests/mcp-tools.test.ts tests/runs.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts tests/doctor.test.ts tests/guard.test.ts tests/context-contract.test.ts tests/mcp-tools.test.ts tests/runs.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  31 passed (31)
      Tests  263 passed (263)
   Start at  23:09:05
   Duration  65.60s (transform 491ms, setup 0ms, import 1.57s, tests 250.69s, environment 2ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 typecheck
> tsc --noEmit

```

### task: `npm run build`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]/tsup.config.ts
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     640.01 KB
ESM dist/cli/index.js.map 1.17 MB
ESM ⚡️ Build success in 46ms
DTS Build start
DTS ⚡️ Build success in 1203ms
DTS dist/cli/index.d.ts 13.00 B
```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 dogfood
> node scripts/dogfood.mjs

# AgentLoopKit Dogfood Gate
Mode: default

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Run parallel unreleased-batch bug hunt" status="in-progress"; verification=missing; run="ship 92/100"; tree=dirty (385; 76 non-evidence, 309 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.42.0
Public docs checked: 79
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --redact-paths
# AgentLoopKit Harness Upgrade

- Overall status: `pass`
- Dry run: `no`
- Writes files: `no`
- Target: `[agentloop-root]`

## Manifest

- `current`: `.agentloop/manifest.json`
- Current template version: `2`
- Local template version: `2`

## Harness Files

- `current`: `AGENTS.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `agent-start`, `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current agent-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-pat

[output truncated: showing first 2500 and last 2500 characters of 15340 total]

t.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/prepare-pr.test.ts, tests/review-context.test.ts, tests/runs.test.ts, tests/safety.test.ts, tests/ship.test.ts, tests/upgrade-harness.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
1 passed, 1 failed
- failed: npm test (exit 1, 407425ms)
- passed: npm test (exit 0, 422053ms)

Review first:
1. src/cli/commands/context.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm test
2. src/cli/commands/doctor.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm test
3. src/cli/commands/guard.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm test
4. src/cli/commands/runs.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm test
5. src/cli/commands/start.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm test

Proof gaps:
- blocking: A verification command failed and must be fixed or rerun successfully: npm test
  Suggested proof: agentflight verify -- npm test

Latest snapshot:
- No snapshots recorded.

Readiness: Blocked by failed verification
Reason: A verification command failed and must be fixed or rerun successfully: npm test

Next action:
Fix the failed command, then rerun agentflight verify -- npm test

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https:[git-root]

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.
```

### task: `npm run lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.42.0 lint
> eslint .

```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
