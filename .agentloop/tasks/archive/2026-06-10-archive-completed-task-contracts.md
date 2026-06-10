# Archive completed task contracts

- Created date: 2026-06-10
- Task type: docs
- Status: done

## Problem Statement
AgentLoopKit's active task folder still contains completed and legacy task contracts, so task doctor reports more than one hundred warnings even though current work is clean.

## Desired Outcome
Move completed and legacy terminal task contracts into the archive folder while preserving deferred future tasks in the active folder.

## Constraints
- Do not delete task history.
- Do not archive deferred future distribution tasks.
- Do not change runtime CLI behavior.

## Non-Goals
- Do not add a bulk archive command in this cleanup.
- Do not cut a release.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- .agentloop/tasks/
- .agentloop/dogfood-log.md
- CHANGELOG.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Only deferred future tasks remain in .agentloop/tasks/ outside README.md and archive/.
- agentloop task doctor reports zero diagnostics.
- agentloop status reports no active task and no latest open task after archiving.

## Result
- Archived 103 completed or legacy task contracts through `agentloop task status` and `agentloop task archive`.
- Preserved `.agentloop/tasks/2026-06-10-add-scoop-winget-manifests.md` and `.agentloop/tasks/2026-06-10-explore-vscode-open-vsx-extension.md` as deferred future work.
- Preserved `.agentloop/tasks/README.md`.
- Runtime CLI behavior, package metadata, release state, and README content were not changed.

## Verification Commands
- node dist/cli/index.js task doctor --json
- node dist/cli/index.js status --json
- npx pnpm@10.12.1 check:links
- git diff --check
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Document how to revert or disable this change.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
