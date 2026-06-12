# PR Summary

- Generated: 2026-06-12-04-12
- Task context: `Add active task done shortcut`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `scripts/smoke-cli.mjs`
- M `src/cli/commands/task.ts`
- M `src/core/completions.ts`
- M `src/core/status.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`
- M `tests/completion.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/reports/2026-06-12-04-04-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-11-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-active-task-done-shortcut.md`

## Change Areas
### Source
- M `src/cli/commands/task.ts`
- M `src/core/completions.ts`
- M `src/core/status.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `src/templates/tasks/README.md`

### Tests
- M `tests/completion.test.ts`
- M `tests/next.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/reports/2026-06-12-04-04-verification-report.md`
- ?? `.agentloop/runs/2026-06-12-04-11-verify/`
- ?? `.agentloop/tasks/2026-06-12-add-active-task-done-shortcut.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/getting-started.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

### CI / Automation
- M `scripts/smoke-cli.mjs`

## Diff Stats
```text
.agentloop/backlog.md                            |  3 +-
 .agentloop/harness/commands.md                   |  1 +
 AGENTLOOP.md                                     |  2 +-
 AGENTS.md                                        |  1 +
 CHANGELOG.md                                     |  1 +
 FINAL_HANDOFF.md                                 |  1 +
 README.md                                        |  1 +
 docs/cli-reference.md                            |  6 ++-
 docs/getting-started.md                          |  2 +
 docs/status.md                                   |  6 ++-
 docs/task-contracts.md                           |  2 +
 scripts/smoke-cli.mjs                            |  9 ++++
 src/cli/commands/task.ts                         | 49 ++++++++++++++++++++-
 src/core/completions.ts                          |  3 +-
 src/core/status.ts                               |  2 +-
 src/templates/agents/claude-code.md              |  1 +
 src/templates/agents/codex.md                    |  1 +
 src/templates/agents/cursor.md                   |  1 +
 src/templates/agents/gemini-cli.md               |  1 +
 src/templates/agents/generic.md                  |  1 +
 src/templates/agents/github-copilot-cli.md       |  1 +
 src/templates/agents/opencode.md                 |  1 +
 src/templates/harness/commands.md                |  1 +
 src/templates/root/AGENTLOOP.md                  |  2 +-
 src/templates/root/AGENTS.md                     |  1 +
 src/templates/root/agentloop-directory-readme.md |  3 +-
 src/templates/tasks/README.md                    |  2 +
 tests/completion.test.ts                         |  6 ++-
 tests/next.test.ts                               |  2 +-
 tests/status.test.ts                             |  4 +-
 tests/task-state.test.ts                         | 56 ++++++++++++++++++++++++
 31 files changed, 158 insertions(+), 15 deletions(-)
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
