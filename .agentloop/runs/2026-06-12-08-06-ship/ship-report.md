# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-08-06`
- Review readiness score: `96`/100
- Task: `Harden MCP run artifact path normalization` (`review`) - `.agentloop/tasks/2026-06-12-harden-mcp-run-artifact-path-normalization.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-08-02-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-08-06-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `14 changed files is reviewable but not small.`
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
- D `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `src/core/mcp-tools.ts`
- M `src/core/review-context.ts`
- M `tests/mcp-tools.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-08-06-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-08-02-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-08-05-verify/`
- ?? `.agentloop/runs/2026-06-12-08-06-handoff/`
- ?? `.agentloop/tasks/2026-06-12-harden-mcp-run-artifact-path-normalization.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-review-context-through-the-cli.md`
- ?? `src/core/display-path.ts`

## Diff Stat

```text
.agentloop/backlog.md                              |  1 +
 ...-06-12-expose-review-context-through-the-cli.md | 59 ----------------------
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  1 +
 src/core/mcp-tools.ts                              |  4 +-
 src/core/review-context.ts                         | 21 ++------
 tests/mcp-tools.test.ts                            |  8 +++
 7 files changed, 18 insertions(+), 77 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Harden MCP run artifact path normalization`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `14 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
