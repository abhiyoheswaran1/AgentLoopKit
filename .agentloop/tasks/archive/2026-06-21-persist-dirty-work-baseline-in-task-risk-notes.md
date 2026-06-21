# Persist dirty-work baseline in task risk notes

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Long autonomous sessions can create a new task over an already dirty worktree. create-task warns immediately, but that dirty baseline is not persisted in the task contract, so later ship and handoff evidence can lose which dirty files predated the task.

## Desired Outcome
When create-task warns about pre-existing dirty non-evidence files, the generated task contract includes a bounded risk note with the same count and examples so reviewers and agents retain the baseline context.

## Constraints
- Do not change dirty-file classification, warning codes, JSON warning fields, or create-task exit behavior.
- Do not read dirty file contents; persist only count and bounded path examples already exposed by the warning.
- Keep the risk note inside the existing Risk Notes section instead of adding a new task schema section.

## Non-Goals
- No cleanup, stash, reset, archive, commit, deletion, or worktree baseline database.
- No release, version bump, tag, publish, or registry work.
- No ship scoring or changed-file attribution redesign.

## Assumptions
- A risk note is the lowest-friction place to preserve this context because ship and prepare-pr already surface task risk notes.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- tests/create-task.test.ts
- docs/task-contracts.md
- docs/cli-reference.md
- src/templates/tasks/README.md
- .agentloop/tasks/README.md
- README.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-163.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Dirty create-task output keeps the existing warning and JSON code while task.markdown includes a Risk Notes bullet for pre-existing dirty non-evidence files.
- The persisted risk note includes the dirty file count and bounded path examples only.
- Clean create-task output keeps the default risk-note fallback unchanged.
- Docs explain that the persisted baseline is advisory and does not read contents, clean files, or block task creation.

## Verification Commands
- npm test -- tests/create-task.test.ts
- npm run check:public-docs
- npm run check:links
- npx --no-install tsx src/cli/index.ts task doctor --redact-paths
- npx --yes projscan doctor --format markdown

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the create-task risk-note helper, tests, docs, and product records; no task or evidence cleanup is required.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
