# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-05-52`
- Review readiness score: `92`/100
- Task: `Make verify output Markdown-safe` (`done`) - `.agentloop/tasks/archive/2026-06-16-make-verify-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-05-49-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-05-52-pr-summary-4.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `29 changed files is broad for one review.`
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
- M `docs/cli-reference.md`
- M `src/cli/commands/verify.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-05-52-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-05-52-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-05-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-05-49-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-05-52-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-52-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-52-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-52-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-52-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-52-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-52-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-05-52-ship/ship-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-verify-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md      |  6 +++++
 .agentloop/dogfood-log.md  | 39 ++++++++++++++++++++++++++++++++
 CHANGELOG.md               |  1 +
 docs/cli-reference.md      |  2 ++
 src/cli/commands/verify.ts |  2 +-
 tests/verification.test.ts | 56 ++++++++++++++++++++++++++++++++++++++++++++++
 6 files changed, 105 insertions(+), 1 deletion(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make verify output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `30 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
