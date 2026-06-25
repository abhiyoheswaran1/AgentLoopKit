# PR Summary

- Generated: 2026-06-24-23-11
- Task context: `Run parallel unreleased-batch bug hunt`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `.agentloop/README.md`
- M `.agentloop/agents/claude-code.md`
- M `.agentloop/agents/codex.md`
- M `.agentloop/agents/cursor.md`
- M `.agentloop/agents/gemini-cli.md`
- M `.agentloop/agents/generic.md`
- M `.agentloop/agents/github-copilot-cli.md`
- M `.agentloop/agents/opencode.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/loops/research.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/release-status.md`
- M `docs/research.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- M `src/cli/commands/context.ts`
- M `src/cli/commands/doctor.ts`
- M `src/cli/commands/guard.ts`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/start.ts`
- M `src/core/agent-start.ts`
- M `src/core/artifacts.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/guard.ts`
- M `src/core/markdown-format.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/runs.ts`
- M `src/core/safety.ts`
- M `src/core/upgrade-harness.ts`
- M `src/core/verification-report-sections.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/loops/research.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/guard.test.ts`
- M `tests/init.test.ts`
- M `tests/markdown-format.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- M `tests/runs.test.ts`
- M `tests/safety.test.ts`
- M `tests/ship.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`
- ?? `src/core/agent-readiness.ts`
- ?? `src/core/run-artifacts.ts`
- ?? `src/core/run-types.ts`
- ?? `src/core/safe-markdown-file.ts`
- AgentLoop evidence: `313` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/context.ts`
- M `src/cli/commands/doctor.ts`
- M `src/cli/commands/guard.ts`
- M `src/cli/commands/runs.ts`
- M `src/cli/commands/start.ts`
- M `src/core/agent-start.ts`
- M `src/core/artifacts.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/guard.ts`
- M `src/core/markdown-format.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/prepare-pr.ts`
- M `src/core/review-context.ts`
- M `src/core/runs.ts`
- M `src/core/safety.ts`
- M `src/core/upgrade-harness.ts`
- M `src/core/verification-report-sections.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/harness/commands.md`
- M `src/templates/loops/research.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `src/templates/root/agentloop-directory-readme.md`
- ?? `src/core/agent-readiness.ts`
- ?? `src/core/run-artifacts.ts`
- ?? `src/core/run-types.ts`
- ?? `src/core/safe-markdown-file.ts`

### Tests
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/guard.test.ts`
- M `tests/init.test.ts`
- M `tests/markdown-format.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/prepare-pr.test.ts`
- M `tests/review-context.test.ts`
- M `tests/runs.test.ts`
- M `tests/safety.test.ts`
- M `tests/ship.test.ts`
- M `tests/upgrade-harness.test.ts`

### AgentLoop
- M `.agentloop/README.md`
- M `.agentloop/agents/claude-code.md`
- M `.agentloop/agents/codex.md`
- M `.agentloop/agents/cursor.md`
- M `.agentloop/agents/gemini-cli.md`
- M `.agentloop/agents/generic.md`
- M `.agentloop/agents/github-copilot-cli.md`
- M `.agentloop/agents/opencode.md`
- M `.agentloop/harness/commands.md`
- M `.agentloop/loops/research.md`
- M `AGENTLOOP.md`
- M `AGENTS.md`

### Documentation
- M `README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/mcp.md`
- M `docs/release-status.md`
- M `docs/research.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`

### AgentLoop Evidence
- AgentLoop evidence: `313` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
.agentloop/README.md                               |   6 +
 .agentloop/agents/claude-code.md                   |   2 +
 .agentloop/agents/codex.md                         |   2 +
 .agentloop/agents/cursor.md                        |   2 +
 .agentloop/agents/gemini-cli.md                    |   2 +
 .agentloop/agents/generic.md                       |   2 +
 .agentloop/agents/github-copilot-cli.md            |   2 +
 .agentloop/agents/opencode.md                      |   2 +
 .agentloop/harness/commands.md                     |   7 +-
 .agentloop/loops/research.md                       |  14 +-
 AGENTLOOP.md                                       |   2 +-
 AGENTS.md                                          |   6 +-
 README.md                                          |  39 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1364155 -> 1832001 bytes
 .../readme/agentloopkit-context-contract.tape      |   5 +
 docs/cli-reference.md                              |  35 +-
 docs/context.md                                    |  33 +-
 docs/getting-started.md                            |   7 +-
 docs/mcp.md                                        |  25 +-
 docs/release-status.md                             |   2 +
 docs/research.md                                   |  27 +-
 docs/template-migrations.md                        |   9 +-
 docs/upgrading-existing-repos.md                   |   7 +-
 src/cli/commands/context.ts                        |  35 +-
 src/cli/commands/doctor.ts                         |  66 +++
 src/cli/commands/guard.ts                          |  30 +-
 src/cli/commands/runs.ts                           | 115 +++-
 src/cli/commands/start.ts                          |   5 +-
 src/core/agent-start.ts                            | 107 +++-
 src/core/artifacts.ts                              |  50 +-
 src/core/context-contract.ts                       | 257 +++++++--
 src/core/doctor.ts                                 |  51 +-
 src/core/evidence-map.ts                           |  98 +++-
 src/core/guard.ts                                  |  47 ++
 src/core/markdown-format.ts                        |  22 +-
 src/core/mcp-tools.ts                              | 213 +++++--
 src/core/prepare-pr.ts                             |   2 +-
 src/core/review-context.ts                         |  28 +-
 src/core/runs.ts                                   | 392 ++++++++++---
 src/core/safety.ts                                 |  15 +-
 src/core/upgrade-harness.ts                        |  10 +-
 src/core/verification-report-sections.ts           |  99 +++-
 src/mcp/server.ts                                  |   2 +-
 src/templates/agents/claude-code.md                |   3 +-
 src/templates/agents/codex.md                      |   3 +-
 src/templates/agents/cursor.md                     |   3 +-
 src/templates/agents/gemini-cli.md                 |   3 +-
 src/templates/agents/generic.md                    |   3 +-
 src/templates/agents/github-copilot-cli.md         |   3 +-
 src/templates/agents/opencode.md                   |   3 +-
 src/templates/harness/commands.md                  |   7 +-
 src/templates/loops/research.md                    |  14 +-
 src/templates/root/AGENTLOOP.md                    |   2 +-
 src/templates/root/AGENTS.md                       |   6 +-
 src/templates/root/agentloop-directory-readme.md   |   8 +-
 tests/agent-start.test.ts                          |  58 +-
 tests/context-contract.test.ts                     | 399 ++++++++++++-
 tests/doctor.test.ts                               | 300 ++++++++++
 tests/guard.test.ts                                | 173 +++++-
 tests/init.test.ts                                 |  27 +
 tests/markdown-format.test.ts                      |  18 +-
 tests/mcp-server.test.ts                           |  83 ++-
 tests/mcp-tools.test.ts                            | 248 ++++++++-
 tests/prepare-pr.test.ts                           |  95 +++-
 tests/review-context.test.ts                       |  79 ++-
 tests/runs.test.ts                                 | 619 ++++++++++++++++++++-
 tests/safety.test.ts                               |  33 ++
 tests/ship.test.ts                                 |   4 +-
 tests/upgrade-harness.test.ts                      |  77 ++-
 69 files changed, 3811 insertions(+), 342 deletions(-)
```

## Behaviour Changed
- Review changed files and task contract to confirm intended behavior.

## Review Focus
- Review source changes for behavior and public API impact.
- Check tests cover the changed behavior.
- Check docs match the implemented command behavior.
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
