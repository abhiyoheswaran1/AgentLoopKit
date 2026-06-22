# AgentLoopKit Ship Report

Make agent-assisted work reviewable, verifiable, and merge-ready.

- Generated: `2026-06-21-21-37`
- Review readiness score: `96`/100
- Task: `Build explainable agent work evidence map` (`in-progress`) - `.agentloop/tasks/2026-06-21-build-explainable-agent-work-evidence-map.md`
- Verification: `pass` - `.agentloop/reports/2026-06-21-21-14-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-21-21-37-pr-summary.md`
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

- Broad CLI feature may touch shared review/readiness surfaces; keep phases small and preserve existing JSON contracts.
- Evidence correlation can overclaim if phrased poorly; human copy must say covered by local evidence, not proven correct.
- Path redaction and file-content boundaries are security-sensitive; reuse existing redaction and path helpers.

## Changed Files

- M `DECISIONS.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `src/cli/index.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- M `tests/ship.test.ts`
- ?? `docs/evidence-map.md`
- ?? `docs/superpowers/plans/2026-06-21-evidence-map.md`
- ?? `docs/superpowers/specs/2026-06-21-evidence-map-design.md`
- ?? `src/cli/commands/explain-diff.ts`
- ?? `src/cli/commands/resume-pack.ts`
- ?? `src/core/evidence-map.ts`
- ?? `src/core/resume-pack.ts`
- ?? `tests/cli-explain-diff.test.ts`
- ?? `tests/evidence-map.test.ts`
- ?? `tests/resume-pack.test.ts`
- AgentLoop evidence: `6` file(s) grouped under `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
DECISIONS.md                 |  8 ++++++
 README.md                    | 11 ++++++--
 ROADMAP.md                   |  2 ++
 docs/cli-reference.md        | 30 ++++++++++++++++++--
 src/cli/index.ts             |  4 +++
 src/core/prepare-pr.ts       | 24 +++++++++++++++-
 src/core/review-context.ts   | 14 ++++++++-
 src/core/ship.ts             | 32 +++++++++++++++++++--
 tests/prepare-pr.test.ts     | 11 ++++++++
 tests/review-context.test.ts | 39 ++++++++++++++++++++++++++
 tests/ship.test.ts           | 67 +++++++++++++++++++++++++++++++++++++++++++-
 11 files changed, 233 insertions(+), 9 deletions(-)
docs/evidence-map.md | untracked
docs/superpowers/plans/2026-06-21-evidence-map.md | untracked
docs/superpowers/specs/2026-06-21-evidence-map-design.md | untracked
src/cli/commands/explain-diff.ts | untracked
src/cli/commands/resume-pack.ts | untracked
src/core/evidence-map.ts | untracked
src/core/resume-pack.ts | untracked
tests/cli-explain-diff.test.ts | untracked
tests/evidence-map.test.ts | untracked
tests/resume-pack.test.ts | untracked
```

## Gate Summary

- [`pass`] `Task contract`: `Build explainable agent work evidence map`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `28 changed file(s) detected (21 non-evidence, 7 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
