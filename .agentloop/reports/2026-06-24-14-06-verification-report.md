# Verification Report

- Timestamp: `2026-06-24T12:06:04.169Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `9966b6dc`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-24-audit-agent-guidance-readiness-for-start.md`
- Title: `Audit agent guidance readiness for Start`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts tests/init.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 test:unit
> vitest run tests/config.test.ts tests/slug.test.ts tests/template-renderer.test.ts tests/markdown-format.test.ts tests/package-manager.test.ts tests/project-detection.test.ts tests/schema.test.ts tests/schemastore.test.ts tests/policy-packs.test.ts tests/github-metadata.test.ts tests/github-action-runner.test.ts tests/release-proof.test.ts tests/readiness-score.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/roadmap-channels.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-start-script.test.ts tests/maintenance-check-script.test.ts tests/cli-docs-drift.test.ts tests/safety.test.ts tests/version.test.ts tests/package-metadata.test.ts tests/package-scripts.test.ts tests/post-verification-gates.test.ts tests/task-contract.test.ts tests/upgrade-harness.test.ts tests/doctor.test.ts tests/init.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  29 passed (29)
      Tests  219 passed (219)
   Start at  14:06:06
   Duration  43.31s (transform 1.34s, setup 0ms, import 3.37s, tests 158.41s, environment 4ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 typecheck
> tsc --noEmit

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.41.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.41.0 dogfood
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
AgentLoopKit: task="Audit agent guidance readiness for Start" status="in-progress"; verification=missing; run="ship 96/100"; tree=dirty (79; 33 non-evidence, 46 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.41.0
Public docs checked: 78
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

[output truncated: showing first 2500 and last 2500 characters of 13992 total]

- tests/upgrade-harness.test.ts tests/doctor.test.ts
2. src/core/context-contract.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
3. src/core/doctor.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
4. src/core/evidence-map.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
5. src/core/evidence.ts
   Why: unknown file; verification failed; no passing test evidence
   Focus: Inspect manually because AgentFlight could not classify this file.
   Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

Proof gaps:
- blocking: A verification command failed and must be fixed or rerun successfully: npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
  Suggested proof: agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

Latest snapshot:
- No snapshots recorded.

Readiness: Blocked by failed verification
Reason: A verification command failed and must be fixed or rerun successfully: npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

Next action:
Fix the failed command, then rerun agentflight verify -- npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
