# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-15-18-16`
- Review readiness score: `100`/100
- Task: `Fix CLI smoke placeholder contract regression` (`in-progress`) - `.agentloop/tasks/2026-06-15-fix-cli-smoke-placeholder-contract-regression.md`
- Verification: `pass` - `.agentloop/reports/2026-06-15-18-15-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-15-18-16-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `100`/100 (weight `15`) - `10 changed file(s).`
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

- No warnings recorded.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `scripts/smoke-cli.mjs`
- ?? `.agentloop/reports/2026-06-15-18-14-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-18-15-verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-14-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-14-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-14-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-18-16-verify/verification-report.md`
- ?? `.agentloop/tasks/2026-06-15-fix-cli-smoke-placeholder-contract-regression.md`

## Diff Stat

```text
scripts/smoke-cli.mjs | 2 ++
 1 file changed, 2 insertions(+)
```

## Gate Summary

- [`pass`] `Task contract`: `Fix CLI smoke placeholder contract regression`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `11 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
