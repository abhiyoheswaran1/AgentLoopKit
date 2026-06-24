# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-24-14-44`
- Review readiness score: `92`/100
- Task: `Release AgentLoopKit 0.42.0` (`in-progress`) - `.agentloop/tasks/2026-06-24-release-agentloopkit-0-42-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-24-14-30-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-24-14-44-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `40 non-evidence changed files is broad for one review; 74 AgentLoop evidence file(s) also present (114 total). Non-evidence review areas: Documentation 18, Source 10, AgentLoop 5, Tests 5, Config / Package 1, Other 1.`
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

- Evidence map: `114` changed file(s); `40` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `40` dirty non-evidence file(s); current non-evidence changed files: `40` (net `0`).

## Task Risk Notes

- Pre-existing dirty non-evidence files before task creation: 40 total; examples: `.agentloop/README.md`, `.agentloop/harness/commands.md`, `.agentloop/manifest.json`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/manifest.json`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- M `package.json`
- M `server.json`
- M `src/core/constants.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/evidence.ts`
- M `src/core/upgrade-harness.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/init.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/superpowers/plans/2026-06-24-agent-guidance-readiness.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md`
- ?? `docs/superpowers/specs/2026-06-24-agent-guidance-readiness-design.md`
- ?? `docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md`
- AgentLoop evidence: `74` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                             |   4 +-
 .agentloop/harness/commands.md                   |   2 +
 .agentloop/manifest.json                         |   2 +-
 AGENTLOOP.md                                     |   2 +-
 AGENTS.md                                        |   1 +
 CHANGELOG.md                                     |  10 +++
 DECISIONS.md                                     |  16 ++++
 FINAL_HANDOFF.md                                 |  44 +++++----
 README.md                                        |  11 ++-
 ROADMAP.md                                       |  10 +--
 docs/cli-reference.md                            |  10 ++-
 docs/context.md                                  |   8 +-
 docs/getting-started.md                          |   2 +-
 docs/launch-checklist.md                         |   2 +-
 docs/mcp.md                                      |   4 +-
 docs/npm-publishing.md                           |   8 +-
 docs/release-status.md                           |  66 +++++++-------
 docs/template-migrations.md                      |  17 +++-
 docs/upgrading-existing-repos.md                 |   4 +-
 package.json                                     |   2 +-
 server.json                                      |   4 +-
 src/core/constants.ts                            |   2 +-
 src/core/context-contract.ts                     |  15 +++-
 src/core/doctor.ts                               |   6 +-
 src/core/evidence-map.ts                         |  13 ++-
 src/core/evidence.ts                             |  54 +++++++++++
 src/core/upgrade-harness.ts                      |  25 ++++--
 src/templates/harness/commands.md                |   2 +
 src/templates/root/AGENTLOOP.md                  |   2 +-
 src/templates/root/AGENTS.md                     |   1 +
 src/templates/root/agentloop-directory-readme.md |   4 +-
 tests/agent-start.test.ts                        |  96 ++++++++++++++++++++
 tests/context-contract.test.ts                   | 109 +++++++++++++++++++++++
 tests/doctor.test.ts                             |   8 +-
 tests/init.test.ts                               |   2 +-
 tests/upgrade-harness.test.ts                    |  31 ++++++-
 36 files changed, 493 insertions(+), 106 deletions(-)
docs/superpowers/plans/2026-06-24-agent-guidance-readiness.md | untracked
docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md | untracked
docs/superpowers/specs/2026-06-24-agent-guidance-readiness-design.md | untracked
docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.42.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `115 changed file(s) detected (40 non-evidence, 75 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
