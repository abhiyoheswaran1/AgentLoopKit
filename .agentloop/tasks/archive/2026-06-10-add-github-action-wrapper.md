# Add GitHub Action wrapper

- Created date: 2026-06-10
- Task type: feature
- Status: done

## Problem Statement
Teams currently copy npm install and `agentloop` commands into each workflow. A thin GitHub Action wrapper could reduce setup friction.

## Desired Outcome
A composite GitHub Action installs a pinned AgentLoopKit version and runs a chosen command such as `check-gates`, `verify`, `handoff`, or `ci-summary`.

## Constraints
- Keep the action a thin wrapper around the npm package.
- Require an explicit command input.
- Do not upload artifacts unless the workflow author configures that separately.
- Do not read secrets or arbitrary environment variables.

## Non-Goals
- Do not create a hosted GitHub app.
- Do not comment on PRs automatically in the first version.

## Likely Files or Areas
- action.yml
- docs/github-actions.md
- examples/github-actions/
- tests or script checks for action metadata

## Acceptance Criteria
- Example workflow runs `agentloop check-gates --strict` through the action.
- Inputs are documented.
- The action pins an AgentLoopKit version or accepts one explicitly.

## Verification Commands
- npx pnpm@10.12.1 check:links
- npm run typecheck
- npm test

## Rollback Notes
Remove the action metadata and examples if the wrapper adds confusion compared with direct npm install.
