# Separate AgentLoop evidence churn in status output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Long autonomous AgentLoopKit sessions create many local AgentLoop/AgentFlight evidence files. `maintainer-check`, `handoff`, and `prepare-pr` already separate AgentLoop evidence churn from the smaller reviewable source/docs/test surface, but `agentloop status --brief` still reports only one large dirty-file count. That makes normal dogfood state look broader and riskier than it is.

## Desired Outcome
`agentloop status` keeps the existing total dirty-file count and also reports how many changed files are non-evidence versus AgentLoop evidence. Human brief and Markdown output become easier to scan, while JSON gains additive fields for automation.

## Constraints
- Preserve existing next-action semantics.
- Keep JSON changes additive and backward-compatible.
- Reuse the existing AgentLoop evidence classifier.
- Do not hide the total dirty-file count.
- Do not add cleanup automation, file deletion, release behavior, registry calls, telemetry, or dependencies.

## Non-Goals
- No changes to `maintainer-check`, `handoff`, `prepare-pr`, or evidence grouping semantics outside `status`.
- No retention policy for generated evidence.
- No version bump, tag, publish, or release-channel work.

## Assumptions
- AgentLoop evidence files are the same local generated paths already recognized by `src/core/agentloop-evidence.ts`.
- Reviewers still need the flat changed-file list in JSON for scripts and diagnostics.

## Likely Files or Areas
- src/core/status.ts
- tests/status.test.ts
- docs/status.md
- docs/cli-reference.md

## Files or Areas Not to Touch
- package version metadata
- release workflows, release notes, tags, npm, GHCR, GitHub Releases, MCP Registry, GitHub Marketplace
- dependency manifests or lockfiles

## Acceptance Criteria
- Status JSON includes additive working-tree counts for non-evidence and AgentLoop evidence files.
- Human `status --brief` shows dirty totals with non-evidence and AgentLoop evidence counts.
- Human Markdown status output shows the same breakdown without changing next-action decisions.
- Clean-tree output remains unchanged.
- Docs describe the breakdown without implying cleanup or deletion.

## Verification Commands
- npm test -- tests/status.test.ts
- npm run typecheck
- npm run check:public-docs

## Post-Verification Gates
- npx --yes agentflight verify -- npm test -- tests/status.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the status renderer/count changes, focused tests, and status/CLI reference documentation updates.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
