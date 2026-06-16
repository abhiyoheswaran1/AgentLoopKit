# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-10-25`
- Review readiness score: `92`/100
- Task: `Release 0.34.1` (`in-progress`) - `.agentloop/tasks/2026-06-16-release-0-34-1.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-10-25-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-10-25-pr-summary-2.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `14 changed files is reviewable but not small.`
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

- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `ROADMAP.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `package.json`
- M `server.json`
- ?? `.agentloop/handoffs/2026-06-16-10-22-release-notes.md`
- ?? `.agentloop/reports/2026-06-16-10-25-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-10-25-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-10-25-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-10-25-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-16-release-0-34-1.md`

## Diff Stat

```text
CHANGELOG.md             |  4 ++++
 FINAL_HANDOFF.md         | 44 ++++++++++++++++++++++---------------
 ROADMAP.md               | 10 ++++-----
 docs/launch-checklist.md |  4 ++--
 docs/npm-publishing.md   |  8 +++----
 docs/release-status.md   | 57 ++++++++++++++++++++++++------------------------
 package.json             |  2 +-
 server.json              |  4 ++--
 8 files changed, 72 insertions(+), 61 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Release 0.34.1`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `20 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
