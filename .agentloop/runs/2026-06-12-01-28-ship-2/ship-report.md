# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-01-28`
- Review readiness score: `92`/100
- Task: `Show latest run evidence in status` (`review`) - `.agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-01-20-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-01-28-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `19 changed files is reviewable but not small.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
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
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/mcp.md`
- M `docs/status.md`
- M `scripts/smoke-cli.mjs`
- M `src/core/runs.ts`
- M `src/core/status.ts`
- M `tests/runs.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-01-28-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-01-20-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-01-28-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-01-27-verify/`
- ?? `.agentloop/runs/2026-06-12-01-28-ship/`
- ?? `.agentloop/tasks/2026-06-12-show-latest-run-evidence-in-status.md`

## Diff Stat

```text
.agentloop/backlog.md     |  1 +
 .agentloop/dogfood-log.md | 30 ++++++++++++++++++++++
 CHANGELOG.md              |  1 +
 FINAL_HANDOFF.md          |  3 ++-
 README.md                 |  4 ++-
 docs/cli-reference.md     |  4 +--
 docs/mcp.md               |  2 +-
 docs/status.md            |  4 ++-
 scripts/smoke-cli.mjs     | 13 ++++++++++
 src/core/runs.ts          | 30 +++++++++++++++++++---
 src/core/status.ts        | 27 +++++++++++++++++++-
 tests/runs.test.ts        | 64 ++++++++++++++++++++++++++++++++++++++++++++++-
 tests/status.test.ts      | 57 +++++++++++++++++++++++++++++++++++++++++
 13 files changed, 228 insertions(+), 12 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Show latest run evidence in status`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`warn`] `Task hygiene`: ``Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `19 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
