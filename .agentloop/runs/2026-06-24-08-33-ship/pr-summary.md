# PR Summary

- Generated: 2026-06-24-08-33
- Task context: `Release AgentLoopKit 0.41.0`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `AGENTLOOP.md`
- M `AGENTS.md`
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/policy-examples.md`
- M `docs/release-status.md`
- M `package.json`
- M `server.json`
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- ?? `docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md`
- ?? `docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md`
- ?? `docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md`
- ?? `docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md`
- ?? `src/cli/commands/start.ts`
- ?? `src/core/agent-start.ts`
- ?? `tests/agent-start.test.ts`
- AgentLoop evidence: `69` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Change Areas
### Source
- M `src/cli/index.ts`
- M `src/core/completions.ts`
- M `src/core/mcp-tools.ts`
- M `src/mcp/server.ts`
- M `src/templates/agents/claude-code.md`
- M `src/templates/agents/codex.md`
- M `src/templates/agents/cursor.md`
- M `src/templates/agents/gemini-cli.md`
- M `src/templates/agents/generic.md`
- M `src/templates/agents/github-copilot-cli.md`
- M `src/templates/agents/opencode.md`
- M `src/templates/root/AGENTLOOP.md`
- M `src/templates/root/AGENTS.md`
- ?? `src/cli/commands/start.ts`
- ?? `src/core/agent-start.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- ?? `tests/agent-start.test.ts`

### AgentLoop
- M `AGENTLOOP.md`
- M `AGENTS.md`

### Documentation
- M `CHANGELOG.md`
- M `DECISIONS.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/policy-examples.md`
- M `docs/release-status.md`
- ?? `docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md`
- ?? `docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md`
- ?? `docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md`
- ?? `docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

### AgentLoop Evidence
- AgentLoop evidence: `69` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
AGENTLOOP.md                                       |   2 +-
 AGENTS.md                                          |   1 +
 CHANGELOG.md                                       |   9 +++
 DECISIONS.md                                       |  16 +++++
 FINAL_HANDOFF.md                                   |  46 +++++++++------
 README.md                                          |  47 +++++++--------
 ROADMAP.md                                         |  11 ++--
 docs/assets/readme/README.md                       |   2 +-
 .../readme/agentloopkit-context-contract.gif       | Bin 1466571 -> 1364155 bytes
 .../readme/agentloopkit-context-contract.tape      |  12 +---
 docs/cli-reference.md                              |  14 +++++
 docs/context.md                                    |  59 +++++++++++--------
 docs/getting-started.md                            |   4 +-
 docs/launch-checklist.md                           |   4 +-
 docs/mcp.md                                        |   3 +-
 docs/npm-publishing.md                             |  10 ++--
 docs/policy-examples.md                            |   2 +-
 docs/release-status.md                             |  65 ++++++++++-----------
 package.json                                       |   2 +-
 server.json                                        |   4 +-
 src/cli/index.ts                                   |   2 +
 src/core/completions.ts                            |   1 +
 src/core/mcp-tools.ts                              |  44 ++++++++++++++
 src/mcp/server.ts                                  |   2 +-
 src/templates/agents/claude-code.md                |   2 +-
 src/templates/agents/codex.md                      |   2 +-
 src/templates/agents/cursor.md                     |   2 +-
 src/templates/agents/gemini-cli.md                 |   2 +-
 src/templates/agents/generic.md                    |   2 +-
 src/templates/agents/github-copilot-cli.md         |   2 +-
 src/templates/agents/opencode.md                   |   2 +-
 src/templates/root/AGENTLOOP.md                    |   2 +-
 src/templates/root/AGENTS.md                       |   1 +
 tests/cli-docs-drift.test.ts                       |   1 +
 tests/mcp-server.test.ts                           |  14 ++++-
 tests/mcp-tools.test.ts                            |  31 ++++++++++
 36 files changed, 288 insertions(+), 137 deletions(-)
docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md | untracked
docs/superpowers/plans/2026-06-23-agentloop-start-preflight-polish.md | untracked
docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md | untracked
docs/superpowers/specs/2026-06-23-agentloop-start-preflight-polish-design.md | untracked
src/cli/commands/start.ts | untracked
src/core/agent-start.ts | untracked
tests/agent-start.test.ts | untracked
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
