# Bound project detection scans

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
Running agentloop init from a large metadata-free directory such as a home folder can hang while project detection recursively scans too much of the tree.

## Desired Outcome
Project detection uses bounded shallow heuristics so init returns quickly even outside a normal repo, while still detecting common docs-only repositories.

## Constraints
- Do not read file contents during detection.
- Do not add prompts, telemetry, network calls, or hidden environment inspection.

## Non-Goals
- Do not make AgentLoopKit encourage users to initialize their home directory.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/project-detection.ts
- src/core/file-system.ts
- tests/project-detection.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- init from a large metadata-free directory does not recursively scan unbounded descendants.
- project detection still detects docs-only repositories from shallow docs files.

## Verification Commands
- npx pnpm@10.12.1 test tests/project-detection.test.ts
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
Revert the bounded scan change if it misclassifies common repositories or hides expected docs-only detection.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
