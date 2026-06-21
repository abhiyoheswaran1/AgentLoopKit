# Show task risk notes in ship reports

- Created date: 2026-06-21
- Task type: feature
- Status: done

## Problem Statement
Ship reports score review readiness but do not render the task contract's Risk Notes, so dirty-work baselines and other reviewer risks can be visible in prepare-pr while missing from the primary ship evidence.

## Desired Outcome
Ship reports include a concise Task Risk Notes section sourced from the active task contract, preserving Markdown safety and existing JSON/run behavior.

## Constraints
- Do not release, tag, publish, bump versions, or change dependencies.
- Keep the change focused on ship report rendering, tests, and docs/evidence.
- Do not read dirty file contents or expand Git scans; use the task contract text already loaded for readiness scoring.

## Non-Goals
- No ship scoring changes.
- No prepare-pr behavior changes.
- No changed-file filtering or baseline diff engine.

## Assumptions
- Risk Notes are already parsed from task Markdown elsewhere with sectionContent and listItems helpers.

## Likely Files or Areas
- src/core/ship.ts
- tests/ship.test.ts
- docs/task-contracts.md
- docs/cli-reference.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Ship report Markdown includes a Task Risk Notes section when the task contract has risk notes.
- Ship report Markdown renders an explicit safe fallback when no risk notes are recorded.
- Risk-note text is escaped as single-line Markdown prose so task content cannot create unintended headings, links, or checkboxes.
- Existing ship score, changed files, run ledger, and prepare-pr behavior remain unchanged.

## Verification Commands
- npm test -- tests/ship.test.ts
- npm run typecheck
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
- Ship reports get one more section, which could be noisy if tasks record vague risks.
- Pre-existing dirty non-evidence files before task creation: 59 total; examples: `.agentloop/backlog.md`, `.agentloop/harness/commands.md`, `.agentloop/tasks/README.md`, `AGENTLOOP.md`, `AGENTS.md`. Confirm they belong to this task before implementation.

## Rollback Notes
Remove the Task Risk Notes section from ship rendering and revert related docs/tests.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
