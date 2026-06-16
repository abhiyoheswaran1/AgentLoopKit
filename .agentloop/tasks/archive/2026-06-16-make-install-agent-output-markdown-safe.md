# Make install-agent output Markdown-safe

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
Human install-agent output currently formats generated paths with raw inline Markdown, so a newline-bearing path can split output into multiple lines.

## Desired Outcome
Install-agent human output keeps dynamic path values on one Markdown line while JSON preserves raw values.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- `src/cli/commands/install-agent.ts`
- `tests/agent-installation.test.ts`
- `docs/cli-reference.md`
- `CHANGELOG.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human install-agent output escapes CR and LF in dynamic path values.
- JSON install-agent output preserves raw path values.
- Docs, changelog, backlog, and dogfood notes record the behavior.

## Verification Commands
- npm test -- tests/agent-installation.test.ts
- npm run typecheck
- npm run lint
- npm run build

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the formatter import change in `src/cli/commands/install-agent.ts` and remove the newline-path regression test and related docs entries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
