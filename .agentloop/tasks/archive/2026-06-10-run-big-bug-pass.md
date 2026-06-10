# Run big bug pass

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
AgentLoopKit needs a broad maintainer bug sweep after real first-run usage exposed init edge cases.

## Desired Outcome
Find and fix concrete bugs in published CLI behavior, safety checks, packaging, or generated artifacts without broad refactors.

## Constraints
- Use Vitest for automated regression coverage.
- Dogfood projscan during implementation.
- Do not add cloud, telemetry, database, or LLM dependencies.
- Do not publish a release unless a user-visible bug fix lands.

## Non-Goals
- Do not redesign the product or add large new features.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src
- tests
- README.md
- docs

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Automated checks and CLI smoke tests cover the audited paths.
- Any fixed bug has a failing regression test first.
- projscan reports project health after the pass.

## Verification Commands
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the bug-sweep commit if any fix regresses core CLI commands.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
