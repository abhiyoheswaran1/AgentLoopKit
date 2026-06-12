# Require current release notes in release-check

- Created date: 2026-06-12
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding the 0.28.5 release showed release-check accepted an older deterministic release-notes artifact as pass evidence even though the release notes did not prove the current package version.

## Desired Outcome
release-check reports stale release-notes evidence when the latest generated release notes do not mention the local package version, and strict mode fails that condition before publishing.

## Constraints
- None recorded yet.

## Non-Goals
- Do not call npm, GitHub, or MCP registries from release-check
- Do not generate release notes automatically
- Do not cut another package version

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/release-check.ts
- tests/release-check.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- release-check passes when the latest release-notes artifact contains the current package version
- release-check warns, and strict mode fails, when release notes are missing the current package version
- human and JSON outputs explain that release notes must be regenerated for the package version

## Verification Commands
- npm test -- tests/release-check.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Overly strict matching could reject valid release notes that format the version differently

## Rollback Notes
Revert the release-check release-notes freshness rule if it blocks legitimate release notes

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
