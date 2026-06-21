# Preserve external URLs during path redaction

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding verification reports with --redact-paths showed ProjScan Markdown badge links being rewritten into malformed text such as https:[git-root]. Redaction should hide local absolute paths, not corrupt external URLs in captured command output.

## Desired Outcome
Path redaction preserves http and https URLs in command output while still redacting the local git root and known local artifact roots.

## Constraints
- Do not weaken local absolute path redaction for git roots, artifact roots, env-style paths, or local command output.
- Do not add dependencies, network calls, URL fetching, release prep, tag creation, publishing, or version bumping.
- Keep behavior deterministic and covered by focused regression tests.

## Non-Goals
- Do not change ProjScan output, badge rendering, or verification command execution.
- Do not introduce broad content sanitization or HTML/Markdown rewriting.
- Do not touch release-channel tasks.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src
- tests
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-173.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A captured http or https Markdown link remains intact when --redact-paths is used.
- A captured local absolute path under the git root is still replaced with [git-root].
- Verification report and shareable-output redaction tests cover URL preservation and local path redaction together.

## Verification Commands
- npm test -- tests/verification.test.ts tests/status.test.ts tests/ship.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Path redaction is security-sensitive because weakening it could leak local filesystem paths in pasted output.
- Pre-existing dirty non-evidence files before task creation: 84 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous redaction implementation and remove the URL-preservation regression tests and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
