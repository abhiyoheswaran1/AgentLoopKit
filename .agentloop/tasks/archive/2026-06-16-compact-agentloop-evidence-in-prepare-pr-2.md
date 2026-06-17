# Compact AgentLoop evidence in prepare-pr

- Created date: 2026-06-16
- Task type: feature
- Status: done

## Problem Statement
`agentloop prepare-pr` groups changed files by review area, but in long dogfood sessions it still expands every generated `.agentloop/` evidence file inside the PR body. This makes PR descriptions hundreds of lines longer even though `agentloop handoff` already compacts AgentLoop evidence churn.

## Desired Outcome
`prepare-pr` should compact generated AgentLoop evidence files in the human PR body the same way handoff summaries do: show ordinary changed files, add one AgentLoop evidence count grouped by evidence directory, and state that JSON/run-ledger evidence keeps full paths.

## Constraints
- Keep JSON `changedFiles` flat and unchanged for automation.
- Keep ship scoring, ship-run reuse, Git parsing, and review-readiness semantics unchanged.
- Keep compacting limited to generated AgentLoop evidence files recognized by the existing evidence helper.
- Preserve existing review-area headings for non-evidence files.
- Do not add dependencies.
- Do not release, tag, publish, bump package versions, or modify release-channel tasks.

## Non-Goals
- Do not change `handoff` or `summarize` output behavior.
- Do not hide source, tests, docs, CI, config, or risk-sensitive changed files.
- Do not change the path classifier rules beyond reusing evidence compaction for prepare-pr.
- Do not clean up local AgentLoop evidence churn.

## Assumptions
- Reviewers need full AgentLoop evidence paths in JSON/run-ledger artifacts, but not expanded in the human PR body.
- Reusing the existing AgentLoop evidence grouping language keeps reviewer expectations consistent.

## Likely Files or Areas
- `src/core/prepare-pr.ts`
- `tests/prepare-pr.test.ts`
- `src/core/pr-summary.ts` or a shared helper only if needed to avoid duplicating compact evidence rendering

## Files or Areas Not to Touch
- Release workflows, package version metadata, registry docs, and publishing tasks.
- `.agentloop/tasks/2026-06-16-publish-github-marketplace-action.md`
- `.agentloop/tasks/2026-06-10-add-scoop-winget-manifests.md`

## Acceptance Criteria
- `prepare-pr` PR body groups generated AgentLoop evidence paths into a compact count and grouped evidence directories.
- Non-evidence changed files remain grouped by review area in the PR body.
- JSON output still includes the full flat `changedFiles` list, including AgentLoop evidence paths.
- GitHub comment output remains unchanged except for any indirect ship evidence references already present.
- Focused prepare-pr tests cover the compact body output and unchanged JSON list.

## Verification Commands
- `npm test -- tests/prepare-pr.test.ts`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

## Post-Verification Gates
- `npx --no-install tsx src/cli/index.ts prepare-pr --redact-paths`
- `npm run dogfood:strict`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert the prepare-pr compact rendering change and its focused test expectations; PR bodies will return to fully expanding AgentLoop evidence files.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
