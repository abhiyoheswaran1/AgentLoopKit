# PR Summary

- Generated: 2026-06-23-09-58
- Task context: `Release AgentLoopKit 0.40.0`
- Verification status: Overall status: pass

## Summary
This summary was generated deterministically from git status, the latest task contract, and the latest verification report.

## Changed Files
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/cli-reference.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
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
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `.agentloop/research/interview-cycle-196.md`
- ?? `docs/assets/readme/agentloopkit-context-contract.gif`
- ?? `docs/assets/readme/agentloopkit-context-contract.tape`
- ?? `docs/context.md`
- ?? `docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md`
- ?? `src/cli/commands/context.ts`
- ?? `src/core/context-contract.ts`
- ?? `tests/context-contract.test.ts`
- AgentLoop evidence: `63` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
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
- ?? `src/cli/commands/context.ts`
- ?? `src/core/context-contract.ts`

### Tests
- M `tests/cli-docs-drift.test.ts`
- M `tests/mcp-server.test.ts`
- M `tests/mcp-tools.test.ts`
- M `tests/package-scripts.test.ts`
- ?? `tests/context-contract.test.ts`

### AgentLoop
- ?? `.agentloop/research/interview-cycle-196.md`

### Documentation
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/README.md`
- M `docs/cli-reference.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-checklist-example.md`
- M `docs/release-status.md`
- ?? `docs/assets/readme/agentloopkit-context-contract.gif`
- ?? `docs/assets/readme/agentloopkit-context-contract.tape`
- ?? `docs/context.md`
- ?? `docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

### AgentLoop Evidence
- AgentLoop evidence: `63` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Diff Stats
```text
CHANGELOG.md                               |  9 +++
 FINAL_HANDOFF.md                           | 64 +++++++++++--------
 README.md                                  | 48 ++++++++++++---
 ROADMAP.md                                 | 11 ++--
 docs/assets/readme/README.md               |  5 +-
 docs/cli-reference.md                      | 32 +++++++++-
 docs/launch-checklist.md                   |  4 +-
 docs/mcp.md                                |  6 +-
 docs/npm-publishing.md                     | 12 ++--
 docs/release-checklist-example.md          |  3 +-
 docs/release-status.md                     | 72 +++++++++++-----------
 package.json                               |  4 +-
 server.json                                |  4 +-
 src/cli/index.ts                           |  2 +
 src/core/completions.ts                    |  1 +
 src/core/mcp-tools.ts                      | 98 ++++++++++++++++++++++++++++++
 src/mcp/server.ts                          |  2 +-
 src/templates/agents/claude-code.md        |  1 +
 src/templates/agents/codex.md              |  1 +
 src/templates/agents/cursor.md             |  1 +
 src/templates/agents/gemini-cli.md         |  1 +
 src/templates/agents/generic.md            |  1 +
 src/templates/agents/github-copilot-cli.md |  1 +
 src/templates/agents/opencode.md           |  1 +
 tests/cli-docs-drift.test.ts               |  1 +
 tests/mcp-server.test.ts                   | 38 ++++++++++++
 tests/mcp-tools.test.ts                    |  3 +
 tests/package-scripts.test.ts              |  5 +-
 28 files changed, 337 insertions(+), 94 deletions(-)
.agentloop/research/interview-cycle-196.md | untracked
docs/assets/readme/agentloopkit-context-contract.gif | untracked
docs/assets/readme/agentloopkit-context-contract.tape | untracked
docs/context.md | untracked
docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md | untracked
src/cli/commands/context.ts | untracked
src/core/context-contract.ts | untracked
tests/context-contract.test.ts | untracked
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
