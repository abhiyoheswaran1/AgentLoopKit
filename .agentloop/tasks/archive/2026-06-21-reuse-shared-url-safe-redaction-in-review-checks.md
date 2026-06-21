# Reuse shared URL-safe redaction in review checks

- Created date: 2026-06-21
- Task type: refactor
- Status: done

## Problem Statement
After fixing URL-safe path redaction, maintainer-check and release-check still carry local root-redaction helpers. That duplicates security-sensitive behavior and can drift from the shared redaction helper.

## Desired Outcome
maintainer-check and release-check use the shared redactLocalRoots helper for local-root redaction, preserving external URLs and local path redaction consistently across review surfaces.

## Constraints
- Do not change command semantics, check ids, warning/pass/fail statuses, JSON shape, release readiness scoring, or maintainer-check warning semantics.
- Do not add dependencies, network calls, release prep, tag creation, publishing, or version bumping.
- Preserve local path redaction for git roots and path aliases; add focused regression coverage for URL preservation.

## Non-Goals
- Do not change AgentFlight behavior or ProjScan behavior.
- Do not broaden release-check responsibilities or registry access.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/maintainer-check.ts
- src/core/release-check.ts
- tests/maintainer-check.test.ts
- tests/release-check.test.ts
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-176.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- maintainer-check redacted output preserves external http/https URLs while redacting local roots.
- release-check redacted output preserves external http/https URLs while redacting local roots.
- The duplicate local redaction helpers are removed in favor of the shared helper.

## Verification Commands
- npm test -- tests/maintainer-check.test.ts tests/release-check.test.ts
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
- Redaction is security-sensitive; keep this as a refactor with regression tests and no check-result semantic changes.
- Pre-existing dirty non-evidence files before task creation: 90 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/autonomous-dogfooding.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Restore the local redaction helpers in maintainer-check and release-check and remove the new regression tests/records.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
