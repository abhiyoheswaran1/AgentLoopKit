# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-19-19-04`
- Review readiness score: `96`/100
- Task: `Guard real-repo trial guidance` (`in-progress`) - `.agentloop/tasks/2026-06-19-guard-real-repo-trial-guidance.md`
- Verification: `pass` - `.agentloop/reports/2026-06-19-19-03-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-19-19-04-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `20 non-evidence changed files is reviewable but not small; 21 AgentLoop evidence file(s) also present (41 total).`
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

- Medium-sized non-evidence change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/contributor-playbook.md`
- M `docs/getting-started.md`
- M `docs/npm-publishing.md`
- M `docs/status.md`
- M `scripts/smoke-packed-release.mjs`
- M `src/core/artifacts.ts`
- M `src/core/task-state.ts`
- M `tests/public-docs-hygiene.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/research/interview-cycle-122.md`
- ?? `docs/real-repo-trials.md`
- ?? `docs/superpowers/plans/2026-06-19-approved-research-improvement-batch.md`
- ?? `docs/superpowers/plans/2026-06-19-real-repo-trial-guidance-guard.md`
- ?? `src/core/artifact-paths.ts`
- AgentLoop evidence: `21` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md                       |  16 ++++
 .agentloop/harness/autonomous-dogfooding.md |   2 +-
 CHANGELOG.md                                |   7 +-
 DECISIONS.md                                |  18 +++++
 README.md                                   |  15 ++++
 ROADMAP.md                                  |   1 +
 docs/contributor-playbook.md                |   2 +
 docs/getting-started.md                     |  15 ++++
 docs/npm-publishing.md                      |   2 +
 docs/status.md                              |   2 +-
 scripts/smoke-packed-release.mjs            |  39 ++++++++++
 src/core/artifacts.ts                       | 111 ++++++----------------------
 src/core/task-state.ts                      |   7 +-
 tests/public-docs-hygiene.test.ts           |  64 ++++++++++++++++
 tests/task-state.test.ts                    |   4 +
 15 files changed, 209 insertions(+), 96 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Guard real-repo trial guidance`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `42 changed file(s) detected (20 non-evidence, 22 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
