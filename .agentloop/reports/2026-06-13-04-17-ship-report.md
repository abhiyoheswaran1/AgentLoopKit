# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-13-04-17`
- Review readiness score: `95`/100
- Task: `Flag post-verification gate mismatches in task doctor` (`proposed`) - `.agentloop/tasks/2026-06-13-flag-post-verification-gate-mismatches-in-task-doctor.md`
- Verification: `pass` - `.agentloop/reports/2026-06-13-04-08-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-13-04-17-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `90`/100 (weight `15`) - `90/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `24 changed files is reviewable but not small.`
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

- Medium-sized change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/task-state.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`
- M `tests/task-state.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-04-17-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-04-08-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-04-10-verify/`
- ?? `.agentloop/runs/2026-06-13-04-17-handoff/`
- ?? `.agentloop/tasks/2026-06-13-flag-post-verification-gate-mismatches-in-task-doctor.md`
- ?? `src/core/post-verification-gates.ts`

## Diff Stat

```text
.agentloop/backlog.md                            |  1 +
 .agentloop/dogfood-log.md                        | 20 ++++++++
 .agentloop/harness/commands.md                   |  2 +-
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  2 +-
 CHANGELOG.md                                     |  1 +
 docs/getting-started.md                          |  2 +-
 docs/status.md                                   |  4 +-
 docs/task-contracts.md                           |  3 +-
 src/cli/commands/create-task.ts                  | 13 +-----
 src/cli/commands/task.ts                         |  3 ++
 src/core/task-state.ts                           | 39 ++++++++++++++++
 src/templates/harness/commands.md                |  2 +-
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  2 +-
 src/templates/root/agentloop-directory-readme.md |  2 +-
 src/templates/tasks/README.md                    |  2 +-
 tests/task-state.test.ts                         | 59 ++++++++++++++++++++++++
 18 files changed, 138 insertions(+), 23 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Flag post-verification gate mismatches in task doctor`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `24 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
