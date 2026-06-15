# Complete release-proof channel completions

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement

release-proof --only accepts fixed channel ids, but shell completions do not surface those values.

## Desired Outcome

Bash, zsh, fish, and PowerShell completions suggest npm, github-release, ghcr, and mcp-registry for release-proof --only.

## Constraints

- Keep the change limited to shell completion generation and docs.
- Do not change release-proof command behavior or release channels.

## Non-Goals

- Do not publish a package, create a tag, or create a GitHub release.
- Do not add live registry checks to completions.

## Assumptions

- The release-proof channel ids remain the four public channels already supported by the CLI.

## Likely Files or Areas

- src/core/completions.ts
- tests/completion.test.ts
- README.md
- docs/cli-reference.md
- docs/getting-started.md
- CHANGELOG.md

## Files or Areas Not to Touch

- package version metadata
- release workflows
- registry publishing configuration

## Acceptance Criteria

- Completion tests cover release-proof --only channel values.
- Generated completion scripts keep existing command and nested completion behavior.

## Verification Commands

- npm test -- tests/completion.test.ts
- npm test -- tests/completion.test.ts tests/cli-docs-drift.test.ts tests/release-proof.test.ts

## Post-Verification Gates

- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the completion renderer and completion test changes. Existing `agentloop release-proof --only <channel>` behavior remains available even without shell completion values.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
