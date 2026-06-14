# PR Summary

- Generated: 2026-06-14-09-48
- Task context: `Implement roadmap adoption channels and policy packs`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/designs/vscode-open-vsx-extension.md`
- M `docs/distribution-channels.md`
- M `docs/policies.md`
- M `package.json`
- M `schema/agentloop.config.schema.json`
- M `src/cli/commands/policy.ts`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/config.ts`
- M `src/templates/root/agentloop.config.json`
- M `tests/cli-docs-drift.test.ts`
- M `tests/completion.test.ts`
- M `tests/config.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/schema.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-09-42-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-09-44-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-14-09-44-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-09-45-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-09-47-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-14-09-47-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-09-33-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-09-44-ship-report.md`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-14-implement-roadmap-adoption-channels-and-policy-packs.md`
- ?? `docs/designs/windows-package-managers.md`
- ?? `docs/github-metadata.md`
- ?? `docs/schemastore.md`
- ?? `schema/schemastore/agentloopkit.json`
- ?? `src/cli/commands/github.ts`
- ?? `src/cli/commands/schemastore.ts`
- ?? `src/core/github-metadata.ts`
- ?? `src/core/policy-packs.ts`
- ?? `src/core/schema-url.ts`
- ?? `src/core/schemastore.ts`
- ?? `src/templates/policy-packs/agentloop-baseline/manifest.json`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/database-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/dependency-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/git-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/no-destructive-actions.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/public-api-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/secrets-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/security-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/ui-change-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/manifest.json`
- ?? `src/templates/policy-packs/maintainer-review/policies/maintainer-evidence-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/policies/review-risk-policy.md`
- ?? `tests/github-metadata.test.ts`
- ?? `tests/policy-packs.test.ts`
- ?? `tests/roadmap-channels.test.ts`
- ?? `tests/schemastore.test.ts`

## Change Areas
### Risk-Sensitive
- ?? `src/templates/policy-packs/agentloop-baseline/policies/security-policy.md`

### Source
- M `src/cli/commands/policy.ts`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/config.ts`
- M `src/templates/root/agentloop.config.json`
- ?? `src/cli/commands/github.ts`
- ?? `src/cli/commands/schemastore.ts`
- ?? `src/core/github-metadata.ts`
- ?? `src/core/policy-packs.ts`
- ?? `src/core/schema-url.ts`
- ?? `src/core/schemastore.ts`
- ?? `src/templates/policy-packs/agentloop-baseline/manifest.json`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/database-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/dependency-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/git-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/no-destructive-actions.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/public-api-change-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/secrets-policy.md`
- ?? `src/templates/policy-packs/agentloop-baseline/policies/ui-change-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/manifest.json`
- ?? `src/templates/policy-packs/maintainer-review/policies/maintainer-evidence-policy.md`
- ?? `src/templates/policy-packs/maintainer-review/policies/review-risk-policy.md`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/completion.test.ts`
- M `tests/config.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/schema.test.ts`
- ?? `tests/github-metadata.test.ts`
- ?? `tests/policy-packs.test.ts`
- ?? `tests/roadmap-channels.test.ts`
- ?? `tests/schemastore.test.ts`

### AgentLoop
- M `.agentloop/dogfood-log.md`
- ?? `.agentloop/handoffs/2026-06-14-09-42-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-09-44-pr-description.md`
- ?? `.agentloop/handoffs/2026-06-14-09-44-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-09-45-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-14-09-47-pr-summary-2.md`
- ?? `.agentloop/handoffs/2026-06-14-09-47-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-09-33-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-09-44-ship-report.md`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-42-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-09-44-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-45-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff-2/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-14-09-47-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-14-implement-roadmap-adoption-channels-and-policy-packs.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/configuration.md`
- M `docs/designs/vscode-open-vsx-extension.md`
- M `docs/distribution-channels.md`
- M `docs/policies.md`
- ?? `docs/designs/windows-package-managers.md`
- ?? `docs/github-metadata.md`
- ?? `docs/schemastore.md`

### Config / Package
- M `package.json`
- M `schema/agentloop.config.schema.json`
- ?? `schema/schemastore/agentloopkit.json`

## Diff Stats
```text
.agentloop/dogfood-log.md                 |  39 ++++++++
 CHANGELOG.md                              |   7 +-
 README.md                                 |   6 ++
 ROADMAP.md                                |  12 ++-
 docs/cli-reference.md                     |  38 +++++++-
 docs/configuration.md                     |  22 ++++-
 docs/designs/vscode-open-vsx-extension.md |  15 +++-
 docs/distribution-channels.md             |   8 +-
 docs/policies.md                          |  77 ++++++++++++++--
 package.json                              |   2 +-
 schema/agentloop.config.schema.json       |  31 +++++++
 src/cli/commands/policy.ts                | 142 ++++++++++++++++++++++++++++++
 src/cli/index.ts                          |   4 +
 src/core/completions.ts                   |   4 +
 src/core/config.ts                        |  27 +++++-
 src/templates/root/agentloop.config.json  |   3 +
 tests/cli-docs-drift.test.ts              |   2 +
 tests/completion.test.ts                  |   7 +-
 tests/config.test.ts                      |  29 ++++++
 tests/package-scripts.test.ts             |   3 +
 tests/schema.test.ts                      |   2 +
 21 files changed, 457 insertions(+), 23 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review package and config changes for install, build, and publish impact.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review risk-sensitive paths such as migrations, auth, security, billing, env, deployment, and lockfiles with extra care.

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
