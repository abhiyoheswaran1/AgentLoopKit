# PR Summary

- Generated: 2026-06-21-03-35
- Task context: `Show task risk notes in ship reports`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/tasks/README.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`
- M `scripts/maintenance-check.mjs`
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
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
- M `src/templates/tasks/README.md`
- M `tests/agent-installation.test.ts`
- M `tests/artifacts.test.ts`
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`
- ?? `.agentloop/research/interview-cycle-159.md`
- ?? `.agentloop/research/interview-cycle-160.md`
- ?? `.agentloop/research/interview-cycle-161.md`
- ?? `.agentloop/research/interview-cycle-162.md`
- ?? `.agentloop/research/interview-cycle-163.md`
- ?? `.agentloop/research/interview-cycle-164.md`
- ?? `.agentloop/research/interview-cycle-165.md`
- ?? `src/core/markdown-sections.ts`
- AgentLoop evidence: `185` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/create-task.ts`
- M `src/cli/commands/task.ts`
- M `src/core/artifacts.ts`
- M `src/core/git.ts`
- M `src/core/html-report.ts`
- M `src/core/pr-summary.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/ship.ts`
- M `src/core/status.ts`
- M `src/core/task-contract.ts`
- M `src/core/task-state.ts`
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
- M `src/templates/tasks/README.md`
- ?? `src/core/markdown-sections.ts`

### Tests
- M `tests/agent-installation.test.ts`
- M `tests/artifacts.test.ts`
- M `tests/create-task.test.ts`
- M `tests/html-report.test.ts`
- M `tests/init.test.ts`
- M `tests/maintenance-check-script.test.ts`
- M `tests/next.test.ts`
- M `tests/pr-summary.test.ts`
- M `tests/ship.test.ts`
- M `tests/status.test.ts`
- M `tests/task-state.test.ts`

### AgentLoop
- M `.agentloop/backlog.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/tasks/README.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- ?? `.agentloop/research/interview-cycle-153.md`
- ?? `.agentloop/research/interview-cycle-154.md`
- ?? `.agentloop/research/interview-cycle-155.md`
- ?? `.agentloop/research/interview-cycle-156.md`
- ?? `.agentloop/research/interview-cycle-157.md`
- ?? `.agentloop/research/interview-cycle-158.md`
- ?? `.agentloop/research/interview-cycle-159.md`
- ?? `.agentloop/research/interview-cycle-160.md`
- ?? `.agentloop/research/interview-cycle-161.md`
- ?? `.agentloop/research/interview-cycle-162.md`
- ?? `.agentloop/research/interview-cycle-163.md`
- ?? `.agentloop/research/interview-cycle-164.md`
- ?? `.agentloop/research/interview-cycle-165.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `README.md`
- M `docs/cli-reference.md`
- M `docs/html-reports.md`
- M `docs/maintenance-guards.md`
- M `docs/pr-summaries.md`
- M `docs/status.md`
- M `docs/task-contracts.md`

### CI / Automation
- M `scripts/maintenance-check.mjs`

### AgentLoop Evidence
- AgentLoop evidence: `185` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/backlog.md                      |  63 ++++++
 .agentloop/harness/commands.md             |   2 +-
 .agentloop/tasks/README.md                 |   6 +-
 AGENTLOOP.md                               |   2 +-
 AGENTS.md                                  |   2 +-
 CHANGELOG.md                               |  14 +-
 DECISIONS.md                               |  78 +++++++
 README.md                                  |   6 +-
 docs/cli-reference.md                      |  15 +-
 docs/html-reports.md                       |   2 +
 docs/maintenance-guards.md                 |   6 +-
 docs/pr-summaries.md                       |   2 +
 docs/status.md                             |   4 +
 docs/task-contracts.md                     |   4 +
 scripts/maintenance-check.mjs              |   8 +-
 src/cli/commands/create-task.ts            | 123 ++++++++++-
 src/cli/commands/task.ts                   |  30 ++-
 src/core/artifacts.ts                      |   3 +-
 src/core/git.ts                            |  19 ++
 src/core/html-report.ts                    |   4 +-
 src/core/pr-summary.ts                     |  10 +-
 src/core/prepare-pr.ts                     |  25 +--
 src/core/ship.ts                           |  19 +-
 src/core/status.ts                         |  18 +-
 src/core/task-contract.ts                  |  80 ++++++-
 src/core/task-state.ts                     |  83 ++------
 src/templates/agents/claude-code.md        |   2 +-
 src/templates/agents/codex.md              |   2 +-
 src/templates/agents/cursor.md             |   2 +-
 src/templates/agents/gemini-cli.md         |   2 +-
 src/templates/agents/generic.md            |   2 +-
 src/templates/agents/github-copilot-cli.md |   2 +-
 src/templates/agents/opencode.md           |   2 +-
 src/templates/harness/commands.md          |   1 +
 src/templates/root/AGENTLOOP.md            |   2 +-
 src/templates/root/AGENTS.md               |   2 +-
 src/templates/tasks/README.md              |   2 +
 tests/agent-installation.test.ts           |   4 +
 tests/artifacts.test.ts                    |   4 +-
 tests/create-task.test.ts                  | 330 +++++++++++++++++++++++++++++
 tests/html-report.test.ts                  |  28 +++
 tests/init.test.ts                         |  27 +++
 tests/maintenance-check-script.test.ts     |  34 +--
 tests/next.test.ts                         |   1 +
 tests/pr-summary.test.ts                   |  38 ++++
 tests/ship.test.ts                         |  76 +++++++
 tests/status.test.ts                       |   2 +
 tests/task-state.test.ts                   |  47 +++-
 48 files changed, 1079 insertions(+), 161 deletions(-)
.agentloop/research/interview-cycle-153.md | untracked
.agentloop/research/interview-cycle-154.md | untracked
.agentloop/research/interview-cycle-155.md | untracked
.agentloop/research/interview-cycle-156.md | untracked
.agentloop/research/interview-cycle-157.md | untracked
.agentloop/research/interview-cycle-158.md | untracked
.agentloop/research/interview-cycle-159.md | untracked
.agentloop/research/interview-cycle-160.md | untracked
.agentloop/research/interview-cycle-161.md | untracked
.agentloop/research/interview-cycle-162.md | untracked
.agentloop/research/interview-cycle-163.md | untracked
.agentloop/research/interview-cycle-164.md | untracked
.agentloop/research/interview-cycle-165.md | untracked
src/core/markdown-sections.ts | untracked
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
