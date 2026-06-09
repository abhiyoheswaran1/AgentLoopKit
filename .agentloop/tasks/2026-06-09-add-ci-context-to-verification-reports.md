# Add CI context to verification reports

- Created date: 2026-06-09
- Task type: feature
- Status: done

## Problem Statement
CI-generated AgentLoopKit verification reports do not say which CI run created them, so reviewers lose provenance when reports are uploaded as artifacts.

## Desired Outcome
Verification reports include safe, allowlisted CI context when run in GitHub Actions or generic CI, while local reports stay concise.

## Constraints
- Do not read .env files or print arbitrary environment variables.
- Keep CI metadata additive and deterministic.
- Do not require network calls or new dependencies.

## Non-Goals
- Do not add a CI dashboard, artifact uploader, or workflow installer.
- Do not expose secrets or arbitrary process environment values.

## Assumptions
- GitHub Actions is the first CI provider worth identifying explicitly.

## Likely Files or Areas
- src/core/verification.ts
- tests/verification.test.ts
- docs/verification-reports.md
- docs/github-actions.md

## Files or Areas Not to Touch
- .env
- node_modules

## Acceptance Criteria
- GitHub Actions environment variables produce a CI Context section with workflow, event, ref, commit, and run URL.
- Generic CI produces a minimal CI Context section without provider-specific claims.
- Local verification reports do not include noisy CI metadata.

## Verification Commands
- npx pnpm@10.12.1 test tests/verification.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 typecheck
- npx pnpm@10.12.1 build
- npx projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the verification metadata helper, report rendering change, and docs updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
