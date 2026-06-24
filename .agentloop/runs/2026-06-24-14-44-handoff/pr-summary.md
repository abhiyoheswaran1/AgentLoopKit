# PR Summary

- Generated: 2026-06-24-14-44
- Task context: `Release AgentLoopKit 0.42.0`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/manifest.json`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- M `package.json`
- M `server.json`
- M `src/core/constants.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/evidence.ts`
- M `src/core/upgrade-harness.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/init.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/superpowers/plans/2026-06-24-agent-guidance-readiness.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md`
- ?? `docs/superpowers/specs/2026-06-24-agent-guidance-readiness-design.md`
- ?? `docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md`
- AgentLoop evidence: `69` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/core/constants.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/evidence.ts`
- M `src/core/upgrade-harness.ts`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`

### Tests
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/init.test.ts`
- M `tests/upgrade-harness.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/manifest.json`
- M `AGENTLOOP.md`
- M `AGENTS.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-guidance-readiness.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md`
- ?? `docs/superpowers/specs/2026-06-24-agent-guidance-readiness-design.md`
- ?? `docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

### AgentLoop Evidence
- AgentLoop evidence: `69` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/README.md                             |   4 +-
 .agentloop/harness/commands.md                   |   2 +
 .agentloop/manifest.json                         |   2 +-
 AGENTLOOP.md                                     |   2 +-
 AGENTS.md                                        |   1 +
 CHANGELOG.md                                     |  10 +++
 DECISIONS.md                                     |  16 ++++
 FINAL_HANDOFF.md                                 |  44 +++++----
 README.md                                        |  11 ++-
 ROADMAP.md                                       |  10 +--
 docs/cli-reference.md                            |  10 ++-
 docs/context.md                                  |   8 +-
 docs/getting-started.md                          |   2 +-
 docs/launch-checklist.md                         |   2 +-
 docs/mcp.md                                      |   4 +-
 docs/npm-publishing.md                           |   8 +-
 docs/release-status.md                           |  66 +++++++-------
 docs/template-migrations.md                      |  17 +++-
 docs/upgrading-existing-repos.md                 |   4 +-
 package.json                                     |   2 +-
 server.json                                      |   4 +-
 src/core/constants.ts                            |   2 +-
 src/core/context-contract.ts                     |  15 +++-
 src/core/doctor.ts                               |   6 +-
 src/core/evidence-map.ts                         |  13 ++-
 src/core/evidence.ts                             |  54 +++++++++++
 src/core/upgrade-harness.ts                      |  25 ++++--
 src/templates/harness/commands.md                |   2 +
 src/templates/root/AGENTLOOP.md                  |   2 +-
 src/templates/root/AGENTS.md                     |   1 +
 src/templates/root/agentloop-directory-readme.md |   4 +-
 tests/agent-start.test.ts                        |  96 ++++++++++++++++++++
 tests/context-contract.test.ts                   | 109 +++++++++++++++++++++++
 tests/doctor.test.ts                             |   8 +-
 tests/init.test.ts                               |   2 +-
 tests/upgrade-harness.test.ts                    |  31 ++++++-
 36 files changed, 493 insertions(+), 106 deletions(-)
docs/superpowers/plans/2026-06-24-agent-guidance-readiness.md | untracked
docs/superpowers/plans/2026-06-24-agentloop-start-truth-consistency.md | untracked
docs/superpowers/specs/2026-06-24-agent-guidance-readiness-design.md | untracked
docs/superpowers/specs/2026-06-24-agentloop-start-truth-consistency-design.md | untracked
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
- Review package and config changes for install, build, and publish impact.
- Review AgentLoop artifacts for accurate task, verification, and handoff evidence.
- Review uncategorized files for ownership and scope.

## Verification Performed
- Overall status: pass

## Verification Report Not Run
- test: `npx pnpm@10.12.1 test`
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

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
