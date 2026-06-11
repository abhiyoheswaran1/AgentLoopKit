# Add JSON error output for unsupported badge source

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop badge --json returns structured success output, but unsupported --source values still use the global human error path. Automation cannot parse the supported badge sources.

## Desired Outcome
agentloop badge --source <source> --json returns a structured error with code, message, requestedSource, and supportedSources when the source is unsupported.

## Constraints
- Keep default non-JSON error output human-readable.
- Do not change supported badge sources or badge SVG format.
- Do not change package version or cut a release.

## Non-Goals
- Do not add remote badge services or hosted badge endpoints.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/badge.ts
- src/cli/commands/badge.ts
- tests/badge.test.ts
- docs/badges.md
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Unsupported badge source with --json prints valid JSON to stdout and exits non-zero.
- The JSON includes supportedSources.
- Unsupported badge source without --json remains human-readable on stderr.

## Verification Commands
- npm test -- badge
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the badge command, badge core parser, tests, README, badge docs, changelog, and AgentLoop evidence files from this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
