# Accept redacted CI summary output flag

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement

agentloop ci-summary is a shareable CI evidence command, but it rejects the common --redact-paths flag even though other public-output commands accept it before logs are copied into issues, PRs, or CI artifacts.

## Desired Outcome

agentloop ci-summary accepts --redact-paths in human, JSON, and write modes; public output and written Markdown redact local root paths while preserving raw paths for internal write validation.

## Constraints

- Keep ci-summary local-only; do not call CI provider APIs, read secrets, upload files, or run verification commands.
- Preserve default ci-summary output and JSON shape when --redact-paths is not passed.
- Do not change output-path safety checks or the actual file path used for --write/--out.
- Do not add dependencies, release, bump versions, tag, publish, or touch Marketplace/Scoop/WinGet work.

## Non-Goals

- Do not expand CI provider detection or read additional environment variables.
- Do not change check-gates semantics or verification lookup behavior.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/cli/commands/ci-summary.ts
- src/core/ci-summary.ts
- tests/ci-summary.test.ts
- docs/cli-reference.md
- docs/ci-summary.md
- README.md

## Files or Areas Not to Touch

- None recorded yet.

## Acceptance Criteria

- agentloop ci-summary --json --redact-paths exits 0.
- agentloop ci-summary --write --json --redact-paths redacts the local repo root in JSON markdown and writtenPath while writing the summary to the real validated path.
- Human ci-summary output accepts --redact-paths and does not expose local roots in the rendered summary or written-path confirmation.
- Help/docs make the flag discoverable for ci-summary public-output use.

## Verification Commands

- npm test -- tests/ci-summary.test.ts
- npm run check:public-docs
- npx prettier --check src/cli/commands/ci-summary.ts src/core/ci-summary.ts tests/ci-summary.test.ts docs/cli-reference.md docs/ci-summary.md README.md

## Post-Verification Gates

- npx --no-install tsx src/cli/index.ts ship --redact-paths
- npx --no-install tsx src/cli/index.ts prepare-pr --write --redact-paths
- npm run dogfood:strict

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Redacting JSON writtenPath can make redacted public output unsuitable for scripts that need to open the artifact; default JSON remains raw for scripts.

## Rollback Notes

Remove the ci-summary --redact-paths option, redaction plumbing, tests, and documentation notes.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
