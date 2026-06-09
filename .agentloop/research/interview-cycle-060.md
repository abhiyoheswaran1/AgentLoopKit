# Interview Cycle 60

## Context

AgentLoopKit now has a public `v0.15.0` GitHub release, npm still serves `0.1.1`, and cycle 59 improved `doctor` risk reporting. The next launch-readiness gap is config schema trust: generated configs point at `https://agentloopkit.dev/schema/agentloop.config.schema.json`, but the repo does not prove that this custom domain hosts the schema.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Developer Experience Designer
- Skeptical Senior Developer

## Feedback summary

The strongest signal is honesty. A `$schema` URL should either be hosted or use a location the project controls today. Since AgentLoopKit already stores the schema in GitHub and ships it in the npm package, the generated config should use the GitHub raw URL until a dedicated domain exists.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The package includes `schema/agentloop.config.schema.json`.
- What confused them: The generated config points at a custom domain that may not resolve.
- What they would need before using it: A URL that works now.
- What would make them recommend/star it: Transparent docs that say the schema ships locally too.
- What would make them abandon it: Broken editor links in the first generated file.

### Security Reviewer

- What they liked: The CLI does not fetch the schema at runtime.
- What confused them: A custom domain suggests infrastructure the project has not documented.
- What they would need before using it: No network calls in validation and no hidden schema download.
- What would make them recommend/star it: The schema URL matches a public repo asset.
- What would make them abandon it: A new runtime network dependency.

### Developer Experience Designer

- What they liked: `$schema` helps editors.
- What confused them: The first generated config should not contain a broken URL.
- What they would need before using it: A short docs note about local and remote schema locations.
- What would make them recommend/star it: Fewer trust papercuts on first run.
- What would make them abandon it: A config file that looks aspirational rather than real.

### Skeptical Senior Developer

- What they liked: Config validation uses local code, not remote state.
- What confused them: Why a young CLI has a custom schema domain before the domain is live.
- What they would need before using it: Proof that the URL resolves or a URL that clearly points at GitHub.
- What would make them recommend/star it: Boring, inspectable references.
- What would make them abandon it: Branding polish ahead of working infrastructure.

## Product council debate

- Abhi: Trust beats a prettier domain. Use the URL that works now.
- Maya: Do not change config version or validation semantics.
- Elias: GitHub raw is enough for launch. A custom domain can come later.
- Nora: Mention the local schema file in docs.
- Samir: No runtime network calls.
- Lina: Agents benefit when schema references are deterministic.
- Tom: Broken schema URLs are a trust smell.
- Rachel: Teams will tolerate GitHub raw more than a dead custom domain.

## Decision

Replace the placeholder custom schema URL with the GitHub raw schema URL in defaults, generated config templates, repo config, schema `$id`, tests, and docs. Keep CLI validation local and package the schema file as before.

## Non-decisions

- Do not set up `agentloopkit.dev`.
- Do not submit to SchemaStore.
- Do not change config version.
- Do not fetch schemas at runtime.
- Do not add a network dependency.

## Resulting tasks

- Add failing tests for the expected schema URL in config defaults, generated config, and schema `$id`.
- Update schema URL references.
- Update configuration docs and release handoff notes.
- Verify with focused tests, full Vitest, link checks, build, projscan, AgentLoop verify, and handoff.

## Success criteria

- `createDefaultConfig()` uses the GitHub raw schema URL.
- `agentloop init` writes the same URL.
- `schema/agentloop.config.schema.json` uses the same URL as `$id`.
- `agentloop.config.json` in this repo uses the same URL.
- Docs explain that the CLI validates locally and the package ships the schema.
