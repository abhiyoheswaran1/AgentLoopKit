# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-22-52`
- Review readiness score: `96`/100
- Task: `Strengthen public docs trust hygiene` (`review`) - `.agentloop/tasks/2026-06-15-strengthen-public-docs-trust-hygiene.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-22-51-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-22-52-pr-summary-2.md`
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
- M `docs/maintenance-guards.md`
- M `scripts/smoke-packed-release.mjs`
- M `tests/public-docs-hygiene.test.ts`
- ?? `.agentloop/handoffs/2026-06-15-22-52-pr-summary.md`
- ?? `.agentloop/reports/2026-06-15-22-51-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-51-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-51-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-51-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-22-52-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-22-52-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-22-52-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-15-22-52-handoff/pr-summary.md`
- ?? `.agentloop/tasks/2026-06-15-strengthen-public-docs-trust-hygiene.md`

## Diff Stat

```text
.agentloop/backlog.md             |  2 +-
 .agentloop/dogfood-log.md         | 25 ++++++++++++++
 docs/maintenance-guards.md        |  9 ++++++
 scripts/smoke-packed-release.mjs  | 68 +++++++++++++++++++++++++++++++++++----
 tests/public-docs-hygiene.test.ts | 48 +++++++++++++++++++++++++++
 5 files changed, 144 insertions(+), 8 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Strengthen public docs trust hygiene`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `16 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
