# Decouple maintenance check from strict release proof

- Created date: 2026-06-16
- Task type: bugfix
- Status: done

## Problem Statement
The regular maintenance guard fails when an intentionally deferred public release channel, such as GitHub Marketplace, lacks post-release proof.

## Desired Outcome
maintenance:check exercises local maintenance surfaces without requiring strict public release-channel proof, while release-flow/release-proof remain strict for approved releases.

## Constraints
- Do not publish, tag, bump versions, create GitHub releases, or change release artifacts.
- Preserve `agentloop release-proof --strict` behavior for approved release gates.
- Keep `npm run maintenance:check` local-first and token-free.
- Keep the change scoped to maintenance guard behavior, docs, and focused tests.

## Non-Goals
- Do not relax `npm run release-flow`.
- Do not mark GitHub Marketplace proof as passed or published.
- Do not add dependencies, network credentials, or environment-token reads.
- Do not remove release-proof documentation for post-release use.

## Assumptions
- Regular maintenance should check release-proof command health without requiring every public channel to be live.
- Strict cross-channel proof remains a release/pre-release concern, not an everyday development guard.

## Likely Files or Areas
- `scripts/maintenance-check.mjs`
- `tests/maintenance-check-script.test.ts`
- `tests/autonomous-dogfood.test.ts`
- `README.md`
- `docs/maintenance-guards.md`

## Files or Areas Not to Touch
- `package.json` version
- release tags, GitHub Releases, npm/GHCR/MCP publishing state
- `.env*` file contents

## Acceptance Criteria
- `maintenance:check` no longer runs `release-proof --strict` across all channels.
- `maintenance:check` still exercises release-proof in a bounded local-safe way.
- `release-flow` and direct `agentloop release-proof --strict` behavior remain unchanged.
- Public maintenance docs explain that strict public release proof belongs to approved release gates.
- Focused tests fail before implementation and pass after implementation.

## Verification Commands
- `npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/package-scripts.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run maintenance:check`

## Post-Verification Gates
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
- Revert the maintenance script step, docs, and focused test expectations to restore strict all-channel release proof inside `maintenance:check`.
- No data migration, dependency, package version, release artifact, or external publication rollback is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
