# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-21-05-07`
- Review readiness score: `92`/100
- Task: `Summarize stale artifact preview by type` (`in-progress`) - `.agentloop/tasks/2026-06-21-summarize-stale-artifact-preview-by-type.md`
- Verification: `pass` - `.agentloop/reports/2026-06-21-05-00-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-21-05-07-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `84 non-evidence changed files is broad for one review; 264 AgentLoop evidence file(s) also present (348 total).`
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

## Task Risk Notes

- Pre-existing dirty non-evidence files from prior autonomous work remain in the working tree; keep this slice scoped to artifact preview summary behavior.
- Pre-existing dirty non-evidence files before task creation: 83 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/tasks/README.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `package.json`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/readiness-score.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/handoffs/verification-report.md`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/tasks/README.md`
- M `tests/agent-installation.test.ts`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/create-task.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/readiness-score.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`
- ?? `.agentloop/research/interview-cycle-159.md`
- ?? `.agentloop/research/interview-cycle-160.md`
- ?? `.agentloop/research/interview-cycle-161.md`
- ?? `.agentloop/research/interview-cycle-162.md`
- ?? `.agentloop/research/interview-cycle-163.md`
- ?? `.agentloop/research/interview-cycle-164.md`
- ?? `.agentloop/research/interview-cycle-165.md`
- ?? `.agentloop/research/interview-cycle-166.md`
- ?? `.agentloop/research/interview-cycle-167.md`
- ?? `.agentloop/research/interview-cycle-168.md`
- ?? `.agentloop/research/interview-cycle-169.md`
- ?? `.agentloop/research/interview-cycle-170.md`
- ?? `.agentloop/research/interview-cycle-171.md`
- ?? `.agentloop/research/interview-cycle-172.md`
- ?? `src/core/markdown-sections.ts`
- ?? `src/core/verification-report-sections.ts`
- AgentLoop evidence: `264` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md                         | 105 ++++++++
 .agentloop/harness/autonomous-dogfooding.md   |   2 +-
 .agentloop/harness/commands.md                |   2 +-
 .agentloop/tasks/README.md                    |   6 +-
 AGENTLOOP.md                                  |   2 +-
 AGENTS.md                                     |   4 +-
 CHANGELOG.md                                  |  21 +-
 DECISIONS.md                                  | 120 ++++++++++
 README.md                                     |   8 +-
 docs/cli-reference.md                         |  25 +-
 docs/html-reports.md                          |   2 +
 docs/maintenance-guards.md                    |   8 +-
 docs/pr-summaries.md                          |   3 +
 docs/status.md                                |   4 +
 docs/task-contracts.md                        |   4 +
 package.json                                  |   2 +-
 scripts/dogfood.mjs                           |  12 +-
 scripts/maintenance-check.mjs                 |   8 +-
 src/cli/commands/create-task.ts               | 123 +++++++++-
 src/cli/commands/task.ts                      |  30 ++-
 src/core/artifacts.ts                         |  35 ++-
 src/core/git.ts                               |  19 ++
 src/core/html-report.ts                       |   4 +-
 src/core/maintainer-check.ts                  |  59 +++--
 src/core/pr-summary.ts                        |  24 +-
 src/core/prepare-pr.ts                        |  45 ++--
 src/core/readiness-score.ts                   |  14 +-
 src/core/review-context.ts                    |  36 ++-
 src/core/ship.ts                              |  19 +-
 src/core/status.ts                            |  18 +-
 src/core/task-contract.ts                     |  80 ++++++-
 src/core/task-state.ts                        |  83 ++-----
 src/templates/agents/claude-code.md           |   2 +-
 src/templates/agents/codex.md                 |   2 +-
 src/templates/agents/cursor.md                |   2 +-
 src/templates/agents/gemini-cli.md            |   2 +-
 src/templates/agents/generic.md               |   2 +-
 src/templates/agents/github-copilot-cli.md    |   2 +-
 src/templates/agents/opencode.md              |   2 +-
 src/templates/handoffs/verification-report.md |   2 +-
 src/templates/harness/commands.md             |   1 +
 src/templates/root/AGENTLOOP.md               |   2 +-
 src/templates/root/AGENTS.md                  |   2 +-
 src/templates/tasks/README.md                 |   2 +
 tests/agent-installation.test.ts              |   4 +
 tests/artifacts.test.ts                       |  41 +++-
 tests/autonomous-dogfood.test.ts              |   8 +
 tests/create-task.test.ts                     | 330 ++++++++++++++++++++++++++
 tests/dogfood-script.test.ts                  |  17 ++
 tests/html-report.test.ts                     |  28 +++
 tests/init.test.ts                            |  27 +++
 tests/maintainer-check.test.ts                |  52 +++-
 tests/maintenance-check-script.test.ts        |  34 +--
 tests/next.test.ts                            |   1 +
 tests/package-scripts.test.ts                 |   1 +
 tests/pr-summary.test.ts                      |  75 ++++++
 tests/prepare-pr.test.ts                      |  55 ++++-
 tests/readiness-score.test.ts                 | 100 ++++++++
 tests/review-context.test.ts                  |  72 ++++++
 tests/ship.test.ts                            |  76 ++++++
 tests/status.test.ts                          |   2 +
 tests/task-state.test.ts                      |  47 +++-
 62 files changed, 1710 insertions(+), 210 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
.agentloop/research/interview-cycle-155.md | untracked
.agentloop/research/interview-cycle-156.md | untracked
.agentloop/research/interview-cycle-157.md | untracked
.agentloop/research/interview-cycle-158.md | untracked
.agentloop/research/interview-cycle-159.md | untracked
.agentloop/research/interview-cycle-160.md | untracked
.agentloop/research/interview-cycle-161.md | untracked
.agentloop/research/interview-cycle-162.md | untracked
.agentloop/research/interview-cycle-163.md | untracked
.agentloop/research/interview-cycle-164.md | untracked
.agentloop/research/interview-cycle-165.md | untracked
.agentloop/research/interview-cycle-166.md | untracked
.agentloop/research/interview-cycle-167.md | untracked
.agentloop/research/interview-cycle-168.md | untracked
.agentloop/research/interview-cycle-169.md | untracked
.agentloop/research/interview-cycle-170.md | untracked
.agentloop/research/interview-cycle-171.md | untracked
.agentloop/research/interview-cycle-172.md | untracked
src/core/markdown-sections.ts | untracked
src/core/verification-report-sections.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Summarize stale artifact preview by type`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `349 changed file(s) detected (84 non-evidence, 265 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
