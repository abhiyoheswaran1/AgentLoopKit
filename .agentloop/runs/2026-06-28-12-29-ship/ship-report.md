# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-28-12-29`
- Review readiness score: `96`/100
- Task: `Release AgentLoopKit 0.46.0` (`in-progress`) - `.agentloop/tasks/2026-06-28-release-agentloopkit-0-46-0.md`
- Verification: `pass` - `.agentloop/reports/2026-06-28-12-08-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-28-12-29-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `25 non-evidence changed files is reviewable but not small; 26 AgentLoop evidence file(s) also present (51 total).`
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

- Evidence map: `51` changed file(s); `25` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `21` dirty non-evidence file(s); current non-evidence changed files: `25` (net `+4`).

## Task Risk Notes

- Public channel publishing can lag after workflows; record gaps honestly and rerun proof before claiming availability.
- Pre-existing dirty non-evidence files before task creation: 21 total; examples: `.agentloop/README.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

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
- M `docs/getting-started.md`
- M `docs/loop-contracts.md`
- M `package.json`
- M `server.json`
- M `src/cli/commands/loop.ts`
- M `src/core/loop-contract.ts`
- M `src/core/upgrade-harness.ts`
- M `src/index.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/loop-contract.test.ts`
- ?? `.agentloop/loops/2026-06-28-10-21-dogfood-guarded-loop-runner/loop.json`
- ?? `src/core/loop-runner.ts`
- AgentLoop evidence: `26` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                             |   2 +-
 .agentloop/harness/autonomous-dogfooding.md      |  16 +-
 .agentloop/harness/commands.md                   |   2 +-
 AGENTLOOP.md                                     |   2 +-
 AGENTS.md                                        |   2 +-
 CHANGELOG.md                                     |   5 +
 FINAL_HANDOFF.md                                 |  51 +++---
 README.md                                        |  35 +++-
 ROADMAP.md                                       |  11 +-
 docs/cli-reference.md                            |  11 +-
 docs/getting-started.md                          |   2 +-
 docs/loop-contracts.md                           |  39 ++++-
 package.json                                     |   2 +-
 server.json                                      |   4 +-
 src/cli/commands/loop.ts                         |  34 ++++
 src/core/loop-contract.ts                        | 201 ++++++++++++++++++++-
 src/core/upgrade-harness.ts                      |   4 +-
 src/index.ts                                     |   7 +
 src/templates/harness/commands.md                |   2 +-
 src/templates/root/AGENTLOOP.md                  |   2 +-
 src/templates/root/AGENTS.md                     |   2 +-
 src/templates/root/agentloop-directory-readme.md |   2 +
 tests/loop-contract.test.ts                      | 213 +++++++++++++++++++++++
 23 files changed, 596 insertions(+), 55 deletions(-)
.agentloop/loops/2026-06-28-10-21-dogfood-guarded-loop-runner/loop.json | untracked
src/core/loop-runner.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Release AgentLoopKit 0.46.0`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `52 changed file(s) detected (25 non-evidence, 27 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
