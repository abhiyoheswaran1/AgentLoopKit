# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-04-21`
- Review readiness score: `96`/100
- Task: `Make policy output Markdown-safe` (`done`) - `.agentloop/tasks/archive/2026-06-16-make-policy-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-04-20-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-04-21-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `22 changed files is reviewable but not small.`
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
- M `docs/cli-reference.md`
- M `docs/policies.md`
- M `src/cli/commands/policy.ts`
- M `tests/policy-packs.test.ts`
- M `tests/policy.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-04-21-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-04-17-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-04-20-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-04-19-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-19-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-19-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-04-21-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-21-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-04-21-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-21-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-04-21-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-04-21-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-04-21-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-policy-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md      | 40 +++++++++++--------
 .agentloop/dogfood-log.md  | 39 ++++++++++++++++++
 CHANGELOG.md               |  1 +
 docs/cli-reference.md      |  2 +
 docs/policies.md           |  2 +
 src/cli/commands/policy.ts | 13 ++++--
 tests/policy-packs.test.ts | 99 ++++++++++++++++++++++++++++++++++++++++++++++
 tests/policy.test.ts       | 26 ++++++++++--
 8 files changed, 198 insertions(+), 24 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make policy output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `23 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
