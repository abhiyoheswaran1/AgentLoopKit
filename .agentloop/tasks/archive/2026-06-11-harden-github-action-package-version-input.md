# Harden GitHub Action package version input

- Created date: 2026-06-11
- Task type: security-review
- Status: done

## Problem Statement
The composite action interpolates the agentloopkit-version input directly inside a shell command. Maintainers should avoid shell interpolation for that input and document that it must stay static and trusted.

## Desired Outcome
The action passes agentloopkit-version through an environment variable before npm install, and docs warn not to derive it from untrusted pull request or user input.

## Constraints
- Keep the action's public inputs compatible.
- Do not change package version or cut a release.

## Non-Goals
- Do not replace the composite action with a JavaScript action.
- Do not add a command parser in this task.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- action.yml
- docs/github-actions.md
- examples/github-actions/README.md
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- action.yml no longer embeds inputs.agentloopkit-version directly in the npm install shell command.
- action.yml passes the package version through an environment variable.
- GitHub Actions docs warn that agentloopkit-version should stay static and trusted.

## Verification Commands
- npm test -- distribution-artifacts
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
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
