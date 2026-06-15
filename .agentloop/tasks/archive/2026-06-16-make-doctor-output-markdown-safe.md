# Make doctor output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement

Doctor output can include user-controlled project names, script names, paths, or recommendations that may be pasted into Markdown contexts without escaping.

## Desired Outcome

Human-readable doctor output escapes Markdown-sensitive dynamic values while preserving JSON output for scripts.

## Constraints

- Keep JSON output unchanged for machine consumers.
- Do not change doctor checks, exit codes, or risk-file detection semantics.

## Non-Goals

- Do not sanitize command output globally or alter other commands in this task.

## Assumptions

- Doctor JSON is the machine-readable contract and should preserve raw values for scripts.
- Human-readable doctor output is commonly pasted into Markdown contexts such as issues, PRs, and handoffs.
- Package names and file paths can contain Markdown-sensitive characters or line breaks in local repositories even when they are unusual.

## Likely Files or Areas

- src/core/doctor.ts
- tests/doctor.test.ts
- docs/cli-reference.md
- docs/getting-started.md

## Files or Areas Not to Touch

- Release workflows, package metadata, and npm publishing files.
- Risk-file detection rules outside the final Markdown rendering boundary.
- Global Markdown helpers used by other commands.

## Acceptance Criteria

- Doctor Markdown output escapes a package name containing Markdown control characters.
- Doctor Markdown output renders dynamic values containing line breaks as single-line inline code.
- Doctor JSON output remains unescaped for the same values.

## Verification Commands

- npm test -- tests/doctor.test.ts
- npm test -- tests/doctor.test.ts tests/init.test.ts tests/cli-docs-drift.test.ts

## Post-Verification Gates

- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert the doctor renderer changes, the package-name check, related tests, and documentation updates. Existing doctor checks and JSON shape would return to the previous behavior.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
