# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-28-10-49`
- Review readiness score: `96`/100
- Task: `Add guarded loop runner` (`in-progress`) - `.agentloop/tasks/2026-06-28-add-guarded-loop-runner.md`
- Verification: `pass` - `.agentloop/reports/2026-06-28-10-24-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-28-10-49-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `21 non-evidence changed files is reviewable but not small; 6 AgentLoop evidence file(s) also present (27 total).`
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

- Evidence map: `27` changed file(s); `21` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.


## Task Risk Notes

- Running external commands from a CLI is high risk unless config is explicit, parsed without shell expansion, and protected commands are blocked.

## Changed Files

- M `.agentloop/README.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/loop-contracts.md`
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
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/README.md                             |   2 +-
 .agentloop/harness/autonomous-dogfooding.md      |  16 +-
 .agentloop/harness/commands.md                   |   2 +-
 AGENTLOOP.md                                     |   2 +-
 AGENTS.md                                        |   2 +-
 CHANGELOG.md                                     |   3 +-
 README.md                                        |  35 +++-
 docs/cli-reference.md                            |  11 +-
 docs/getting-started.md                          |   2 +-
 docs/loop-contracts.md                           |  39 ++++-
 src/cli/commands/loop.ts                         |  34 ++++
 src/core/loop-contract.ts                        | 201 ++++++++++++++++++++-
 src/core/upgrade-harness.ts                      |   4 +-
 src/index.ts                                     |   7 +
 src/templates/harness/commands.md                |   2 +-
 src/templates/root/AGENTLOOP.md                  |   2 +-
 src/templates/root/AGENTS.md                     |   2 +-
 src/templates/root/agentloop-directory-readme.md |   2 +
 tests/loop-contract.test.ts                      | 213 +++++++++++++++++++++++
 19 files changed, 556 insertions(+), 25 deletions(-)
.agentloop/loops/2026-06-28-10-21-dogfood-guarded-loop-runner/loop.json | untracked
src/core/loop-runner.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Add guarded loop runner`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `28 changed file(s) detected (21 non-evidence, 7 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
