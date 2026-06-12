# Roadmap

AgentLoopKit is local-first and npm-distributed. The open-source core stays focused on repo-level task contracts, verification evidence, safety policies, and reviewer handoffs.

See `docs/distribution-channels.md` for the staged release-channel plan beyond npm and GitHub Releases.

## Shipped

- Repo harness generation with `agentloop init`
- Setup checks with `agentloop doctor`
- Task contracts with `agentloop create-task`
- Active task lifecycle with `agentloop task list`, `show`, `set`, `current`, `status`, `archive`, and `clear`
- Task folder hygiene diagnostics with `agentloop task doctor`
- Verification reports with configured commands, custom commands, long-output excerpts, and GitHub Actions, GitLab CI, and Buildkite CI context
- Task-linked verification reports and failed-verification summaries
- Deterministic PR summaries and `agentloop handoff`
- PR summary change-area classification and path-based review-focus hints
- Local static HTML evidence reports with `agentloop report`
- Local SVG evidence badges with `agentloop badge`
- Local CI provenance summaries with `agentloop ci-summary` for GitHub Actions, GitLab CI, and Buildkite
- Local release-note handoffs with `agentloop release-notes`
- Local evidence inventory with `agentloop artifacts`
- Local reviewability snapshot with `agentloop review-context`
- Local template manifest checks and manual migration guidance
- Local safety policy inspection with `agentloop policy`
- Local safety policy template status with `agentloop policy status`
- Policy customization guidance for repo-local safety rules
- Repo-type policy examples for common project shapes
- Local review-evidence gates with `agentloop check-gates` and `--strict`
- Read-only MCP server with `agentloop mcp-server` for status, tasks, policies, policy template status, verification reports, ship reports, artifact inventory metadata, review context snapshots, run summaries and details, file intent matches, maintainer checks, gate status, and handoffs
- Agent instruction installers, including `agentloop install-agent all`
- Static bash, zsh, fish, and PowerShell completions
- GitHub Actions, GitLab CI, and Buildkite recipes for evidence checks and CI-generated artifacts
- Cross-platform CLI smoke workflow for Ubuntu, macOS, and Windows
- Composite GitHub Action wrapper for running AgentLoopKit commands in CI
- Dockerfile and GHCR release workflow for a minimal `agentloop` image
- MCP Registry metadata and publish workflow for the read-only server
- Stack recipes for Next.js, React/Vite, Node API, Python, docs-only, empty repos, and monorepos
- Launch visuals generated from committed Playwright and VHS sources

## Current State

- GitHub release `v0.27.0` is public.
- npm latest is `agentloopkit@0.27.0`.
- GHCR and MCP Registry are live for `0.27.0`.
- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- Future releases should publish through GitHub Releases and the trusted-publishing workflow.
- Do not publish older release numbers from current `main`; use matching release tags or tarballs if an old line must be reproduced.
- Current `main` is preparing the `0.28.0` release candidate, including README/demo refreshes, first-run guidance polish, cross-platform smoke CI, the local acceptance-layer commands, safer run ledger and public artifact paths, opt-in redacted Git-root output for status, gates, ship, and PR preparation, read-only artifact inventory, CLI review context snapshots, and MCP evidence tools.

## Near Term

- Keep the GitHub release to npm trusted-publishing flow healthy with each release.
- Keep the README focused on user install and usage, not release operations.
- Keep GHCR and MCP Registry release proof current after each release.
- Keep the SchemaStore catalog entry current if the config schema URL changes.

## Later

- Keep the VS Code/Open VSX extension deferred until command-palette shortcuts prove necessary. See `docs/designs/vscode-open-vsx-extension.md`.
- Evaluate Scoop and WinGet after Windows smoke tests and release checksums are stable.
- Add configurable organization policy packs.
- Add GitHub issue and PR metadata import.
- Evaluate paid team features only after npm publishing is stable and the open-source CLI matures.

## Non-Goals

- No hosted SaaS.
- No LLM wrapper.
- No telemetry.
- No database.
- No IDE replacement.
- No login, billing, or cloud dashboard in the MVP.
