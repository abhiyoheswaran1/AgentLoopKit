# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-20-08-53`
- Review readiness score: `96`/100
- Task: `Make doctor pre-init safe for copy-paste trials` (`done`) - `.agentloop/tasks/archive/2026-06-20-make-doctor-pre-init-safe-for-copy-paste-trials.md`
- Verification: `pass` - `.agentloop/reports/2026-06-20-08-50-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-20-08-53-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `12 non-evidence changed files is reviewable but not small; 18 AgentLoop evidence file(s) also present (30 total).`
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

- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/real-repo-trials.md`
- M `src/cli/commands/doctor.ts`
- M `src/core/doctor.ts`
- M `tests/doctor.test.ts`
- ?? `.agentloop/research/interview-cycle-124.md`
- ?? `docs/superpowers/plans/2026-06-20-doctor-advisory-mode.md`
- ?? `docs/superpowers/specs/2026-06-20-doctor-advisory-mode-design.md`
- AgentLoop evidence: `18` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentloop/backlog.md      |  6 ++++++
 CHANGELOG.md               |  1 +
 DECISIONS.md               |  6 ++++++
 README.md                  | 10 +++++++++-
 docs/cli-reference.md      |  3 +++
 docs/real-repo-trials.md   |  4 +++-
 src/cli/commands/doctor.ts | 37 +++++++++++++++++++++-------------
 src/core/doctor.ts         |  5 +++++
 tests/doctor.test.ts       | 50 ++++++++++++++++++++++++++++++++++++++++++++++
 9 files changed, 106 insertions(+), 16 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make doctor pre-init safe for copy-paste trials`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `31 changed file(s) detected (12 non-evidence, 19 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
