# Add repo-type policy examples

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Maintainers can customize policies, but docs do not show concrete policy snippets for common repo types such as web apps, APIs, Python services, docs-only repos, and monorepos.

## Desired Outcome
GitHub docs include practical policy examples by repo type, with links from the policy docs and no package/runtime changes.

## Constraints
- Docs-only change outside package contents.
- Do not change package version, README, dist, or CLI behavior.

## Non-Goals
- Do not add a policy pack system or enforcement engine.
- Do not create another GitHub release for docs-only examples.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/policy-examples.md
- docs/policies.md
- ROADMAP.md
- FINAL_HANDOFF.md
- .agentloop/dogfood-log.md

## Files or Areas Not to Touch
- package.json
- README.md
- src
- dist

## Acceptance Criteria
- docs/policy-examples.md covers at least five common repo types.
- docs/policies.md links to the examples.
- Examples avoid compliance claims and automatic enforcement language.

## Verification Commands
- git diff --check
- npx pnpm@10.12.1 check:links
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs commit if examples create confusion or imply policy enforcement.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
