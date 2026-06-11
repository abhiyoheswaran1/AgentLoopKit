# Harden policy command human Markdown

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
agentloop policy list/status render local policy titles, statuses, and paths directly into human output. Backticks in repo-local policy headings or paths can corrupt Markdown when agents paste policy status into reports.

## Desired Outcome
Policy list/status human output formats local titles, statuses, and paths with shared Markdown-safe inline code. JSON output and policy show raw policy content remain unchanged.

## Constraints
- Use TDD with a failing regression test before production code.
- Keep JSON output exact and preserve raw policy show output.
- Do not change policy discovery, policy status logic, version metadata, release files, or publishing state.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/cli/commands/policy.ts
- tests/policy.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A focused policy CLI test fails before implementation when a policy title/path contains backticks.
- agentloop policy list human output renders policy titles and paths with shared inline-code formatting.
- agentloop policy status human output renders status, titles, and paths with shared inline-code formatting.
- agentloop policy show still prints the raw policy Markdown content.

## Verification Commands
- npm test -- tests/policy.test.ts
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
- Escaping policy show would make the command less useful because policy show is supposed to print raw Markdown.

## Rollback Notes
Revert the policy command formatter and regression test.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
