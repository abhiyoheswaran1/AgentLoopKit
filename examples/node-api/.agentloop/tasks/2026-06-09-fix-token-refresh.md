# Fix token refresh

- Created date: 2026-06-09
- Task type: bugfix
- Status: proposed

## Problem Statement

Refresh tokens expire too early for valid sessions.

## Desired Outcome

Valid refresh tokens produce a new access token.

## Constraints

- Do not change password login.
- Do not change token signing keys.

## Acceptance Criteria

- Regression test covers refresh flow.
- Invalid tokens still fail.

## Verification Commands

- pnpm run test
- pnpm run typecheck

## Rollback Notes

Revert refresh-token handler changes.
