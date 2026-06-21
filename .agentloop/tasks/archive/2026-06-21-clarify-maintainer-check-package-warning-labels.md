# Clarify maintainer-check package warning labels

- Created date: 2026-06-21
- Task type: docs
- Status: done

## Problem Statement
Maintainer-check now distinguishes package manifest-only changes from dependency lockfile changes in the message and checklist, but human output still labels the warning row with the compatibility id dependency-lockfiles. In package-manifest-only cases, that makes the row read like a lockfile warning even when no lockfile changed.

## Desired Outcome
Human maintainer-check output uses clearer display labels for package manifest, dependency lockfile, and combined package/dependency warnings while preserving the existing JSON check id, status, message, and checklist behavior.

## Constraints
- Do not change maintainer-check JSON check ids, statuses, messages, checklist items, warning/failure semantics, release behavior, dependencies, tags, publishing, or package versions.
- Do not parse package.json contents or infer whether dependency values changed.

## Non-Goals
- Do not change check-gates, release-check, ProjScan, or AgentFlight behavior.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/maintainer-check.ts
- tests/maintainer-check.test.ts
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Package-manifest-only maintainer-check human output labels the warning as package manifest instead of dependency-lockfiles.
- Dependency-lockfile-only and combined package/dependency human output use precise labels.
- maintainer-check JSON keeps id dependency-lockfiles and existing message strings for compatibility.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts
- npm run typecheck
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Human-output label only; keep JSON ids/messages, checklist copy, warning behavior, release, tag, publish, and version behavior stable.
- Pre-existing dirty non-evidence files before task creation: 111 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore maintainer-check human output to render the raw dependency-lockfiles id.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
