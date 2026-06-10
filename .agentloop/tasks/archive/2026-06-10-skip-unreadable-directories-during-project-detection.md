# Skip unreadable directories during project detection

- Created date: 2026-06-10
- Task type: bugfix
- Status: done

## Problem Statement
Running npx agentloopkit init from a directory such as a macOS home folder can crash with EPERM when project detection recursively scans protected directories like .Trash.

## Desired Outcome
Project detection and init skip unreadable directories instead of crashing, so users get generated AgentLoopKit files or normal command output.

## Constraints
- Do not read protected directory contents.
- Do not add telemetry, prompts, or broad filesystem inspection.
- Keep the fix local and deterministic.

## Non-Goals
- Do not make AgentLoopKit recommend running init from a home directory.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/file-system.ts
- tests/project-detection.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- detectProjectType handles unreadable child directories without throwing.
- npx-style init no longer fails on EPERM from protected child directories.

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
Revert the file-system walker change if it hides legitimate project files or introduces scan regressions.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
