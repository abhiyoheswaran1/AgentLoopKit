# Add built CLI smoke coverage for SchemaStore output

- Created date: 2026-06-17
- Task type: tests
- Status: done

## Problem Statement
SchemaStore output is covered by source tests and maintenance checks, but the built CLI smoke script does not exercise the packaged schemastore command surface. That leaves distribution smoke without proof that the packaged CLI emits the catalog entry and safety flags.

## Desired Outcome
The built CLI smoke script proves agentloop schemastore --json emits the AgentLoopKit config catalog entry, expected file match and schema URL, and read-only safety flags through the packaged CLI.

## Constraints
- Keep the check read-only; do not submit a SchemaStore contribution, call GitHub, call SchemaStore, read tokens, or write files.
- Keep changes scoped to built CLI smoke coverage and its guard test.
- Do not change SchemaStore output behavior, dependencies, release artifacts, public docs, package versions, or schema files.

## Non-Goals
- Release prep, publishing, Marketplace work, or SchemaStore submission.
- Changing catalog metadata or schema URLs.

## Assumptions
- Existing schemastore tests remain the authority for exact helper behavior, human output formatting, and committed catalog-file parity.

## Likely Files or Areas
- scripts/smoke-cli.mjs
- tests/distribution-artifacts.test.ts

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- schema
- src/core/schemastore.ts
- src/cli/commands/schemastore.ts

## Acceptance Criteria
- A failing guard test is added before implementation to prove the smoke script lacks SchemaStore built CLI coverage.
- scripts/smoke-cli.mjs runs agentloop schemastore --json against the built CLI in the temporary smoke repo.
- The smoke assertion verifies the entry name, agentloop.config.json fileMatch, GitHub raw schema URL, writesFiles false, and callsNetwork false.

## Verification Commands
- npm test -- tests/distribution-artifacts.test.ts -t "CLI smoke script covers SchemaStore output"
- npm test -- tests/distribution-artifacts.test.ts
- npm run typecheck
- npm run build
- node scripts/smoke-cli.mjs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/distribution-artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Low: smoke script changes can become brittle if catalog metadata intentionally changes.

## Rollback Notes
Revert the smoke-cli and distribution-artifacts test changes; no persistent runtime state or dependency changes are expected.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
