# Interview Cycle 111

## Context

AgentLoopKit is live as a local-first npm CLI with the core acceptance loop, GitHub Actions, GHCR, MCP Registry publishing, policy packs, SchemaStore support, optional local GitHub metadata import, and strict dogfood gates. The next roadmap slice should improve adoption and release trust without adding another large workflow feature.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- Startup CTO
- AI-Skeptical Senior Engineer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is that release trust is still too manual. Maintainers can verify npm with `npm-status` and local readiness with `release-check`, but GHCR, MCP Registry, GitHub release assets, and npm proof are still gathered by hand. Users also want public docs to stay clean after rapid development: no internal release chatter, no unsupported channel promises, no fake adoption language, and no premature Pro positioning.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: npm, GitHub Releases, GHCR, MCP Registry, public-doc hygiene, and release-flow already exist.
- What confused them: post-release proof is spread across docs, Actions, registry commands, and manual screenshots.
- What they would need before using it: one command that tells them whether a release is actually visible where docs claim it is visible.
- What would make them recommend/star it: a boring proof report with no hidden auth or mutation.
- What would make them abandon it: README or npm package docs leaking internal release-state notes.

### Platform Engineer

- What they liked: local-first gates, JSON output, CI-friendly commands, optional local GitHub metadata.
- What confused them: whether release proof requires GitHub tokens or registry credentials.
- What they would need before using it: fixture-driven, timeout-bounded checks and clear safety text.
- What would make them recommend/star it: proof artifacts they can attach to internal release processes.
- What would make them abandon it: commands that silently call APIs, post comments, or mutate releases.

### Startup CTO

- What they liked: reviewability and release discipline without a SaaS account.
- What confused them: how policy packs should stay useful without becoming organization governance software.
- What they would need before using it: small examples, not a huge policy framework.
- What would make them recommend/star it: easy adoption across repos and a credible release checklist.
- What would make them abandon it: premature Pro gating in the open-source docs.

### AI-Skeptical Senior Engineer

- What they liked: deterministic CLI outputs and explicit evidence.
- What confused them: claims that sound like marketing instead of verifiable facts.
- What they would need before using it: docs that say exactly what the tool checks and what it does not check.
- What would make them recommend/star it: a command that distinguishes local readiness from public release availability.
- What would make them abandon it: claims that the tool measures quality or guarantees safe code.

### Power User / Agentic Engineer

- What they liked: dogfood gate, run ledger, `ship`, `prepare-pr`, and MCP read-only context.
- What confused them: release proof is not part of the same loop yet.
- What they would need before using it: `release-proof` after release and stronger docs hygiene before release.
- What would make them recommend/star it: fewer manual release proof steps.
- What would make them abandon it: release docs that drift after fast patch releases.

## Product council debate

- Abhi: Build the proof helper now; it protects the OSS wedge and makes releases feel serious.
- Maya: Keep it a composed read-only command. Do not add a release orchestrator or credential management.
- Elias: Public docs must stay user-facing. Add hygiene tests so stale internal notes do not ship again.
- Nora: The command should say what passed, what is missing, and the next action in plain language.
- Samir: Block `.env` fixture reads, avoid token reads, add timeouts, and document that live checks only query public metadata.
- Lina: Make it usable in dogfood and release handoffs.
- Tom: Do not pretend registry availability means code quality. It is release evidence only.
- Rachel: This is valuable to teams later, but keep it OSS and local today.

## Decision

Implement `agentloop release-proof` as a read-only post-release evidence command. It will combine local package metadata, git tag evidence, npm status, GitHub release proof, GHCR tag proof, and MCP Registry proof. It will support JSON and captured fixture inputs so tests and CI can run deterministically.

Strengthen public-doc hygiene at the same time, focused on claims that have previously caused user confusion: internal release chatter, unsupported package-manager claims, fake adoption/testimonial language, and premature Pro/SaaS copy.

## Non-decisions

- Do not build a Pro gate.
- Do not publish a new version in this batch.
- Do not add Homebrew, Scoop, WinGet, VS Code, Open VSX, or hosted dashboards.
- Do not make GitHub metadata mandatory.
- Do not add remote policy-pack fetching.

## Resulting tasks

- Add release-proof core, CLI, docs, tests, and completion support.
- Add public-doc hygiene guards for release/documentation trust.
- Review SchemaStore, GitHub metadata, and policy-pack docs for local-first boundaries.
- Run a bug/security pass and ProjScan before final handoff.

## Success criteria

- `agentloop release-proof --json` produces structured evidence without mutation.
- Captured fixture tests prove npm/GitHub/GHCR/MCP proof handling without live registries.
- Public-doc hygiene fails on unsafe public claims and passes on current docs.
- README and CLI docs mention release-proof only as user-facing release evidence.
- Dogfood evidence records the task, verification, ship report, and handoff.
