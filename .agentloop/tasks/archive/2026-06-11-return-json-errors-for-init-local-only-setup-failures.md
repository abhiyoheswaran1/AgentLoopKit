# Return JSON errors for init local-only setup failures

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
agentloop init --local-only --json currently uses the global human error path when local-only mode cannot write .git/info/exclude because the target is not a Git repo.

## Desired Outcome
init --local-only --json returns a parseable setup error with the requested mode, reason, and next step while default output remains human-readable.

## Constraints
- Do not change normal init file generation behavior.
- Do not modify global Git config.
- Keep local-only writes limited to repo-local .git/info/exclude.

## Non-Goals
- Add new init modes.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/init.ts
- src/cli/commands/init.ts
- tests/init.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- init --local-only --json outside Git exits non-zero with structured error
- init --local-only outside Git keeps a readable stderr error
- normal init and local-only in a Git repo still work

## Verification Commands
- npm test -- tests/init.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the commit that adds `InitSetupError`, removes the init command JSON setup-error handler, and removes the matching init tests and docs.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
