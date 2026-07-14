# Roadmap

AgentLoopKit is local-first and npm-distributed. The open-source core stays focused on repo-level task contracts, verification evidence, safety policies, and reviewer handoffs.

Starting at 1.0, the shipped surface is a committed public contract under SemVer, enforced by contract-lock tests (`contract:check`). See `docs/stability.md` and `docs/versioning.md`.

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
- Local evidence map with `agentloop explain-diff`, review-surface reuse, and compact `agentloop resume-pack` continuation briefs
- Local Context Contract with `agentloop context budget`, `context pack`, `context show`, reversible source handles, context receipts, and MCP tools
- Repo-native Start preflight with `agentloop start` for active task, context handles, risk, verification freshness, next safe command, and context-budget impact
- Local Guard checks with `agentloop guard` for drift, proof debt, baselines, and context-budget pressure
- Local template manifest checks and manual migration guidance
- Local safety policy inspection with `agentloop policy`
- Local safety policy template status with `agentloop policy status`
- Policy customization guidance for repo-local safety rules
- Repo-type policy examples for common project shapes
- Local review-evidence gates with `agentloop check-gates` and `--strict`
- Read-only existing-repo harness upgrade audit with `agentloop upgrade-harness`
- Read-only MCP server with `agentloop mcp-server` for status, tasks, policies, policy template status, verification reports, ship reports, artifact inventory metadata, review context snapshots, run summaries and details, file intent matches, maintainer checks, gate status, and handoffs
- Agent instruction installers, including `agentloop install-agent all`
- Static bash, zsh, fish, and PowerShell completions
- GitHub Actions, GitLab CI, and Buildkite recipes for evidence checks and CI-generated artifacts
- Cross-platform CLI smoke workflow for Ubuntu, macOS, and Windows
- Composite GitHub Action wrapper for running AgentLoopKit commands in CI
- Dockerfile and GHCR release workflow for a minimal `agentloop` image
- MCP Registry metadata and publish workflow for the read-only server
- SchemaStore catalog entry helper with `agentloop schemastore`
- Configurable local policy packs with `agentloop policy packs`, `policy pack show`, and `policy pack apply`
- Explicit local GitHub issue/PR metadata import with `agentloop github import`
- Imported GitHub issue/PR metadata in `review-context`, `prepare-pr`, and `maintainer-check`
- Organization policy-pack workflow examples for repo-local team review rules
- Stack recipes for Next.js, React/Vite, Node API, Python, docs-only, empty repos, and monorepos
- Windows package-manager design notes for Scoop and WinGet without public availability claims
- VS Code/Open VSX extension validation gates before any editor marketplace release
- Launch visuals generated from committed Playwright and VHS sources
- Baseframe Suite v1 local JSON integration with ProjScan assessment import and AgentFlight gate reconciliation
- Guarded loop runner passes with `agentloop loop run`, explicit configured runner commands, bounded output, changed-file evidence, and token receipts
- Read-only loop scorecards with `agentloop loop scorecard` for continuation, human-review, stop, and ready decisions
- 1.0 stability contract: the full command surface committed as a public SemVer contract, with contract-lock tests (`contract:check`), a pre-freeze consistency audit, a versioning/deprecation/experimental policy, and a guaranteed 0.x to 1.0 upgrade path

## Current State

- GitHub release `v1.2.0` is public.
- npm latest is `agentloopkit@1.2.0`.
- GHCR and MCP Registry are live for `1.2.0`.
- GitHub Marketplace listing is pending owner UI publication for the composite Action.
- npm trusted publishing is configured for `abhiyoheswaran1/AgentLoopKit` and `.github/workflows/publish.yml`.
- Future releases should publish through GitHub Releases and the trusted-publishing workflow.
- Do not publish older release numbers from current `main`; use matching release tags or tarballs if an old line must be reproduced.
- Release tag `v1.2.0` points at the published release commit.
- Current `main` contains release proof documentation after `v1.2.0`.

## Near Term

- Keep the GitHub release to npm trusted-publishing flow healthy with each release.
- Keep the README focused on user install and usage, not release operations.
- Keep GitHub Marketplace, GHCR, and MCP Registry release proof current after each release.
- Keep the SchemaStore catalog entry current if the config schema URL changes.
- Keep bundled policy packs small, safe, and useful for real maintainers.
- Keep local GitHub metadata consumption read-only and optional while teams try it in real repos.
- Use the [real-repo trial checklist](docs/real-repo-trials.md) before adding more bundled policy packs or changing GitHub metadata scoring.

## Later

- Keep the VS Code/Open VSX extension deferred until command-palette shortcuts prove necessary. See `docs/designs/vscode-open-vsx-extension.md`.
- Evaluate Scoop and WinGet after Windows smoke tests, release checksums, and user demand are stable. See `docs/designs/windows-package-managers.md`.
- Collect real feedback on organization policy-pack examples before adding more bundled packs.
- Evaluate whether imported GitHub metadata should affect `ship` scoring after the read-only context format proves stable.
- Evaluate paid team features only after npm publishing is stable and the open-source CLI matures.

## Non-Goals

- No hosted SaaS.
- No LLM wrapper.
- No telemetry.
- No database.
- No IDE replacement.
- No login, billing, or cloud dashboard in the MVP.
