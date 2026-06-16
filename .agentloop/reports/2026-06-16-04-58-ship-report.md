# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-04-58`
- Review readiness score: `92`/100
- Task: `Make github import output Markdown-safe` (`done`) - `.agentloop/tasks/archive/2026-06-16-make-github-import-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-04-53-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-04-58-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `61 changed files is broad for one review.`
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
- M `docs/github-metadata.md`
- M `src/cli/commands/github.ts`
- M `tests/github-metadata.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-04-56-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-04-56-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-04-57-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-16-04-57-pr-summary-3.md`
- ?? `.agentloop/handoffs/2026-06-16-04-57-pr-summary-4.md`
- ?? `.agentloop/handoffs/2026-06-16-04-57-pr-summary-5.md`
- ?? `.agentloop/handoffs/2026-06-16-04-57-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-04-58-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-04-53-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-04-56-ship-report.md`
- ?? `.agentloop/reports/2026-06-16-04-57-ship-report-2.md`
- ?? `.agentloop/reports/2026-06-16-04-57-ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-55-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-04-56-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-56-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-56-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-56-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-56-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-56-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-56-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-56-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-56-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-04-56-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-3/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-3/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-3/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff-3/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-57-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-57-ship-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-57-ship-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-57-ship-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-57-ship-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-57-ship-2/score.json`
- ?? `.agentloop/runs/2026-06-16-04-57-ship-2/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-57-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-57-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-57-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-57-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-57-ship/score.json`
- ?? `.agentloop/runs/2026-06-16-04-57-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-16-04-58-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-58-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-58-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-58-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-github-import-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md         |  6 ++++
 .agentloop/dogfood-log.md     | 42 +++++++++++++++++++++++++++
 CHANGELOG.md                  |  1 +
 docs/cli-reference.md         |  2 ++
 docs/github-metadata.md       |  2 ++
 src/cli/commands/github.ts    |  2 +-
 tests/github-metadata.test.ts | 67 +++++++++++++++++++++++++++++++++++++++++++
 7 files changed, 121 insertions(+), 1 deletion(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make github import output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `62 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
