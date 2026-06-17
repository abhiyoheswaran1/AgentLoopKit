# Clarify release checklist proof phases

- Created date: 2026-06-17
- Task type: docs
- Status: done

## Problem Statement

The release checklist example mixes pre-bump release evidence with post-publish npm and cross-channel proof, which can make agents run proof commands at the wrong phase.

## Desired Outcome

The release checklist example separates pre-bump verification from post-publish proof and tests lock the guidance without changing release behavior.

## Constraints

- Keep this as documentation and regression coverage only.
- Do not bump versions, tag, publish, cut a release, edit package metadata, or change release workflows.
- Keep GitHub Marketplace publication deferred until the maintainer approves it.
- Preserve existing release commands; clarify sequencing only.

## Non-Goals

- Do not change `release-flow`, `release-proof`, `npm-status`, trusted publishing, GHCR, MCP Registry, or Marketplace behavior.
- Do not edit `package.json`, lockfiles, `CHANGELOG.md`, or `.github/workflows/`.
- Do not add dependencies or external network checks.

## Assumptions

- Release prep has two distinct phases: local pre-bump/pre-publish evidence and post-publish public channel proof.
- `agentloop npm-status --agentloopkit --expect-current` can pass before a bump only when local package metadata still matches npm latest; it belongs in pre-bump evidence or post-publish proof, not in generic intended-version verification.

## Likely Files or Areas

- `docs/release-checklist-example.md`
- `src/templates/harness/release-checklist.md`
- `tests/public-docs-hygiene.test.ts`

## Files or Areas Not to Touch

- `package.json`
- `pnpm-lock.yaml`
- `CHANGELOG.md`
- `.github/workflows/`
- `action.yml`
- Distribution channel publish docs beyond the checklist wording required for this task

## Acceptance Criteria

- The release checklist example explicitly separates local pre-bump evidence from post-publish npm and cross-channel proof.
- The sample `agentloop create-task` command does not put post-publish proof commands under ordinary `--verification` checks.
- The handoff checklist still requires post-publish npm and release-proof results before availability claims.
- A focused test locks the proof-phase wording so future edits do not collapse the phases again.

## Verification Commands

- npm test -- tests/public-docs-hygiene.test.ts -t "release checklist"
- npx prettier --check docs/release-checklist-example.md src/templates/harness/release-checklist.md tests/public-docs-hygiene.test.ts

## Post-Verification Gates

- npx --yes agentflight verify -- npm test -- tests/public-docs-hygiene.test.ts
- npx --yes projscan doctor --format markdown
- npx --yes agentflight doctor

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Low runtime risk; docs/test only.
- Main risk is weakening release guidance. Keep the distinction concrete and preserve the no-publish/no-token safety language.

## Rollback Notes

Revert the checklist wording, the harness release checklist wording, the focused docs regression, and this task contract update.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
