# Interview Cycle 112

## Context
AgentLoopKit already ships the local acceptance-layer loop and public release-proof commands. The next work is not a new user workflow. It is repo discipline: future agent sessions should use AgentLoopKit, ProjScan, AgentFlight, product-panel review, and simulated research without cutting releases unless the maintainer asks.

## Personas interviewed
- Open Source Maintainer
- Platform Engineer
- Claude Code Power User
- AI-Skeptical Senior Engineer
- Small Team CTO

## Feedback summary
The strongest signal was operational clarity. The repo has good tools, but future agents need one written dogfood loop and one maintenance gate. The panel rejected another large feature because the near-term roadmap asks for release health, public-doc hygiene, small policy packs, read-only GitHub metadata, SchemaStore freshness, and repeatable proof.

## Raw simulated feedback
### Open Source Maintainer
- What they liked: README hygiene, release proof, and no telemetry.
- What confused them: which checks maintainers should run outside a full release.
- What they would need before using it: a short maintenance command and clear docs.
- What would make them recommend/star it: a repo that visibly follows its own process.
- What would make them abandon it: internal release chatter leaking into public docs.

### Platform Engineer
- What they liked: local policy packs and read-only evidence.
- What confused them: whether AgentFlight and ProjScan are required for users.
- What they would need before using it: clear separation between contributor dogfood and end-user setup.
- What would make them recommend/star it: repeatable guardrails that do not need tokens.
- What would make them abandon it: remote policy downloads or hidden registry behavior.

### Claude Code Power User
- What they liked: task contracts, ship reports, run ledger, and agent-specific instructions.
- What confused them: where autonomous sessions should start.
- What they would need before using it: a repo-local dogfood guide.
- What would make them recommend/star it: fewer forgotten handoff steps.
- What would make them abandon it: noisy local artifacts in every diff.

### AI-Skeptical Senior Engineer
- What they liked: deterministic checks and no LLM dependency.
- What confused them: product-panel files if they look like real user evidence.
- What they would need before using it: explicit labeling that simulated feedback is internal.
- What would make them recommend/star it: maintenance rules enforced by tests.
- What would make them abandon it: fake adoption claims.

### Small Team CTO
- What they liked: one local loop that humans and agents can share.
- What confused them: release-channel state versus future marketplace ideas.
- What they would need before using it: stable release-proof and public-doc gates.
- What would make them recommend/star it: trust that release docs stay current.
- What would make them abandon it: premature paid-plan gating or cloud language.

## Product council debate
- Abhi: Keep the wedge tight. This batch should make AgentLoopKit a better example of itself, not add a new product surface.
- Maya: Add a small `maintenance:check` script and tests. Avoid another abstraction.
- Elias: Public docs should stay about install, use, evidence, and release proof. Put internal agent research in `.agentloop/`.
- Nora: Future agents need a single starting guide that says which commands to run.
- Samir: Ignore local session caches, keep AgentFlight local, and block token or `.env` behavior from dogfood.
- Lina: AgentFlight and ProjScan should be part of our own loop because long autonomous work needs session proof and repo-risk context.
- Tom: The test suite should prove these rules exist. Simulated research must not become public proof.
- Rachel: Keep GitHub metadata read-only until teams prove they want more.

## Decision
Add a committed AgentFlight config, a repo dogfood guide, a `maintenance:check` script, dogfood script coverage for AgentFlight, and tests that lock in the near-term maintenance guardrails.

## Non-decisions
- No release in this batch.
- No new marketplace channel.
- No Pro gating.
- No cloud service, telemetry, login, billing, or AI API calls.
- No change to `ship` scoring from GitHub metadata.

## Resulting tasks
- Configure AgentFlight as a local-first companion tool.
- Add `.agentloop/harness/autonomous-dogfooding.md`.
- Update AGENTS and harness command docs.
- Add `npm run maintenance:check`.
- Add tests for dogfood tooling and maintenance guardrails.
- Keep public docs user-facing.

## Success criteria
- Focused tests cover AgentFlight dogfood, autonomous harness guidance, and maintenance guardrails.
- `npm run dogfood:strict` runs AgentLoopKit checks, dependency audit, AgentFlight, and ProjScan without release actions.
- Public docs mention only user and maintainer behavior, not simulated user claims.
