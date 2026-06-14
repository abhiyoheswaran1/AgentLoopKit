# Improve roadmap adoption evidence

- Created date: 2026-06-14
- Task type: feature
- Status: done

## Problem Statement
Roadmap and simulated research point to adoption polish: teams need clearer organization policy-pack examples, and imported GitHub issue/PR metadata should become useful in local review evidence without API calls, tokens, telemetry, or posting comments.

## Desired Outcome
AgentLoopKit documents practical organization policy-pack workflows, records the simulated research cycle, and surfaces explicit local GitHub metadata in review-context, prepare-pr, and maintainer-check outputs with tests and docs.

## Constraints
- Keep all GitHub metadata usage read-only and sourced only from .agentloop/github/context.json.
- Do not call GitHub APIs, read tokens, read .env files, post comments, or add cloud features.

## Non-Goals
- Do not build a VS Code extension, Scoop/WinGet manifests, hosted dashboard, telemetry, or paid-team features.

## Assumptions
- Local GitHub metadata has already been normalized by `agentloop github import`.
- Missing GitHub metadata should be neutral, not a warning or failure.

## Likely Files or Areas
- `.agentloop/research/`
- `.agentloop/backlog.md`
- `docs/policies.md`
- `docs/policy-examples.md`
- `docs/github-metadata.md`
- `docs/cli-reference.md`
- `src/core/github-metadata.ts`
- `src/core/review-context.ts`
- `src/core/prepare-pr.ts`
- `src/core/maintainer-check.ts`
- related Vitest coverage

## Files or Areas Not to Touch
- release metadata and package version
- marketplace/package-manager release channels
- GitHub Actions publishing workflows unless a test proves they are affected

## Acceptance Criteria
- Simulated user research cycle is documented internally and clearly labeled as simulated.
- Organization policy-pack examples are documented with safe no-overwrite local workflow guidance.
- review-context reports imported GitHub issue/PR metadata summaries when .agentloop/github/context.json exists.
- prepare-pr includes imported GitHub issue/PR context in PR body and JSON output when available.
- maintainer-check adds a read-only GitHub metadata check without treating missing metadata as a failure.
- Tests cover GitHub metadata consumption and docs remain user-facing.

## Verification Commands
- npm run test:unit
- npm run test:integration
- npm run check:public-docs
- npm run check:links

## Post-Verification Gates
- npm run dogfood:strict

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Imported issue and PR text is untrusted. Escape Markdown in user-facing output.
- Do not read raw `.env` files, GitHub tokens, or remote APIs.
- Do not make missing GitHub metadata look like a review blocker.

## Rollback Notes
Revert the docs, tests, and GitHub metadata evidence changes. Existing imported `.agentloop/github/context.json` files remain local user data and do not need migration.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
