# Base ship scope-control scoring on non-evidence changes

- Created date: 2026-06-17
- Task type: feature
- Status: done

## Problem Statement
Long autonomous AgentLoopKit sessions generate many local evidence files under `.agentloop/` and `.agentflight/`.
Recent dogfood work separated that churn in `status`, `next`, `check-gates`, and human ship report file lists, but the ship readiness `scope-control` dimension still scores the raw changed-file count.
That makes review readiness look artificially broad when the real non-evidence review surface is small.

## Desired Outcome
`agentloop ship` should base the `scope-control` readiness score and broad-change warnings on non-evidence changed files, while still preserving the full changed-file list in JSON output, run-ledger evidence, risk checks, gates, and generated report context.

## Constraints
- Keep the change deterministic and local-only.
- Preserve full changed-file evidence for JSON output and run-ledger artifacts.
- Preserve risk-sensitive file detection across the full changed-file list.
- Do not hide, delete, archive, or mutate generated AgentLoop evidence files.
- Do not add dependencies, network calls, telemetry, release steps, tags, version bumps, or publishing behavior.

## Non-Goals
- Do not change `status`, `next`, `check-gates`, `prepare-pr`, `maintainer-check`, or generated evidence retention behavior.
- Do not change public API shape unless an additive field is required by tests.
- Do not compact or remove JSON changed-file lists.
- Do not resume deferred Marketplace, Scoop, WinGet, package, or release-channel tasks.

## Assumptions
- `.agentloop/reports/`, `.agentloop/handoffs/`, `.agentloop/runs/`, generated `.agentloop/tasks/`, archived task contracts, `.agentflight/current/`, and `.agentflight/reports/` are local evidence churn for scope-scoring purposes.
- Non-evidence files are the review surface that should drive broad-change score penalties.
- Maintainer-check already uses the same conceptual boundary for broad-change warnings.

## Likely Files or Areas
- `src/core/readiness-score.ts`
- `src/core/agentloop-evidence.ts`
- `tests/readiness-score.test.ts`
- `tests/ship.test.ts`
- `docs/cli-reference.md`

## Files or Areas Not to Touch
- `package.json` version metadata
- `CHANGELOG.md`
- `.github/workflows/` publishing or release workflows
- release, npm, GHCR, MCP registry, Scoop, WinGet, and Marketplace files
- dependency lockfiles unless a verification command updates them unexpectedly

## Acceptance Criteria
- Ship readiness `scope-control` counts non-evidence changed files for no-change, medium-change, and broad-change thresholds.
- When evidence churn exists, the `scope-control` reason explains both total changed files and the non-evidence/evidence split.
- Large generated AgentLoop evidence churn alone does not trigger the broad-change readiness warning.
- Full changed-file lists remain present in `ship --json` output and run-ledger `changed-files.json`.
- Risk-sensitive file warnings still inspect the full changed-file list.
- Documentation explains that generated AgentLoop evidence does not lower ship scope-control score by itself.

## Verification Commands
- `npm test -- tests/readiness-score.test.ts -t "scores ship scope control from non-evidence changed files"`
- `npm test -- tests/readiness-score.test.ts`
- `npm test -- tests/ship.test.ts`
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
- Scoring changes can mislead reviewers if generated evidence files hide meaningful source changes, so only known AgentLoop/AgentFlight evidence paths should be excluded from scope thresholds.
- JSON and run-ledger evidence must stay complete so maintainers can audit all local files.

## Rollback Notes
Revert the readiness-score, test, and documentation changes for this task. Existing generated evidence files require no cleanup for rollback.

## Handoff Requirements
- Summarize files changed.
- Include verification commands and results.
- State unverified areas honestly.
- Include risks, rollback notes, and reviewer checklist.
