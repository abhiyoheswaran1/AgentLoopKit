# Add AGENTS.md specialist roster

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
AGENTS.md currently gives loop rules but does not give future coding-agent sessions a reusable specialist roster for dividing product, release, documentation, testing, security, and distribution work.

## Desired Outcome
AgentLoopKit's own AGENTS.md and generated AGENTS.md template include clear role definitions that help Codex, Claude Code, Cursor, OpenCode, Gemini CLI, and similar agents route work without pretending AgentLoopKit can control those tools directly.

## Constraints
- Keep the roster local-first and tool-agnostic.
- Do not claim autonomous spawning support inside third-party agents.
- Keep wording concise and public-safe.

## Non-Goals
- Do not build a runtime multi-agent orchestrator.
- Do not add SaaS, cloud, telemetry, or agent accounts.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- AGENTS.md
- src/templates/root/AGENTS.md
- tests/init.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Generated AGENTS.md contains an Agent Roster section.
- This repo's AGENTS.md contains the same specialist roster.
- Tests cover the generated roster.

## Verification Commands
- pnpm test tests/init.test.ts
- pnpm test
- pnpm typecheck

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the AGENTS.md/template/test changes if the roster proves noisy or misleading.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
