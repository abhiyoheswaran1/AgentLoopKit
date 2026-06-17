# Separate AgentLoop evidence churn in artifacts run output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
The human artifacts command can show a latest run changed-file count as one raw total, which makes generated AgentLoop and AgentFlight evidence churn look like ordinary review scope during long autonomous sessions.

## Desired Outcome
Human artifacts output separates non-evidence changed-file counts from generated AgentLoop evidence churn for run artifacts when changed-files evidence is available, while JSON output and missing-evidence fallbacks remain unchanged.

## Constraints
- Keep this scoped to artifacts human rendering and run changed-file evidence lookup.
- Do not change artifact inventory JSON shape or run ledger schemas.
- Do not publish, version bump, tag, or touch release-channel tasks.

## Non-Goals
- No artifact cleanup, retention policy, release proof, or GitHub marketplace/channel work.

## Assumptions
- Run metadata may have changedFileCount without readable changed-files.json; in that case preserve the existing count-only output.

## Likely Files or Areas
- src/core/artifacts.ts
- src/cli/commands/artifacts.ts
- tests/artifacts.test.ts
- docs/cli-reference.md

## Files or Areas Not to Touch
- package.json version
- CHANGELOG.md release entries

## Acceptance Criteria
- Human artifacts output for latest run preserves score/status/count and appends a non-evidence versus AgentLoop evidence split when local changed-files.json is readable.
- artifacts --type run --latest uses the same split for human output.
- artifacts --json and artifacts --type run --latest --json remain unchanged and do not gain split fields.
- Runs without readable changed-files evidence preserve existing human output.
- Public CLI docs explain the human-only split.

## Verification Commands
- npm test -- tests/artifacts.test.ts
- npm run typecheck
- npm run check:public-docs

## Post-Verification Gates
- npm run dogfood
- npx --yes agentflight verify -- npm test -- tests/artifacts.test.ts
- npx --yes projscan doctor --format markdown

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Human output wording changes could break snapshot-like downstream copy/paste expectations; preserve JSON for scripts.

## Rollback Notes
Revert artifacts command/core/test/docs changes for this task.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
