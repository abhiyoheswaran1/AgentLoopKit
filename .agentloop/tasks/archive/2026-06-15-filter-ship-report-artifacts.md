# Filter ship report artifacts

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
agentloop artifacts can preview stale ship reports, but users cannot filter artifact inventory or stale previews directly to ship-report evidence.

## Desired Outcome
Users can run agentloop artifacts --type ship-report, agentloop artifacts --type ship-report --latest, and agentloop artifacts --stale --type ship-report to inspect ship report evidence precisely.

## Constraints
- Keep `artifacts` read-only.
- Do not delete, archive, move, or rewrite any evidence files.
- Keep JSON output deterministic and repo-relative.
- Keep public docs user-facing and concise.

## Non-Goals
- No cleanup or retention automation.
- No release, version bump, npm publish, registry calls, or GitHub release work.
- No `.env` contents, token reads, telemetry, or network calls.

## Assumptions
- Ship reports are first-class review evidence and should be filterable like verification reports, handoffs, and run records.
- Adding ship-report inventory is more coherent than making `--type ship-report` work only with `--stale`.

## Likely Files or Areas
- `src/core/artifacts.ts`
- `src/cli/commands/artifacts.ts`
- `tests/artifacts.test.ts`
- `README.md`
- `docs/cli-reference.md`
- `docs/getting-started.md`

## Files or Areas Not to Touch
- `package.json` version fields.
- Release workflows and registry metadata.
- Cleanup, delete, archive, or retention code.

## Acceptance Criteria
- agentloop artifacts includes ship report counts and latest ship report metadata.
- agentloop artifacts --type ship-report and --latest work in Markdown and JSON.
- agentloop artifacts --stale --type ship-report previews only stale ship reports and keeps the latest ship report protected.
- Unsupported artifact type errors still list supported types accurately.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run test:unit
- npm run typecheck
- npm run lint
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/artifacts.test.ts
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the artifact inventory, tests, docs, and this task contract. No generated evidence files need runtime migration.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
