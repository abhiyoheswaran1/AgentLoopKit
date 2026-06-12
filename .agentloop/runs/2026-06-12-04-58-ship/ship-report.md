# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-04-58`
- Review readiness score: `96`/100
- Task: `Use repo-relative paths in PR-facing Markdown` (`review`) - `.agentloop/tasks/2026-06-12-use-repo-relative-paths-in-pr-facing-markdown.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-04-51-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-04-58-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `12 changed files is reviewable but not small.`
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
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/reports/2026-06-12-04-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-57-verify/`
- ?? `.agentloop/tasks/2026-06-12-use-repo-relative-paths-in-pr-facing-markdown.md`

## Diff Stat

```text
.agentloop/backlog.md    |  1 +
 CHANGELOG.md             |  1 +
 FINAL_HANDOFF.md         |  1 +
 docs/cli-reference.md    |  2 ++
 src/cli/commands/ship.ts |  6 ++++--
 src/core/prepare-pr.ts   | 27 ++++++++++++++++-----------
 src/core/ship.ts         | 26 +++++++++++++++++---------
 tests/prepare-pr.test.ts |  5 +++++
 tests/ship.test.ts       |  8 +++++++-
 9 files changed, 54 insertions(+), 23 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Use repo-relative paths in PR-facing Markdown`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `13 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
