# Maintain near-term roadmap health

- Created date: 2026-06-16
- Task type: security-review
- Status: done

## Problem Statement
The near-term roadmap calls for keeping release publishing, public docs, release proof, SchemaStore, policy packs, and GitHub metadata behavior healthy.

## Desired Outcome
The repository has current evidence and any small concrete gaps fixed for the six near-term roadmap health items.

## Constraints
- Keep the maintenance pass local-first and release-safe.
- Do not make the maintenance gate depend on pre-existing verification evidence.
- Keep `dogfood:strict` available as a post-verification/final-handoff gate.

## Non-Goals
- Do not cut a release
- Do not add SaaS, telemetry, tokens, posting, or remote mutation

## Assumptions
- npm/GitHub/GHCR/MCP release proof for the current published version can be checked live.
- AgentFlight and ProjScan can be exercised through `npx` in the maintainer environment.

## Likely Files or Areas
- `scripts/maintenance-check.mjs`
- `scripts/dogfood.mjs`
- `package.json`
- `tests/*maintenance*`
- `tests/*dogfood*`
- `README.md`
- `docs/maintenance-guards.md`
- `CHANGELOG.md`

## Files or Areas Not to Touch
- Release version fields
- Git tags
- GitHub release metadata
- npm package publishing state
- MCP Registry publishing state

## Acceptance Criteria
- Release pipeline documentation and proof commands remain current
- README and public docs stay user-facing
- GHCR and MCP Registry proof remains current
- SchemaStore guidance is current when schema URL or shape has not changed
- Policy packs remain local, small, safe, and no-overwrite
- GitHub metadata import remains explicit, read-only, optional, and documented

## Verification Commands
- npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/dogfood-script.test.ts tests/package-scripts.test.ts
- npm run maintenance:check -- --json
- npm run check:public-docs
- node dist/cli/index.js release-proof --strict --redact-paths
- node dist/cli/index.js schemastore --json
- node dist/cli/index.js policy packs --json
- node dist/cli/index.js github import --help
- projscan --format json doctor
- npx --yes agentflight@latest --version

## Post-Verification Gates
- npm run dogfood:strict
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js prepare-pr --stdout --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.
- `maintenance:check` runs live release proof and `npx` tool checks, so it can fail on network or registry availability.
- The maintenance gate must not publish, tag, upload, post comments, or pass token-like environment variables to child processes.

## Rollback Notes
Revert `scripts/maintenance-check.mjs`, restore the previous `maintenance:check` package script, revert the ProjScan dogfood argument-order change, and remove the associated tests/docs/changelog entries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
