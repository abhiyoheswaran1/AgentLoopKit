# Redact verification report paths

- Created date: 2026-06-15
- Task type: bugfix
- Status: done

## Problem Statement
Verification reports can include local absolute roots from command output, for example Vitest or build logs printing the current working directory. Dogfooding required manual redaction before committing evidence, which means the product does not fully own its public-output safety model.

## Desired Outcome
`agentloop verify --redact-paths` writes and prints verification evidence with the local repo root replaced by `[git-root]`, including report Markdown and run-ledger copies, while default `verify` behavior remains compatible for private local debugging.

## Constraints
- Keep changes scoped and do not claim completion without proof.
- Do not change which verification commands run.
- Do not redact by default.
- Do not bump version or cut a release.
- Do not introduce network behavior, telemetry, tokens, or new dependencies.

## Non-Goals
- Do not redact arbitrary paths outside the current repo root.
- Do not sanitize secrets beyond existing behavior; command output remains user-controlled and should not contain secrets.
- Do not change report schemas or run-ledger metadata fields.

## Assumptions
- Replacing the local repo root and its resolved macOS `/private/var` alias is enough for this bugfix.
- Repo-relative paths should remain readable in reports and run metadata.

## Likely Files or Areas
- `src/core/verification.ts`
- `src/cli/commands/verify.ts`
- `src/core/redaction.ts`
- `src/core/pr-summary.ts`
- `tests/verification.test.ts`
- Verification docs and README safety copy

## Files or Areas Not to Touch
- Release workflows, package version, npm publishing, GitHub release metadata, GHCR, and MCP Registry publishing.
- Verification command execution semantics.

## Acceptance Criteria
- `agentloop verify --redact-paths` accepts the flag.
- Markdown reports replace local absolute roots with `[git-root]`.
- `agentloop verify --json --redact-paths` redacts JSON `markdown` and command-output excerpts.
- `agentloop verify --write-run --redact-paths` stores a redacted `verification-report.md` in `.agentloop/runs/`.
- Default `agentloop verify` output remains unchanged unless `--redact-paths` is passed.
- README and CLI verification docs mention the flag.

## Verification Commands
- npm test -- tests/verification.test.ts
- npm test -- tests/pr-summary.test.ts
- npm run test:unit
- npm run typecheck
- npm run check:public-docs
- npm run build

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes agentflight doctor
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.
- Main risk is changing report output too broadly. Keep redaction opt-in and limited to the local repo root.
- Second risk is missing macOS path aliases where temp paths appear as both `/var/...` and `/private/var/...`.

## Rollback Notes
Revert the verify flag wiring, shared redaction helper, verification tests, docs/changelog updates, and generated AgentLoop evidence.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
