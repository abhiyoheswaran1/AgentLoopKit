# Interview Cycle 68

## Context

AgentLoopKit now generates repo harnesses, task contracts, verification reports, handoffs, HTML evidence reports, gates, and badges. GitHub release `v0.16.0` is public, but npm remains at `0.1.1` until browser/OTP auth completes. The next local-first improvement should help users maintain generated AgentLoop files as templates evolve.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Principal Engineer

## Feedback summary

The strongest signal is that generated files need provenance. Users should be able to see which template generation created their harness and whether `doctor` thinks the harness is current. The panel rejected automatic migration because overwriting human-edited instructions would break trust.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: A local manifest makes support questions easier.
- What confused them: Whether `init` should rewrite existing files.
- What they would need before using it: A clear warning path when generated templates are old.
- What would make them recommend/star it: Transparent version metadata with no hidden update behavior.
- What would make them abandon it: A tool that rewrites `AGENTS.md` or policies unexpectedly.

### Platform Engineer

- What they liked: Template versioning helps many repos stay consistent.
- What confused them: Whether teams can pin templates later.
- What they would need before using it: `doctor --json` output that automation can read.
- What would make them recommend/star it: A warning that points to migration docs.
- What would make them abandon it: A migration engine that changes repo policy files without review.

### Power User / Agentic Engineer

- What they liked: Agents can ask `doctor` whether the harness is missing template metadata.
- What confused them: Whether this replaces reading `AGENTS.md`.
- What they would need before using it: A local file under `.agentloop/` that agents can inspect.
- What would make them recommend/star it: The warning says exactly what to do next.
- What would make them abandon it: Noisy warnings on a fresh init.

### Skeptical Senior Developer

- What they liked: A JSON manifest is boring and inspectable.
- What confused them: Why not just use package version.
- What they would need before using it: Separate template version from package version because docs can change without runtime semantics.
- What would make them recommend/star it: No network checks and no automatic migration.
- What would make them abandon it: Versioning theater with no practical warning.

### Principal Engineer

- What they liked: Small data file, one doctor check, no config schema break.
- What confused them: Whether old repos become invalid.
- What they would need before using it: Backwards-compatible warning, not failure.
- What would make them recommend/star it: Tests for missing, stale, invalid, and current manifests.
- What would make them abandon it: Required config migration for every existing user.

## Product council debate

- Abhi: This helps teams adopt AgentLoopKit across repos without making it heavy.
- Maya: Keep it as a manifest, not a migration framework.
- Elias: Add docs and make the warning easy to understand.
- Nora: `doctor` should give the next action in the message.
- Samir: Missing or invalid manifest must warn, never fail.
- Lina: Agents can use this signal before long sessions.
- Tom: Do not pretend this upgrades anything. It only tells you the state.
- Rachel: Version metadata is useful for later policy packs, but do not build policy packs yet.

## Decision

Add `.agentloop/manifest.json` during `init` with a current template version and generator name. Add a `doctor` check that passes for current manifests and warns for missing, invalid, stale, or newer manifests. Add docs that explain manual migration review and clarify that AgentLoopKit does not overwrite edited harness files.

## Non-decisions

- No automatic migration command.
- No remote template registry.
- No config schema change.
- No package-version pinning in generated repos.

## Resulting tasks

- Add template version constants.
- Generate `.agentloop/manifest.json` during `init`.
- Add doctor manifest checks.
- Add focused tests for init and doctor.
- Add migration guidance docs and README links.

## Success criteria

- Fresh `init` creates `.agentloop/manifest.json`.
- Fresh `doctor` reports the template manifest as current.
- `doctor` warns for missing, invalid, old, and newer manifests without serious errors.
- Public docs explain manual review and safe re-run behavior.
