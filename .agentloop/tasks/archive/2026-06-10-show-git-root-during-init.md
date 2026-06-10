# Show git root during init

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
agentloop init reports whether Git is detected but does not show the Git work-tree root, so users who run init inside a nested package cannot tell whether they are configuring the whole repo root or only the current subdirectory.

## Desired Outcome
init human and JSON output include the Git root and whether the current target is the Git root, without changing where files are written.

## Constraints
- Do not auto-change the target directory
- Do not require Git for normal init
- Do not change package version or release artifacts

## Non-Goals
- Do not add interactive prompts
- Do not add repository discovery beyond Git root reporting

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/git.ts
- src/core/init.ts
- src/cli/commands/init.ts
- tests/git.test.ts
- tests/init.test.ts
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Git helpers expose the repository root safely
- InitResult includes git root and target-is-root metadata
- Human init output prints Git root when Git is detected
- Tests cover repo root and subdirectory targets

## Verification Commands
- npx pnpm@10.12.1 test tests/git.test.ts tests/init.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the Git root helper, init Git-root metadata/output, tests, and matching README/getting-started/changelog updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
