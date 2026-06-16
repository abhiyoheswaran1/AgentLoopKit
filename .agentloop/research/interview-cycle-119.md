# Interview Cycle 119

Internal simulated feedback and product-panel output. This is not real user research.

## Context

AgentLoopKit already checks public release proof for npm, GitHub Releases, GHCR, and MCP Registry. Dogfooding after unreleased commits showed a trust gap: `release-proof` could pass for `0.34.1` while the current checkout was ahead of `v0.34.1`.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Startup CTO

## Feedback summary

The strongest signal was wording and evidence boundaries. Maintainers need release-proof to say which package version is visible publicly, and they need a separate signal when current `HEAD` has unreleased commits.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: One command checks npm, GitHub Releases, GHCR, and MCP Registry.
- What confused them: The output showed the current commit but did not say whether that commit matched the version tag.
- What they would need before using it: A direct HEAD/tag line and a next action.
- What would make them recommend/star it: Release proof that avoids ambiguous release claims.
- What would make them abandon it: A release helper that makes unreleased commits look published.

### Security Reviewer

- What they liked: The command is read-only and token-free.
- What confused them: `--strict` could still pass on a checkout that is newer than the tag.
- What they would need before using it: Clear separation between channel proof and local release readiness.
- What would make them recommend/star it: No publishing side effects and explicit safety language.
- What would make them abandon it: Any hidden registry mutation, token read, or tag creation.

### AI-Skeptical Senior Engineer

- What they liked: This is deterministic and based on git state.
- What confused them: "Record release proof" sounded wrong when `HEAD` had commits after the release.
- What they would need before using it: The command should recommend `release-check` for unreleased commits.
- What would make them recommend/star it: Boring output that states exactly what was checked.
- What would make them abandon it: Vague release confidence without commit evidence.

### Startup CTO

- What they liked: Release proof can support a small team's release checklist.
- What confused them: A passing proof result could be copied into a handoff without noting unreleased changes.
- What they would need before using it: A line that distinguishes released package version from current checkout.
- What would make them recommend/star it: A release process junior engineers and agents can follow without guesswork.
- What would make them abandon it: A gate that fails every time development continues after a release.

## Product council debate

- Abhi: Keep the release path simple. Show the distinction; do not add release automation.
- Maya: Add two git fields and one next-action branch. Avoid a new state machine.
- Elias: Put this in release docs, not the README.
- Nora: The next action should say `release-check` when `HEAD` is ahead.
- Samir: Keep the command read-only and make safety explicit.
- Lina: Agents need this because they often run from `main`, not from a release tag checkout.
- Tom: Passing channel proof should not imply current code is published.
- Rachel: Maintenance checks should keep working during normal unreleased development.

## Decision

Add release-proof metadata for the version tag commit, current commit, and HEAD/tag match state. Keep channel proof passing when public channels match the package version. When HEAD differs from the tag and channel proof passes, recommend `agentloop release-check`.

## Non-decisions

- Do not bump or publish a version.
- Do not make maintenance checks fail only because development continued after a release.
- Do not create tags, releases, npm publishes, GHCR images, or MCP Registry entries.
- Do not read tokens or `.env` files.

## Resulting tasks

- Add regression coverage for HEAD/tag mismatch.
- Add release-proof git metadata.
- Update release-proof docs, CLI reference, changelog, decisions, backlog, and dogfood log.
- Run focused tests, static checks, dogfood, AgentFlight, ProjScan, and maintenance gate.

## Success criteria

- JSON output includes `git.tagCommit` and `git.headMatchesTag`.
- Markdown output shows tag commit, current commit, and HEAD/tag match state.
- Passing channel proof with unreleased commits recommends `agentloop release-check`.
- `npm run maintenance:check -- --json` can still pass while `HEAD` is ahead of the version tag.
