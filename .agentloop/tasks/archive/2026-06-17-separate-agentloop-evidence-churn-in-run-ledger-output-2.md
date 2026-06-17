# Separate AgentLoop evidence churn in run ledger output

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Human run-ledger output reports only a raw changed-file count for runs.
In long AgentLoopKit sessions, that count is dominated by generated AgentLoop/AgentFlight evidence and does not show the smaller non-evidence review surface.
Other loop surfaces already separate non-evidence files from local evidence churn.

## Desired Outcome
`agentloop runs` and `agentloop show-run` human output should display the total changed-file count plus non-evidence and AgentLoop evidence counts when a run includes changed-file evidence. JSON output and stored `changed-files.json` evidence remain unchanged.

## Constraints
- Keep output deterministic and local-only.
- Keep JSON shapes and run-ledger files unchanged.
- Preserve one-line Markdown-safe human output.
- Do not hide, delete, archive, or mutate generated evidence files.
- Do not add dependencies, network calls, telemetry, version bumps, tags, releases, or publishing behavior.

## Non-Goals
- Do not change how runs are written or ordered.
- Do not change file-intent matching.
- Do not change ship, verify, handoff, status, next, check-gates, or report behavior.
- Do not resume deferred Marketplace, Scoop, WinGet, npm, release, or package-channel tasks.

## Assumptions
- `src/core/agentloop-evidence.ts` is the shared classifier for generated AgentLoop/AgentFlight evidence paths.
- Human run-ledger output should help reviewers interpret run scope without requiring them to open `changed-files.json`.
- Scripts that need exact files already use `--json` or run-ledger artifacts.

## Likely Files or Areas
- `src/cli/commands/runs.ts`
- `src/core/runs.ts`
- `src/core/agentloop-evidence.ts`
- `tests/runs.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- Run ledger schema files beyond test fixtures
- `package.json` version metadata
- `CHANGELOG.md`
- `.github/workflows/` release or publishing workflows
- dependency lockfiles unless verification unexpectedly changes them
- Marketplace, Scoop, WinGet, npm, GHCR, MCP registry, and release files

## Acceptance Criteria
- `agentloop runs` human output includes `total; non-evidence, AgentLoop evidence` counts for runs with changed-file evidence.
- `agentloop show-run` human output includes the same split when `changed-files.json` is present.
- Runs without changed-file evidence preserve a sensible count-only fallback.
- JSON output for `runs --json` and `show-run --json` is unchanged and still includes full `changedFiles` for `show-run`.
- Existing Markdown-safe output guarantees remain intact for run IDs, commands, counts, and intent output.
- Docs explain that run-ledger human output separates generated evidence churn while JSON/run-ledger files remain complete.

## Verification Commands
- `npm test -- tests/runs.test.ts -t "separates AgentLoop evidence churn in human run ledger output"`
- `npm test -- tests/runs.test.ts`
- `npm run typecheck`
- `npm run check:public-docs`

## Post-Verification Gates
- `npx --yes agentflight status`
- `npx --yes agentflight doctor`
- `npx --yes projscan doctor --format markdown`

## Implementation Plan
- Inspect relevant files before editing.
- Keep changes focused on this contract.
- Record any architecture decision in DECISIONS.md.

## Risk Notes
- Re-check protected areas before changing migrations, auth, secrets, billing, deployment, or public APIs.
- Human output should not imply evidence files are ignored or removed; the split is interpretive only.
- JSON output and run-ledger artifacts must stay complete for scripts and auditors.

## Rollback Notes
Revert the run-ledger human rendering, tests, and docs for this task. Existing run-ledger evidence files require no cleanup for rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
