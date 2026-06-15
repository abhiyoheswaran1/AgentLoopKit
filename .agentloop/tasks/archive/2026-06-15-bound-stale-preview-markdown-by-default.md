# Bound stale preview markdown by default

- Created date: 2026-06-15
- Task type: feature
- Status: done

## Problem Statement
agentloop artifacts --stale is safe, but human Markdown output can still flood the terminal in repos with long evidence histories unless users already know to pass a limit.

## Desired Outcome
Human stale-preview output is bounded by default, while JSON remains complete unless a caller passes a limit.

## Constraints
- Keep stale preview read-only.
- Do not delete, move, archive, or mutate evidence files.
- Keep `--json` complete by default for scripts and agents.
- Keep public docs user-facing and concise.

## Non-Goals
- Do not add automatic cleanup or retention policy enforcement.
- Do not change default `agentloop artifacts` inventory output.
- Do not read `.env` contents, call external APIs, or change release metadata.

## Assumptions
- Human terminal output should be scannable by default.
- JSON callers prefer full candidate data unless they explicitly ask for a limit.

## Likely Files or Areas
- `src/core/artifacts.ts`
- `src/cli/commands/artifacts.ts`
- `tests/artifacts.test.ts`
- `docs/cli-reference.md`
- `docs/getting-started.md`

## Files or Areas Not to Touch
- `package.json` version
- Release workflows
- Registry metadata
- Destructive filesystem cleanup code

## Acceptance Criteria
- Plain agentloop artifacts --stale shows a bounded candidate list and hidden count when candidates exceed the default.
- agentloop artifacts --stale --json still returns all candidates unless a limit is provided.
- The default cap is documented and --limit can override it for Markdown or JSON.

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
Revert the CLI/core/test/docs changes if the default Markdown cap proves confusing.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
