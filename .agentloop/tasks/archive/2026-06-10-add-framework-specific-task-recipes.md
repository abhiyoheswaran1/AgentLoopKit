# Add framework-specific task recipes

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Stack recipes cover broad project types, but users evaluating AgentLoopKit for Remix, SvelteKit, Django, and FastAPI need concrete task-contract examples before the workflow feels directly usable.

## Desired Outcome
The docs include copyable Remix, SvelteKit, Django, and FastAPI task recipes with commands, likely files, risk areas, and verification guidance.

## Constraints
- Docs-only change.
- Do not add framework detection or command execution behavior.
- Do not claim full framework support beyond guidance users can adapt.

## Non-Goals
- Do not add package graph inference or workspace runners.
- Do not add examples that require installing those frameworks.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/stack-recipes.md
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- src/core
- src/cli

## Acceptance Criteria
- Stack recipes include Remix, SvelteKit, Django, and FastAPI sections.
- Each section includes command starter, task-contract example, and extra-care notes.
- README and getting-started docs point users to the expanded framework recipes without overstating support.

## Verification Commands
- npx pnpm@10.12.1 check:links
- git diff --check
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove the framework recipe sections and revert docs links.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
