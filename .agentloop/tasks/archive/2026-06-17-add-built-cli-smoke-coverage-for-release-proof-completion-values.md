# Add built CLI smoke coverage for release-proof completion values

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
Source completion tests cover release-proof --only channel suggestions, but the built CLI smoke script does not exercise the completion command, leaving packaged completion output unverified in the cross-platform smoke path.

## Desired Outcome
The built CLI smoke script verifies that agentloop completion bash includes release-proof --only channel completion values without running release-proof or querying release channels.

## Constraints
- Do not run release-proof, query registries, publish, tag, bump versions, or touch release workflow files.
- Keep changes scoped to the smoke script and its source-level distribution guard test.
- Preserve existing smoke flow behavior and temp-repo safety.

## Non-Goals
- No completion generator behavior change unless the smoke test exposes a real bug.
- No public release prep.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- CHANGELOG.md
- .github/workflows

## Acceptance Criteria
- Distribution-artifacts tests prove the smoke script calls the built CLI completion command.
- The smoke script asserts release-proof --only completions include npm, github-release, github-marketplace, ghcr, and mcp-registry.
- The smoke script logs a clear completion smoke pass message.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers release-proof completion values"
- npm test -- tests/distribution-artifacts.test.ts
- npm run typecheck
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Smoke script assertions could be too brittle if they match incidental formatting instead of completion semantics.

## Rollback Notes
Remove the completion smoke step and the matching distribution-artifacts regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
