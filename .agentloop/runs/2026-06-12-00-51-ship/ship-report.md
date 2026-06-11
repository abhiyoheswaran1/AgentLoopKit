# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-00-51`
- Review readiness score: `92`/100
- Task: `Add opt-in run ledger entries for verify and handoff` (`review`) - `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-12-00-45-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-00-51-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `28 changed files is broad for one review.`
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
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `examples/end-to-end/README.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/summarize.ts`
- M `src/cli/commands/verify.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/runs.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/runs.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-00-30-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-12-00-39-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-12-00-39-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-00-24-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-00-39-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-00-45-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-00-29-verify/`
- ?? `.agentloop/runs/2026-06-12-00-30-handoff/`
- ?? `.agentloop/runs/2026-06-12-00-39-ship-2/`
- ?? `.agentloop/runs/2026-06-12-00-39-ship/`
- ?? `.agentloop/runs/2026-06-12-00-51-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-opt-in-run-ledger-entries-for-verify-and-handoff.md`

## Diff Stat

```text
.agentloop/backlog.md         |   1 +
 .agentloop/dogfood-log.md     |  32 ++++++++++
 CHANGELOG.md                  |   4 ++
 FINAL_HANDOFF.md              |   1 +
 README.md                     |   4 +-
 docs/cli-reference.md         |   9 ++-
 examples/end-to-end/README.md |   4 ++
 scripts/smoke-cli.mjs         |  12 +++-
 src/cli/commands/runs.ts      |  15 +++--
 src/cli/commands/summarize.ts |  22 ++++++-
 src/cli/commands/verify.ts    |  54 +++++++++++++++-
 src/core/pr-summary.ts        |   2 +-
 src/core/prepare-pr.ts        |  15 ++++-
 src/core/runs.ts              | 142 ++++++++++++++++++++++++++++++++++++++----
 tests/prepare-pr.test.ts      |   5 ++
 tests/runs.test.ts            | 141 ++++++++++++++++++++++++++++++++++++++++-
 16 files changed, 435 insertions(+), 28 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add opt-in run ledger entries for verify and handoff`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `29 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
