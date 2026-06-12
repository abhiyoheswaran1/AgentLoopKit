# Prepare 0.28.4 patch release

- Created date: 2026-06-12
- Task type: release
- Status: in-progress

## Problem Statement
The repo has verified dogfood improvements after 0.28.3, but npm and GitHub still point at 0.28.3.

## Desired Outcome
Publish a small 0.28.4 patch release with accurate changelog, package metadata, release evidence, npm package, and GitHub release notes.

## Constraints
- Do not change product behavior beyond release metadata.
- Do not publish until release-check and packed smoke pass.

## Non-Goals
- Do not add new features during the release task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- FINAL_HANDOFF.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- package.json declares 0.28.4.
- CHANGELOG.md has a 0.28.4 section and no pending Unreleased entries.
- release-check passes for 0.28.4 before publishing.
- npm and GitHub releases expose 0.28.4 after publishing.

## Verification Commands
- npm run typecheck
- npm test
- npm run build
- npm run smoke:release
- node dist/cli/index.js release-check --strict

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Release metadata can drift from package contents if changelog or tags are wrong.

## Rollback Notes
Use npm deprecate guidance only if the package is bad; otherwise follow up with a corrective patch release.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
