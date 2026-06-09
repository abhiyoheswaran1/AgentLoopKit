# Interview Cycle 40

Internal simulated feedback. Do not present this as real user research.

## Context

Shell completions landed on `main` after the public `v0.9.0` GitHub release. The package metadata, changelog, README source note, launch checklist, publishing docs, and README visual assets still describe `0.9.0`.

## Personas interviewed

- Founder / Product Lead
- Principal Engineer
- Open Source Maintainer
- Developer Experience Designer
- Power User / Agentic Engineer
- Security Reviewer

## Feedback summary

The strongest signal is release clarity. The shell-completion feature should ship as a new GitHub release candidate with refreshed README visuals. npm availability must stay separate from GitHub source availability until `npm view agentloopkit version` proves otherwise.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: Shell completions make the CLI feel more complete.
- What confused them: Readers may not know whether npm has the newest source.
- What they would need before using it: A release note that names the feature and the npm status.
- What would make them recommend/star it: README assets that show a polished command flow.
- What would make them abandon it: Docs that blur the npm and GitHub release states.

### Principal Engineer

- What they liked: The feature has tests and no new dependency.
- What confused them: The package version still says `0.9.0`.
- What they would need before using it: A clean semver bump and packed CLI smoke test.
- What would make them recommend/star it: Verified release metadata.
- What would make them abandon it: A release tag without matching source version.

### Open Source Maintainer

- What they liked: GitHub release tarballs let users test newer source while npm auth is blocked.
- What confused them: README screenshots can become stale quickly.
- What they would need before using it: Regenerated VHS and Playwright assets from committed sources.
- What would make them recommend/star it: Clear changelog and launch checklist entries.
- What would make them abandon it: Public docs that imply npm `0.10.0` is live before registry proof.

### Developer Experience Designer

- What they liked: A completion command is easy to demonstrate.
- What confused them: The existing GIF does not show completions.
- What they would need before using it: Terminal demo includes `agentloop completion zsh`.
- What would make them recommend/star it: README copy that gives the next step without lecturing.
- What would make them abandon it: A large release story for a small CLI polish feature.

### Power User / Agentic Engineer

- What they liked: Completion covers nested task and install-agent values.
- What confused them: The old demo did not show the new command.
- What they would need before using it: Packed CLI smoke covering the release version.
- What would make them recommend/star it: A GitHub tarball with the new command.
- What would make them abandon it: npx examples that pretend npm has caught up.

### Security Reviewer

- What they liked: Completion scripts print to stdout and do not edit shell profiles.
- What confused them: npm publishing remains auth-blocked.
- What they would need before using it: Release notes that state no hidden dotfile writes and no telemetry.
- What would make them recommend/star it: Dry-run publish, pack, projscan, and CI evidence.
- What would make them abandon it: Unverified release artifacts.

## Product council debate

- Abhi: Cut `0.10.0`; the feature is useful and GitHub releases give users the newest source.
- Maya: Keep the bump mechanical and verify the packed CLI.
- Elias: Update README, changelog, launch checklist, and npm docs together.
- Nora: Show `completion zsh` in the GIF, but keep the README section short.
- Samir: Repeat the npm status warning and avoid shell-profile mutation claims we cannot prove for users after they install scripts.
- Lina: Packed CLI smoke must include the completion command.
- Tom: This is practical polish. Do not oversell it.
- Rachel: Shell completions help teams standardize daily usage without adding process weight.

## Decision

Prepare `agentloopkit@0.10.0` as a GitHub release candidate for shell completions. Refresh README VHS and Playwright assets, verify locally, push, wait for CI, create a GitHub release with a tarball, and record npm publish results honestly.

## Non-decisions

- Do not claim npm `0.10.0` availability until `npm view agentloopkit version` proves it.
- Do not add PowerShell completion in this release.
- Do not add shell-profile installers.
- Do not change runtime dependencies.

## Resulting tasks

- Bump package metadata to `0.10.0`.
- Add a `0.10.0` changelog entry.
- Update README source note and command docs.
- Update launch checklist and npm publishing docs.
- Update the VHS tape to use `agentloopkit-0.10.0.tgz` and show `agentloop completion zsh`.
- Regenerate VHS and Playwright README assets.
- Run full release verification, projscan, pack, publish dry run, packed CLI smoke, and CI.
- Create a GitHub release with a tarball if checks pass.

## Success criteria

- Source and packed CLI report `0.10.0`.
- Changelog has a `0.10.0` section for shell completions.
- README demo tape uses `agentloopkit-0.10.0.tgz` and shows the completion command.
- Playwright screenshots and VHS GIF regenerate without manual image edits.
- GitHub release `v0.10.0` is public with a tarball.
- npm status remains explicit until registry proof changes.
