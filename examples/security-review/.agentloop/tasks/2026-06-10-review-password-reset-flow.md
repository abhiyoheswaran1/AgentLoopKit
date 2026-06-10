# Review password reset flow

- Created date: 2026-06-10
- Task type: security-review
- Status: review

## Problem Statement

Password reset code changed and needs focused review before release.

## Desired Outcome

Reviewers can see the review scope, risk areas, verification evidence, and follow-up risks.

## Constraints

- Do not read or print `.env` contents.
- Do not change token signing keys.
- Do not weaken reset-token expiry.
- Keep the review scoped to password reset behavior.

## Non-Goals

- Do not redesign the authentication system.
- Do not add a new security scanner.
- Do not claim compliance or certification.

## Assumptions

- The repository already has tests for auth flows.
- A human reviewer will inspect the final diff and risk notes.

## Likely Files or Areas

- `src/auth/reset-password.ts`
- `src/auth/session.ts`
- `tests/auth/reset-password.test.ts`

## Files or Areas Not to Touch

- `.env`
- `src/billing/`
- `migrations/`

## Acceptance Criteria

- Reset tokens expire on the configured schedule.
- Used reset tokens cannot be reused.
- Logs do not include reset tokens or secret values.
- Existing session behavior still passes regression tests.

## Verification Commands

- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`

## Implementation Plan

- Inspect auth reset code and related tests.
- Add or update focused regression tests if gaps are found.
- Keep any code change scoped to password reset behavior.
- Record unresolved concerns in the handoff.

## Risk Notes

- Auth code and secret handling require human review.
- Passing tests do not prove the flow is secure.

## Rollback Notes

Revert the password reset flow changes and restore the previous release.

## Handoff Requirements

- Summarize touched auth files.
- Include verification commands and results.
- List checks not run.
- Call out any unresolved security concerns.
- Include rollback notes.
