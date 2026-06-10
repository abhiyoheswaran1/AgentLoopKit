# Improve verification failure summaries

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

Verification reports preserve long output with first and last excerpts, but reviewers still have to scan the full command section to find the most useful failure lines.

## Desired Outcome

Failed verification reports include a concise failure summary before the full command output so agents and reviewers can see the failed command, exit code, and final useful output lines quickly.

## Constraints

- Do not hide or replace the existing command output excerpt.
- Do not parse tool-specific error formats.
- Do not add dependencies.
- Do not run verification commands except when the user invokes `agentloop verify`.
- Keep the output deterministic and local.

## Non-Goals

- No AI diagnosis.
- No log upload.
- No remediation suggestions beyond the existing recommended next action.
- No CI provider API calls.

## Assumptions

- The final non-empty output lines are usually the highest-signal failure clue.

## Likely Files or Areas

- `src/core/verification.ts`
- `tests/verification.test.ts`
- `README.md`
- `docs/verification-reports.md`
- `.agentloop/backlog.md`
- `.agentloop/dogfood-log.md`

## Files or Areas Not to Touch

- npm publishing workflow
- release metadata
- package version

## Acceptance Criteria

- Failed reports include `## Failure Summary`.
- The summary includes each failed command and exit code.
- The summary includes final useful output lines from the failed command.
- Passing and not-run reports do not include `## Failure Summary`.
- Full command output excerpts remain in the command sections.

## Verification Commands

- npx pnpm@10.12.1 test tests/verification.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Add a failing Vitest assertion for failed command summaries.
- Add a small renderer in verification core.
- Update docs with concise wording.
- Dogfood the change with AgentLoop verification and handoff.

## Risk Notes

- Reports must not overstate root cause. The summary is an output excerpt, not a diagnosis.

## Rollback Notes

Revert the verification renderer, tests, and docs.

## Handoff Requirements

- Include tests run.
- Include whether report output changed.
- Include rollback notes.
