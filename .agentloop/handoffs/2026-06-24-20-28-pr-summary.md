# PR Summary

- Generated: 2026-06-24-20-28
- Task context: `Hydrate bounded MCP run summaries consistently`
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
- M `src/cli/commands/runs.ts`
- M `src/core/agent-start.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/runs.ts`
- M `src/core/upgrade-harness.ts`
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
- M `tests/init.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/runs.test.ts`
- M `tests/upgrade-harness.test.ts`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`
- ?? `src/core/agent-readiness.ts`
- ?? `src/core/run-artifacts.ts`
- ?? `src/core/run-types.ts`
- AgentLoop evidence: `116` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/commands/context.ts`
- M `src/cli/commands/doctor.ts`
- M `src/cli/commands/runs.ts`
- M `src/core/agent-start.ts`
- M `src/core/context-contract.ts`
- M `src/core/doctor.ts`
- M `src/core/evidence-map.ts`
- M `src/core/mcp-tools.ts`
- M `src/core/runs.ts`
- M `src/core/upgrade-harness.ts`
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

### Tests
- M `tests/agent-start.test.ts`
- M `tests/context-contract.test.ts`
- M `tests/doctor.test.ts`
- M `tests/init.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/runs.test.ts`
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
- AgentLoop evidence: `116` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
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
 README.md                                          |  27 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1364155 -> 1832001 bytes
 .../readme/agentloopkit-context-contract.tape      |   5 +
 docs/cli-reference.md                              |  20 +-
 docs/context.md                                    |  27 +-
 docs/getting-started.md                            |   2 +-
 docs/mcp.md                                        |  16 +-
 docs/release-status.md                             |   4 +-
 docs/research.md                                   |  27 +-
 docs/template-migrations.md                        |   7 +-
 docs/upgrading-existing-repos.md                   |   7 +-
 src/cli/commands/context.ts                        |  21 ++
 src/cli/commands/doctor.ts                         |  66 ++++
 src/cli/commands/runs.ts                           |   9 +-
 src/core/agent-start.ts                            |  97 ++++-
 src/core/context-contract.ts                       | 188 ++++++++--
 src/core/doctor.ts                                 |  51 ++-
 src/core/evidence-map.ts                           |  42 ++-
 src/core/mcp-tools.ts                              | 105 ++++--
 src/core/runs.ts                                   | 259 +++++++++----
 src/core/upgrade-harness.ts                        |  10 +-
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
 tests/agent-start.test.ts                          |  15 +
 tests/context-contract.test.ts                     | 259 ++++++++++++-
 tests/doctor.test.ts                               | 267 ++++++++++++++
 tests/init.test.ts                                 |  27 ++
 tests/mcp-server.test.ts                           |   1 +
 tests/mcp-tools.test.ts                            | 183 +++++++++-
 tests/runs.test.ts                                 | 402 ++++++++++++++++++++-
 tests/upgrade-harness.test.ts                      |  77 +++-
 54 files changed, 2126 insertions(+), 204 deletions(-)
docs/start-usefulness-demo.md | untracked
docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md | untracked
docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md | untracked
src/core/agent-readiness.ts | untracked
src/core/run-artifacts.ts | untracked
src/core/run-types.ts | untracked
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
