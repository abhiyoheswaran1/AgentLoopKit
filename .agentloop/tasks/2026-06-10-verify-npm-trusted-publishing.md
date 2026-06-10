# Verify npm trusted publishing

- Created date: 2026-06-10
- Task type: release
- Status: proposed

## Problem Statement
AgentLoopKit is published on npm and npm trusted publishing is configured, but the next release must prove the GitHub Release workflow can publish through OIDC without manual browser authentication.

## Desired Outcome
A future release is published through `.github/workflows/publish.yml`, npm latest matches `package.json`, and maintainer docs record the result.

## Constraints
- Do not use long-lived npm tokens.
- Do not paste npm OTPs or tokens into chat, issues, docs, or logs.
- Keep npm and npx as the primary distribution path.

## Non-Goals
- Do not add a new release channel in this task.
- Do not change package behavior unless release verification exposes a bug.

## Likely Files or Areas
- .github/workflows/publish.yml
- docs/npm-publishing.md
- docs/release-status.md
- docs/launch-checklist.md
- CHANGELOG.md
- package.json

## Acceptance Criteria
- GitHub release triggers the publish workflow.
- Workflow either publishes the new version or skips because it already exists.
- `agentloop npm-status --expect-current` passes after publish.
- Docs state the verified release path.

## Verification Commands
- npm view agentloopkit version versions --json
- npx --yes agentloopkit@<version> version
- agentloop npm-status --expect-current

## Rollback Notes
If trusted publishing fails, document the failure in maintainer docs and use a patch release after the workflow is fixed.
