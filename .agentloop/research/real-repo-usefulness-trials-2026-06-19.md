# Real-Repo Usefulness Trials - 2026-06-19

Internal AgentLoopKit trial notes. These notes are simulated/internal decision support from local dogfooding and must not be presented as real user interviews, adoption proof, testimonials, compliance evidence, or public usage claims.

## Scope

- Goal: run AgentLoopKit in real repository shapes, identify repeated first-use or review-evidence friction, and implement only the highest-confidence small fix.
- Trial boundary: local-only temp copies of committed sibling repository state.
- Excluded: tokens, GitHub API calls, posting, telemetry, hosted services, sibling repo mutation, release work, version bumps, and public proof claims.

## Trial Method

Built the local CLI first with `npm run build`, then copied committed repository state into temporary directories with `git archive`. Each temp copy was initialized as its own local Git repository with a baseline commit before running AgentLoopKit commands.

Commands exercised across the trials:

- `agentloop doctor --redact-paths`
- `agentloop init --dry-run --json --redact-paths`
- `agentloop init --yes --redact-paths`
- `agentloop create-task ... --status in-progress`
- `agentloop verify --command "node -e \"console.log('trial verification ok')\"" --redact-paths`
- `agentloop status --redact-paths`
- `agentloop next --redact-paths`
- `agentloop ship --redact-paths`
- `agentloop prepare-pr --redact-paths`
- `agentloop check-gates --redact-paths`
- `agentloop task doctor --redact-paths`

The verification command was deliberately small and deterministic so the trial tested AgentLoopKit's loop rather than each repository's dependency installation.

## Repositories

### `projscan`

Shape: mature TypeScript CLI/tooling repository without an initialized AgentLoopKit harness.

Useful:

- `doctor` clearly explained that AgentLoopKit had not been initialized.
- `init --dry-run --json` made the planned 51 generated files reviewable before mutation.
- `init --yes` created a complete harness in the temp copy.
- `verify`, `ship`, and `prepare-pr` produced local review evidence without credentials or network services.

Confusing:

- `doctor` before init returned exit code 1. That is technically correct, but it can stop a copied `set -e` trial script before the user sees the full loop.
- A minimal generated task with placeholder acceptance, verification, and rollback sections could reach `status` with `agentloop handoff` as the recommended next action after verification.
- `ship` and `prepare-pr` then surfaced placeholder text in reviewer-facing evidence.

Safety observations:

- No sibling repo files were mutated.
- No token, GitHub API, posting, or telemetry path was needed.

### `LaunchDesk`

Shape: web app repository that already had an AgentLoopKit harness.

Useful:

- Re-running `init --dry-run --json` and `init --yes` was non-destructive and reported skipped files.
- Existing AgentFlight placeholder task evidence was preserved separately from real task evidence.
- The loop still worked in a repo that was not starting from a blank AgentLoopKit state.

Confusing:

- The same minimal task contract issue repeated: after verification, `status` recommended `agentloop handoff` while task doctor and gate checks correctly identified placeholder review-critical sections.
- `prepare-pr` included placeholder acceptance/rollback guidance when the user followed the current next action.

Safety observations:

- Existing local harness files were not overwritten.
- The temp-copy boundary kept the sibling repo untouched.

### `EndpointOS`

Shape: larger app/service repository without an initialized AgentLoopKit harness.

Useful:

- Project detection found an npm/Next-style repo and flagged risk areas without requiring setup.
- `init --dry-run --json` was understandable even with a larger repository surface.
- Review evidence stayed local and deterministic.

Confusing:

- `doctor` before init returned exit code 1, again useful but brittle for copy-paste automation.
- The active placeholder task again reached `status` with a handoff recommendation after passing verification.

Safety observations:

- No dependency install, GitHub credential, network service, or remote posting was required.

## Repeated Friction

The repeated blocker across all three repo shapes was not initialization or evidence generation. It was that an active task contract with placeholder review-critical sections could flow too far:

1. `create-task` can leave placeholders in acceptance, verification, rollback, or other review-critical sections when the user starts with a thin task.
2. `agentloop verify` can pass because the command evidence is real.
3. `agentloop status` and `agentloop next` previously recommended `agentloop handoff`.
4. `agentloop ship`, `agentloop prepare-pr`, `agentloop check-gates`, and `agentloop task doctor` then exposed the placeholders later.

This creates reviewer-facing noise at exactly the point AgentLoopKit is supposed to make handoff evidence boring and trustworthy.

## Persona Synthesis

This is simulated internal product-panel feedback, not real user feedback.

- Product Maintainer: fix the core loop quality before adding policy packs, scoring, or release channels. A small next-action correction improves usefulness more than a new surface.
- CLI Engineer: `status` and `next` own the user's immediate command path. If task doctor already knows the active task has placeholder sections, next action should route there before handoff.
- Docs and DX Writer: no new onboarding copy is needed if the CLI can point to the existing doctor flow at the right time.
- Security Reviewer: keep the fix local and read-only. Reuse diagnostics; do not mutate task files or infer external metadata.
- Dogfood Steward: AgentLoopKit, AgentFlight, and ProjScan were all used. The evidence supports a narrow CLI behavior change, not a release or public claim.
- Open Source Maintainer: a deterministic warning before handoff is more useful than a PR body that contains "add acceptance criteria" placeholders.

## Decision

Implement one focused fix: make `agentloop status` and `agentloop next` reuse the existing `placeholder-task-section` task-doctor diagnostic for the active task. When the active task still has review-critical placeholder sections, recommend:

```text
agentloop task doctor
```

before verification or handoff evidence is generated.

## Non-Decisions

- Do not change `create-task` defaults in this pass.
- Do not add policy packs.
- Do not add GitHub metadata scoring.
- Do not change `ship` scoring.
- Do not add GitHub posting, token reads, telemetry, hosted services, or remote policy services.
- Do not cut a release, bump package versions, create tags, or publish.

## Success Criteria

- A focused regression test fails before the fix and passes after it.
- `agentloop status --json` reports `agentloop task doctor` for an active task with placeholder review-critical sections, even when verification evidence exists.
- Human `agentloop status` output gives the same next command and reason.
- Existing stale-state, dirty-tree, handoff, and done-task next-action behavior stays intact.
- Full task verification, ProjScan, AgentFlight, ship evidence, and strict dogfood pass before handoff.
