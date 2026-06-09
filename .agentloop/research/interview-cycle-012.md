# Interview Cycle 12

## Context

AgentLoopKit has a public npm package, GitHub release notes, launch visuals, issue templates, PR evidence prompts, and two open product PRs. The next low-risk launch polish area is contributor onboarding.

## Personas interviewed

- Open Source Contributor
- Open Source Maintainer
- Skeptical Senior Developer
- Principal Engineer

## Feedback summary

The strongest signal: new contributors need a small, trustworthy path into the repo without maintainers adding automation. A label map and good-first issue template help GitHub launch quality without changing runtime behavior.

## Raw simulated feedback

### Open Source Contributor

- Liked: setup and tests are already clear.
- Confused: which issues are safe for a first PR.
- Would need before contributing: labels and a template that tells them files, criteria, and checks.
- Would recommend/star it if: the repo feels ready for outside help.
- Would abandon it if: starter issues secretly involve publishing or architecture work.

### Open Source Maintainer

- Liked: PR template already asks for evidence.
- Confused: label taxonomy is not recorded anywhere.
- Would need before using it: a label map and good-first issue template.
- Would recommend/star it if: contributors can self-serve simple docs/template work.
- Would abandon it if: the project adds a bot or external service too early.

### Skeptical Senior Developer

- Liked: first contributions can focus on tests and docs.
- Confused: whether `good first issue` means trivial or reviewable.
- Would need before contributing: explicit areas to avoid.
- Would recommend/star it if: labels reduce review noise.
- Would abandon it if: labels become marketing instead of useful triage.

### Principal Engineer

- Liked: repo-only change with no package risk.
- Confused: whether label sync will become another dependency.
- Would need before approving: no new service and no runtime changes.
- Would recommend/star it if: first PRs stay focused.
- Would abandon it if: contributor docs promise support the maintainers cannot sustain.

## Product council debate

- Abhi: This improves GitHub launch readiness and keeps the wedge focused.
- Maya: Keep it as files and guidance. No automation.
- Elias: Good first issue scaffolding helps contributors trust the repo.
- Nora: The first-contribution path should be short and direct.
- Samir: Do not ask contributors to paste secrets or environment values.
- Lina: Good starter issues should still ask for AgentLoopKit verification evidence.
- Tom: Labels matter only if they make review easier.
- Rachel: This is a light team-readiness signal without enterprise process.

## Decision

Add a good-first issue template, a checked-in label map, and a short first-contribution section in `CONTRIBUTING.md`.

## Non-decisions

- No label-sync dependency.
- No GitHub bot.
- No automated contributor scoring.
- No package release for this repo-only change.

## Resulting tasks

- Add `.github/ISSUE_TEMPLATE/good_first_issue.md`.
- Add `.github/labels.yml`.
- Update `CONTRIBUTING.md`.
- Update backlog and dogfood notes.

## Success criteria

- A maintainer can create a starter issue with clear files, criteria, and verification.
- A contributor can identify safe first PR areas.
- The change passes repo verification and `projscan`.
