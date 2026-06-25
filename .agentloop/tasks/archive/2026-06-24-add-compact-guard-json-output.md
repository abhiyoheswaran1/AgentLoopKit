# Add compact Guard JSON output

- Created date: 2026-06-24
- Task type: feature
- Status: done

## Problem Statement
agentloop guard --json returns the full evidenceMap.files list, which becomes very large in dirty repos and wastes agent context when callers only need preflight status, findings, budget, and source handles.

## Desired Outcome
Guard should offer an explicit compact JSON mode that omits the full changed-file list while preserving status, findings, context budget, next actions, and an expandable evidence-map handle.

## Constraints
- Do not change default guard --json output shape.
- Use the existing compactEvidenceMap contract rather than inventing a second compact schema.
- Keep watch mode behavior explicit and tested.

## Non-Goals
- Do not add a Guard MCP tool in this task.
- Do not remove full file-list access from existing JSON callers.

## Assumptions
- None recorded yet.

## Likely Files or Areas
- src/core/guard.ts
- src/cli/commands/guard.ts
- tests/guard.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- agentloop guard --json --compact returns evidenceMap.fileList with omitted true and no evidenceMap.files array.
- agentloop guard --json without --compact still returns evidenceMap.files.
- agentloop guard --watch --json --compact compacts each snapshot.
- CLI docs mention --compact for Guard JSON.

## Verification Commands
- npm run test:unit -- tests/guard.test.ts
- npm run typecheck
- npm run build
- npm run dogfood
- npm run lint

## Post-Verification Gates
- node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-add-compact-guard-json-output.md --task-commands --only-task-commands --progress --write-run --redact-paths
- node dist/cli/index.js ship --redact-paths
- node dist/cli/index.js prepare-pr --redact-paths
- node dist/cli/index.js check-gates --redact-paths

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Guard JSON is machine-readable; default compatibility must remain intact.
- Pre-existing dirty non-evidence files before task creation: 70 total; examples: `.agentloop/README.md`, `.agentloop/agents/claude-code.md`, `.agentloop/agents/codex.md`, `.agentloop/agents/cursor.md`, `.agentloop/agents/gemini-cli.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Revert Guard compact JSON option, docs, and tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
