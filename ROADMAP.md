# Roadmap

AgentLoopKit is local-first and npm-distributed. The open-source core stays focused on repo-level task contracts, verification evidence, safety policies, and reviewer handoffs.

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

## Current Blocker

- GitHub release `v0.23.0` is public with the current CLI, including PowerShell completions.
- npm still serves `agentloopkit@0.1.1` until account authentication or trusted publishing is repaired.
- The release-triggered GitHub Publish workflow for `v0.23.0` passed package checks and failed at npm authorization with `E404`.
- The next npm publish should catch up once to `0.23.0`, then normal semver releases resume.
- Do not publish older release numbers from current `main`; use matching release tags or tarballs if an old line must be published.

## Near Term

- Complete npm browser/OTP authentication or configure npm trusted publishing for `agentloopkit@0.23.0`.
- Remove temporary GitHub tarball fallback guidance after npm reports `0.23.0` or newer.
- Submit the config schema to SchemaStore after npm publishing is stable.

## Later

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
