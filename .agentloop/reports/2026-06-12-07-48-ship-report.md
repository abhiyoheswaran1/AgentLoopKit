# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-07-48`
- Review readiness score: `96`/100
- Task: `Expose review context through the CLI` (`review`) - `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-07-43-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-07-48-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `21 changed files is reviewable but not small.`
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
- D `.agentloop/tasks/2026-06-12-expose-review-context-through-mcp.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `tests/cli-docs-drift.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-07-47-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-07-43-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-07-47-handoff/`
- ?? `.agentloop/runs/2026-06-12-07-47-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-review-context-through-the-cli.md`
- ?? `.agentloop/tasks/archive/2026-06-12-expose-review-context-through-mcp.md`
- ?? `src/cli/commands/review-context.ts`
- ?? `src/core/review-context.ts`
- ?? `tests/review-context.test.ts`

## Diff Stat

```text
.agentloop/backlog.md                              |  1 +
 ...2026-06-12-expose-review-context-through-mcp.md | 72 ----------------------
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  2 +
 README.md                                          | 62 ++++++++++---------
 ROADMAP.md                                         |  3 +-
 docs/cli-reference.md                              | 11 ++++
 scripts/smoke-cli.mjs                              | 38 +++++++++++-
 src/cli/index.ts                                   |  2 +
 src/core/completions.ts                            |  1 +
 src/core/mcp-tools.ts                              | 56 +----------------
 tests/cli-docs-drift.test.ts                       |  1 +
 12 files changed, 89 insertions(+), 161 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Expose review context through the CLI`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `22 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
