# Reject unsafe config paths

- Created date: 2026-06-11
- Task type: security-review
- Status: done

## Problem Statement

agentloop.config.json accepts arbitrary string path values, so a repo can configure AgentLoopKit artifact directories with absolute paths or parent traversal outside the project.

## Desired Outcome

AgentLoopKit only accepts local repo-relative config paths and reports invalid path configuration before reading or writing artifacts.

## Constraints

- Do not bump package version or publish a release
- Keep the behavior deterministic and local-only

## Non-Goals

- Do not add a cloud policy engine or broad config migration system

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/config.ts
- schema/agentloop.config.schema.json
- tests/config.test.ts
- tests/schema.test.ts
- docs/configuration.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- Config rejects absolute path values
- Config rejects parent traversal path values
- JSON schema documents the same path restrictions
- Docs explain paths are repo-relative local paths

## Verification Commands

- npm test -- tests/config.test.ts tests/schema.test.ts
- npm test
- npm run typecheck
- npm run build

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the config/schema validation changes and related docs/tests if a legitimate repo-local path customization is blocked incorrectly. Do not loosen the rule to allow absolute paths or parent traversal without a replacement safety boundary.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
