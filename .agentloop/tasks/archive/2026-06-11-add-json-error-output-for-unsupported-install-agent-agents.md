# Add JSON error output for unsupported install-agent agents

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
install-agent supports --json for successful writes, but unsupported agent names still fail with human-only error text, which forces automation to special-case the failure path.

## Desired Outcome
When --json is provided with an unsupported agent value, the CLI exits non-zero and prints a stable JSON error object listing supported agent values, while default human errors stay unchanged.

## Constraints
- Do not change generated agent instruction files.
- Do not execute external commands or read credentials.
- Do not bump package version or cut a release.

## Non-Goals
- No prompt redesign.
- No MCP, Homebrew, or distribution-channel work.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/install-agent.ts
- tests/agent-installation.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- install-agent unknown --json exits non-zero with parseable JSON on stdout or stderr.
- JSON error includes code, message, requested agent, and supported agents.
- install-agent unknown without --json preserves the current human-facing failure behavior.

## Verification Commands
- npm test -- agent-installation
- npm run typecheck
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

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
