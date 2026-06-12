# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-05-42`
- Review readiness score: `87`/100
- Task: `Expose run details through MCP` (`review`) - `.agentloop/tasks/2026-06-12-expose-run-details-through-mcp.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-05-38-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-05-42-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `70`/100 (weight `15`) - `70/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `13 changed files is reviewable but not small.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Verification evidence is passing.
- Reviewer handoff exists.

## Warnings

- Medium-sized change set; check scope carefully.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/tasks/2026-06-12-expose-ship-evidence-through-mcp.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`
- M `tests/mcp-tools.test.ts`
- ?? `.agentloop/reports/2026-06-12-05-38-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-05-42-verify/`
- ?? `.agentloop/tasks/2026-06-12-expose-run-details-through-mcp.md`

## Diff Stat

```text
.agentloop/backlog.md                              |  1 +
 .../2026-06-12-expose-ship-evidence-through-mcp.md |  2 +-
 CHANGELOG.md                                       |  1 +
 FINAL_HANDOFF.md                                   |  2 +-
 ROADMAP.md                                         |  2 +-
 docs/cli-reference.md                              |  2 +-
 docs/mcp.md                                        |  1 +
 src/core/mcp-tools.ts                              | 43 +++++++++++++++-
 src/mcp/server.ts                                  |  2 +-
 tests/mcp-tools.test.ts                            | 59 ++++++++++++++++++++++
 10 files changed, 109 insertions(+), 6 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Expose run details through MCP`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`warn`] `Task hygiene`: ``Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `14 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
