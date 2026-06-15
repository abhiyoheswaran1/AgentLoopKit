# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-01-07`
- Review readiness score: `96`/100
- Task: `Make status and next output Markdown-safe` (`review`) - `.agentloop/tasks/2026-06-16-make-status-and-next-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-01-02-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-01-07-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `15 changed files is reviewable but not small.`
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
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `docs/status.md`
- M `src/cli/commands/next.ts`
- M `src/core/markdown-format.ts`
- M `src/core/status.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/reports/2026-06-16-01-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-01-03-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-make-status-and-next-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md       |   6 ++
 .agentloop/dogfood-log.md   |  42 ++++++++++
 CHANGELOG.md                |   1 +
 docs/cli-reference.md       |   1 +
 docs/status.md              |   1 +
 src/cli/commands/next.ts    |  12 +--
 src/core/markdown-format.ts |   4 +
 src/core/status.ts          |  38 ++++-----
 tests/next.test.ts          |  54 ++++++++++++-
 tests/status.test.ts        | 189 +++++++++++++++++++++++++++++---------------
 10 files changed, 257 insertions(+), 91 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make status and next output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `16 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
