# Add GitLab and Buildkite CI provenance

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
GitLab CI and Buildkite examples now exist, but AgentLoopKit still reports those providers as Generic CI, so verification reports and ci-summary artifacts lose useful non-secret provenance.

## Desired Outcome
Verification reports and ci-summary output identify GitLab CI and Buildkite with allowlisted workflow/event/ref/commit/run URL fields and continue to avoid secrets, provider APIs, and arbitrary environment dumping.

## Constraints
- Use TDD: add failing tests before production code.
- Read only documented, non-secret provider environment variables.
- Do not call GitLab or Buildkite APIs.
- Do not read token, password, repository URL with embedded credentials, or arbitrary environment variables.
- Keep generic CI fallback for unsupported providers.

## Non-Goals
- No workflow installer.
- No provider dashboard integration.
- No telemetry or network calls.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/verification.ts
- src/core/ci-summary.ts
- tests/verification.test.ts
- tests/ci-summary.test.ts
- docs/ci-summary.md
- docs/verification-reports.md
- examples/gitlab-ci/README.md
- examples/buildkite/README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- `agentloop verify` reports `Provider: GitLab CI` with allowlisted pipeline/ref/commit/run URL fields when GitLab CI variables are present.
- `agentloop verify` reports `Provider: Buildkite` with allowlisted pipeline/ref/commit/run URL fields when Buildkite variables are present.
- `agentloop ci-summary --json --write` returns GitLab CI and Buildkite provider IDs and writes matching Markdown.
- Unsupported CI providers still fall back to Generic CI.
- Provider-specific detection does not print unrelated env values, token-like values, or arbitrary environment variables.

## Verification Commands
- npx pnpm@10.12.1 test tests/verification.test.ts tests/ci-summary.test.ts
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the CI provenance feature commit.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
