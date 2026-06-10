# Interview Cycle 72

## Context

GitHub release `v0.18.0` is public with the policy-status command, but npm still serves `agentloopkit@0.1.1`. The release-triggered Publish workflow and a local exact-tarball publish both reached npm and failed with authorization errors. A maintainer asked whether this means AgentLoopKit will keep skipping many versions and then publish a higher version without context.

## Personas interviewed

- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Founder / Product Lead
- Security Reviewer
- Indie Hacker Using Codex

## Feedback summary

The strongest signal is version-trust clarity. Users can tolerate a one-time npm catch-up jump if the README, changelog, and publishing docs explain why it happened and what happens next. They will lose trust if the public docs imply npm has `0.18.0` before the registry proves it, or if old versions get backfilled from current source.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: GitHub releases include tarball assets and verification notes.
- What confused them: npm shows `0.1.1` while public tags have moved to `v0.18.0`.
- What they would need before using it: A short README note that explains the one-time npm catch-up jump.
- What would make them recommend/star it: Honest publishing status and clear install guidance.
- What would make them abandon it: Docs claiming npm availability that the registry does not confirm.

### AI-Skeptical Senior Engineer

- What they liked: The project records failed publish attempts instead of hiding them.
- What confused them: Many release candidates can look like version inflation.
- What they would need before using it: A direct statement that normal semver resumes after npm catches up.
- What would make them recommend/star it: Current source, GitHub tags, and npm state explained in one place.
- What would make them abandon it: Backfilled npm versions that do not match their tags.

### Founder / Product Lead

- What they liked: The current release line has a stronger product than the early npm package.
- What confused them: Users may ask why `0.13.0` was prepared and then `0.18.0` became current.
- What they would need before using it: A launch-ready explanation that protects the product without sounding defensive.
- What would make them recommend/star it: A clean catch-up release and a boring version cadence afterward.
- What would make them abandon it: More release churn before the npm blocker is fixed.

### Security Reviewer

- What they liked: npm auth failures are recorded with exact error classes.
- What confused them: `E404` can mean authorization, not package absence.
- What they would need before using it: Instructions that avoid tokens, OTPs, and credentials in logs.
- What would make them recommend/star it: Trusted publishing configured after the first manual repair.
- What would make them abandon it: Retrying publish from unauthenticated local state and then claiming success.

### Indie Hacker Using Codex

- What they liked: They can still install the GitHub tarball while npm lags.
- What confused them: `npx agentloopkit` from npm will not match the README’s current examples.
- What they would need before using it: A pinned tarball fallback until npm catches up.
- What would make them recommend/star it: The next npm install works without special flags.
- What would make them abandon it: Having to understand the whole release history before trying the tool.

## Product council debate

- Abhi: Publish the current release line once auth is fixed. Do not backfill old npm versions.
- Maya: Version metadata must match the source. Publishing old numbers from current `main` would create a traceability problem.
- Elias: README should explain the mismatch in two sentences, not a wall of release forensics.
- Nora: Keep the next action obvious: fix npm auth, publish `0.18.0`, verify registry state.
- Samir: Do not attempt another publish until `npm whoami` works or trusted publishing is configured.
- Lina: Tarball pinning in CI docs is a useful bridge while npm lags.
- Tom: Say why the jump is intentional. Avoid spin.
- Rachel: This is acceptable for a young OSS package if the project returns to predictable semver after catch-up.

## Decision

Document the one-time npm catch-up jump in README and `docs/npm-publishing.md`, update changelog and handoff records with the `v0.18.0` GitHub release result, and keep npm status explicitly blocked until `npm view agentloopkit version` reports `0.18.0`.

## Non-decisions

- Do not publish stale intermediate npm versions from current source.
- Do not create another GitHub release for documentation-only status changes.
- Do not add release automation that needs npm credentials in the repo.
- Do not retry local npm publish until local npm authentication is repaired.

## Resulting tasks

- Add a task contract for the `0.18.0` release-status cleanup.
- Patch README, changelog, npm publishing docs, launch checklist, roadmap, final handoff, and dogfood log.
- Verify Markdown links, diff whitespace, and projscan output.
- Generate a handoff and clear the active local task pointer after the task is done.

## Success criteria

- Public docs explain why npm can jump from `0.1.1` to `0.18.0`.
- Public docs distinguish GitHub release availability from npm availability.
- The next publish path says to fix npm authentication or trusted publishing first.
- No source behavior changes are included in this documentation-only cleanup.
