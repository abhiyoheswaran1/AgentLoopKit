# Add dependency-upgrade workflow example

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Dependency upgrades are common in agent-generated work, but users need a concrete AgentLoopKit example that explains lockfile review, verification, rollback, and human review triggers without adding a scanner or package manager automation.

## Desired Outcome
The repo includes a dependency-upgrade workflow doc and example artifacts that show how agents should scope dependency changes and hand off lockfile evidence.

## Constraints
- Docs and examples only.
- Do not change package dependencies or lockfiles.
- Do not add vulnerability scanning, package-audit integration, or automated upgrade behavior.

## Non-Goals
- Do not add dependency bots, policy enforcement, or external API calls.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/dependency-upgrades.md
- examples/dependency-upgrade
- README.md
- docs/getting-started.md

## Files or Areas Not to Touch
- package.json
- pnpm-lock.yaml
- src/core
- src/cli

## Acceptance Criteria
- Docs explain dependency-upgrade task contracts, lockfile review notes, verification, and rollback.
- Example folder includes README, sample task, sample verification report, and sample PR summary.
- README and getting-started docs link to the dependency-upgrade workflow without claiming scanner or audit behavior.

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
Remove dependency-upgrade docs and example folder and revert docs links.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
