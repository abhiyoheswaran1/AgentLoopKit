# Interview Cycle 104

## Context

AgentLoopKit `0.24.0` is published on npm, GitHub release `v0.24.0` is public, and npm trusted publishing is configured for future GitHub releases. The README still contained maintainer-only release recovery language, which is wrong because the same README ships to npm.

This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Founder / Product Lead
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is public-doc hygiene. The README should explain what AgentLoopKit is, how to install it, how to use it, and why it is safe. Release incidents, npm auth state, trusted-publishing setup, and catch-up history belong in maintainer docs and internal handoffs.

## Raw simulated feedback

### Founder / Product Lead

- What they liked: npm and GitHub release alignment removes the largest adoption concern.
- What confused them: The README still sounded like an internal release incident log.
- What they would need before using it: Clean install commands and clear positioning.
- What would make them recommend/star it: A README that feels like a polished devtool launch page.
- What would make them abandon it: Public docs exposing internal release friction.

### Open Source Maintainer

- What they liked: Trusted publishing is now configured.
- What confused them: README and maintainer docs mixed user install guidance with release operations.
- What they would need before using it: Release operations kept in `docs/`, not npm README copy.
- What would make them recommend/star it: Maintainer docs that capture the process without leaking it into the user path.
- What would make them abandon it: README churn every time release state changes.

### Developer Experience Designer

- What they liked: `npx agentloopkit init` remains the right first command.
- What confused them: The install section asked users to understand npm catch-up history.
- What they would need before using it: Minimal install, pinned install, and next commands.
- What would make them recommend/star it: Short copy with no release archaeology.
- What would make them abandon it: Asking first-time users to parse maintainer problems.

### Security Reviewer

- What they liked: No tokens, OTPs, or credential details are needed in public docs.
- What confused them: Mentioning local auth state in README invites bad habits.
- What they would need before using it: Public docs that say what the tool does and does not do.
- What would make them recommend/star it: Trusted publishing documented for maintainers only.
- What would make them abandon it: Any public instruction that encourages sharing auth state.

### Power User / Agentic Engineer

- What they liked: Future channels are useful if they stay thin wrappers around the CLI.
- What confused them: MCP Registry was mentioned before an MCP server exists.
- What they would need before using it: Channel tasks with prerequisites and no false support claims.
- What would make them recommend/star it: GitHub Action and Docker support after npm is stable.
- What would make them abandon it: A channel list that promises unsupported integrations.

### AI-Skeptical Senior Engineer

- What they liked: The README now focuses on concrete artifacts and commands.
- What confused them: Internal release notes in public README felt unprofessional.
- What they would need before using it: Deterministic workflow claims and boring install instructions.
- What would make them recommend/star it: Honest docs that do not oversell support.
- What would make them abandon it: Public docs that read like generated process debris.

## Product council debate

- Abhi: README is product surface. Keep internal release state out of it.
- Maya: Put channel expansion behind separate tasks. Do not mix release planning with implementation.
- Elias: npm and GitHub are current. The maintainer docs can carry release history.
- Nora: Install should be `npx agentloopkit init`, then next commands. Nothing else in the first-run path.
- Samir: Auth state, OTPs, and trusted-publisher setup belong in private maintainer flow, not user docs.
- Lina: Add future tasks for GitHub Action and Docker before editor extension work.
- Tom: Do not claim MCP Registry until there is an MCP server.
- Rachel: A thin GitHub Action and GHCR image are the most useful team adoption channels after npm.

## Decision

Remove internal release-state language from README, update current release docs to reflect npm `0.24.0`, add a maintainer distribution-channel plan, and create future task contracts for each release channel.

## Non-decisions

- Do not implement Homebrew, Docker/GHCR, GitHub Action, MCP, editor extensions, Scoop, or WinGet in this iteration.
- Do not put release incident history in README.
- Do not claim MCP Registry support before building a real MCP server.
- Do not add cloud, telemetry, login, billing, or hosted dashboards.

## Resulting tasks

- Clean README install and publishing content.
- Update current maintainer release docs.
- Add `docs/distribution-channels.md`.
- Add backlog entries for all release channels.
- Add proposed task contracts for future channel work.
- Verify docs, links, types, tests, build, and projscan.

## Success criteria

- README contains no npm auth state, catch-up history, or release blocker language.
- Maintainer docs state npm latest is `0.24.0` and trusted publishing is configured.
- Future release-channel work is captured as backlog and task contracts.
- MCP Registry work is blocked on a real MCP server prerequisite.
