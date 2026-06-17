# Mirror raw AgentFlight recovery in agent instructions

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement
Root AGENTS and harness docs explain how to recover after raw agentflight start creates or pins an AgentFlight placeholder, but bundled per-agent instruction templates omit that recovery line. Agents installed via install-agent can miss the re-pin step during long autonomous sessions.

## Desired Outcome
All bundled per-agent instruction templates include the same raw AgentFlight recovery guidance: after direct agentflight start, run agentloop status --redact-paths and re-pin the detailed task if an AgentFlight placeholder becomes active.

## Constraints
- Do not change AgentFlight behavior or task-state semantics.
- Do not cut a release, bump versions, publish, or alter release-channel task status.
- Keep guidance concise and generic across Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic agents.

## Non-Goals
- Do not change generated root AGENTS or AGENTLOOP behavior beyond template guidance.
- Do not delete or archive existing AgentFlight placeholder task evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/templates/agents/codex.md
- src/templates/agents/claude-code.md
- src/templates/agents/cursor.md
- src/templates/agents/opencode.md
- src/templates/agents/gemini-cli.md
- src/templates/agents/github-copilot-cli.md
- src/templates/agents/generic.md
- tests/autonomous-dogfood.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Each bundled per-agent template mentions agentflight start, agentloop status --redact-paths, agentloop task set <path>, and AgentFlight placeholder recovery.
- Root and harness raw AgentFlight recovery tests continue to pass.
- No release-channel docs or version metadata are changed.

## Verification Commands
- npm test -- tests/autonomous-dogfood.test.ts -t "documents raw AgentFlight active-task recovery when the helper is not used"
- npm run build

## Post-Verification Gates
- npx --no-install agentloop check-gates --strict --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Agent instructions are copied into user repos, so wording must be clear, tool-agnostic, and not over-prescriptive.

## Rollback Notes
Revert the per-agent template guidance and focused test expectation.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
