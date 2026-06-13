# Escape prepare-pr list Markdown

- Created date: 2026-06-13
- Task type: security-review
- Status: done

## Problem Statement
prepare-pr copies task acceptance criteria, risk notes, and review-readiness list text into public PR Markdown as raw bullet prose. If a task line starts with a checkbox, heading marker, link, or emphasis marker, the generated PR body can accidentally render structure the maintainer did not intend.

## Desired Outcome
prepare-pr preserves readable prose while escaping Markdown control characters in generated PR and GitHub-comment list items.

## Constraints
- Do not change task contract Markdown generation.
- Do not change release metadata, package version, tags, npm publishing, or GitHub releases.
- Keep the behavior deterministic and dependency-free.

## Non-Goals
- Do not sanitize full arbitrary Markdown documents.
- Do not remove useful backtick inline-code formatting for file paths or command evidence.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/prepare-pr.ts
- src/core/markdown-format.ts
- tests/prepare-pr.test.ts
- .agentloop/dogfood-log.md
- CHANGELOG.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml

## Acceptance Criteria
- A prepare-pr regression test proves task acceptance and risk list items with Markdown control characters are escaped in the generated PR body.
- A GitHub comment regression test proves readiness blocker/warning/next-action list items are escaped.
- Existing prepare-pr behavior and path redaction tests continue to pass.

## Verification Commands
- npm test -- tests/prepare-pr.test.ts
- npm run typecheck
- npm run build

## Post-Verification Gates
- node dist/cli/index.js verify --task-commands --only-task-commands --write-run
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js check-gates --redact-paths --strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Over-escaping could make generated PR descriptions harder to read.
- Under-escaping could allow generated PR descriptions to display unintended checklist or heading structure.

## Rollback Notes
Revert the Markdown escaping helper, prepare-pr rendering changes, and focused tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
