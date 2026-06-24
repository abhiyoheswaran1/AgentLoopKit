# Build AgentLoop Start context router and impact ledger

- Created date: 2026-06-23
- Task type: feature
- Status: done

## Problem Statement
Software agents can already read static repo guidance and AgentLoopKit can already build context packs, but the product still lacks one canonical start command that tells an agent what to read first, what to avoid reading broadly, what evidence is stale or risky, and how much context pressure the compact path avoids. Users need a repo-native operating layer that turns current task, diff, verification, guard, and context-budget evidence into a trusted starting briefing before agents touch code.

## Desired Outcome
Add an `agentloop start` workflow that acts as the default entry point for software agents. The command should produce a compact human briefing and structured JSON with read-first source handles, route reasons, stale/risk warnings, proof gaps, context avoided, next command guidance, and source-expansion commands. The implementation should reuse existing Context Contract primitives where possible, update MCP/agent guidance/docs, and include tests plus dogfood evidence.

## Constraints
- Keep the workflow local-first and deterministic.
- Do not intercept provider traffic, rewrite prompts, call LLMs, read secrets, upload artifacts, publish packages, tag releases, or mutate repo state from read-only start/context commands.
- Use transparent heuristic context estimates only; do not make billing-token claims.
- Preserve source-truth retrieval through local handles and commands.
- Follow existing CLI output, JSON, MCP, template, and test patterns.

## Non-Goals
- No release, version bump, tag, npm publish, GitHub Release, GHCR publish, MCP Registry publish, or Marketplace action work.
- No proxy/wrapper mode.
- No external user-research collection or telemetry.
- No broad file-content scans for start output.
- No dependency additions unless implementation proves they are necessary.

## Assumptions
- Existing `agentloop context` primitives can provide most task, evidence-map, verification, source-handle, and context-budget data.
- `agentloop start` can be a thin orchestration layer over existing core modules rather than a separate workflow engine.
- Generated agent guidance should route agents to `agentloop start` before broad repo reads.
- Impact metrics should be explainable as local heuristics and evidence signals, not guarantees of correctness or savings.

## Likely Files or Areas
- `src/core/context-contract.ts`
- `src/cli/commands/context.ts`
- `src/cli/commands/start.ts`
- `src/cli/index.ts`
- `src/core/agent-start.ts`
- `src/core/completions.ts`
- `src/core/mcp-tools.ts`
- `src/mcp/server.ts`
- `src/mcp/*`
- `src/templates/agents/`
- `src/templates/root/`
- `src/templates/*`
- `AGENTS.md`
- `AGENTLOOP.md`
- `tests/context-contract.test.ts`
- `tests/agent-start.test.ts`
- `tests/mcp-server.test.ts`
- `tests/mcp-tools.test.ts`
- `tests/cli-docs-drift.test.ts`
- `docs/context.md`
- `docs/cli-reference.md`
- `docs/getting-started.md`
- `docs/mcp.md`
- `docs/superpowers/specs/`
- `docs/superpowers/plans/`
- `README.md`
- `DECISIONS.md`

## Files or Areas Not to Touch
- `package.json` version fields, release metadata, release workflows, publishing scripts, npm credentials, registry metadata, and Marketplace release assets unless a test-only reference needs updating.
- Environment files or secret-bearing config.
- Unrelated deferred release-channel task contracts.

## Acceptance Criteria
- agentloop start gives software agents a compact repo briefing with read-first handles, risk, stale evidence, context savings, next command, and JSON output
- context routing recommends what to read next by goal without dumping broad file contents
- impact ledger quantifies context avoided, broad files avoided, stale evidence, scope drift, verification freshness, and reviewability delta
- generated agent guidance, MCP tools, README, docs, and tests cover the new start workflow

## Verification Commands
- npm run typecheck
- npm test
- npm run check:public-docs
- npm run dogfood

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect current Context Contract, CLI registration, MCP tools, generated agent guidance, and tests.
- Write a design/implementation plan before production edits.
- Use TDD for new `start` behavior, router behavior, impact ledger metrics, MCP exposure, and docs drift checks.
- Implement in small passes: core model, CLI command, MCP/tooling, templates/docs, then bug/security/performance passes.
- Record architecture/public-behavior decisions in `DECISIONS.md`.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the `agentloop start` command registration, new core routing/impact helpers, MCP tool additions, generated guidance updates, docs updates, and tests from this task. Existing `agentloop context` commands should remain usable as the fallback start workflow.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
