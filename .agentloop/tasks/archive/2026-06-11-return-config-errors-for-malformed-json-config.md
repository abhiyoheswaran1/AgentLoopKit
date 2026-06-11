# Return config errors for malformed JSON config

- Created date: 2026-06-11
- Task type: bugfix
- Status: done

## Problem Statement
JSON-mode commands document invalid agentloop.config.json as CONFIG_ERROR, but malformed JSON currently throws a raw SyntaxError before command-level JSON error handling can run.

## Desired Outcome
Malformed agentloop.config.json files are normalized to ConfigError so JSON commands return CONFIG_ERROR and human commands keep clear stderr output.

## Constraints
- Normalize only config parsing failures, not unrelated filesystem or runtime errors
- Keep schema validation errors unchanged
- Do not change package version or release metadata
- Do not add dependencies

## Non-Goals
- Change config schema version
- Implement config migration
- Redesign global error handling

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/config.ts
- tests/config.test.ts
- tests/status.test.ts
- README.md
- docs/configuration.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- loadAgentLoopConfig throws ConfigError for malformed JSON
- status --json returns CONFIG_ERROR for malformed JSON config
- Human commands still print a clear agentloop: Invalid AgentLoopKit config message
- Schema-invalid config behavior remains unchanged

## Verification Commands
- npm test -- tests/config.test.ts tests/status.test.ts
- npm run lint
- npm run typecheck
- npm test
- npm run check:links
- npm run build
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the config loader normalization, tests, docs, and changelog entries.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
