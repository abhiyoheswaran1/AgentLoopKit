# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-29-10-12`
- Review readiness score: `92`/100
- Task: `Release AgentLoopKit 0.47.0` (`in-progress`) - `.agentloop/tasks/2026-06-29-release-agentloopkit-0-47-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-29-09-49-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-29-10-12-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `32 non-evidence changed files is broad for one review; 32 AgentLoop evidence file(s) also present (64 total). Non-evidence review areas: Documentation 11, Source 9, AgentLoop 7, Tests 3, Config / Package 1, Other 1.`
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

- Evidence map: `64` changed file(s); `32` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `26` dirty non-evidence file(s); current non-evidence changed files: `32` (net `+6`).

## Task Risk Notes

- Release touches package metadata, changelog, tags, npm, and GitHub Release state.
- Pre-existing dirty non-evidence files before task creation: 26 total; examples: `.agentloop/README.md`, `.agentloop/harness/commands.md`, `AGENTLOOP.md`, `AGENTS.md`, `CHANGELOG.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/loop-contracts.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `package.json`
- M `server.json`
- M `src/cli/commands/loop.ts`
- M `src/core/evidence-map.ts`
- M `src/core/loop-contract.ts`
- M `src/core/upgrade-harness.ts`
- M `src/index.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/evidence-map.test.ts`
- M `tests/loop-contract.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `.agentloop/loops/2026-06-28-14-05-dogfood-autonomous-loop-scorecards/loop.json`
- ?? `.agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json`
- ?? `.agentloop/loops/2026-06-28-14-25-dogfood-autonomous-loop-scorecards-final/loop.json`
- ?? `docs/superpowers/plans/2026-06-28-loop-scorecard.md`
- ?? `docs/superpowers/specs/2026-06-28-loop-scorecard-design.md`
- AgentLoop evidence: `32` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                             |   2 +-
 .agentloop/harness/commands.md                   |   2 +-
 AGENTLOOP.md                                     |   2 +-
 AGENTS.md                                        |   2 +-
 CHANGELOG.md                                     |   9 +
 DECISIONS.md                                     |  10 +
 FINAL_HANDOFF.md                                 |  46 +--
 README.md                                        |  10 +-
 ROADMAP.md                                       |  11 +-
 docs/cli-reference.md                            |   6 +-
 docs/loop-contracts.md                           |   7 +-
 docs/npm-publishing.md                           |  10 +-
 docs/release-status.md                           |  72 ++---
 package.json                                     |   2 +-
 server.json                                      |   4 +-
 src/cli/commands/loop.ts                         |  23 ++
 src/core/evidence-map.ts                         |   4 +-
 src/core/loop-contract.ts                        | 385 ++++++++++++++++++++++-
 src/core/upgrade-harness.ts                      |   4 +-
 src/index.ts                                     |   5 +
 src/templates/harness/commands.md                |   2 +-
 src/templates/root/AGENTLOOP.md                  |   2 +-
 src/templates/root/AGENTS.md                     |   2 +-
 src/templates/root/agentloop-directory-readme.md |   3 +-
 tests/evidence-map.test.ts                       |  40 +++
 tests/loop-contract.test.ts                      | 286 ++++++++++++++++-
 tests/upgrade-harness.test.ts                    |   5 +
 27 files changed, 858 insertions(+), 98 deletions(-)
.agentloop/loops/2026-06-28-14-05-dogfood-autonomous-loop-scorecards/loop.json | untracked
.agentloop/loops/2026-06-28-14-22-dogfood-autonomous-loop-scorecards-guard-fix/loop.json | untracked
.agentloop/loops/2026-06-28-14-25-dogfood-autonomous-loop-scorecards-final/loop.json | untracked
docs/superpowers/plans/2026-06-28-loop-scorecard.md | untracked
docs/superpowers/specs/2026-06-28-loop-scorecard-design.md | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.47.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `70 changed file(s) detected (32 non-evidence, 38 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
