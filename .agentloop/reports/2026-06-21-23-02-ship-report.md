# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-21-23-02`
- Review readiness score: `92`/100
- Task: `Fix doctor monorepo subpackage detection` (`in-progress`) - `.agentloop/tasks/2026-06-21-fix-doctor-monorepo-subpackage-detection.md`
- Verification: `pass` - `.agentloop/reports/2026-06-21-22-58-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-21-23-02-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `35 non-evidence changed files is broad for one review; 38 AgentLoop evidence file(s) also present (73 total). Non-evidence review areas: Source 15, Documentation 10, Tests 10.`
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

- Evidence map: `73` changed file(s); `35` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Inherited Dirty Work

- Task started with `32` dirty non-evidence file(s); current non-evidence changed files: `35` (net `+3`).

## Task Risk Notes

- Nested package detection touches doctor output and may affect onboarding guidance for non-monorepos.
- Pre-existing dirty non-evidence files before task creation: 32 total; examples: `DECISIONS.md`, `README.md`, `ROADMAP.md`, `docs/cli-reference.md`, `src/cli/index.ts`. Confirm they belong to this task before implementation.

## Changed Files

- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `src/cli/index.ts`
- M `src/core/agentloop-evidence.ts`
- M `src/core/artifact-paths.ts`
- M `src/core/completions.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/project-detection.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `tests/cli-docs-drift.test.ts`
- M `tests/doctor.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/project-detection.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- ?? `docs/evidence-map.md`
- ?? `docs/guard.md`
- ?? `docs/superpowers/plans/2026-06-21-agentloop-guard.md`
- ?? `docs/superpowers/plans/2026-06-21-evidence-map.md`
- ?? `docs/superpowers/specs/2026-06-21-agentloop-guard-design.md`
- ?? `docs/superpowers/specs/2026-06-21-evidence-map-design.md`
- ?? `src/cli/commands/explain-diff.ts`
- ?? `src/cli/commands/guard.ts`
- ?? `src/cli/commands/resume-pack.ts`
- ?? `src/core/context-budget.ts`
- ?? `src/core/evidence-map.ts`
- ?? `src/core/guard.ts`
- ?? `src/core/resume-pack.ts`
- ?? `tests/cli-explain-diff.test.ts`
- ?? `tests/evidence-map.test.ts`
- ?? `tests/guard.test.ts`
- ?? `tests/resume-pack.test.ts`
- AgentLoop evidence: `38` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
DECISIONS.md                    | 16 +++++++++
 README.md                       | 12 +++++--
 ROADMAP.md                      |  3 ++
 docs/cli-reference.md           | 56 +++++++++++++++++++++++++++--
 src/cli/index.ts                |  6 ++++
 src/core/agentloop-evidence.ts  |  1 +
 src/core/artifact-paths.ts      |  2 ++
 src/core/completions.ts         |  1 +
 src/core/prepare-pr.ts          | 24 ++++++++++++-
 src/core/project-detection.ts   | 79 ++++++++++++++++++++++++++++++++++++++++-
 src/core/review-context.ts      | 28 ++++++++++++++-
 src/core/ship.ts                | 32 +++++++++++++++--
 tests/cli-docs-drift.test.ts    |  1 +
 tests/doctor.test.ts            | 28 +++++++++++++++
 tests/prepare-pr.test.ts        | 11 ++++++
 tests/project-detection.test.ts | 36 +++++++++++++++++++
 tests/review-context.test.ts    | 57 +++++++++++++++++++++++++++++
 tests/ship.test.ts              | 67 +++++++++++++++++++++++++++++++++-
 18 files changed, 449 insertions(+), 11 deletions(-)
docs/evidence-map.md | untracked
docs/guard.md | untracked
docs/superpowers/plans/2026-06-21-agentloop-guard.md | untracked
docs/superpowers/plans/2026-06-21-evidence-map.md | untracked
docs/superpowers/specs/2026-06-21-agentloop-guard-design.md | untracked
docs/superpowers/specs/2026-06-21-evidence-map-design.md | untracked
src/cli/commands/explain-diff.ts | untracked
src/cli/commands/guard.ts | untracked
src/cli/commands/resume-pack.ts | untracked
src/core/context-budget.ts | untracked
src/core/evidence-map.ts | untracked
src/core/guard.ts | untracked
src/core/resume-pack.ts | untracked
tests/cli-explain-diff.test.ts | untracked
tests/evidence-map.test.ts | untracked
tests/guard.test.ts | untracked
tests/resume-pack.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Fix doctor monorepo subpackage detection`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `74 changed file(s) detected (35 non-evidence, 39 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
