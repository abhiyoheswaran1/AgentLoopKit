# Make AgentLoop Start a sharper repo preflight

- Created date: 2026-06-23
- Task type: feature
- Status: done

## Problem Statement
AgentLoop Start exists, but the next product step is to make it feel like the clear hero workflow: shorter, more decisive, goal-aware, and obviously connected to Context, Guard, Ship, docs, and demos.

## Desired Outcome
Improve the existing agentloop start workflow so it gives a sharper repo-native preflight with explicit statuses, concise routing, impact metrics, source handles, docs, README visuals, tests, and verification evidence without introducing release or publishing behavior.

## Constraints
- Keep Start local-first, deterministic, read-only, and transparent.
- Do not add provider proxying, hidden prompt rewriting, telemetry, dependencies, release behavior, version bumps, tags, or publishing.
- Use transparent context estimates only; do not make billing-token claims.
- Preserve the lower-level Context Contract and source-handle retrieval model.

## Non-Goals
- No release, version bump, changelog entry, tag, npm publish, GitHub Release, GHCR publish, MCP Registry publish, or Marketplace work.
- No new product category or proxy/compression layer.
- No external telemetry, analytics collection, or real user-research claims.

## Assumptions
- Existing context, guard, evidence-map, review-context, ship, and MCP primitives can be reused.
- The existing dirty Start implementation is intentional unreleased work and should be preserved.

## Likely Files or Areas
- AGENTLOOP.md
- AGENTS.md
- DECISIONS.md
- src/core/agent-start.ts
- src/cli/commands/start.ts
- src/cli/index.ts
- src/core/completions.ts
- src/core/mcp-tools.ts
- src/mcp/server.ts
- src/templates/agents/
- src/templates/root/
- tests/agent-start.test.ts
- tests/mcp-tools.test.ts
- tests/mcp-server.test.ts
- tests/cli-docs-drift.test.ts
- README.md
- docs/context.md
- docs/cli-reference.md
- docs/getting-started.md
- docs/mcp.md
- docs/assets/readme/
- docs/superpowers/specs/
- docs/superpowers/plans/

## Files or Areas Not to Touch
- package.json version fields
- CHANGELOG.md
- changelog.md
- release workflows
- publishing scripts
- registry metadata
- environment files or secrets
- unrelated deferred release-channel tasks

## Acceptance Criteria
- agentloop start renders decisive goal-aware status states and next safe commands.
- Start output remains compact while surfacing task, evidence, risk, proof, context avoided, source handles, and do-not-broad-scan guidance.
- JSON and MCP expose the same stable preflight model.
- README, docs, templates, and demo evidence center Start as the hero workflow.
- Bug, security, performance, docs, and full verification passes are complete.

## Verification Commands
- npm run typecheck
- npm test
- npm run check:public-docs
- npm run dogfood

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Existing dirty changes from the previous verified Start implementation are present; keep new edits tightly scoped and preserve prior evidence rather than reverting it.
- Pre-existing dirty non-evidence files before task creation: 32 total; examples: `AGENTLOOP.md`, `AGENTS.md`, `DECISIONS.md`, `README.md`, `docs/assets/readme/README.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert the Start polish changes, docs/demo updates, tests, and evidence from this task. The lower-level context pack and previous Start command should remain usable.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
