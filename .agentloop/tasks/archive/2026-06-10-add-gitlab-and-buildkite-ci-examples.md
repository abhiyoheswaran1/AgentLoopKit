# Add GitLab and Buildkite CI examples

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
Teams using GitLab CI or Buildkite do not have copyable AgentLoopKit CI recipes, and the existing GitHub Actions example still pins an older v0.19.0 tarball.

## Desired Outcome
Docs show local-first AgentLoopKit CI usage for GitHub Actions, GitLab CI, and Buildkite while keeping npm status honest and avoiding workflow installers.

## Constraints
- Do not add a workflow installer or mutate user CI config from the CLI.
- Keep examples docs-only and pin the current v0.23.0 GitHub tarball until npm catches up.
- Do not claim provider API integration; ci-summary remains local and allowlisted.

## Non-Goals
- No CLI behavior changes.
- No new dependencies.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- docs/github-actions.md
- docs/ci-summary.md
- examples/github-actions/README.md
- examples/gitlab-ci/README.md
- examples/buildkite/README.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- `examples/github-actions/README.md` no longer pins the stale `v0.19.0` tarball.
- GitLab CI example shows an evidence gate and a CI-generated evidence artifact job.
- Buildkite example shows an evidence gate and a CI-generated evidence artifact step.
- Docs state that GitLab CI and Buildkite currently produce Generic CI provenance unless AgentLoopKit adds provider-specific allowlists later.
- Examples remain docs-only and do not imply AgentLoopKit installs or mutates CI workflows.

## Verification Commands
- npx pnpm@10.12.1 check:links
- npx pnpm@10.12.1 test
- npx pnpm@10.12.1 build

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the docs-only CI examples commit.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
