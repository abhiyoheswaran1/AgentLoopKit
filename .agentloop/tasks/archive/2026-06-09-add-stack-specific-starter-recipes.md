# Add stack-specific starter recipes

- Created date: 2026-06-09
- Task type: docs
- Status: done

## Problem Statement
AgentLoopKit has examples for common repo types, but users still need practical verification-command recipes they can copy into task contracts and config.

## Desired Outcome
Add stack-specific starter recipes for Next.js, Node APIs, Python services, docs-only repos, empty repos, and monorepos without changing CLI behavior.

## Constraints
- Docs must stay honest about heuristic project detection
- Do not add a stack-specific runner
- Do not add new dependencies

## Non-Goals
- No framework auto-configuration
- No package graph inference

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/stack-recipes.md
- README.md
- examples/nextjs-app/README.md
- examples/node-api/README.md
- examples/python-service/README.md
- examples/docs-only/README.md
- examples/empty-repo/README.md

## Files or Areas Not to Touch
- src/cli
- src/core

## Acceptance Criteria
- Stack recipes include copy-pasteable verification commands
- Examples explain task contract usage per stack
- Docs distinguish root commands from package-specific checks

## Verification Commands
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 test
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Remove stack recipe docs and example README updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
