# PR Summary

- Generated: 2026-06-13-19-15
- Task context: `Improve upgrade path and docs polish`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `CONTRIBUTING.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/contributor-playbook.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/template-migrations.md`
- M `package.json`
- M `scripts/dogfood.mjs`
- M `scripts/smoke-cli.mjs`
- M `scripts/smoke-packed-release.mjs`
- M `server.json`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-13-18-51-release-notes.md`
- ?? `.agentloop/reports/2026-06-13-18-58-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-19-04-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-19-04-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-19-04-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-improve-upgrade-path-and-docs-polish.md`
- ?? `src/cli/commands/upgrade-harness.ts`
- ?? `src/core/upgrade-harness.ts`
- ?? `tests/upgrade-harness.test.ts`

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- ?? `src/cli/commands/upgrade-harness.ts`
- ?? `src/core/upgrade-harness.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/dogfood-script.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `tests/upgrade-harness.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/handoffs/2026-06-13-18-51-release-notes.md`
- ?? `.agentloop/reports/2026-06-13-18-58-verification-report.md`
- ?? `.agentloop/runs/2026-06-13-19-04-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-13-19-04-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-13-19-04-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-13-improve-upgrade-path-and-docs-polish.md`

### Documentation
- M `CHANGELOG.md`
- M `CONTRIBUTING.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/contributor-playbook.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/template-migrations.md`

### CI / Automation
- M `scripts/dogfood.mjs`
- M `scripts/smoke-cli.mjs`
- M `scripts/smoke-packed-release.mjs`

### Config / Package
- M `package.json`

### Other
- M `server.json`

## Diff Stats
```text
.agentloop/README.md                             | 13 ++++++
 .agentloop/harness/commands.md                   | 14 +++++--
 AGENTLOOP.md                                     |  5 ++-
 AGENTS.md                                        | 16 +++++--
 CHANGELOG.md                                     | 10 ++++-
 CONTRIBUTING.md                                  | 14 +++++++
 FINAL_HANDOFF.md                                 | 39 ++++++++++++++---
 README.md                                        | 49 +++++++++++++++++++---
 ROADMAP.md                                       |  9 ++--
 docs/cli-reference.md                            | 23 ++++++++++
 docs/contributor-playbook.md                     |  1 +
 docs/getting-started.md                          | 53 +++++++++++++++++++++---
 docs/launch-checklist.md                         |  2 +-
 docs/mcp.md                                      | 34 +++++++++++++++
 docs/npm-publishing.md                           |  8 ++--
 docs/release-status.md                           | 49 +++++++++++-----------
 docs/template-migrations.md                      | 42 +++++++++++++++++++
 package.json                                     |  3 +-
 scripts/dogfood.mjs                              |  9 +++-
 scripts/smoke-cli.mjs                            | 13 ++++++
 scripts/smoke-packed-release.mjs                 |  1 +
 server.json                                      |  4 +-
 src/cli/index.ts                                 |  2 +
 src/core/completions.ts                          |  1 +
 src/templates/harness/commands.md                | 16 ++++---
 src/templates/root/AGENTLOOP.md                  |  5 ++-
 src/templates/root/AGENTS.md                     | 18 +++++---
 src/templates/root/agentloop-directory-readme.md | 45 ++++++++++++++++----
 tests/cli-docs-drift.test.ts                     |  1 +
 tests/dogfood-script.test.ts                     | 28 +++++++++----
 tests/release-smoke.test.ts                      |  2 +-
 31 files changed, 433 insertions(+), 96 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review CI or automation changes for permissions and secret handling.
- Review package and config changes for install, build, and publish impact.
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
