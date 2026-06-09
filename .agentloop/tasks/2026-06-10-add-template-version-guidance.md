# Add template version guidance

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement

AgentLoopKit keeps improving generated harness templates, but installed repos have no local marker showing which template generation created their .agentloop setup.

## Desired Outcome

Record a transparent local template manifest during init and have doctor warn when the manifest is missing, old, invalid, or newer than the CLI.

## Constraints

- Do not overwrite existing user harness files.
- Do not make old configs invalid.
- Keep this local-only with no network calls.

## Non-Goals

- Do not build a template migration engine.
- Do not mutate existing harness files automatically.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/init.ts
- src/core/doctor.ts
- src/core/constants.ts
- tests/init.test.ts
- tests/doctor.test.ts
- docs/template-migrations.md

## Files or Areas Not to Touch

- package.json unless release metadata is needed later

## Acceptance Criteria

- init-writes-agentloop-manifest
- doctor-passes-current-template-version
- doctor-warns-missing-or-stale-template-manifest
- docs-explain-manual-migration-guidance

## Verification Commands

- npx pnpm@10.12.1 test tests/init.test.ts tests/doctor.test.ts
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert manifest generation, doctor checks, docs, and tests. Existing generated manifest files are harmless JSON and can be deleted manually if needed.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
