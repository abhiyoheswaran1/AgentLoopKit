# Sort maintainer-check review area counts

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
The maintainer-check broad-change warning now separates AgentLoop evidence churn and includes non-evidence review-area counts, but those counts render in classifier order. During dogfood runs this made the warning less scan-friendly because smaller areas can appear before the largest review surface.

## Desired Outcome
When the changed-file-count warning includes non-evidence review-area counts, render those counts largest-first with a stable alphabetical tie-breaker. This keeps the warning focused on the biggest review burden while preserving existing safety checks and machine-readable output.

## Constraints
- Keep the change focused on maintainer-check human warning text.
- Preserve existing dependency, migration, auth, generated-file, evidence freshness, and checklist semantics.
- Preserve JSON shape and exit-code behavior.
- Do not add dependencies.
- Do not release, tag, publish, bump package versions, or modify release-channel tasks.

## Non-Goals
- Do not change prepare-pr or handoff area ordering.
- Do not change file classifiers or evidence-file detection.
- Do not change broad-change thresholds.
- Do not clean up unrelated AgentLoop evidence churn.

## Assumptions
- Reviewers benefit from seeing the largest non-evidence review areas first.
- A title-based tie-breaker is stable and deterministic enough for human output.

## Likely Files or Areas
- `src/core/maintainer-check.ts`
- `tests/maintainer-check.test.ts`
- `docs/cli-reference.md` only if wording needs to mention ordering

## Files or Areas Not to Touch
- Release workflows, version metadata, package publishing files, and registry docs.
- `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- `.agentloop/tasks/2026-06-10-add-scoop-winget-manifests.md`

## Acceptance Criteria
- The broad changed-file warning lists non-evidence review areas by descending file count.
- Areas with equal counts use stable alphabetical ordering by displayed area title.
- Existing evidence-only broad churn remains excluded from the changed-file-count warning.
- Existing package/dependency risk warnings still inspect the full changed-file set where appropriate.
- Focused maintainer-check tests cover the new ordering behavior.

## Verification Commands
- `npm test -- tests/maintainer-check.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

## Post-Verification Gates
- `npx --no-install tsx src/cli/index.ts maintainer-check --redact-paths`
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the maintainer-check area-count sorting change and its focused test expectation; existing review-area counts will return to classifier order.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
