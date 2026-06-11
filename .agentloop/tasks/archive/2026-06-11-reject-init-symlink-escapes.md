# Reject init symlink escapes

- Created date: 2026-06-11
- Task type: security-review
- Status: done

## Problem Statement
agentloop init can follow pre-existing symlinked root files or AgentLoop directories outside the current repo, which violates the local-first safety model.

## Desired Outcome
init refuses unsafe symlinked targets before writing, returns structured JSON errors where supported, and leaves outside files unchanged.

## Constraints
- Do not change package version or publish a release.
- Keep init useful for normal existing repos and dry-run behavior.
- Use Vitest regression tests before implementation.

## Non-Goals
- Do not redesign the init template set.
- Do not add a cloud backend, telemetry, or external API.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/init.ts
- src/cli/commands/init.ts
- src/core/artifacts.ts
- tests/init.test.ts

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- init rejects a symlinked AGENTS.md that resolves outside the repo and does not modify the outside file.
- init rejects a symlinked .agentloop directory or generated subdirectory that resolves outside the repo and does not write outside the repo.
- init --dry-run remains non-writing.
- JSON mode returns a parseable safety error for unsafe output paths.

## Verification Commands
- npx pnpm@10.12.1 test tests/init.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 lint
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
