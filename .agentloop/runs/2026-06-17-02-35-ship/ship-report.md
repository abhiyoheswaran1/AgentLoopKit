# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-17-02-35`
- Review readiness score: `92`/100
- Task: `Guard README against release runbook drift` (`in-progress`) - `.agentloop/tasks/2026-06-17-guard-readme-against-release-runbook-drift.md`
- Verification: `pass` - `.agentloop/reports/2026-06-17-02-33-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-17-02-35-pr-summary.md`
- Gates: `pass`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `45`/100 (weight `15`) - `82 non-evidence changed files is broad for one review; 1495 AgentLoop evidence file(s) also present (1577 total).`
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

## Changed Files

- M `.agentflight/config.json`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `AGENTLOOP.md`
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/getting-started.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/policies.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- M `scripts/dogfood-start.mjs`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-cli.mjs`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/artifacts.ts`
- M `src/cli/commands/init.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/review-context.ts`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/evidence.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/html-report.ts`
- M `src/core/init.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/policy-packs.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/readiness-score.ts`
- M `src/core/review-context.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/distribution-artifacts.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/handoff.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/policy-packs.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/public-docs-hygiene.test.ts`
- M `tests/readiness-score.test.ts`
- M `tests/release-smoke.test.ts`
- M `tests/review-context.test.ts`
- M `tests/runs.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.projscanrc.json`
- ?? `docs/superpowers/plans/2026-06-16-agentflight-placeholder-roadmap-counts.md`
- ?? `docs/superpowers/plans/2026-06-16-artifact-inventory-agentflight-placeholders.md`
- ?? `docs/superpowers/plans/2026-06-16-artifact-latest-agentflight-placeholder-filter.md`
- ?? `docs/superpowers/plans/2026-06-16-artifacts-redact-paths-flag.md`
- ?? `docs/superpowers/plans/2026-06-16-decouple-maintenance-check-release-proof.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-concise-evidence-steps.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-concise-hygiene-steps.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-concise-review-context.md`
- ?? `docs/superpowers/plans/2026-06-16-dogfood-placeholder-task-clutter.md`
- ?? `docs/superpowers/plans/2026-06-16-handoff-evidence-churn-grouping.md`
- ?? `docs/superpowers/plans/2026-06-16-ignore-active-agentflight-placeholder-tasks.md`
- ?? `docs/superpowers/plans/2026-06-16-maintainer-check-evidence-churn.md`
- ?? `docs/superpowers/plans/2026-06-16-redaction-guidance-smoke-coverage.md`
- ?? `docs/superpowers/plans/2026-06-16-review-context-agentflight-placeholders.md`
- ?? `docs/superpowers/plans/2026-06-16-task-list-agentflight-placeholder-grouping.md`
- ?? `src/core/agentloop-evidence.ts`
- AgentLoop evidence: `1495` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stat

```text
.agentflight/config.json                           |   6 +-
 .agentloop/dogfood-log.md                          |  15 +-
 .agentloop/harness/autonomous-dogfooding.md        |  12 +-
 ...026-06-16-prevent-stale-agentloop-task-state.md |  78 --
 ...2026-06-16-publish-github-marketplace-action.md |   2 +-
 AGENTLOOP.md                                       |   2 +
 README.md                                          |   8 +-
 docs/check-gates.md                                |   2 +
 docs/cli-reference.md                              |  38 +-
 docs/configuration.md                              |   2 +
 docs/getting-started.md                            |   4 +-
 docs/html-reports.md                               |   2 +
 docs/maintenance-guards.md                         |   8 +-
 docs/policies.md                                   |   2 +
 docs/status.md                                     |  20 +-
 docs/upgrading-existing-repos.md                   |  15 +
 scripts/dogfood-start.mjs                          |  88 ++-
 scripts/dogfood.mjs                                |   8 +-
 scripts/maintenance-check.mjs                      |   6 +-
 scripts/smoke-cli.mjs                              | 271 ++++++-
 scripts/smoke-packed-release.mjs                   |  34 +
 src/cli/commands/artifacts.ts                      |  32 +-
 src/cli/commands/init.ts                           |   5 +
 src/cli/commands/next.ts                           |  42 +-
 src/cli/commands/review-context.ts                 |  28 +-
 src/cli/commands/runs.ts                           |  46 +-
 src/cli/commands/task.ts                           |  62 +-
 src/core/artifacts.ts                              | 152 +++-
 src/core/change-areas.ts                           |  46 ++
 src/core/check-gates.ts                            |  83 ++-
 src/core/evidence.ts                               |   9 +-
 src/core/handoff-coverage.ts                       |  24 +
 src/core/html-report.ts                            |  46 +-
 src/core/init.ts                                   |  20 +-
 src/core/maintainer-check.ts                       |  42 +-
 src/core/policy-packs.ts                           |  29 +-
 src/core/pr-summary.ts                             |  14 +-
 src/core/prepare-pr.ts                             |   4 +-
 src/core/readiness-score.ts                        |  41 +-
 src/core/review-context.ts                         |  71 +-
 src/core/ship.ts                                   |   9 +-
 src/core/status.ts                                 | 133 +++-
 src/core/task-state.ts                             | 312 +++++++-
 src/templates/root/AGENTLOOP.md                    |   2 +
 tests/artifacts.test.ts                            | 365 ++++++++++
 tests/autonomous-dogfood.test.ts                   | 154 +++-
 tests/check-gates.test.ts                          | 155 +++-
 tests/distribution-artifacts.test.ts               | 134 ++++
 tests/dogfood-script.test.ts                       |  10 +-
 tests/dogfood-start-script.test.ts                 | 143 +++-
 tests/handoff.test.ts                              | 113 ++-
 tests/html-report.test.ts                          |  30 +
 tests/init.test.ts                                 |  92 +++
 tests/maintainer-check.test.ts                     | 149 +++-
 tests/maintenance-check-script.test.ts             |  44 +-
 tests/next.test.ts                                 | 231 ++++++
 tests/policy-packs.test.ts                         |  50 +-
 tests/pr-summary.test.ts                           |   7 +-
 tests/prepare-pr.test.ts                           |  30 +-
 tests/public-docs-hygiene.test.ts                  |  35 +
 tests/readiness-score.test.ts                      |  47 ++
 tests/release-smoke.test.ts                        |  45 +-
 tests/review-context.test.ts                       |  87 ++-
 tests/runs.test.ts                                 |  58 ++
 tests/ship.test.ts                                 |  30 +
 tests/status.test.ts                               | 250 +++++++
 tests/task-state.test.ts                           | 804 ++++++++++++++++++++-
 67 files changed, 4624 insertions(+), 314 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Guard README against release runbook drift`
- [`pass`] `Verification report`: `Overall status: pass`
- [`pass`] `Handoff summary`: `Reviewer handoff found.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `1578 changed file(s) detected (82 non-evidence, 1496 AgentLoop evidence).`
- [`pass`] `Git target`: `Current directory is the Git root.`
