# Mark README HTML assets as documentation

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
GitHub language stats count README screenshot source HTML as product HTML, which makes AgentLoopKit look like it has a frontend app.

## Desired Outcome
GitHub Linguist treats the README visual HTML sources as documentation/generated assets while the product remains a TypeScript CLI.

## Constraints
- Do not remove the HTML sources; Playwright needs them for reproducible screenshots.
- Do not change packaged CLI behavior.

## Non-Goals
- Do not build a frontend.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- None recorded yet.

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- A .gitattributes rule marks docs/assets/readme/*.html as non-product language stats input.

## Verification Commands
- git check-attr -a -- docs/assets/readme/showcase.html docs/assets/readme/verification.html

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
