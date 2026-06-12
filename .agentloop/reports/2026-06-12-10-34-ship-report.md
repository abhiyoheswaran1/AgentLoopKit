# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-10-34`
- Review readiness score: `92`/100
- Task: `Redact acceptance-layer git roots` (`in-progress`) - `.agentloop/tasks/2026-06-12-redact-acceptance-layer-git-roots.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-10-29-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-10-34-pr-summary.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `19 changed files is reviewable but not small.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Reviewer handoff exists.

## Warnings

- Medium-sized change set; check scope carefully.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/release-status.md`
- M `src/cli/commands/prepare-pr.ts`
- M `src/cli/commands/ship.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/ship.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-10-34-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-10-29-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-10-34-ship-report.md`
- ?? `.agentloop/runs/2026-06-12-10-33-verify/`
- ?? `.agentloop/runs/2026-06-12-10-34-ship/`
- ?? `.agentloop/tasks/2026-06-12-redact-acceptance-layer-git-roots.md`

## Diff Stat

```text
.agentloop/backlog.md          |  2 +-
 CHANGELOG.md                   |  1 +
 FINAL_HANDOFF.md               |  6 ++++--
 README.md                      |  2 +-
 ROADMAP.md                     |  2 +-
 docs/cli-reference.md          |  3 +++
 docs/release-status.md         |  1 +
 src/cli/commands/prepare-pr.ts |  2 ++
 src/cli/commands/ship.ts       |  2 ++
 src/core/prepare-pr.ts         |  3 +++
 src/core/ship.ts               |  2 ++
 tests/prepare-pr.test.ts       | 20 +++++++++++++++++++-
 tests/ship.test.ts             | 38 +++++++++++++++++++++++++++++++++++++-
 13 files changed, 77 insertions(+), 7 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Redact acceptance-layer git roots`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`warn`] `Task hygiene`: ``Task folder has 1 hygiene diagnostic. Run `agentloop task doctor` for cleanup details.``
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `19 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
