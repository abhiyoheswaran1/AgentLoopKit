# PR Summary

- Generated: 2026-06-15-00-04
- Task context: `Harden OSS roadmap release proof and public docs`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/README.md`
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/distribution-channels.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
- M `package.json`
- M `scripts/smoke-packed-release.mjs`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-23-55-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-00-01-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-23-52-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-23-55-ship-report.md`
- ?? `.agentloop/reports/2026-06-14-23-58-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-00-01-ship-report.md`
- ?? `.agentloop/research/interview-cycle-111.md`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-14-harden-oss-roadmap-release-proof-and-public-docs.md`
- ?? `docs/release-proof.md`
- ?? `docs/superpowers/plans/2026-06-14-oss-roadmap-hardening.md`
- ?? `src/cli/commands/release-proof.ts`
- ?? `src/core/release-proof.ts`
- ?? `tests/public-docs-hygiene.test.ts`
- ?? `tests/release-proof.test.ts`

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- ?? `src/cli/commands/release-proof.ts`
- ?? `src/core/release-proof.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/package-scripts.test.ts`
- M `tests/release-smoke.test.ts`
- ?? `tests/public-docs-hygiene.test.ts`
- ?? `tests/release-proof.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/handoffs/2026-06-14-23-55-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-15-00-01-pr-summary.md`
- ?? `.agentloop/reports/2026-06-14-23-52-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-23-55-ship-report.md`
- ?? `.agentloop/reports/2026-06-14-23-58-verification-report.md`
- ?? `.agentloop/reports/2026-06-15-00-01-ship-report.md`
- ?? `.agentloop/research/interview-cycle-111.md`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/score.json`
- ?? `.agentloop/runs/2026-06-14-23-55-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-14-23-55-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/diffstat.txt`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/metadata.json`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/pr-summary.md`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/score.json`
- ?? `.agentloop/runs/2026-06-15-00-01-ship/ship-report.md`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-15-00-01-verify/verification-report.md`
- ?? `.agentloop/tasks/archive/2026-06-14-harden-oss-roadmap-release-proof-and-public-docs.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/distribution-channels.md`
- M `docs/launch-checklist.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
- ?? `docs/release-proof.md`
- ?? `docs/superpowers/plans/2026-06-14-oss-roadmap-hardening.md`

### CI / Automation
- M `scripts/smoke-packed-release.mjs`

### Config / Package
- M `package.json`

## Diff Stats
```text
.agentloop/README.md                             |  1 +
 .agentloop/backlog.md                            |  3 ++
 .agentloop/dogfood-log.md                        | 60 ++++++++++++++++++++++++
 .agentloop/harness/commands.md                   |  3 ++
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  1 +
 CHANGELOG.md                                     |  3 ++
 DECISIONS.md                                     |  8 ++++
 README.md                                        |  5 +-
 docs/cli-reference.md                            | 13 ++++-
 docs/distribution-channels.md                    |  3 ++
 docs/launch-checklist.md                         |  1 +
 docs/npm-publishing.md                           |  2 +
 docs/release-checklist-example.md                |  3 ++
 package.json                                     |  2 +-
 scripts/smoke-packed-release.mjs                 | 20 +++++++-
 src/cli/index.ts                                 |  2 +
 src/core/completions.ts                          |  1 +
 src/templates/harness/commands.md                |  3 ++
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  1 +
 src/templates/root/agentloop-directory-readme.md | 12 ++++-
 tests/cli-docs-drift.test.ts                     |  1 +
 tests/package-scripts.test.ts                    |  2 +
 tests/release-smoke.test.ts                      |  2 +-
 25 files changed, 147 insertions(+), 9 deletions(-)
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
