# Separate AgentLoop evidence churn in next output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
`agentloop status` and `agentloop review-context` now separate working-tree changes into non-evidence files and generated AgentLoop evidence, but `agentloop next` still renders a flat `dirty (N changed file(s))` line. During autonomous dogfooding that makes the quick next-action output look noisier than the rest of the loop and hides whether churn is mostly review evidence.

## Desired Outcome
`agentloop next` should preserve its current next-action decisions while reporting the same working-tree evidence breakdown that `status` and `review-context` expose. JSON should gain additive count fields for scripts, and human Markdown should stay one-line and Markdown-safe.

## Constraints
- Keep the command read-only.
- Preserve the existing `next.command` and `next.reason` behavior.
- Keep JSON changes additive; do not remove `workingTree.changedFileCount`.
- Do not hide, delete, archive, or mutate changed files.
- Do not touch release, publishing, package-manager, registry, token, or dependency behavior.

## Non-Goals
- No release prep, version bump, tag, publish, or Marketplace work.
- No broad rewrite of status, review-context, gates, or handoff behavior.
- No cleanup of existing AgentLoop evidence churn.

## Assumptions
- `next` can reuse the already-computed status working-tree counts instead of recomputing git status.
- Human `next` output should match the concise `review-context` shape: `dirty (N; X non-evidence, Y AgentLoop evidence)`.

## Likely Files or Areas
- `src/cli/commands/next.ts`
- `tests/next.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- Release workflows, release notes, npm/GitHub/GHCR/MCP registry publishing paths.
- Dependency manifests and lockfiles.
- Existing archived task evidence except for normal AgentLoop-generated handoff/report artifacts.

## Acceptance Criteria
- `agentloop next --json` includes `workingTree.nonEvidenceChangedFileCount` and `workingTree.agentLoopEvidenceChangedFileCount`.
- Human `agentloop next` output shows dirty working-tree totals as non-evidence plus AgentLoop evidence counts.
- Clean-tree human output remains `Working tree: `clean``.
- The next-action command/reason selection is unchanged.
- Public CLI docs mention the `next` working-tree evidence split without implying cleanup or deletion.

## Verification Commands
- `npm test -- tests/next.test.ts`
- `npm run typecheck`
- `npm run check:public-docs`

## Post-Verification Gates
- `npx --yes agentflight verify -- npm test -- tests/next.test.ts`
- `npx --yes projscan doctor --format markdown`
- `npx --yes agentflight doctor`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the `next` command working-tree formatter/count propagation, the focused regression test, and the CLI reference wording.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
