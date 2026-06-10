# Interview Cycle 87

## Context

GitHub release `v0.22.0` is public and npm still serves `0.1.1`. README now states that mismatch, but the first install block still starts with `npx agentloopkit init`, which gives users the old npm package until the registry catches up.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Indie Hacker Using Codex
- Open Source Maintainer
- Developer Experience Designer
- Skeptical Senior Developer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal was first-run clarity. Users can tolerate npm lag if the README gives one current, tested command.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: The README says npm is behind instead of hiding it.
- What confused them: Which command gives the current CLI today.
- What they would need before using it: One command that runs the current release.
- What would make them recommend/star it: A path that works without cloning.
- What would make them abandon it: Installing from npm and finding missing commands.

### Open Source Maintainer

- What they liked: The GitHub release tarball has a digest and release notes.
- What confused them: Whether tarball usage is a permanent distribution model.
- What they would need before using it: A note that the tarball fallback goes away when npm catches up.
- What would make them recommend/star it: Honest install instructions for both npm and GitHub release tarball users.
- What would make them abandon it: Asking users to clone the repo for normal usage.

### Developer Experience Designer

- What they liked: The release-status sentence is compact.
- What confused them: The next command still uses npm.
- What they would need before using it: A copy-paste tarball command next to the npm caveat.
- What would make them recommend/star it: README gives a working path in the first screen.
- What would make them abandon it: A long workaround section that hides the quickstart.

### Skeptical Senior Developer

- What they liked: The docs now name the auth failure.
- What confused them: A temporary tarball path can look suspicious without context.
- What they would need before using it: A link that points at the public GitHub release asset, not an opaque script.
- What would make them recommend/star it: The command reports `0.22.0` and does not require a clone.
- What would make them abandon it: Any implication that GitHub tarballs replace npm.

### Power User / Agentic Engineer

- What they liked: The tarball keeps current commands available.
- What confused them: Whether `agentloop` or `agentloopkit` is the binary to call through `npx --package`.
- What they would need before using it: Tested examples for `agentloop version` and `agentloop init`.
- What would make them recommend/star it: Current CLI path plus later npm catch-up guidance.
- What would make them abandon it: Having to infer install behavior from release notes.

## Product council debate

- Abhi: "Keep npm as the main distribution path, but unblock current users with the release tarball."
- Maya: "Docs only. No install wrapper and no special fallback logic."
- Elias: "Say when to remove the fallback so the README does not rot."
- Nora: "Put the command near the npm caveat. Do not bury it."
- Samir: "Use the public GitHub release URL. Do not add curl-pipe-shell patterns."
- Lina: "Show `agentloop version` first so users can verify what they got."
- Tom: "A tested command beats another explanation."
- Rachel: "This gives teams a temporary pin without creating a new support surface."

## Decision

Add a temporary GitHub release tarball command to README and `docs/npm-publishing.md`. Keep npm/npx as the primary model and remove the fallback once npm reports `0.22.0` or newer.

## Non-decisions

- Do not build an installer.
- Do not change package metadata.
- Do not publish to npm from this shell.
- Do not tell users to clone the repo for normal usage.

## Resulting tasks

- Test `npx --yes --package <v0.22.0 tarball> agentloop version`.
- Test `npx --yes --package <v0.22.0 tarball> agentloop init --dry-run --json`.
- Add the tarball commands to README.
- Add removal guidance to npm publishing docs.
- Run Markdown link checks, whitespace checks, projscan, and AgentLoop verification.

## Success criteria

- README has a tested current-release command.
- Docs still state npm latest remains `0.1.1`.
- The fallback is clearly temporary.
- No source, package, or workflow files change.
