# Limit stale evidence preview output

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
agentloop artifacts --stale can print hundreds of stale evidence candidates in long-running repos, making the safe preview hard to scan.

## Desired Outcome
Users can cap stale-preview output without losing total candidate counts or safety notes.

## Constraints
- Keep stale preview read-only.
- Do not delete, move, archive, or mutate evidence files.
- Preserve normal `agentloop artifacts` behavior.
- Keep public docs user-facing and concise.

## Non-Goals
- Do not add automatic cleanup or retention policies.
- Do not add network calls, telemetry, release behavior, or registry checks.
- Do not change the run ledger format.

## Assumptions
- Long-running repos need scannable terminal output more than exhaustive Markdown lists.
- JSON callers may still need deterministic access to full candidate metadata unless they request a limit.

## Likely Files or Areas
- `src/core/artifacts.ts`
- `src/cli/commands/artifacts.ts`
- `tests/artifacts.test.ts`
- `README.md`
- `docs/cli-reference.md`
- `docs/getting-started.md`

## Files or Areas Not to Touch
- `package.json` version
- Release workflows
- Registry metadata
- Destructive filesystem cleanup code

## Acceptance Criteria
- Markdown stale preview shows a bounded candidate list and reports how many candidates are hidden.
- The limit flag controls stale preview output and rejects invalid values.
- JSON output includes total counts and respects the limit flag when provided.

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
Revert the CLI/core/test/docs changes if the bounded preview shape is not useful.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
