# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-26-23-40`
- Review readiness score: `96`/100
- Task: `Implement Baseframe Suite Integration v1` (`in-progress`) - `.agentloop/tasks/2026-06-26-baseframe-suite-integration-v1.md`
- Verification: `pass` - `.agentloop/reports/2026-06-26-23-30-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-26-23-40-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `16 non-evidence changed files is reviewable but not small; 7 AgentLoop evidence file(s) also present (23 total).`
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

- Medium-sized non-evidence change set; check scope carefully.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `DECISIONS.md`
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/task-contracts.md`
- M `package.json`
- M `src/cli/commands/check-gates.ts`
- M `src/cli/commands/create-task.ts`
- M `src/core/task-contract.ts`
- M `tsup.config.ts`
- ?? `docs/integrations/baseframe-suite-v1.md`
- ?? `src/core/baseframe.ts`
- ?? `src/index.ts`
- ?? `test/fixtures/baseframe/agentflight-result.json`
- ?? `test/fixtures/baseframe/projscan-assessment.json`
- ?? `tests/baseframe.test.ts`
- AgentLoop evidence: `7` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
DECISIONS.md                    |  8 ++++
 README.md                       |  6 +++
 docs/check-gates.md             |  5 +++
 docs/cli-reference.md           | 10 +++++
 docs/task-contracts.md          |  4 ++
 package.json                    |  4 +-
 src/cli/commands/check-gates.ts | 91 ++++++++++++++++++++++++++++++++++++++++-
 src/cli/commands/create-task.ts | 81 +++++++++++++++++++++++++++++++++++-
 src/core/task-contract.ts       |  3 +-
 tsup.config.ts                  |  1 +
 10 files changed, 208 insertions(+), 5 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Implement Baseframe Suite Integration v1`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `24 changed file(s) detected (16 non-evidence, 8 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
