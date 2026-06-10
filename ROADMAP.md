# Roadmap

AgentLoopKit is local-first and npm-distributed. The open-source core stays focused on repo-level task contracts, verification evidence, safety policies, and reviewer handoffs.

See `docs/distribution-channels.md` for the staged release-channel plan beyond npm and GitHub Releases.

## Shipped

- Repo harness generation with `agentloop init`
- Setup checks with `agentloop doctor`
- Task contracts with `agentloop create-task`
- Active task lifecycle with `agentloop task list`, `show`, `set`, `current`, `status`, `archive`, and `clear`
- Verification reports with configured commands, custom commands, long-output excerpts, and GitHub Actions, GitLab CI, and Buildkite CI context
- Task-linked verification reports and failed-verification summaries
- Deterministic PR summaries and `agentloop handoff`
- PR summary change-area classification and path-based review-focus hints
- Local static HTML evidence reports with `agentloop report`
- Local SVG evidence badges with `agentloop badge`
- Local CI provenance summaries with `agentloop ci-summary` for GitHub Actions, GitLab CI, and Buildkite
- Local release-note handoffs with `agentloop release-notes`
- Local template manifest checks and manual migration guidance
- Local safety policy inspection with `agentloop policy`
- Local safety policy template status with `agentloop policy status`
- Policy customization guidance for repo-local safety rules
- Repo-type policy examples for common project shapes
- Local review-evidence gates with `agentloop check-gates` and `--strict`
- Agent instruction installers, including `agentloop install-agent all`
- Static bash, zsh, fish, and PowerShell completions
- GitHub Actions, GitLab CI, and Buildkite recipes for evidence checks and CI-generated artifacts
- Stack recipes for Next.js, React/Vite, Node API, Python, docs-only, empty repos, and monorepos
- Launch visuals generated from committed Playwright and VHS sources

## Current State

- GitHub release `v0.24.2` is public.
- npm latest is `agentloopkit@0.24.2`.
- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- Future releases should publish through GitHub Releases and the trusted-publishing workflow.
- Do not publish older release numbers from current `main`; use matching release tags or tarballs if an old line must be reproduced.

## Near Term

- Keep the GitHub release to npm trusted-publishing flow healthy with each release.
- Keep the README focused on user install and usage, not release operations.
- Add staged distribution-channel tasks for Homebrew, Docker/GHCR, GitHub Action, MCP Registry, editor extensions, Scoop, and WinGet.
- Submit the config schema to SchemaStore after npm publishing is stable.

## Later

- Add Homebrew tap support.
- Add a Docker/GHCR image for CI usage.
- Add a GitHub Action wrapper for common AgentLoopKit CI commands.
- Build a real MCP server before any MCP Registry submission.
- Evaluate VS Code/Open VSX, Scoop, and WinGet after the core release flow stays stable.
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
