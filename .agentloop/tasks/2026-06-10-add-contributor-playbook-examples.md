# Add contributor playbook examples

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Maintainers have issue templates, but no copyable examples that show how to scope good first issues or verification-focused contributor work.

## Desired Outcome
Add a concise contributor playbook with example issues, maintainer guidance, and verification expectations linked from CONTRIBUTING.md.

## Constraints
- Keep this docs-only and outside npm package behavior.
- Do not claim real contributor feedback.

## Non-Goals
- Do not add a label-sync dependency or automate GitHub labels.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/contributor-playbook.md
- CONTRIBUTING.md
- .agentloop/backlog.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Contributor playbook includes copyable good-first, docs, and verification issue examples.
- CONTRIBUTING.md links to the playbook.
- Backlog and dogfood records explain the iteration.

## Verification Commands
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
Remove docs/contributor-playbook.md and the CONTRIBUTING.md link if the guidance proves noisy.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
