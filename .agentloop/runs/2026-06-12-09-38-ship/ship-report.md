# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-12-09-38`
- Review readiness score: `92`/100
- Task: `Refresh README launch copy and demo assets` (`in-progress`) - `.agentloop/tasks/2026-06-12-refresh-readme-launch-copy-and-demo-assets.md`
- Verification: `pass` - `.agentloop/reports/2026-06-12-09-34-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-12-09-38-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `33 changed files is broad for one review.`
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

- Large change set; consider splitting before review.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- D `.agentloop/tasks/2026-06-12-sanitize-run-ledger-display-paths.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-cli.gif`
- M `docs/assets/readme/agentloopkit-cli.tape`
- M `docs/assets/readme/agentloopkit-showcase.png`
- M `docs/assets/readme/showcase.html`
- M `docs/release-status.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/commands/summarize.ts`
- M `src/cli/commands/verify.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `tests/ci-summary.test.ts`
- M `tests/handoff.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/runs.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/verification.test.ts`
- ?? `.agentloop/handoffs/2026-06-12-09-02-pr-summary.md`
- ?? `.agentloop/reports/2026-06-12-08-58-verification-report.md`
- ?? `.agentloop/reports/2026-06-12-09-02-ship-report.md`
- ?? `.agentloop/reports/2026-06-12-09-34-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-09-01-verify/`
- ?? `.agentloop/runs/2026-06-12-09-02-ship/`
- ?? `.agentloop/runs/2026-06-12-09-38-verify/`
- ?? `.agentloop/tasks/2026-06-12-refresh-readme-launch-copy-and-demo-assets.md`
- ?? `.agentloop/tasks/archive/2026-06-12-sanitize-run-ledger-display-paths.md`

## Diff Stat

```text
.agentloop/backlog.md                              |   2 +
 ...2026-06-12-sanitize-run-ledger-display-paths.md |  54 ---------------------
 CHANGELOG.md                                       |   4 +-
 FINAL_HANDOFF.md                                   |   6 ++-
 README.md                                          |   4 +-
 ROADMAP.md                                         |   2 +-
 docs/assets/readme/README.md                       |   2 +-
 docs/assets/readme/agentloopkit-cli.gif            | Bin 2696884 -> 1471375 bytes
 docs/assets/readme/agentloopkit-cli.tape           |  42 +++++++---------
 docs/assets/readme/agentloopkit-showcase.png       | Bin 532219 -> 527918 bytes
 docs/assets/readme/showcase.html                   |  41 +++++++++-------
 docs/release-status.md                             |   7 ++-
 scripts/smoke-cli.mjs                              |  26 +++++++---
 src/cli/commands/summarize.ts                      |  26 ++++++++--
 src/cli/commands/verify.ts                         |  21 ++++++--
 src/core/prepare-pr.ts                             |  18 ++++---
 src/core/ship.ts                                   |  15 +++++-
 tests/ci-summary.test.ts                           |   3 +-
 tests/handoff.test.ts                              |  24 +++++----
 tests/prepare-pr.test.ts                           |   4 +-
 tests/runs.test.ts                                 |   3 +-
 tests/ship.test.ts                                 |  15 ++++--
 tests/status.test.ts                               |   3 +-
 tests/verification.test.ts                         |  25 ++++++----
 24 files changed, 192 insertions(+), 155 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Refresh README launch copy and demo assets`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `34 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
