# Interview Cycle 110

## Context

AgentLoopKit `0.32.1` shipped through GitHub Releases, npm trusted publishing, GHCR, and MCP Registry. After the release, the maintainer asked to continue roadmap implementation and run user research with agents. Two internal read-only research agents reviewed the product direction:

- Product research agent: first-run, first-PR, team rollout, and adoption clarity.
- Roadmap engineering agent: feasible roadmap work, maintenance risk, and safety boundaries.

This cycle is internal simulated product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Startup CTO

## Feedback summary

The strongest signal was adoption evidence, not another large feature. Teams need practical policy-pack examples, and reviewers need imported GitHub issue or PR context to appear in the local review surfaces that already exist.

The panel rejected marketplace expansion for this batch. VS Code/Open VSX, Scoop, WinGet, and more release channels stay deferred until demand and maintenance capacity justify them.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: npm, GitHub Releases, GHCR, and MCP Registry now have real release proof.
- What confused them: `agentloop github import` existed, but the imported context did not yet show up in the main review flow.
- What they would need before using it: PR copy that carries issue context without requiring GitHub tokens.
- What would make them recommend/star it: A clean local story for issue context, PR descriptions, and maintainer checks.
- What would make them abandon it: Any CLI behavior that posts comments or reads tokens without explicit setup.

### Platform Engineer

- What they liked: Local policy packs fit team standards without a hosted policy service.
- What confused them: The docs showed the command shape but not a full organization pack workflow.
- What they would need before using it: A manifest example, policy examples, dry-run apply, and no-overwrite guarantees.
- What would make them recommend/star it: Copyable policy-pack examples that work across several repos.
- What would make them abandon it: Remote policy downloads, hidden network calls, or auto-enforcement.

### Power User / Agentic Engineer

- What they liked: `review-context`, `ship`, `prepare-pr`, and `maintainer-check` create a useful evidence loop.
- What confused them: Agents still needed to inspect `.agentloop/github/context.json` manually.
- What they would need before using it: The context should appear in `review-context` and PR prep output.
- What would make them recommend/star it: One local command that tells an agent the active task, evidence, and related issue/PR.
- What would make them abandon it: More markdown files that agents must parse manually.

### Skeptical Senior Developer

- What they liked: The product remains deterministic and local.
- What confused them: Whether imported issue text could break generated Markdown or look like trusted code-review evidence.
- What they would need before using it: Escaped PR-facing output and clear wording that this is context only.
- What would make them recommend/star it: Reviewers see enough context without giving the tool GitHub credentials.
- What would make them abandon it: Claims that issue text proves quality or correctness.

### Startup CTO

- What they liked: Policy packs could make agent-assisted PRs more consistent across repos.
- What confused them: Whether missing GitHub metadata would block a PR.
- What they would need before using it: Missing metadata must stay optional so teams can adopt incrementally.
- What would make them recommend/star it: Low-friction team rollout with no SaaS dependency.
- What would make them abandon it: A workflow that demands every repo use GitHub in the same way.

## Product council debate

- Abhi: "Keep the wedge clear: make agent-generated code reviewable without becoming a project-management app."
- Maya: "Use the metadata file we already have. Do not add a GitHub API client."
- Elias: "Docs need the org policy-pack workflow, not just a command reference."
- Nora: "The next PR path should show issue context where reviewers already look."
- Samir: "Imported issue text is untrusted. Escape it, keep it optional, and never read tokens."
- Lina: "Agents need this in `review-context`; otherwise they still inspect files by hand."
- Tom: "Do not let issue metadata affect code-quality claims."
- Rachel: "Make team rollout clearer without adding cloud features."

## Decision

Build the adoption-evidence batch:

- Read `.agentloop/github/context.json` in `review-context`, `prepare-pr`, and `maintainer-check`.
- Include imported issue and PR context in generated PR bodies.
- Treat missing metadata as neutral and invalid local metadata as a warning.
- Add org policy-pack workflow examples with dry-run and no-overwrite guidance.

## Non-decisions

- Do not call GitHub APIs.
- Do not post or update GitHub comments from the CLI.
- Do not read GitHub tokens or `.env` files.
- Do not add VS Code/Open VSX, Scoop, WinGet, cloud dashboards, telemetry, or paid-team features.
- Do not make imported GitHub metadata affect `ship` scoring yet.

## Resulting tasks

- Fix GitHub metadata round-trip reading for normalized `bodyExcerpt` fields.
- Add metadata summaries to `review-context`.
- Add an `Imported GitHub Context` section to `prepare-pr`.
- Add a `github-metadata` maintainer check.
- Document organization policy-pack workflows.
- Update public docs, roadmap, decisions, backlog, and dogfood log.
- Add tests for metadata consumption.

## Success criteria

- Missing GitHub metadata stays neutral.
- Invalid GitHub metadata is visible as local context risk.
- Imported issue and PR text is escaped in PR-facing Markdown.
- Public docs explain the feature without claiming token-based GitHub integration.
- The roadmap batch passes focused tests, unit/integration checks, public-doc checks, link checks, and strict dogfood.
