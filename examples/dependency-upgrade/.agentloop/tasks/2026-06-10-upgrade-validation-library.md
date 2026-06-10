# Upgrade validation library

- Created date: 2026-06-10
- Task type: dependency-upgrade
- Status: review

## Problem Statement

The validation package needs a patch upgrade for a parser bugfix.

## Desired Outcome

The intended package and lockfile update with passing verification and clear rollback notes.

## Constraints

- Change only the intended package and lockfile entries.
- Do not add new runtime dependencies.
- Do not change auth behavior.
- Do not accept install scripts without human review.

## Non-Goals

- Do not migrate validation frameworks.
- Do not refactor validation call sites.
- Do not add a dependency scanner.

## Assumptions

- The package manager is pnpm.
- Existing validation tests cover the affected parser behavior.

## Likely Files or Areas

- `package.json`
- `pnpm-lock.yaml`
- `tests/validation.test.ts`

## Files or Areas Not to Touch

- `src/auth/`
- `src/billing/`
- `.env`

## Acceptance Criteria

- Only the intended validation package and expected lockfile entries changed.
- Validation regression tests pass.
- Typecheck and build pass.
- Handoff names old version, new version, lockfile impact, and rollback path.

## Verification Commands

- `pnpm install --frozen-lockfile`
- `pnpm test`
- `pnpm typecheck`
- `pnpm build`

## Implementation Plan

- Inspect current package and lockfile entries.
- Update the validation package.
- Review package and lockfile diff.
- Run install, test, typecheck, and build checks.
- Record risks and rollback notes in the handoff.

## Risk Notes

- Lockfile changes need human review.
- Passing tests do not prove the upgraded package is safe.

## Rollback Notes

Revert `package.json` and `pnpm-lock.yaml`.

## Handoff Requirements

- Include package name, old version, and new version.
- Include lockfile impact.
- Include verification results and skipped checks.
- Include rollback notes.
