# Add repeatable dogfood gate and official icon assets

- Created date: 2026-06-12
- Task type: feature
- Status: done

## Problem Statement
AgentLoopKit dogfooding still relies on a remembered sequence of CLI checks, and public docs do not consistently use the official icon assets now present under docs/logo.

## Desired Outcome
The repo has one repeatable dogfood command for AgentLoopKit self-checks, and README/docs/assets use the official icon with clean cropped edges.

## Constraints
- None recorded yet.

## Non-Goals
- None recorded yet.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- package.json
- scripts
- tests
- README.md
- docs
- docs/logo

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A documented npm dogfood script runs the core AgentLoopKit self-check sequence without publishing or external tokens
- Automated tests cover the dogfood script command plan or behavior
- README uses the official AgentLoopKit icon from committed assets
- Official icon assets are committed in the docs asset set with any visible white edge trimmed if needed
- Public docs remain user-facing and avoid internal release chatter

## Verification Commands
- npm test -- tests/dogfood-script.test.ts
- npm run dogfood
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
- Dogfood command could become too slow or mutate evidence unexpectedly if not scoped carefully

## Rollback Notes
Remove the dogfood script, generated icon asset references, and docs changes

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
