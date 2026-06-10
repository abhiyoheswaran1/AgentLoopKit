# Interview Cycle 91

## Context

PowerShell shell completion support is merged on `main` and CI passed. The latest GitHub release is still `v0.22.0`, and npm still serves `0.1.1`. README now documents PowerShell completion, so the current GitHub tarball fallback needs a matching release.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is release consistency. Users who follow README tarball commands should get the behavior README describes. Because npm publishing is still blocked by authentication, the safe path is a small `0.23.0` GitHub release with clear npm-pending notes and no claim that npm has caught up.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: PowerShell support makes the CLI feel more cross-platform.
- What confused them: README now says PowerShell works, but the current tarball is still `0.22.0`.
- What they would need before using it: One current GitHub release path while npm lags.
- What would make them recommend/star it: Fast release hygiene after visible CLI improvements.
- What would make them abandon it: Version guidance that looks random again.

### Open Source Maintainer

- What they liked: The change is small and tested.
- What confused them: Whether npm should jump to `0.22.0` or `0.23.0` now.
- What they would need before using it: Changelog and release-status docs that name the current target.
- What would make them recommend/star it: Release notes that explain npm lag without drama.
- What would make them abandon it: Public docs that point at a stale tarball.

### Developer Experience Designer

- What they liked: `agentloop completion powershell` is easy to understand.
- What confused them: Users need the install command to match the feature list.
- What they would need before using it: README and release-status commands updated together.
- What would make them recommend/star it: Copy-paste commands that work.
- What would make them abandon it: A first-run mismatch between docs and installed CLI.

### Security Reviewer

- What they liked: npm publish remains blocked unless `npm whoami` succeeds.
- What confused them: Whether GitHub release creation will imply npm availability.
- What they would need before using it: npm-pending notes and registry proof after release.
- What would make them recommend/star it: Tarball digest, CI link, and no hidden publish attempt.
- What would make them abandon it: Publishing from an unauthenticated shell or claiming npm success from intent.

### AI-Skeptical Senior Engineer

- What they liked: Releasing a small tested feature is concrete.
- What confused them: The long release history can look noisy.
- What they would need before using it: A plain note that `0.23.0` is the next normal minor after `0.22.0`.
- What would make them recommend/star it: Deterministic smoke tests against the packed tarball.
- What would make them abandon it: Another release without proof that the artifact runs.

## Product council debate

- Abhi: Ship `0.23.0` as the next minor. Do not chase old npm numbers.
- Maya: Keep the release-prep commit metadata-only. Do not touch completion code again unless a packaging test fails.
- Elias: Update README, changelog, release status, publishing docs, and final handoff in one pass.
- Nora: The tarball command in README must match the feature list.
- Samir: Verify `npm whoami` before any npm publish. If it fails, record the blocker and stop.
- Lina: Smoke test `agentloop completion powershell` from the packed tarball.
- Tom: Say what changed and what did not. No vague launch language.
- Rachel: This helps teams on Windows, but keep the release local-first and boring.

## Decision

Prepare `agentloopkit@0.23.0` for PowerShell completions, verify and smoke test the packed tarball, publish a GitHub release with npm-pending notes if checks pass, and keep npm status explicit.

## Non-decisions

- Do not publish to npm unless `npm whoami` succeeds.
- Do not backfill old npm versions from current `main`.
- Do not add new features during release prep.
- Do not change npm package ownership or token setup from this shell.

## Resulting tasks

- Bump package metadata to `0.23.0`.
- Move the PowerShell completion release note into a `0.23.0` changelog section.
- Update current release-status, publishing, README, launch checklist, final handoff, backlog, and dogfood docs.
- Build, pack, dry-run, and smoke test the tarball.
- Commit, push, wait for CI, create the GitHub release, and record npm registry proof.

## Success criteria

- `node dist/cli/index.js version` reports `0.23.0`.
- Packed tarball smoke tests show `agentloop version` as `0.23.0` and `agentloop completion powershell` prints `Register-ArgumentCompleter`.
- GitHub release `v0.23.0` exists with attached tarball and notes.
- npm docs still state that npm serves `0.1.1` unless registry proof changes.
