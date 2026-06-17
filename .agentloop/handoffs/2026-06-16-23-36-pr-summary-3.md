# PR Summary

- Generated: 2026-06-16-23-36
- Task context: `Compact AgentLoop evidence in prepare-pr`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `AGENTLOOP.md`
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/getting-started.md`
- M `docs/maintenance-guards.md`
- M `docs/policies.md`
- M `docs/status.md`
- M `docs/upgrading-existing-repos.md`
- M `scripts/dogfood-start.mjs`
- M `scripts/dogfood.mjs`
- M `scripts/maintenance-check.mjs`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/commands/artifacts.ts`
- M `src/cli/commands/init.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/evidence.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/policy-packs.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/handoff.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/policy-packs.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/release-smoke.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
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
- AgentLoop evidence: `706` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/artifacts.ts`
- M `src/cli/commands/init.ts`
- M `src/cli/commands/next.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/change-areas.ts`
- M `src/core/check-gates.ts`
- M `src/core/evidence.ts`
- M `src/core/handoff-coverage.ts`
- M `src/core/maintainer-check.ts`
- M `src/core/policy-packs.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/status.ts`
- M `src/core/task-state.ts`
- M `src/templates/root/AGENTLOOP.md`
- ?? `src/core/agentloop-evidence.ts`

### Tests
- M `tests/artifacts.test.ts`
- M `tests/autonomous-dogfood.test.ts`
- M `tests/check-gates.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/dogfood-start-script.test.ts`
- M `tests/handoff.test.ts`
- M `tests/init.test.ts`
- M `tests/maintainer-check.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/policy-packs.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/release-smoke.test.ts`
- M `tests/review-context.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/harness/autonomous-dogfooding.md`
- M `AGENTLOOP.md`

### Documentation
- M `README.md`
- M `docs/check-gates.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/getting-started.md`
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
- M `scripts/smoke-packed-release.mjs`

### AgentLoop Evidence
- AgentLoop evidence: `706` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/harness/autonomous-dogfooding.md        |   2 +
 ...026-06-16-prevent-stale-agentloop-task-state.md |  78 ---
 ...2026-06-16-publish-github-marketplace-action.md |   2 +-
 AGENTLOOP.md                                       |   2 +
 README.md                                          |   6 +-
 docs/check-gates.md                                |   1 +
 docs/cli-reference.md                              |  22 +-
 docs/configuration.md                              |   2 +
 docs/getting-started.md                            |   2 +-
 docs/maintenance-guards.md                         |   6 +-
 docs/policies.md                                   |   2 +
 docs/status.md                                     |  17 +-
 docs/upgrading-existing-repos.md                   |  15 +
 scripts/dogfood-start.mjs                          |  89 ++-
 scripts/dogfood.mjs                                |   8 +-
 scripts/maintenance-check.mjs                      |   6 +-
 scripts/smoke-packed-release.mjs                   |   4 +
 src/cli/commands/artifacts.ts                      |   5 +
 src/cli/commands/init.ts                           |   2 +
 src/cli/commands/next.ts                           |  26 +-
 src/cli/commands/task.ts                           |  50 +-
 src/core/artifacts.ts                              |  84 ++-
 src/core/change-areas.ts                           |  46 ++
 src/core/check-gates.ts                            |  46 +-
 src/core/evidence.ts                               |   9 +-
 src/core/handoff-coverage.ts                       |  24 +
 src/core/maintainer-check.ts                       |  42 +-
 src/core/policy-packs.ts                           |  29 +-
 src/core/pr-summary.ts                             |  14 +-
 src/core/prepare-pr.ts                             |   4 +-
 src/core/review-context.ts                         |  17 +-
 src/core/status.ts                                 | 106 ++-
 src/core/task-state.ts                             | 309 ++++++++-
 src/templates/root/AGENTLOOP.md                    |   2 +
 tests/artifacts.test.ts                            | 283 ++++++++
 tests/autonomous-dogfood.test.ts                   |  65 +-
 tests/check-gates.test.ts                          |  99 ++-
 tests/dogfood-script.test.ts                       |  10 +-
 tests/dogfood-start-script.test.ts                 | 124 +++-
 tests/handoff.test.ts                              | 113 +++-
 tests/init.test.ts                                 |  41 ++
 tests/maintainer-check.test.ts                     | 149 ++++-
 tests/maintenance-check-script.test.ts             |   6 +-
 tests/next.test.ts                                 | 181 ++++++
 tests/policy-packs.test.ts                         |  50 +-
 tests/pr-summary.test.ts                           |   7 +-
 tests/prepare-pr.test.ts                           |  30 +-
 tests/release-smoke.test.ts                        |  45 +-
 tests/review-context.test.ts                       |  31 +
 tests/status.test.ts                               | 192 ++++++
 tests/task-state.test.ts                           | 715 +++++++++++++++++++++
 51 files changed, 3007 insertions(+), 213 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.

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
