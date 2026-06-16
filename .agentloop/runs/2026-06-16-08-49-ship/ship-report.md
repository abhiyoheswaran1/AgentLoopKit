# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-08-49`
- Review readiness score: `92`/100
- Task: `Preserve existing agent instruction files` (`in-progress`) - `.agentloop/tasks/2026-06-16-preserve-existing-agent-instruction-files-2.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-08-48-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-08-49-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `29 changed files is broad for one review.`
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
- M `README.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/install-agent.ts`
- M `src/core/agent-installation.ts`
- M `tests/agent-installation.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-08-47-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-08-46-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-47-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-08-48-verification-report.md`
- ?? `.agentloop/research/interview-cycle-116.md`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-46-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-47-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify-2/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-08-48-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-preserve-existing-agent-instruction-files-2.md`
- ?? `.agentloop/tasks/archive/2026-06-16-preserve-existing-agent-instruction-files.md`

## Diff Stat

```text
.agentloop/backlog.md             |  6 ++++
 .agentloop/dogfood-log.md         | 49 ++++++++++++++++++++++++++++++
 CHANGELOG.md                      |  1 +
 DECISIONS.md                      |  8 +++++
 README.md                         |  2 +-
 docs/cli-reference.md             |  4 +--
 src/cli/commands/install-agent.ts | 14 +++++++--
 src/core/agent-installation.ts    | 16 ++++++++--
 tests/agent-installation.test.ts  | 63 ++++++++++++++++++++++++++++++++++++++-
 9 files changed, 154 insertions(+), 9 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Preserve existing agent instruction files`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `30 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
