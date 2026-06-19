# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-19-23-55`
- Review readiness score: `96`/100
- Task: `Run real-repo usefulness trials` (`in-progress`) - `.agentloop/tasks/2026-06-19-run-real-repo-usefulness-trials-2.md`
- Verification: `pass` - `.agentloop/reports/2026-06-19-23-51-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-19-23-55-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `12 non-evidence changed files is reviewable but not small; 10 AgentLoop evidence file(s) also present (22 total).`
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

- Medium-sized non-evidence change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `src/core/status.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/next.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- ?? `.agentloop/research/interview-cycle-123.md`
- ?? `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`
- ?? `docs/superpowers/plans/2026-06-19-real-repo-usefulness-trials.md`
- ?? `docs/superpowers/plans/2026-06-19-status-routes-placeholder-active-tasks.md`
- AgentLoop evidence: `10` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md        |  6 ++++
 CHANGELOG.md                 |  2 +-
 DECISIONS.md                 |  6 ++++
 src/core/status.ts           | 28 ++++++++++++++--
 tests/mcp-tools.test.ts      |  4 +++
 tests/next.test.ts           | 76 ++++++++++++++++++++++++++++++++++++++++++++
 tests/review-context.test.ts |  1 +
 tests/status.test.ts         | 73 ++++++++++++++++++++++++++++++++++++++++++
 8 files changed, 192 insertions(+), 4 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Run real-repo usefulness trials`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `23 changed file(s) detected (12 non-evidence, 11 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
