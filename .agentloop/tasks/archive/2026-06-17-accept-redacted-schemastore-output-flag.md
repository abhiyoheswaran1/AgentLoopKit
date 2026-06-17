# Accept redacted SchemaStore output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement

Agents and CI wrappers can pass the common --redact-paths flag to evidence commands, but agentloop schemastore currently rejects it even though its catalog output is repo-agnostic and read-only.

## Desired Outcome

agentloop schemastore accepts --redact-paths for human and JSON output without changing the catalog payload; docs identify the flag as accepted and output-neutral.

## Constraints

- Keep schemastore read-only; do not write files or scan broad paths.
- Preserve existing human and JSON output shapes except for accepting the flag.
- Do not add dependencies, release, bump versions, tag, publish, or touch Marketplace/Scoop/WinGet work.

## Non-Goals

- Do not implement path redaction for schema catalog values; they are package metadata, not local filesystem paths.
- Do not change SchemaStore URLs, package metadata, or JSON schema content.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/cli/commands/schemastore.ts
- tests/schemastore.test.ts
- docs/cli-reference.md
- README.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- agentloop schemastore --json --redact-paths exits 0 and matches the JSON output without the flag.
- Human schemastore output accepts --redact-paths without changing visible catalog output.
- Help/docs make the flag discoverable as output-neutral for schemastore.

## Verification Commands

- npm test -- tests/schemastore.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/schemastore.ts tests/schemastore.test.ts docs/cli-reference.md README.md

## Post-Verification Gates

- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- A no-op flag can create false expectations if docs imply schema catalog values are local paths.

## Rollback Notes

Remove the schemastore --redact-paths option, its tests, and its documentation note.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
