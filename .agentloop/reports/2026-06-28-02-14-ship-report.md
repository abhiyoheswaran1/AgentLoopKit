# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-28-02-14`
- Review readiness score: `92`/100
- Task: `Add Loop Contract and readiness gates` (`in-progress`) - `.agentloop/tasks/2026-06-27-add-loop-contract-and-readiness-gates.md`
- Verification: `pass` - `.agentloop/reports/2026-06-28-01-56-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-28-02-14-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `38 non-evidence changed files is broad for one review; 27 AgentLoop evidence file(s) also present (65 total). Non-evidence review areas: Source 16, Documentation 10, AgentLoop 5, Tests 5, Config / Package 1, Other 1.`
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

- Large non-evidence change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Evidence Map

- Evidence map: `65` changed file(s); `38` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.


## Task Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/maintenance-guards.md`
- M `package.json`
- M `server.json`
- M `src/cli/commands/context.ts`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/context-contract.ts`
- M `src/core/redaction.ts`
- M `src/core/upgrade-harness.ts`
- M `src/index.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/loop-contracts.md`
- ?? `src/cli/commands/loop.ts`
- ?? `src/cli/commands/ready.ts`
- ?? `src/core/loop-contract.ts`
- ?? `src/core/ready.ts`
- ?? `src/core/token-receipt.ts`
- ?? `tests/loop-contract.test.ts`
- ?? `tests/ready.test.ts`
- AgentLoop evidence: `27` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                             |  6 ++-
 .agentloop/harness/autonomous-dogfooding.md      | 14 ++++++
 .agentloop/harness/commands.md                   |  2 +
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  2 +
 CHANGELOG.md                                     |  8 ++++
 FINAL_HANDOFF.md                                 | 31 +++++++++-----
 README.md                                        | 11 ++++-
 ROADMAP.md                                       | 10 ++---
 docs/cli-reference.md                            | 33 ++++++++++++++-
 docs/context.md                                  |  5 +++
 docs/getting-started.md                          | 10 ++++-
 docs/launch-checklist.md                         |  2 +-
 docs/maintenance-guards.md                       |  2 +
 package.json                                     |  4 +-
 server.json                                      |  4 +-
 src/cli/commands/context.ts                      |  8 +++-
 src/cli/index.ts                                 |  4 ++
 src/core/completions.ts                          |  2 +
 src/core/context-contract.ts                     | 54 +++++++++++++++++-------
 src/core/redaction.ts                            |  2 +
 src/core/upgrade-harness.ts                      | 11 +++++
 src/index.ts                                     | 34 +++++++++++++++
 src/templates/harness/commands.md                |  2 +
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  2 +
 src/templates/root/agentloop-directory-readme.md |  4 +-
 tests/cli-docs-drift.test.ts                     |  2 +
 tests/context-contract.test.ts                   | 44 +++++++++++++++++++
 tests/upgrade-harness.test.ts                    | 10 +++++
 30 files changed, 281 insertions(+), 46 deletions(-)
docs/loop-contracts.md | untracked
src/cli/commands/loop.ts | untracked
src/cli/commands/ready.ts | untracked
src/core/loop-contract.ts | untracked
src/core/ready.ts | untracked
src/core/token-receipt.ts | untracked
tests/loop-contract.test.ts | untracked
tests/ready.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Add Loop Contract and readiness gates`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `66 changed file(s) detected (38 non-evidence, 28 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
