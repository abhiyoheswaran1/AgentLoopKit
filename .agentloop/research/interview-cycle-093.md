# Interview Cycle 93

## Context

GitHub release `v0.23.0` is public for PowerShell completions. npm still serves `0.1.1`. `ROADMAP.md` still lists shipped completions as bash, zsh, and fish only, and its blocker section stops at `v0.22.0`.

## Personas interviewed

- Open Source Maintainer
- Developer Experience Designer
- AI-Skeptical Senior Engineer
- Startup CTO

## Feedback summary

The strongest signal is trust through current public docs. The roadmap should reflect the release users see on GitHub without turning npm auth into a product feature or adding new scope.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Release-status docs are now current.
- What confused them: The roadmap still stops before PowerShell completions.
- What they would need before using it: Shipped and blocked sections aligned with the latest release.
- What would make them recommend/star it: Public docs that do not contradict each other.
- What would make them abandon it: A stale roadmap after a release.

### Developer Experience Designer

- What they liked: The README install path is current.
- What confused them: Roadmap wording makes the CLI look less complete than it is.
- What they would need before using it: One clear blocker and a short near-term list.
- What would make them recommend/star it: Users can scan roadmap and understand scope fast.
- What would make them abandon it: A roadmap that reads like internal release archaeology.

### AI-Skeptical Senior Engineer

- What they liked: npm remains marked blocked instead of hand-waved.
- What confused them: Why a roadmap needs many old failed-release details.
- What they would need before using it: A concise current blocker and non-goals.
- What would make them recommend/star it: Public status that is boring and precise.
- What would make them abandon it: Hype or claims that npm is done.

### Startup CTO

- What they liked: The tool stays local-first.
- What confused them: Whether team features are near-term.
- What they would need before using it: The roadmap keeps team/cloud ideas clearly later.
- What would make them recommend/star it: Practical local workflow first.
- What would make them abandon it: Premature SaaS direction.

## Product council debate

- Abhi: Keep the roadmap tight. Current shipped, current blocker, near-term, later, non-goals.
- Maya: Docs only. Do not change release metadata or CLI.
- Elias: Remove stale release clutter where it distracts from the current state.
- Nora: Add PowerShell to shipped completions.
- Samir: Keep npm auth marked external and blocked.
- Lina: Roadmap should point agents toward local-first improvements, not cloud.
- Tom: Avoid version archaeology in public docs.
- Rachel: Later team features can stay later; do not pull them into MVP.

## Decision

Refresh `ROADMAP.md` so it reflects `v0.23.0`, PowerShell completions, the npm auth blocker, and local-first next steps.

## Non-decisions

- Do not add a new feature.
- Do not claim npm publish success.
- Do not add SaaS or dashboard commitments.

## Resulting tasks

- Update shipped completion wording.
- Update current blocker wording for `v0.23.0` and npm `0.1.1`.
- Keep near-term items focused on npm auth/trusted publishing and post-catch-up cleanup.
- Record dogfooding and verification.

## Success criteria

- Roadmap does not say completions are bash/zsh/fish only.
- Roadmap names `v0.23.0` as the current GitHub release line.
- Roadmap says npm still serves `0.1.1`.
- Roadmap preserves local-first scope and non-goals.
