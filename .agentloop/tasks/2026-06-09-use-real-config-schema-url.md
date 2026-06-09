# Use real config schema URL

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement

Generated configs and the package schema point at https://agentloopkit.dev/schema/agentloop.config.schema.json, but the repo has no proof that this custom domain hosts the schema. That weakens launch trust.

## Desired Outcome

Generated configs, default config values, the repo config, and the packaged schema use a reachable GitHub raw schema URL until a dedicated domain is configured.

## Constraints

- Do not add a hosted service or custom domain setup.
- Do not change config validation semantics.
- Keep the schema file packaged locally.
- Do not introduce network calls in the CLI.

## Non-Goals

- No schema-store submission.
- No agentloopkit.dev hosting work.
- No config version bump.

## Assumptions

- None recorded yet.

## Likely Files or Areas

- src/core/config.ts
- src/templates/root/agentloop.config.json
- schema/agentloop.config.schema.json
- agentloop.config.json
- tests/config.test.ts
- tests/schema.test.ts
- docs/configuration.md

## Files or Areas Not to Touch

- .env

## Acceptance Criteria

- Default config `$schema` uses the GitHub raw schema URL.
- Generated init config uses the same schema URL.
- `schema/agentloop.config.schema.json` `$id` matches the same URL.
- Docs explain that the package also ships the schema locally.

## Verification Commands

- npx pnpm@10.12.1 test tests/config.test.ts tests/schema.test.ts tests/init.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes

Revert schema URL references to the previous custom-domain placeholder if a hosted domain is configured later.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
