# Compact AgentLoop evidence churn in ship reports

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
`agentloop ship` writes a human Markdown report that lists every changed file. During long autonomous dogfood sessions, generated AgentLoop and AgentFlight evidence can dominate the `Changed Files` section, making the report hard to read even though reviewer-facing handoff and PR-prep output already compact that evidence.

## Desired Outcome
Human ship reports should compact generated AgentLoop evidence in the `Changed Files` section while preserving ordinary changed-file lines. JSON output, run-ledger changed-file evidence, and scoring inputs should keep the full changed-file list.

## Constraints
- Keep `agentloop ship` read-only with respect to project source, aside from its existing report/handoff/run artifact writes.
- Reuse the existing generated-evidence classifier and compact changed-file renderer.
- Preserve JSON `changedFiles` exactly.
- Preserve run-ledger changed-file evidence exactly.
- Do not change review-readiness scoring in this task.
- Do not hide, delete, archive, or mutate generated evidence.
- Do not touch release, publishing, registry, package-manager, dependency, token, or network behavior.

## Non-Goals
- No release prep, version bump, tag, publish, or Marketplace work.
- No change to ship score thresholds or broad-change scoring.
- No cleanup of existing generated evidence churn.
- No change to GitHub comment output.

## Assumptions
- The existing `renderCompactChangedFiles` helper matches the handoff/prepare-pr behavior users already see.
- Ship reports can compact only the human Markdown section without weakening machine-readable evidence.

## Likely Files or Areas
- `src/core/ship.ts`
- `tests/ship.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- Release workflows, release notes, npm/GitHub/GHCR/MCP registry publishing paths.
- Dependency manifests and lockfiles.
- Existing archived task evidence except for normal AgentLoop-generated reports, runs, and handoffs.

## Acceptance Criteria
- Human ship report `Changed Files` lists ordinary changed files individually.
- Human ship report groups generated AgentLoop evidence into a compact evidence count and grouped-directory line.
- Human ship report states that full paths remain in JSON output and run-ledger evidence.
- `ship --json` still returns the full flat `changedFiles` list, including generated evidence files.
- Run-ledger changed-file evidence still records the full flat changed-file list.
- Public CLI docs describe ship-report compaction without implying cleanup, deletion, or hiding.

## Verification Commands
- `npm test -- tests/ship.test.ts`
- `npm run typecheck`
- `npm run check:public-docs`

## Post-Verification Gates
- `npx --yes agentflight verify -- npm test -- tests/ship.test.ts`
- `npx --yes projscan doctor --format markdown`
- `npx --yes agentflight doctor`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.

## Rollback Notes
Revert ship-report Markdown changed-file rendering to the full flat list, remove the focused regression test, and restore the CLI reference wording.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
