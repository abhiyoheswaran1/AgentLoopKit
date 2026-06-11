# Expose task command details in verify JSON

- Created date: 2026-06-11
- Task type: feature
- Status: done

## Problem Statement
agentloop verify --task-commands --json tells automation how many task commands were found, but not which task-defined commands were executed. Agents and CI must parse Markdown reports to answer that.

## Desired Outcome
Verification JSON includes the explicit task command strings that were selected from the task contract when --task-commands is used.

## Constraints
- Only include commands that were explicitly read from the selected task contract.
- Do not change command execution behavior or default human output.
- Do not change package version or cut a release.

## Non-Goals
- Do not add command policy enforcement.
- Do not infer commands from arbitrary Markdown sections.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/verify.ts
- tests/verification.test.ts
- docs/verification.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- verify --task-commands --json includes taskCommands.commands with the task-defined commands in execution order.
- The existing requested and foundCount fields remain.
- Default verify output remains unchanged.

## Verification Commands
- npm test -- verification
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
