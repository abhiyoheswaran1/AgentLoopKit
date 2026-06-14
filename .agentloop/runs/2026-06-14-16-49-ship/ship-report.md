# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-14-16-49`
- Review readiness score: `92`/100
- Task: `Improve roadmap adoption evidence` (`review`) - `.agentloop/tasks/2026-06-14-improve-roadmap-adoption-evidence.md`
- Verification: `pass` - `.agentloop/reports/2026-06-14-16-45-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-14-16-49-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `34 changed files is broad for one review.`
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
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/github-metadata.md`
- M `docs/policies.md`
- M `docs/policy-examples.md`
- M `src/core/github-metadata.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `tests/github-metadata.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-16-48-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-16-45-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-16-48-ship-report.md`
- ?? `.agentloop/research/interview-cycle-110.md`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-47-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-16-48-ship/ship-report.md`
- ?? `.agentloop/tasks/2026-06-14-improve-roadmap-adoption-evidence.md`

## Diff Stat

```text
.agentloop/backlog.md          |  9 ++++
 .agentloop/dogfood-log.md      | 37 +++++++++++++++++
 CHANGELOG.md                   |  8 ++--
 DECISIONS.md                   |  8 ++++
 FINAL_HANDOFF.md               | 37 ++++++++++-------
 README.md                      |  2 +-
 ROADMAP.md                     |  7 +++-
 docs/cli-reference.md          | 12 ++++--
 docs/getting-started.md        |  1 +
 docs/github-metadata.md        | 18 ++++++++
 docs/policies.md               | 77 ++++++++++++++++++++++++++++++++++
 docs/policy-examples.md        | 51 +++++++++++++++++++++++
 src/core/github-metadata.ts    | 93 +++++++++++++++++++++++++++++++++++++++++-
 src/core/maintainer-check.ts   | 71 ++++++++++++++++++++++----------
 src/core/prepare-pr.ts         | 88 ++++++++++++++++++++++++++++++++++++---
 src/core/review-context.ts     | 27 +++++++++++-
 tests/github-metadata.test.ts  | 55 ++++++++++++++++++++++++-
 tests/maintainer-check.test.ts | 61 +++++++++++++++++++++++++--
 tests/prepare-pr.test.ts       | 92 +++++++++++++++++++++++++++++++++++++----
 tests/review-context.test.ts   | 43 ++++++++++++++++++-
 20 files changed, 731 insertions(+), 66 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Improve roadmap adoption evidence`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `35 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
