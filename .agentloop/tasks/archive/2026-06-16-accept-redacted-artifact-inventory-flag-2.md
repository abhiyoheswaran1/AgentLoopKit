# Accept redacted artifact inventory flag

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
artifacts is a read-only evidence-sharing command, but it rejects the common --redact-paths flag used by nearby review commands, causing agents to fail when applying a standard public-output option.

## Desired Outcome
agentloop artifacts accepts --redact-paths for human, JSON, latest, and stale output as a no-op compatibility flag because artifact inventory paths are already repo-relative; docs and tests describe the behavior.

## Constraints
- Keep `artifacts` read-only and deterministic.
- Treat `--redact-paths` as a compatibility flag for `artifacts`; do not change artifact discovery, stale preview selection, or JSON shape.
- Preserve repo-relative artifact paths. Do not introduce absolute-path output.
- Do not change release, publishing, package metadata, Marketplace, or distribution behavior.

## Non-Goals
- Do not add new artifact types.
- Do not add cleanup/deletion behavior.
- Do not add broad redaction utilities to artifact rendering.
- Do not change `review-context`, `status`, `next`, or task placeholder classification.

## Assumptions
- Artifact inventory output already uses repo-relative paths, so accepting `--redact-paths` does not require data transformation.
- Users and agents benefit when shareable evidence commands accept a consistent public-output flag.

## Likely Files or Areas
- `src/cli/commands/artifacts.ts`
- `tests/artifacts.test.ts`
- `README.md`
- `docs/cli-reference.md`
- `tests/release-smoke.test.ts`

## Files or Areas Not to Touch
- `src/core/artifacts.ts`, unless tests prove rendering must change.
- Release workflows, package metadata, lockfiles, distribution manifests, Marketplace task files, and external publication tooling.

## Acceptance Criteria
- `agentloop artifacts --redact-paths` succeeds for human output.
- `agentloop artifacts --json --redact-paths` succeeds and preserves the existing JSON shape.
- `agentloop artifacts --type task --latest --redact-paths` succeeds.
- `agentloop artifacts --stale --redact-paths` succeeds.
- Public docs describe `artifacts` as accepting `--redact-paths` even though output is already repo-relative.
- Existing artifact inventory behavior and stale preview behavior remain unchanged.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm test -- tests/release-smoke.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the artifacts CLI option, artifact tests, and redaction guidance docs/tests. Existing artifact inventory and stale preview behavior will return unchanged except `--redact-paths` will again be rejected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
