# Clarify archived task evidence in artifacts output

- Created date: 2026-06-21
- Task type: bugfix
- Status: done

## Problem Statement
Dogfooding showed agentloop artifacts can report current task counts while labeling an archived done task as Latest task, which mixes current task inventory with archived evidence fallback and can confuse reviewers.

## Desired Outcome
Artifacts output distinguishes current task counts from archived task evidence fallback in human output while keeping JSON data compatible and evidence files preserved.

## Constraints
- Keep artifacts read-only and do not delete, move, archive, or rewrite evidence files.
- Preserve existing JSON fields and compatibility; archived fallback remains machine-detectable via archived: true.
- Keep the change narrow to artifact inventory rendering, docs, tests, and product evidence.

## Non-Goals
- No stale evidence cleanup workflow or deletion automation.
- No release, version bump, publish, tag, or registry work.
- No broad artifact schema redesign.

## Assumptions
- Archived done tasks remain useful fallback task evidence when there is no active/open task contract.

## Likely Files or Areas
- src/core/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md
- docs/status.md
- CHANGELOG.md
- DECISIONS.md
- .agentloop/backlog.md
- .agentloop/research/interview-cycle-161.md

## Files or Areas Not to Touch
- None recorded yet.

## Acceptance Criteria
- Human artifacts output labels archived fallback task evidence clearly enough that it is not mistaken for a current task contract.
- Human artifacts output for active/open task contracts keeps the existing latest task wording.
- artifacts --json remains backward compatible and still exposes archived: true for archived fallback tasks.
- Docs describe task counts, AgentFlight placeholders, and archived fallback task evidence without claiming cleanup or mutation.

## Verification Commands
- npm test -- tests/artifacts.test.ts
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
Revert the artifacts renderer/test/docs updates; no generated task, report, handoff, or AgentFlight evidence files need deletion.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
