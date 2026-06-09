# Add account settings

- Created date: 2026-06-09
- Task type: feature
- Status: proposed

## Problem Statement

Users cannot edit account preferences.

## Desired Outcome

Add a settings page with form validation and saved preferences.

## Constraints

- Do not change billing logic.
- Preserve existing navigation behavior.

## Acceptance Criteria

- Settings route renders.
- Form validation errors are visible.
- Tests cover save behavior.

## Verification Commands

- pnpm run test
- pnpm run lint
- pnpm run build

## Rollback Notes

Revert the settings route and related tests.
