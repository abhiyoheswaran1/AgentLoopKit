# Align dirty-work guidance with non-evidence wording

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed create-task/status/next dirty-work guidance says dirty non-AgentLoop files even though the implementation counts non-evidence files and examples can include local .agentloop product or harness files. That wording is misleading.

## Desired Outcome
Dirty-work warnings and next-action guidance consistently say dirty non-evidence files while preserving warning codes, JSON field names, counts, examples, and safety behavior.

## Constraints
- Output-only terminology change; do not change dirty-file classification, warning codes, or JSON field names.
- Keep warnings advisory and bounded to counts plus path examples; do not read dirty file contents.
- Keep changes scoped to CLI copy, docs/templates, tests, changelog, decisions, backlog, and research evidence.

## Non-Goals
- No cleanup, stash, reset, archive, commit, or deletion behavior.
- No release, version bump, tag, publish, or registry work.
- No broad changed-file scoring redesign.

## Assumptions
- AgentLoop evidence files stay excluded from the dirty-work warning; local non-evidence files under .agentloop may still be included.

## Likely Files or Areas
- src/cli/commands/create-task.ts
- src/core/status.ts
- tests/create-task.test.ts
- tests/status.test.ts
- tests/next.test.ts
- tests/init.test.ts
- docs/cli-reference.md
- docs/status.md
- docs/task-contracts.md
- src/templates/tasks/README.md
- .agentloop/tasks/README.md
- README.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-162.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human create-task dirty-work warning says dirty non-evidence files.
- Status and next create-task reasons say existing dirty non-evidence files.
- Generated task README guidance says dirty non-evidence files and still states contents are not read or cleaned.
- Existing JSON warning codes and counts remain compatible.

## Verification Commands
- npm test -- tests/create-task.test.ts tests/status.test.ts tests/next.test.ts tests/init.test.ts
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
Revert the terminology updates in CLI copy, docs/templates, tests, and product records; no evidence files need deletion.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
