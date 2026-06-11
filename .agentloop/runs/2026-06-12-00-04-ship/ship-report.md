# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-00-04`
- Review readiness score: `92`/100
- Task: `Build local acceptance layer commands` (`in-progress`) - `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`
- Verification: `pass` - `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/reports/2026-06-11-23-57-verification-report.md`
- Handoff: `/Users/abhyoh/local dev folder/Apps/AgentLoopKit/.agentloop/handoffs/2026-06-12-00-04-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `31 changed files is broad for one review.`
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
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/github-actions.md`
- M `examples/end-to-end/README.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `tests/cli-docs-drift.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-00-04-pr-summary.md`
- ?? `.agentloop/reports/2026-06-11-23-57-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-00-04-ship-report.md`
- ?? `.agentloop/runs/`
- ?? `.agentloop/tasks/2026-06-11-build-local-acceptance-layer-commands.md`
- ?? `src/cli/commands/maintainer-check.ts`
- ?? `src/cli/commands/prepare-pr.ts`
- ?? `src/cli/commands/runs.ts`
- ?? `src/cli/commands/ship.ts`
- ?? `src/core/maintainer-check.ts`
- ?? `src/core/prepare-pr.ts`
- ?? `src/core/readiness-score.ts`
- ?? `src/core/runs.ts`
- ?? `src/core/ship.ts`
- ?? `tests/maintainer-check.test.ts`
- ?? `tests/prepare-pr.test.ts`
- ?? `tests/readiness-score.test.ts`
- ?? `tests/runs.test.ts`
- ?? `tests/ship.test.ts`

## Diff Stat

```text
.agentloop/backlog.md         |  1 +
 CHANGELOG.md                  |  4 +++
 DECISIONS.md                  |  6 ++++
 FINAL_HANDOFF.md              | 16 ++++++++++
 README.md                     | 30 +++++++++++++-----
 docs/cli-reference.md         | 49 ++++++++++++++++++++++++++++
 docs/github-actions.md        | 74 ++++++++++++++++++++++++++++++++++++++++++-
 examples/end-to-end/README.md | 32 ++++++++++++++++---
 scripts/smoke-cli.mjs         | 46 +++++++++++++++++++++++++++
 src/cli/index.ts              | 10 ++++++
 src/core/completions.ts       |  6 ++++
 tests/cli-docs-drift.test.ts  |  6 ++++
 12 files changed, 266 insertions(+), 14 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Build local acceptance layer commands`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `31 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
