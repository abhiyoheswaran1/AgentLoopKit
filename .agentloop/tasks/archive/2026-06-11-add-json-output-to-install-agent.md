# Add JSON output to install-agent

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop install-agent writes useful setup files but only reports human text today.

## Desired Outcome
install-agent --json returns written agent instruction paths and AGENTS.md path for single-agent and all-agent installs, while preserving default human output.

## Constraints
- Do not change generated file contents
- Do not overwrite existing AGENTS.md content
- Do not bump package version
- Do not publish a release

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/install-agent.ts
- tests/agent-installation.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- install-agent codex --json returns parseable paths
- install-agent all --json returns all bundled agent entries

## Verification Commands
- npm test -- agent-installation
- npm test
- npm run typecheck
- npm run build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
