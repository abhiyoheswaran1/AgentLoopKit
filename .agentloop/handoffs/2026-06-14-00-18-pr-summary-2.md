# PR Summary

- Generated: 2026-06-14-00-18
- Task context: `Improve adoption polish and release workflow`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `CHANGELOG.md`
- M `README.md`
- M `docs/claude-code.md`
- M `docs/cli-reference.md`
- M `docs/codex.md`
- M `docs/cursor.md`
- M `docs/gemini-cli.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/opencode.md`
- M `docs/template-migrations.md`
- M `examples/dependency-upgrade/README.md`
- M `package.json`
- M `src/cli/commands/upgrade-harness.ts`
- M `src/core/doctor.ts`
- M `src/core/upgrade-harness.ts`
- M `tests/doctor.test.ts`
- M `tests/examples.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `.agentloop/handoffs/2026-06-14-00-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-23-42-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-00-13-verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-improve-adoption-polish-and-release-workflow.md`
- ?? `docs/upgrading-existing-repos.md`
- ?? `examples/bugfix-pr/README.md`
- ?? `tests/package-scripts.test.ts`

## Change Areas
### Source
- M `src/cli/commands/upgrade-harness.ts`
- M `src/core/doctor.ts`
- M `src/core/upgrade-harness.ts`

### Tests
- M `tests/doctor.test.ts`
- M `tests/examples.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `tests/package-scripts.test.ts`

### AgentLoop
- ?? `.agentloop/handoffs/2026-06-14-00-18-pr-summary.md`
- ?? `.agentloop/reports/2026-06-13-23-42-verification-report.md`
- ?? `.agentloop/reports/2026-06-14-00-13-verification-report.md`
- ?? `.agentloop/tasks/2026-06-13-improve-adoption-polish-and-release-workflow.md`

### Documentation
- M `CHANGELOG.md`
- M `README.md`
- M `docs/claude-code.md`
- M `docs/cli-reference.md`
- M `docs/codex.md`
- M `docs/cursor.md`
- M `docs/gemini-cli.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/opencode.md`
- M `docs/template-migrations.md`
- M `examples/dependency-upgrade/README.md`
- ?? `docs/upgrading-existing-repos.md`
- ?? `examples/bugfix-pr/README.md`

### Config / Package
- M `package.json`

## Diff Stats
```text
CHANGELOG.md                          |  7 ++-
 README.md                             | 10 +++-
 docs/claude-code.md                   |  6 +++
 docs/cli-reference.md                 | 13 +++++
 docs/codex.md                         |  6 +++
 docs/cursor.md                        |  6 +++
 docs/gemini-cli.md                    |  6 +++
 docs/getting-started.md               |  4 +-
 docs/mcp.md                           | 92 +++++++++++++++++++++++++++++++++--
 docs/opencode.md                      |  6 +++
 docs/template-migrations.md           |  3 +-
 examples/dependency-upgrade/README.md | 33 +++++++++++++
 package.json                          |  6 ++-
 src/cli/commands/upgrade-harness.ts   | 58 +++++++++++++++++-----
 src/core/doctor.ts                    | 22 +++++++++
 src/core/upgrade-harness.ts           | 61 +++++++++++++++++++++++
 tests/doctor.test.ts                  | 34 +++++++++++++
 tests/examples.test.ts                | 38 +++++++++++++++
 tests/upgrade-harness.test.ts         | 46 ++++++++++++++++--
 19 files changed, 431 insertions(+), 26 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
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
