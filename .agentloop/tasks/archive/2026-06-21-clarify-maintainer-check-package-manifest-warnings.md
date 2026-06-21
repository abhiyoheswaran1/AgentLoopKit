# Clarify maintainer-check package manifest warnings

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
maintainer-check labels every package.json change as 'Dependency or lockfile changes detected', which is misleading for script-only package manifest changes like adding a test file to test:unit.

## Desired Outcome
maintainer-check distinguishes package manifest changes from lockfile changes in messages and checklist copy while preserving warning behavior for reviewer attention.

## Constraints
- Do not release, tag, publish, bump versions, or change dependencies.
- Keep the check id and JSON shape compatible unless tests prove a targeted additive field is needed.
- Do not inspect package.json contents; classify by changed paths only.

## Non-Goals
- No dependency diff parser or package script semantic analyzer.
- No change to maintainer-check warning status for package.json or lockfiles.
- No lockfile policy changes.

## Assumptions
- Path-level distinction is enough: package.json is a package manifest, lockfiles are lockfiles.

## Likely Files or Areas
- src/core/maintainer-check.ts
- tests/maintainer-check.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A package.json-only change warns with package-manifest wording instead of dependency-or-lockfile wording.
- Lockfile changes still warn with dependency/lockfile wording.
- Maintainer checklist copy matches the changed path category.
- The maintainer-check id remains backward-compatible as dependency-lockfiles.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Changing maintainer-check copy may affect reviewer expectations; preserve warning status and check id.
- Pre-existing dirty non-evidence files before task creation: 71 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the previous dependency-lockfiles message and checklist copy.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
