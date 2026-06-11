# Harden verification report metadata Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
Verification reports still render top-level repo, git, working-tree, and status metadata directly into Markdown, so local repo names or refs with backticks can corrupt reviewer-facing evidence.

## Desired Outcome
Verification report top-level metadata values use the shared Markdown-safe inline-code formatter while command execution, git detection, JSON output, and artifact paths remain unchanged.

## Constraints
- Keep the change scoped to verification report top-level Markdown metadata and tests.
- Do not change command execution, git commands, task context rendering, package version, release notes, or publishing.

## Non-Goals
- No version bump, npm publish, GitHub release, Homebrew work, MCP registry work, or new distribution channel.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- tests/verification.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A regression test fails before the fix when the repo name contains a backtick.
- Timestamp, repo, git branch, git commit, and working tree header values render with inlineCode.
- Overall status remains parseable for downstream AgentLoop commands.
- Existing command results and JSON output remain unchanged.

## Verification Commands
- npm test -- tests/verification.test.ts
- git diff --check
- npm run lint
- npm run typecheck
- npm run check:links
- npx --yes projscan doctor --format markdown
- npm test
- npm run build
- node scripts/smoke-cli.mjs
- npm run smoke:release

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Verification report formatting is public evidence; keep the change presentation-only and avoid changing command semantics.

## Rollback Notes
Revert verification metadata formatting and the associated regression tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
