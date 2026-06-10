# Interview Cycle 89

## Context

Release status now appears in README, npm publishing docs, launch checklist, final handoff, and GitHub release notes. The duplicated current-state text has drifted before. GitHub release `v0.22.0` is public, npm still serves `0.1.1`, and README has a temporary GitHub tarball command.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer
- Skeptical Senior Developer
- Startup CTO

## Feedback summary

The strongest signal was maintainability. A short release-status page reduces stale guidance risk without adding product scope.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Current evidence exists, but it is spread across several files.
- What confused them: Which file should be updated first after npm catches up.
- What they would need before using it: One concise current-status page.
- What would make them recommend/star it: Release status that takes 30 seconds to understand.
- What would make them abandon it: Long docs that contradict each other.

### Developer Experience Designer

- What they liked: README now gives a working tarball command.
- What confused them: The release history is too long for first-run readers.
- What they would need before using it: A short link from README to current release status.
- What would make them recommend/star it: The quickstart stays short.
- What would make them abandon it: Repeating the same npm caveat in every section.

### Security Reviewer

- What they liked: npm auth failure and tarball digest are explicit.
- What confused them: Update rules for removing temporary fallback guidance.
- What they would need before using it: A checklist for what changes after npm publishes.
- What would make them recommend/star it: Clear no-token, no-hidden-installer messaging.
- What would make them abandon it: Curl-pipe-shell or opaque install commands.

### Skeptical Senior Developer

- What they liked: The current command is tested.
- What confused them: A final handoff with a long historical checklist is hard to audit.
- What they would need before using it: A current-state summary with exact commands.
- What would make them recommend/star it: No hype and no contradiction.
- What would make them abandon it: Version explanations that keep changing across docs.

### Startup CTO

- What they liked: The tool keeps release evidence and CI status visible.
- What confused them: Whether a team should pin npm or the GitHub tarball today.
- What they would need before using it: A temporary status page that says what to pin.
- What would make them recommend/star it: Clear migration path back to npm.
- What would make them abandon it: A workaround that looks permanent.

## Product council debate

- Abhi: "Keep the README quick. Link the longer release state."
- Maya: "Docs only. Do not add a release-status command yet."
- Elias: "One current page reduces drift."
- Nora: "Put the tested command near the top."
- Samir: "Keep the E404 and npm auth blocker explicit."
- Lina: "Power users need the tarball command and removal rule."
- Tom: "A short status page beats another paragraph in README."
- Rachel: "Teams can pin the tarball until npm catches up."

## Decision

Add `docs/release-status.md` as the compact source for the current GitHub/npm state. Link it from README and npm publishing docs. Leave historical logs intact.

## Non-decisions

- Do not add a CLI command.
- Do not publish to npm.
- Do not change package metadata.
- Do not remove historical release evidence.

## Resulting tasks

- Create `docs/release-status.md`.
- Link it from README and npm publishing docs.
- Update final handoff Next 15 improvements to remove release-status compaction as future work.
- Update backlog and dogfood records.
- Run link checks, projscan, and AgentLoop verification.

## Success criteria

- Current release status is understandable in one page.
- README still gives a quick install path.
- Docs keep npm as the main distribution path after catch-up.
- Verification passes.
