# Add compact JSON status output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement

Agents can request status --brief --json but the command still emits full status JSON, including thousands of changed files and placeholder tasks in dogfooded repos.

## Desired Outcome

status --json --brief returns a compact machine-readable snapshot with summaries and next action, while default status --json remains complete.

## Constraints

- Preserve default `agentloop status --json` output for scripts that need full changed-file and task arrays.
- Scope compact JSON to the existing `--brief --json` flag combination.
- Keep the command read-only: no task, state, report, run, git, env, network, or package metadata mutation.
- Keep output deterministic and repo-relative/redacted consistently with existing status output.
- Do not add dependencies, release prep, Marketplace, Scoop, WinGet, npm publish, tag, or version work.

## Non-Goals

- Do not change human `status --brief` copy.
- Do not remove fields from default `status --json`.
- Do not add artifact cleanup, retention, broad evidence scanning, or new task-selection semantics.
- Do not make compact JSON parse Markdown bodies or include full report, run, task, or changed-file bodies.

## Assumptions

- Agents and scripts that combine `--brief` with `--json` are asking for a compact machine-readable snapshot.
- Full JSON remains available through `agentloop status --json`.
- `agentloop next --json` stays the smallest command when only the next action is needed.

## Likely Files or Areas

- src/cli/commands/status.ts
- src/core/status.ts
- tests/status.test.ts
- docs/status.md
- docs/cli-reference.md

## Files or Areas Not to Touch

- package.json
- pnpm-lock.yaml
- CHANGELOG.md
- .github/workflows/
- action.yml
- release, registry, Marketplace, Scoop, and WinGet files

## Acceptance Criteria

- `agentloop status --json` keeps the existing full result, including `workingTree.changedFiles`, `deferredTasks`, `agentFlightPlaceholderTasks`, `latestRun`, `brief`, and `markdown`.
- `agentloop status --brief --json` returns compact JSON with project, git, working-tree counts, active/latest/deferred/placeholder summaries, latest verification/run summary, configured/missing command counts or names, next action, and brief text.
- Compact JSON omits `workingTree.changedFiles`, full task arrays, full run details, and Markdown output.
- `--redact-paths` is respected in compact JSON.
- Public CLI docs mention compact JSON and point users to full JSON when they need complete arrays.
- Focused tests fail before the compact JSON branch exists and pass after implementation.

## Verification Commands

- npm test -- tests/status.test.ts -t "compact JSON"
- npm test -- tests/status.test.ts
- npm run typecheck
- npm run check:public-docs

## Post-Verification Gates

- npm run dogfood:strict
- npm run maintenance:check

## Implementation Plan

- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes

- Changing the `--brief --json` combination may affect any script that already combined both flags and expected the full JSON object.
- Under-including fields could make compact status less useful to agents; over-including arrays would preserve the token issue.
- Docs must be explicit that full JSON is still available.

## Rollback Notes

Revert the compact status JSON renderer, CLI branch, tests, docs updates, and this task contract.

## Handoff Requirements

- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
