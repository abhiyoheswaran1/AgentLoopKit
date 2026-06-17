# Separate AgentLoop evidence churn in check-gates output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
`agentloop status`, `agentloop next`, `review-context`, and `maintainer-check` now separate ordinary changed files from generated AgentLoop evidence, but `agentloop check-gates` still reports only a flat changed-file count in Markdown and JSON. During long dogfood sessions, gate output still looks broader than the review surface and does not explain whether the churn is mostly generated evidence.

## Desired Outcome
`agentloop check-gates` should keep its current gate decisions while reporting the same non-evidence versus generated AgentLoop evidence breakdown in Git context output. JSON should gain additive fields, and human Markdown/gate messages should stay concise and Markdown-safe.

## Constraints
- Keep `check-gates` read-only.
- Preserve existing gate IDs, next-action decisions, strict-mode behavior, and exit-code semantics.
- Keep JSON changes additive; do not remove `git.changedFileCount`.
- Use the existing generated-evidence classifier.
- Do not hide, delete, archive, or mutate changed files.
- Do not touch release, publishing, registry, package-manager, dependency, token, or network behavior.

## Non-Goals
- No release prep, version bump, tag, publish, or Marketplace work.
- No broad rewrite of gate scoring or handoff coverage.
- No cleanup of existing generated evidence churn.

## Assumptions
- `check-gates` can classify the same parsed Git status entries it already reads.
- Clean-tree output should remain unchanged.

## Likely Files or Areas
- `src/core/check-gates.ts`
- `tests/check-gates.test.ts`
- `docs/check-gates.md`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- Release workflows, release notes, npm/GitHub/GHCR/MCP registry publishing paths.
- Dependency manifests and lockfiles.
- Existing archived task evidence except for normal AgentLoop-generated reports, runs, and handoffs.

## Acceptance Criteria
- `agentloop check-gates --json` includes `git.nonEvidenceChangedFileCount` and `git.agentLoopEvidenceChangedFileCount`.
- Human `agentloop check-gates` output shows dirty changed-file totals as non-evidence plus AgentLoop evidence counts.
- The `git-context` gate message includes the same breakdown when changed files exist.
- Clean-tree output remains `No changed files detected.` and does not add noisy zero-count text.
- Public docs describe the breakdown without implying cleanup, deletion, or hiding.

## Verification Commands
- `npm test -- tests/check-gates.test.ts`
- `npm run typecheck`
- `npm run check:public-docs`

## Post-Verification Gates
- `npx --yes agentflight verify -- npm test -- tests/check-gates.test.ts`
- `npx --yes projscan doctor --format markdown`
- `npx --yes agentflight doctor`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the `check-gates` Git context count propagation/formatting, the focused regression test, and check-gates documentation wording.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
