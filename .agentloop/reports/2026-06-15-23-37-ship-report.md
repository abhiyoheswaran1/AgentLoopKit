# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-23-37`
- Review readiness score: `96`/100
- Task: `Add targeted release-proof channel checks` (`review`) - `.agentloop/tasks/2026-06-15-add-targeted-release-proof-channel-checks.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-23-36-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-23-37-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `19 changed files is reviewable but not small.`
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
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/release-proof.md`
- M `src/cli/commands/release-proof.ts`
- M `src/core/release-proof.ts`
- M `tests/release-proof.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-23-37-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-23-36-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-36-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-23-37-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-15-add-targeted-release-proof-channel-checks.md`

## Diff Stat

```text
.agentloop/backlog.md             |   1 +
 .agentloop/dogfood-log.md         |  41 +++++++++
 CHANGELOG.md                      |   4 +
 README.md                         |   2 +-
 docs/cli-reference.md             |   6 +-
 docs/release-proof.md             |   8 ++
 src/cli/commands/release-proof.ts |  97 +++++++++++++++++----
 src/core/release-proof.ts         | 176 ++++++++++++++++++++++++--------------
 tests/release-proof.test.ts       |  89 +++++++++++++++++++
 9 files changed, 339 insertions(+), 85 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Add targeted release-proof channel checks`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `20 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
