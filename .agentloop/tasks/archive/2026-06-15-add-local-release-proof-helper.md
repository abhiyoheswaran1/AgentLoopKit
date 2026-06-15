# Add local release proof helper

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
Post-release proof for npm, GitHub Releases, GHCR, and MCP Registry is still gathered manually across commands and workflow pages, which makes release checks slower and easier to miss.

Audit note: `agentloop release-proof` already exists. The current gap is hardening: packages without MCP server metadata should still get npm, GitHub Release, and GHCR proof instead of a command-level crash.

## Desired Outcome
agentloop release-proof produces one read-only Markdown or JSON report summarizing local version, npm availability, GitHub release status, GHCR image status, MCP registry status, and safety boundaries.

## Constraints
- Keep `release-proof` read-only.
- Keep live metadata checks explicit to the `release-proof` command.
- Preserve deterministic fixture-driven tests.
- Treat missing optional channel metadata as warnings when the rest of the proof can still be evaluated.

## Non-Goals
- Do not publish, tag, upload, create GitHub releases, post comments, or read credentials.
- Do not add tokens, API keys, telemetry, or environment scanning.
- Do not change version metadata or cut a release.

## Assumptions
- Not every repository using AgentLoopKit has an MCP server.
- A release proof command should remain useful for npm, GitHub Release, and GHCR even when MCP Registry proof is not configured.

## Likely Files or Areas
- `src/core/release-proof.ts`
- `tests/release-proof.test.ts`
- `docs/release-proof.md`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- `package.json` version fields
- publish workflows and release tags
- npm, GitHub, GHCR, MCP Registry, or SchemaStore publication state

## Acceptance Criteria
- release-proof is read-only, explicit, and never publishes, tags, uploads, reads tokens, reads .env contents, or changes package metadata.
- release-proof supports fixture inputs for deterministic tests without network access.
- release-proof reports pass/warn/fail per channel and gives clear next actions.
- README and CLI reference document release-proof as a maintainer command, not an end-user install step.

## Verification Commands
- npm test -- tests/release-proof.test.ts
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run build

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/release-proof.test.ts
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the release-proof hardening test, core fallback behavior, and docs. The command will return to failing when MCP metadata is absent.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
