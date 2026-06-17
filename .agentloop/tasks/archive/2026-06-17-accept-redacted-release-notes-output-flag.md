# Accept redacted release-notes output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement

agentloop release-notes generates shareable local release-note evidence, but it rejects the common --redact-paths flag used by other public-output commands before logs or drafts are pasted into review surfaces.

## Desired Outcome

agentloop release-notes accepts --redact-paths in human, JSON, public, and write modes; local roots are redacted in public output and written Markdown while the command remains local-only.

## Constraints

- Do not create tags, publish packages, call registries, call GitHub APIs, upload files, read tokens, or cut a release.
- Preserve default release-notes output and JSON shape when --redact-paths is not passed.
- Do not change git ref validation, changelog parsing, output-path safety checks, or the actual file path used for --write/--out.
- Do not add dependencies, bump versions, tag, publish, or touch Marketplace/Scoop/WinGet work.

## Non-Goals

- Do not prepare a real release or modify CHANGELOG.md/package metadata.
- Do not change release-note content selection beyond local-root redaction.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/cli/commands/release-notes.ts
- src/core/release-notes.ts
- tests/release-notes.test.ts
- docs/cli-reference.md
- docs/release-notes.md
- README.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- agentloop release-notes --json --redact-paths exits 0.
- agentloop release-notes --write --json --redact-paths redacts the local repo root in JSON markdown and writtenPath while writing the file to the real validated path.
- Human release-notes output accepts --redact-paths and redacts local roots in rendered release notes and written-path confirmation.
- Help/docs make the flag discoverable without implying a release is published.

## Verification Commands

- npm test -- tests/release-notes.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/release-notes.ts src/core/release-notes.ts tests/release-notes.test.ts docs/cli-reference.md docs/release-notes.md README.md

## Post-Verification Gates

- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Release-note command changes are release-adjacent; keep this to local output redaction and avoid publishing or version changes.

## Rollback Notes

Remove the release-notes --redact-paths option, redaction plumbing, tests, and documentation notes.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
