# Interview Cycle 63

## Context

After `v0.15.1`, the public roadmap still lists completed work such as task status transitions and shell completion as near-term. The repo has current release-status docs, but `ROADMAP.md` now understates what shipped and blurs the real blocker: npm authorization.

## Personas interviewed

- Open Source Maintainer
- Skeptical Senior Developer
- Startup CTO
- Open Source Contributor

## Feedback summary

The strongest signal is public trust. The roadmap should show shipped capabilities, one current blocker, near-term local-first improvements, and explicit non-goals. It should not make completed features look unfinished or imply a SaaS pivot.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The README and release docs are detailed.
- What confused them: `ROADMAP.md` says task status and completion are still future work.
- What they would need before using it: Public docs that agree with the current CLI.
- What would make them recommend/star it: A short roadmap that makes scope easy to trust.
- What would make them abandon it: Stale roadmap items after a release.

### Skeptical Senior Developer

- What they liked: The product is deterministic and local-first.
- What confused them: Whether the project is still basic if status and completion are listed as future work.
- What they would need before using it: A roadmap that separates working features from ideas.
- What would make them recommend/star it: Clear limits and no vague AI promises.
- What would make them abandon it: Roadmap fluff.

### Startup CTO

- What they liked: The team-use path is visible.
- What confused them: Which improvements are likely soon versus speculative.
- What they would need before using it: A practical next-roadmap list, especially CI and policy improvements.
- What would make them recommend/star it: Local-first governance without a cloud dependency.
- What would make them abandon it: Premature dashboard or billing language.

### Open Source Contributor

- What they liked: Issue templates and contributor guidance exist.
- What confused them: Which open work is safe for contributors.
- What they would need before using it: A roadmap with approachable contributor items.
- What would make them recommend/star it: Clear boundaries around npm publishing and public API changes.
- What would make them abandon it: A roadmap that requires maintainer-only credentials for every next step.

## Product council debate

- Abhi: Make the roadmap launch-clean. Keep the wedge tight.
- Maya: Do not overpromise. Name local-first work that fits the codebase.
- Elias: This is a trust document. It should be shorter and current.
- Nora: Put the npm blocker first, then useful next improvements.
- Samir: Keep security and no-telemetry commitments explicit.
- Lina: Mention agent-facing improvements like better summaries and policy packs.
- Tom: Cut vague language.
- Rachel: Keep future commercial options out of near-term open-source scope.

## Decision

Refresh `ROADMAP.md` to show shipped capabilities, the current npm authorization blocker, near-term local-first improvements, later options, and non-goals.

## Non-decisions

- Do not create a new release version.
- Do not add cloud, login, billing, telemetry, or hosted dashboards.
- Do not claim npm `0.15.1` availability.

## Resulting tasks

- Rewrite `ROADMAP.md`.
- Add a dogfood log entry.
- Update `FINAL_HANDOFF.md` if top remaining items change.
- Run link check and projscan.

## Success criteria

- Roadmap no longer lists shipped task status or shell completion as future work.
- Roadmap names npm publishing repair as the current blocker.
- Roadmap preserves local-first scope and non-goals.
