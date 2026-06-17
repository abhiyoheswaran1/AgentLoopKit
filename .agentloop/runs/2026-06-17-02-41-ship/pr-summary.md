# PR Summary

- Generated: 2026-06-17-02-41
- Task context: `Guard README against release incident chatter`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

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
- AgentLoop evidence: `1525` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
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
- ?? `src/core/agentloop-evidence.ts`

### Tests
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

### AgentLoop
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `AGENTLOOP.md`

### Documentation
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

### CI / Automation
- M `scripts/dogfood-start.mjs`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-cli.mjs`
- M `scripts/smoke-packed-release.mjs`

### Other
- M `.agentflight/config.json`
- ?? `.projscanrc.json`

### AgentLoop Evidence
- AgentLoop evidence: `1525` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
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
 scripts/smoke-packed-release.mjs                   |  46 ++
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
 tests/public-docs-hygiene.test.ts                  |  70 ++
 tests/readiness-score.test.ts                      |  47 ++
 tests/release-smoke.test.ts                        |  45 +-
 tests/review-context.test.ts                       |  87 ++-
 tests/runs.test.ts                                 |  58 ++
 tests/ship.test.ts                                 |  30 +
 tests/status.test.ts                               | 250 +++++++
 tests/task-state.test.ts                           | 804 ++++++++++++++++++++-
 67 files changed, 4671 insertions(+), 314 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review uncategorized files for ownership and scope.

## Verification Performed
- Overall status: pass

## Verification Not Performed
- Check the verification report for skipped commands.

## Risks
- Re-check protected files such as migrations, secrets, auth, billing, deployment, and public APIs before merge.

## Rollback Notes
- Revert the changed files or revert the merge commit if this lands as a PR.

## Reviewer Checklist
- [ ] Acceptance criteria match the task contract.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk areas have been reviewed.
- [ ] Rollback plan is clear.

## Follow-Ups
- Capture any deferred work in ROADMAP.md or a new task contract.
