# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-27-16-04`
- Review readiness score: `96`/100
- Task: `Release AgentLoopKit 0.44.0` (`in-progress`) - `.agentloop/tasks/2026-06-27-release-agentloopkit-0-44-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-27-15-56-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-27-16-04-pr-summary-2.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `22 non-evidence changed files is reviewable but not small; 22 AgentLoop evidence file(s) also present (44 total).`
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

## Evidence Map

- Evidence map: `44` changed file(s); `22` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `16` dirty non-evidence file(s); current non-evidence changed files: `22` (net `+6`).

## Task Risk Notes

- Pre-existing dirty non-evidence files before task creation: 16 total; examples: `DECISIONS.md`, `README.md`, `docs/check-gates.md`, `docs/cli-reference.md`, `docs/task-contracts.md`. Confirm they belong to this task before implementation.

## Changed Files

- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/task-contracts.md`
- M `package.json`
- M `server.json`
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
- AgentLoop evidence: `22` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
CHANGELOG.md                    |  8 ++++
 DECISIONS.md                    |  8 ++++
 FINAL_HANDOFF.md                | 48 +++++++++++++---------
 README.md                       |  6 +++
 ROADMAP.md                      | 11 ++---
 docs/check-gates.md             |  5 +++
 docs/cli-reference.md           | 10 +++++
 docs/npm-publishing.md          | 10 ++---
 docs/release-status.md          | 72 +++++++++++++++-----------------
 docs/task-contracts.md          |  4 ++
 package.json                    |  6 ++-
 server.json                     |  4 +-
 src/cli/commands/check-gates.ts | 91 ++++++++++++++++++++++++++++++++++++++++-
 src/cli/commands/create-task.ts | 81 +++++++++++++++++++++++++++++++++++-
 src/core/task-contract.ts       |  3 +-
 tsup.config.ts                  |  1 +
 16 files changed, 293 insertions(+), 75 deletions(-)
docs/integrations/baseframe-suite-v1.md | untracked
src/core/baseframe.ts | untracked
src/index.ts | untracked
test/fixtures/baseframe/agentflight-result.json | untracked
test/fixtures/baseframe/projscan-assessment.json | untracked
tests/baseframe.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.44.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `45 changed file(s) detected (22 non-evidence, 23 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
