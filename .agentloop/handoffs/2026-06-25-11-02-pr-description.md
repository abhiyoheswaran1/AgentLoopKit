# Release AgentLoopKit 0.43.0

## Summary

AgentLoopKit 0.43.0 is versioned, verified, committed, tagged, pushed, published through usual channels, and backed by release proof.

## Changed Files

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
- M `CHANGELOG.md`
- M `FINAL_HANDOFF.md`
- M `README.md`
- M `ROADMAP.md`
- M `docs/assets/readme/agentloopkit-context-contract.gif`
- M `docs/assets/readme/agentloopkit-context-contract.tape`
- M `docs/cli-reference.md`
- M `docs/context.md`
- M `docs/getting-started.md`
- M `docs/launch-checklist.md`
- M `docs/mcp.md`
- M `docs/npm-publishing.md`
- M `docs/release-status.md`
- M `docs/research.md`
- M `docs/template-migrations.md`
- M `docs/upgrading-existing-repos.md`
- ?? `docs/start-usefulness-demo.md`
- ?? `docs/superpowers/plans/2026-06-24-agent-readiness-matrix.md`
- ?? `docs/superpowers/plans/2026-06-24-agentloop-start-usefulness-proof.md`

### Config / Package
- M `package.json`

### Other
- M `server.json`

### AgentLoop Evidence
- AgentLoop evidence: `328` file(s) grouped under `.agentloop/handoffs/`, `.agentloop/reports/`, `.agentloop/runs/`, `.agentloop/tasks/`, `.agentloop/tasks/archive/`.
- Full paths remain in JSON output and run-ledger evidence.

## Review Readiness

- Score: 92/100
- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.
- Ship report: `.agentloop/reports/2026-06-25-11-02-ship-report.md`

## Evidence Map

- Evidence map: `411` changed file(s); `83` covered, `0` unexplained; verification `fresh`; `0` risk-sensitive.

## Acceptance Criteria

- Version and changelog reflect 0.43.0.
- Public docs hygiene, links, tests, typecheck, lint, build, dogfood, ship, prepare-pr, and release checks pass.
- Main and v0.43.0 tag are pushed.
- npm, GitHub Release, GHCR, GitHub Marketplace, and MCP release proof are checked or documented with exact status.

## Verification Evidence

- Overall status: pass (`.agentloop/reports/2026-06-25-10-36-verification-report.md`)

## Reviewer Checklist

- [ ] Acceptance criteria match the implementation.
- [ ] Verification evidence is adequate for the change.
- [ ] Risk-sensitive files have been reviewed.
- [ ] Rollback notes are clear.

## Risks

- Release work publishes public artifacts; verify package contents and registry state before claims.
- GitHub Marketplace publication may still require owner-side approval; report exact proof status.

## Rollback Notes

If a channel fails after tag push, prefer a patch release for code defects; for a bad package publish, deprecate/yank only with maintainer approval.

## Verification Report Not Run

- No skipped commands were recorded.
