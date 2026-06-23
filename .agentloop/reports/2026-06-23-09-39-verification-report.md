# Verification Report

- Timestamp: `2026-06-23T07:39:24.986Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `d5f4631e`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- Title: `Release AgentLoopKit 0.40.0`
- Task type: `release`
- Status: `in-progress`





## Commands Run
### task: `npm run release-flow`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.40.0 release-flow
> node scripts/prepublish-check.mjs && npm run lint && npm run typecheck && npm run test:release && npm run build && npm run check:public-docs && npm run check:links && npm run dogfood && npm run smoke:release

Prepublish metadata check passed.

> agentloopkit@0.40.0 lint
> eslint .


> agentloopkit@0.40.0 typecheck
> tsc --noEmit


> agentloopkit@0.40.0 test:release
> npm test


> agentloopkit@0.40.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  70 passed (70)
      Tests  899 passed (899)
   Start at  09:40:01
   Duration  931.38s (transform 1.27s, setup 0ms, import 5.89s, tests 3671.24s, environment 6ms)


> agentloopkit@0.40.0 build
> tsup && node scripts/copy-assets.mjs

CLI Building entry: {"cli/index":"src/cli/index.ts"}
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: [git-root]
CLI Target: node20
CLI Cleaning output folder
ESM Build start
ESM dist/cli/index.js     572.60 KB
ESM dist/cli/index.js.map 1.05 MB
ESM ⚡️ Build success in 55ms
DTS Build start
DTS ⚡️ Build success in 2259ms
DTS dist/cli/index.d.ts 13.00 B

> agentloopkit@0.40.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

> agentloopkit@0.40.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4981 file(s) checked).

> agentloopkit@0.40.0 dogfood
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
AgentLoopKit: task="Release AgentLoopKit 0.40.0" status="in-progress"; verification=missing; run="verify fail"; tree=dirty (89; 36 non-evidence, 53 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --redact-paths
# AgentLoopKit Harness Upgr

[output truncated: showing first 2500 and last 2500 characters of 14875 total]

.json
   Why: dependency metadata changed; no passing test evidence
   Focus: Check install/build impact and dependency risk first.
   Suggested proof: agentflight verify -- npm run typecheck
2. server.json
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/cli/commands/context.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/completions.ts
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

> agentloopkit@0.40.0 smoke:release
> node scripts/smoke-packed-release.mjs

Release smoke for agentloopkit@0.40.0
Packed /var/folders/tc/vn86wd6d7v70rn_pxbv3h2k40000gn/T/agentloopkit-release-smoke-NZgef1/pack/agentloopkit-0.40.0.tgz
README has no stale exact version pins.
Public docs hygiene passed for 78 public docs and 2 harness files.
Packed binary version smoke passed.
Packed init smoke passed.
Packed local-only init smoke passed.
Packed create-task path guard smoke passed.
Packed verify task path guard smoke passed.
Packed init symlink guard smoke passed.
Packed task archive symlink guard smoke passed.
Packed home-directory dry-run guard smoke passed.
Release smoke passed.
```

## Post-Verification Gates
### post-verification: `node dist/cli/index.js release-notes --write --redact-paths`

- Exit code: 0
- Status: pass


```text
# Release Notes

- Generated: 2026-06-23-09-57
- Package: `agentloopkit`
- Version: `0.40.0`
- Range: `v0.39.0..HEAD`
- Branch: `main`
- Commit: `d5f4631e`

## Changelog
- Added `agentloop context budget`, `agentloop context pack`, and `agentloop context show` as a unified Context Contract for software agents.
- Added auditable context-pack receipts that explain included evidence, omitted broad context, source handles, verification freshness, next actions, and context-budget estimates.
- Added read-only MCP tools for context budget, context pack, and context handle expansion so agent platforms can consume the same contract directly.
- Added generated agent guidance that tells Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic agents to request a context pack before broad repo reads.
- Added public Context Contract documentation, CLI reference coverage, README positioning, an ASCII workflow diagram, a context-budget visual, and a regenerated terminal demo GIF.
- Added tests for context-pack JSON and Markdown output, redacted handle expansion, MCP tool exposure, CLI docs drift, and public documentation hygiene.

## Commits
- `chore: archive agentloopkit 0.39.0 release task`
- `docs: record agentloopkit 0.39.0 release proof`

## Changed Files
- R099 `.agentloop/tasks/2026-06-22-release-agentloopkit-v0-39-0.md .agentloop/tasks/archive/2026-06-22-release-agentloopkit-v0-39-0.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`

## Working Tree
- Uncommitted changes detected. Commit or stash them before publishing a release.
- `M CHANGELOG.md`
- `M FINAL_HANDOFF.md`
- `M README.md`
- `M ROADMAP.md`
- `M docs/assets/readme/README.md`
- `M docs/cli-reference.md`
- `M docs/launch-checklist.md`
- `M docs/mcp.md`
- `M docs/npm-publishing.md`
- `M docs/release-checklist-example.md`
- `M docs/release-status.md`
- `M package.json`
- `M server.json`
- `M src/cli/index.ts`
- `M src/core/completions.ts`
- `M src/core/mcp-tools.ts`
- `M src/mcp/server.ts`
- `M src/templates/agents/claude-code.md`
- `M src/templates/agents/codex.md`
- `M src/templates/agents/cursor.md`
- `M src/templates/agents/gemini-cli.md`
- `M src/templates/agents/generic.md`
- `M src/templates/agents/github-copilot-cli.md`
- `M src/templates/agents/opencode.md`
- `M tests/cli-docs-drift.test.ts`
- `M tests/mcp-server.test.ts`
- `M tests/mcp-tools.test.ts`
- `M tests/package-scripts.test.ts`
- `?? .agentloop/handoffs/2026-06-

[output truncated: showing first 2500 and last 2500 characters of 5446 total]

ort.md`
- `?? .agentloop/reports/2026-06-22-22-17-ship-report.md`
- `?? .agentloop/reports/2026-06-22-22-19-verification-report.md`
- `?? .agentloop/reports/2026-06-22-22-21-ship-report.md`
- `?? .agentloop/reports/2026-06-23-09-16-verification-report.md`
- `?? .agentloop/reports/2026-06-23-09-39-verification-report.md`
- `?? .agentloop/research/interview-cycle-196.md`
- `?? .agentloop/runs/2026-06-22-13-40-handoff/`
- `?? .agentloop/runs/2026-06-22-15-23-ship/`
- `?? .agentloop/runs/2026-06-22-15-23-verify/`
- `?? .agentloop/runs/2026-06-22-22-17-ship/`
- `?? .agentloop/runs/2026-06-22-22-17-verify/`
- `?? .agentloop/runs/2026-06-22-22-20-verify/`
- `?? .agentloop/runs/2026-06-22-22-21-ship/`
- `?? .agentloop/runs/2026-06-23-09-33-verify/`
- `?? .agentloop/tasks/2026-06-22-add-readme-demo-gif-and-public-context-contract-polish.md`
- `?? .agentloop/tasks/2026-06-22-build-agentloop-context-contract-v1-2.md`
- `?? .agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0-2.md`
- `?? .agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- `?? .agentloop/tasks/archive/2026-06-22-add-readme-demo-gif-and-context-polish.md`
- `?? .agentloop/tasks/archive/2026-06-22-agentloop-context-contract-product-research.md`
- `?? .agentloop/tasks/archive/2026-06-22-build-agentloop-context-contract-v1.md`
- `?? docs/assets/readme/agentloopkit-context-contract.gif`
- `?? docs/assets/readme/agentloopkit-context-contract.tape`
- `?? docs/context.md`
- `?? docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md`
- `?? src/cli/commands/context.ts`
- `?? src/core/context-contract.ts`
- `?? tests/context-contract.test.ts`

## AgentLoop Evidence
- Task: `Release AgentLoopKit 0.40.0` (`in-progress`) - `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- Verification: Overall status: `pass` - `.agentloop/reports/2026-06-23-09-39-verification-report.md`
- CI summary: `AgentLoopKit CI Summary` - `.agentloop/reports/2026-06-17-03-22-ci-summary.md`

## Release Checklist
- Review these notes before publishing.
- Confirm npm and GitHub release status from the registry or release page.
- Attach verification evidence when creating a release.
- Keep npm catch-up notes honest if the registry still serves an older version.

## Safety
This command is local and deterministic. Does not create tags, publish packages, call external APIs, read tokens, upload files, or rewrite changelogs.


Release notes written: `[git-root]/.agentloop/handoffs/2026-06-23-09-57-release-notes.md`
```

### post-verification: `node dist/cli/index.js ship --redact-paths`

- Exit code: 0
- Status: pass


````text
# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-23-09-57`
- Review readiness score: `92`/100
- Task: `Release AgentLoopKit 0.40.0` (`in-progress`) - `.agentloop/tasks/2026-06-23-release-agentloopkit-0-40-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-23-09-39-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-23-09-57-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `36 non-evidence changed files is broad for one review; 55 AgentLoop evidence file(s) also present (91 total). Non-evidence review areas: Documentation 15, Source 13, Tests 5, AgentLoop 1, Config / Package 1, Other 1.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `100`/100 (weight `15`) - `Review gates passed.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Review gates pass.
- Reviewer handoff exists.

## Warnings

- Large non-evidence change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Evidence Map

- Evidence map: `91` changed file(s); `34` covered, `2` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `26` dirty non-evidence file(s); current non-evidence changed files: `36` (net `+10`).

## Task Risk Notes

- Release workflows publish public artifacts. Verify channels from current command output before claiming success.
- Pre-existing dirty non-evidence files before task creation: 26 total; examples: `README.md`, `docs/assets/readme/README.md`, `docs/cli-reference.md`, `docs/mcp.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Changed Files

- M `CHANGELOG.md`
- M `FINAL_HANDOFF

[output truncated: showing first 2500 and last 2500 characters of 6570 total]

                         | 48 ++++++++++++---
 ROADMAP.md                                 | 11 ++--
 docs/assets/readme/README.md               |  5 +-
 docs/cli-reference.md                      | 32 +++++++++-
 docs/launch-checklist.md                   |  4 +-
 docs/mcp.md                                |  6 +-
 docs/npm-publishing.md                     | 12 ++--
 docs/release-checklist-example.md          |  3 +-
 docs/release-status.md                     | 72 +++++++++++-----------
 package.json                               |  4 +-
 server.json                                |  4 +-
 src/cli/index.ts                           |  2 +
 src/core/completions.ts                    |  1 +
 src/core/mcp-tools.ts                      | 98 ++++++++++++++++++++++++++++++
 src/mcp/server.ts                          |  2 +-
 src/templates/agents/claude-code.md        |  1 +
 src/templates/agents/codex.md              |  1 +
 src/templates/agents/cursor.md             |  1 +
 src/templates/agents/gemini-cli.md         |  1 +
 src/templates/agents/generic.md            |  1 +
 src/templates/agents/github-copilot-cli.md |  1 +
 src/templates/agents/opencode.md           |  1 +
 tests/cli-docs-drift.test.ts               |  1 +
 tests/mcp-server.test.ts                   | 38 ++++++++++++
 tests/mcp-tools.test.ts                    |  3 +
 tests/package-scripts.test.ts              |  5 +-
 28 files changed, 337 insertions(+), 94 deletions(-)
.agentloop/research/interview-cycle-196.md | untracked
docs/assets/readme/agentloopkit-context-contract.gif | untracked
docs/assets/readme/agentloopkit-context-contract.tape | untracked
docs/context.md | untracked
docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md | untracked
src/cli/commands/context.ts | untracked
src/core/context-contract.ts | untracked
tests/context-contract.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.40.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `92 changed file(s) detected (36 non-evidence, 56 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`


Ship report written: `.agentloop/reports/2026-06-23-09-57-ship-report.md`
````

### post-verification: `node dist/cli/index.js handoff --write-run --redact-paths`

- Exit code: 0
- Status: pass


````text
# PR Summary

- Generated: 2026-06-23-09-58
- Task context: `Release AgentLoopKit 0.40.0`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/cli-reference.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
- M `docs/release-status.md`
- M `package.json`
- M `server.json`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `.agentloop/research/interview-cycle-196.md`
- ?? `docs/assets/readme/agentloopkit-context-contract.gif`
- ?? `docs/assets/readme/agentloopkit-context-contract.tape`
- ?? `docs/context.md`
- ?? `docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md`
- ?? `src/cli/commands/context.ts`
- ?? `src/core/context-contract.ts`
- ?? `tests/context-contract.test.ts`
- AgentLoop evidence: `63` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- ?? `src/cli/commands/context.ts`
- ?? `src/core/context-contract.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `tests/context-contract.test.ts`

### AgentLoop
- ?? `.agentloop/research/interview-cycle-196.md`

### Documentation
- M `CHANGELOG.md

[output truncated: showing first 2500 and last 2500 characters of 6674 total]

core/mcp-tools.ts                      | 98 ++++++++++++++++++++++++++++++
 src/mcp/server.ts                          |  2 +-
 src/templates/agents/claude-code.md        |  1 +
 src/templates/agents/codex.md              |  1 +
 src/templates/agents/cursor.md             |  1 +
 src/templates/agents/gemini-cli.md         |  1 +
 src/templates/agents/generic.md            |  1 +
 src/templates/agents/github-copilot-cli.md |  1 +
 src/templates/agents/opencode.md           |  1 +
 tests/cli-docs-drift.test.ts               |  1 +
 tests/mcp-server.test.ts                   | 38 ++++++++++++
 tests/mcp-tools.test.ts                    |  3 +
 tests/package-scripts.test.ts              |  5 +-
 28 files changed, 337 insertions(+), 94 deletions(-)
.agentloop/research/interview-cycle-196.md | untracked
docs/assets/readme/agentloopkit-context-contract.gif | untracked
docs/assets/readme/agentloopkit-context-contract.tape | untracked
docs/context.md | untracked
docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md | untracked
src/cli/commands/context.ts | untracked
src/core/context-contract.ts | untracked
tests/context-contract.test.ts | untracked
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review package and config changes for install, build, and publish impact.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review uncategorized files for ownership and scope.

## Verification Performed
- Overall status: pass

## Verification Report Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.


Summary written: `.agentloop/handoffs/2026-06-23-09-58-pr-summary.md`
Run written: `.agentloop/runs/2026-06-23-09-58-handoff`
````

### post-verification: `npm run dogfood:strict`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.40.0 dogfood:strict
> node scripts/dogfood.mjs --strict

# AgentLoopKit Dogfood Gate
Mode: strict

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Release AgentLoopKit 0.40.0" status="in-progress"; verification=pass; run="handoff 99 files"; tree=dirty (104; 36 non-evidence, 68 AgentLoop evidence); next="agentloop task done"
Reason: Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
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
- Current template version: `1`
- Local template version: `1`

## Harness Files

- `current`: `AGENTS.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current review-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gates
$ np

[output truncated: showing first 2500 and last 2500 characters of 12738 total]

ts/readme/agentloopkit-context-contract.gif, docs/assets/readme/agentloopkit-context-contract.tape, docs/context.md, docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md
- dependencies: package.json
- unknown: server.json, src/cli/index.ts, src/core/completions.ts, src/core/mcp-tools.ts, src/mcp/server.ts, src/cli/commands/context.ts, src/core/context-contract.ts
- tests: tests/cli-docs-drift.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/package-scripts.test.ts, tests/context-contract.test.ts

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
4. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/completions.ts
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
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
