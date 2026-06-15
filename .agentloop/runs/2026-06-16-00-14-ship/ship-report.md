# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-00-14`
- Review readiness score: `92`/100
- Task: `Complete fixed option completions` (`done`) - `.agentloop/tasks/archive/2026-06-15-complete-fixed-option-completions.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-00-12-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-00-14-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `36 changed files is broad for one review.`
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

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `src/core/completions.ts`
- M `tests/completion.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-00-06-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-16-00-06-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-00-06-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-00-07-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-00-04-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-00-06-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-00-12-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-00-04-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-04-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-04-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-00-06-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-06-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-00-06-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-06-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-00-06-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-06-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-00-06-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-06-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-00-06-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-00-06-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-00-07-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-07-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-00-07-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-07-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-00-13-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-00-13-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-00-13-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-15-complete-fixed-option-completions.md`

## Diff Stat

```text
.agentloop/backlog.md     |  6 ++++
 .agentloop/dogfood-log.md | 42 ++++++++++++++++++++++++
 CHANGELOG.md              |  1 +
 README.md                 |  2 +-
 docs/cli-reference.md     |  2 +-
 docs/getting-started.md   |  2 +-
 src/core/completions.ts   | 83 +++++++++++++++++++++++++++++++++++++++++++++++
 tests/completion.test.ts  | 48 +++++++++++++++++++++++++++
 8 files changed, 183 insertions(+), 3 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Complete fixed option completions`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `37 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
