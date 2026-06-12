# Add published package smoke helper

- Created date: 2026-06-12
- Task type: tests
- Status: done

## Problem Statement
Post-release verification currently relies on remembered npm/npx commands, and running npx from inside the package repo can produce misleading self-package behavior.

## Desired Outcome
Provide a repeatable maintainer smoke script that verifies a published AgentLoopKit version from clean temp directories.

## Constraints
- Do not bump package version
- Do not publish another release
- Keep the script maintainer-facing, not part of normal user init

## Non-Goals
- No new registry channel
- No release automation that creates tags or GitHub releases

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json exposes a smoke:published script
- the helper verifies npm view, npx version, npx init dry-run, and installed bin aliases from temporary directories
- the helper strips token-like environment variables and does not publish, tag, or call GitHub APIs
- Vitest covers the helper plan and safety behavior

## Verification Commands
- npm test -- tests/published-smoke-script.test.ts
- npm run smoke:published -- --version 0.28.1
- npm run lint
- npm run typecheck
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Network or npm registry propagation issues can make this post-release smoke fail for reasons outside the local repo.

## Rollback Notes
Remove the helper script, package script, tests, and docs if the approach creates release friction.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
