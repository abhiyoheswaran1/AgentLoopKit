# Add public docs hygiene to dogfood gate

- Created date: 2026-06-13
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit already checks public docs during release smoke, but the regular dogfood gate does not catch README/docs release-channel or internal-chatter regressions during everyday product work.

## Desired Outcome
npm run dogfood and npm run dogfood:strict run a read-only public docs hygiene step that reuses existing release-smoke assertions without packing, publishing, tagging, reading tokens, or making network calls.

## Constraints
- Reuse existing public-doc assertion helpers where practical.
- Keep the new dogfood step read-only and deterministic.
- Do not run npm pack, npm publish, gh release, or registry checks from the dogfood gate.

## Non-Goals
- Do not change release publishing automation.
- Do not add a SaaS, cloud service, telemetry, or external API dependency.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- scripts/dogfood.mjs
- scripts/smoke-packed-release.mjs
- tests/dogfood-script.test.ts
- tests/release-smoke.test.ts
- package.json
- README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Dogfood step plan includes a public docs hygiene check before review evidence gates.
- The hygiene check fails on stale public docs claims and passes current repo docs.
- Default and strict dogfood modes remain read-only and token-safe.
- Docs mention the new dogfood check where appropriate.

## Verification Commands
- npm test -- tests/dogfood-script.test.ts tests/release-smoke.test.ts
- npm run typecheck
- npm run build
- npm run check:links
- git diff --check

## Post-Verification Gates
- npm run dogfood:strict
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- A dogfood step that is too heavy would slow every local self-check.
- Importing release-smoke helpers must not accidentally run packed-release smoke.

## Rollback Notes
Remove the dogfood step and any helper script/docs added for it.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
