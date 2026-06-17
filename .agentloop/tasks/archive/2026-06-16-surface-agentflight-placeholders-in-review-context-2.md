# Surface AgentFlight placeholders in review context

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
review-context summarizes ordinary task artifacts but omits preserved AgentFlight placeholder task artifacts, so agents lose the distinction between roadmap work and session scaffolding when using one read-only snapshot.

## Desired Outcome
review-context human and JSON output expose AgentFlight placeholder task artifact counts from the artifact inventory without changing artifact discovery, task classification, release behavior, or publishing.

## Constraints
- Keep artifact discovery and AgentFlight placeholder classification unchanged.
- Keep `review-context` read-only; do not run commands, scan broadly, call APIs, read tokens, or mutate task artifacts.
- Do not change release, publishing, package metadata, or distribution behavior.
- Preserve existing JSON fields and add only bounded summary data derived from the artifact inventory.

## Non-Goals
- Do not archive, delete, hide, or mutate AgentFlight placeholder tasks.
- Do not change `status`, `next`, `task list`, or `artifacts` semantics.
- Do not add a new task source or placeholder detector.
- Do not touch release/distribution tasks or Marketplace publication.

## Assumptions
- `review-context` already embeds `renderArtifactInventoryJson(inventory)`, so the placeholder summary can be surfaced from that existing data.
- Agents need the human snapshot to distinguish ordinary roadmap tasks from preserved AgentFlight session placeholders without parsing full artifact JSON.

## Likely Files or Areas
- `src/core/review-context.ts`
- `tests/review-context.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- `src/core/artifacts.ts`, except if a test proves the existing summary is insufficient.
- Release workflows, package metadata, lockfiles, publish scripts, Marketplace task files, and distribution manifests.

## Acceptance Criteria
- `agentloop review-context --json` exposes the existing artifact inventory placeholder summary under `artifacts.tasks.agentFlightPlaceholders` when placeholders exist.
- Human `agentloop review-context` output shows preserved AgentFlight placeholder task count beside ordinary task artifact counts.
- Human output remains Markdown-safe for dynamic values.
- Existing review-context JSON consumers keep their current fields.
- Focused tests cover JSON and Markdown output for ordinary task artifacts plus AgentFlight placeholders.

## Verification Commands
- npm test -- tests/review-context.test.ts
- npm run typecheck
- npm run lint
- npm run build
- npm test

## Post-Verification Gates
- No post-verification gate recorded. Use this for commands that need a fresh AgentLoop verification report.

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the review-context formatter/test/docs changes. Artifact inventory and task classification behavior will remain as implemented by the prior task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
