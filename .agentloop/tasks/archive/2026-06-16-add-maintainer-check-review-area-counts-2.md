# Add maintainer-check review area counts

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
Long autonomous sessions can make the changed-file-count warning hard to act on because it reports only a broad non-evidence count.

## Desired Outcome
maintainer-check keeps existing safety checks but names compact non-evidence review-area counts when the broad changed-file warning fires.

## Constraints
- Keep all existing maintainer-check safety checks on the full changed-file list.
- Keep JSON output shape unchanged apart from the existing `changed-file-count` message text.
- Reuse existing change-area classification instead of adding a second classifier.
- Do not change release, publishing, dependency, registry, or task lifecycle behavior.

## Non-Goals
- Do not suppress the broad changed-file warning when non-evidence file count remains high.
- Do not change evidence grouping in `handoff`, `prepare-pr`, or `artifacts`.
- Do not add cleanup, archiving, retention, or PR posting behavior.

## Assumptions
- Maintainers need compact area counts before opening a large diff, not another full file listing.

## Likely Files or Areas
- `src/core/maintainer-check.ts`
- `src/core/change-areas.ts`
- `tests/maintainer-check.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- Package metadata, release notes, release workflows, registry metadata, dependency manifests, and lockfiles.
- Marketplace, GHCR, MCP Registry, npm publishing, or versioning files.

## Acceptance Criteria
- `changed-file-count` warnings include compact non-evidence review-area counts.
- Evidence-only churn still passes the changed-file-count check.
- Broad non-evidence changes still warn.
- Dependency, migration, auth/security, generated-output, handoff, and task checks continue to inspect the full changed-file list.
- Public docs explain that the area counts are advisory review context.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts
- npm run typecheck
- npm run lint
- npm test

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the maintainer-check message change, tests, and docs note. Existing maintainer-check safety checks and warning thresholds should remain unchanged.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
