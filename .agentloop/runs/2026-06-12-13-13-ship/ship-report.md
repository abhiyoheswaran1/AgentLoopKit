# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-13-13`
- Review readiness score: `96`/100
- Task: `Add published package smoke helper` (`in-progress`) - `.agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-13-08-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-13-13-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `15 changed files is reviewable but not small.`
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
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `package.json`
- ?? `.agentloop/reports/2026-06-12-12-58-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-03-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-13-08-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-13-02-verify/`
- ?? `.agentloop/runs/2026-06-12-13-07-verify/`
- ?? `.agentloop/runs/2026-06-12-13-12-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-published-package-smoke-helper.md`
- ?? `scripts/smoke-published-package.mjs`
- ?? `tests/published-smoke-script.test.ts`

## Diff Stat

```text
.agentloop/backlog.md     |  2 ++
 .agentloop/dogfood-log.md | 27 +++++++++++++++++++++++++++
 docs/launch-checklist.md  |  1 +
 docs/npm-publishing.md    | 13 +++++++++++++
 docs/release-status.md    |  1 +
 package.json              |  1 +
 6 files changed, 45 insertions(+)
```

## Gate Summary

- [`pass`] `Task contract`: `Add published package smoke helper`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `16 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
