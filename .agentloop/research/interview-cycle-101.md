# Interview Cycle 101

## Context

AgentLoopKit has release-status docs and npm publishing docs, but maintainers still need a copyable example for documenting a GitHub release when npm publish remains blocked. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Startup CTO
- Founder / Product Lead

## Feedback summary

The strongest signal is release trust. Users can tolerate a temporary GitHub tarball path if maintainers document the exact release, npm state, verification evidence, and next action. They will lose trust if package versions look arbitrary.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Current docs explain why npm should catch up to the current GitHub release.
- What confused them: The full launch checklist is too large to copy into one release handoff.
- What they would need before using it: A short example with task, verification, and handoff artifacts.
- What would make them recommend/star it: Clear instructions that prevent stale npm backfills.
- What would make them abandon it: Release docs that drift from registry state.

### Security Reviewer

- What they liked: The workflow avoids tokens and publish actions.
- What confused them: Whether documenting a release might be mistaken for publishing it.
- What they would need before using it: Explicit non-run items for `npm publish` and `gh release create`.
- What would make them recommend/star it: Registry proof before any npm claim.
- What would make them abandon it: Hidden publish commands.

### AI-Skeptical Senior Engineer

- What they liked: Exact commands and evidence beat release optimism.
- What confused them: Why the next npm publish should not backfill old numbers.
- What they would need before using it: A direct rule: publish current release from matching source, not stale versions from `main`.
- What would make them recommend/star it: Docs that admit npm is behind.
- What would make them abandon it: Version archaeology without a clear next action.

### Startup CTO

- What they liked: Teams can keep adopting from GitHub while npm catches up.
- What confused them: Whether temporary tarball usage is permanent.
- What they would need before using it: A removal trigger for fallback commands.
- What would make them recommend/star it: A clean path from GitHub release to npm catch-up.
- What would make them abandon it: A permanent split between GitHub and npm.

### Founder / Product Lead

- What they liked: This protects launch credibility.
- What confused them: The docs need a compact maintainer-facing example.
- What they would need before using it: A reusable checklist that fits the local-first wedge.
- What would make them recommend/star it: No SaaS, no publish automation, no confusing version jumps.
- What would make them abandon it: Premature release tooling.

## Product council debate

- Abhi: This keeps launch messaging honest while npm is behind.
- Maya: Docs and examples only. Do not touch workflows, package metadata, or tags.
- Elias: Make it copyable for maintainers.
- Nora: Include exact evidence to collect and the temporary fallback removal trigger.
- Samir: State that publish commands were not run.
- Lina: Agents need a task contract shape for release-status work.
- Tom: Say not to claim npm availability without registry proof.
- Rachel: Teams need one handoff before they trust the release.

## Decision

Add a release-checklist example page and artifact set for the GitHub-current/npm-lag state.

## Non-decisions

- Do not create tags or releases.
- Do not publish to npm.
- Do not change package metadata.
- Do not change GitHub Actions workflows.
- Do not automate release creation.

## Resulting tasks

- Add `docs/release-checklist-example.md`.
- Add `examples/release-checklist/README.md`.
- Add sample release task, verification report, and handoff.
- Link from README, launch checklist, npm publishing docs, and release-status docs.
- Update backlog, dogfood log, and final handoff.
- Verify links, whitespace, projscan, and AgentLoop verification.

## Success criteria

- Maintainers have a compact release-status example.
- Docs say not to backfill stale npm versions from current `main`.
- Docs say publish commands are not run by the example.
- Checks pass.
