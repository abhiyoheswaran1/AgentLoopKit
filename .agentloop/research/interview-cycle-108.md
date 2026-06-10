# Interview Cycle 108

## Context

AgentLoopKit already ships on npm and GitHub Releases. The product panel asked whether to add MCP Registry, Homebrew, Docker/GHCR, and a GitHub Action. The user confirmed those channels should move from backlog into implementation, with MCP Registry gated on a real MCP server.

## Personas interviewed

- Claude Code Power User
- Platform Engineer
- Small Team CTO
- Open Source Maintainer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal was that distribution channels should reuse the existing CLI rather than introduce new product surfaces. MCP was valuable only if it exposed a real read-only server. GitHub Action and Docker had clear CI value. Homebrew mattered for install friction, but only after checksum and tap verification. No persona wanted cloud, login, telemetry, or a dashboard in this iteration.

## Raw simulated feedback

### Claude Code Power User

- What they liked: MCP can let an agent inspect task state, policies, verification reports, and handoffs without scraping the filesystem.
- What confused them: Whether MCP can run `verify`.
- What they would need before using it: Clear tool names and read-only safety rules.
- What would make them recommend/star it: A simple MCP client config using `npx`.
- What would make them abandon it: An MCP server that mutates files or runs commands without explicit user action.

### Platform Engineer

- What they liked: Docker and GitHub Action reduce repeated CI setup across repos.
- What confused them: Whether the Docker image includes project dependencies.
- What they would need before using it: Pinned tags, clear volume mount examples, and no hidden install behavior.
- What would make them recommend/star it: A clean `check-gates --strict` CI recipe.
- What would make them abandon it: Image builds that read credentials or bundle user project dependencies.

### Small Team CTO

- What they liked: GitHub Action plus MCP gives teams a path from local agent discipline to CI evidence.
- What confused them: Whether MCP Registry means AgentLoopKit is now an AI agent.
- What they would need before using it: README copy that keeps npm as the main install path.
- What would make them recommend/star it: Consistent proof across local CLI and CI.
- What would make them abandon it: Scope drift into dashboards before the CLI is trusted.

### Open Source Maintainer

- What they liked: Release channels make the project easier to install and cite.
- What confused them: Homebrew support before a tap exists.
- What they would need before using it: Exact formula checksum, release asset, and tap instructions.
- What would make them recommend/star it: A README that stays user-facing and does not include maintainer incident notes.
- What would make them abandon it: Claims that a channel is live before maintainers verify it.

### AI-Skeptical Senior Engineer

- What they liked: Read-only MCP and no telemetry match the project's trust posture.
- What confused them: Why MCP is useful if the CLI already prints status.
- What they would need before using it: Deterministic tools that expose the same evidence as local commands.
- What would make them recommend/star it: Clear safety docs and tests.
- What would make them abandon it: Hidden network calls or command execution from MCP.

## Product council debate

- Abhi: Ship the channels that strengthen the npm wedge. MCP is allowed because it exposes the existing loop to agent clients.
- Maya: Keep every channel thin. The CLI remains the source of behavior.
- Elias: The README can mention channels, but current status and release proof belong in maintainer docs.
- Nora: GitHub Action docs need one copyable example. MCP docs need one client config.
- Samir: MCP v1 must be read-only. No command execution, no `.env` reads, no uploads.
- Lina: `agentloop mcp-server` is useful if tools map to status, next, tasks, policies, reports, and handoffs.
- Tom: Do not call Homebrew live until the tap and checksum are verified.
- Rachel: Docker/GHCR and the GitHub Action are the strongest team adoption path after npm.

## Decision

Build the read-only MCP server and distribution artifacts now:

- `agentloop mcp-server`
- MCP Registry metadata and workflow
- GitHub Action wrapper
- Dockerfile and GHCR release workflow
- Homebrew formula template
- docs and tests for all of the above

## Non-decisions

- No MCP tools that run verification commands.
- No hosted dashboard.
- No VS Code extension in this release.
- No Scoop or WinGet manifests yet.
- No Homebrew claim until the tap is updated and verified.

## Resulting tasks

- Implement read-only MCP tools for status, next action, tasks, active task, policies, verification report, and handoffs.
- Add Vitest coverage for MCP behavior and safety.
- Add `server.json`, `mcpName`, and MCP publish workflow.
- Add `action.yml` and GitHub Actions docs.
- Add Dockerfile and GHCR workflow.
- Add Homebrew formula and checksum release step.
- Update distribution docs, README, changelog, backlog, dogfood log, and handoff.

## Success criteria

- Full Vitest suite passes.
- Typecheck and build pass.
- Packed package includes `server.json` and built MCP command.
- `agentloop mcp-server` starts and responds to MCP `tools/list`.
- README stays user-facing.
- Maintainer docs distinguish implemented artifacts from externally verified releases.
