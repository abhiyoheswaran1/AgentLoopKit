# Roadmap

AgentLoopKit is local-first and npm-distributed. The open-source core stays focused on repo-level task contracts, verification evidence, safety policies, and reviewer handoffs.

## Shipped

- Repo harness generation with `agentloop init`
- Setup checks with `agentloop doctor`
- Task contracts with `agentloop create-task`
- Active task lifecycle with `agentloop task list`, `show`, `set`, `current`, `status`, `archive`, and `clear`
- Verification reports with configured commands, custom commands, long-output excerpts, and CI context
- Task-linked verification reports and failed-verification summaries
- Deterministic PR summaries and `agentloop handoff`
- PR summary change-area classification and path-based review-focus hints
- Local static HTML evidence reports with `agentloop report`
- Local SVG evidence badges with `agentloop badge`
- Local CI provenance summaries with `agentloop ci-summary`
- Local release-note handoffs with `agentloop release-notes`
- Local template manifest checks and manual migration guidance
- Local safety policy inspection with `agentloop policy`
- Local safety policy template status with `agentloop policy status`
- Policy customization guidance for repo-local safety rules
- Repo-type policy examples for common project shapes
- Local review-evidence gates with `agentloop check-gates` and `--strict`
- Agent instruction installers, including `agentloop install-agent all`
- Static bash, zsh, and fish completions
- GitHub Actions recipes for evidence checks and CI-generated artifacts
- Stack recipes for Next.js, React/Vite, Node API, Python, docs-only, empty repos, and monorepos
- Launch visuals generated from committed Playwright and VHS sources

## Current Blocker

- Configure npm trusted publishing for GitHub Actions.
- npm previously lagged at `agentloopkit@0.1.1` while GitHub release candidates reached `v0.22.0`.
- GitHub release `v0.19.0` is public for local CI summaries.
- GitHub release `v0.21.0` is public for next-action and release-safety guardrails.
- GitHub release `v0.22.0` is public for task-linked verification and README evidence.
- Local `npm publish --access public` for `0.16.0` passed package checks and stopped at npm OTP/browser authentication.
- The release-triggered GitHub Publish workflow for `v0.16.0` passed package checks and failed at npm authorization.
- The release-triggered GitHub Publish workflow for `v0.17.0` passed package checks and failed at npm authorization.
- A local exact-tarball publish attempt for `0.17.0` reached npm and stopped at OTP/browser authentication.
- The release-triggered GitHub Publish workflow for `v0.18.0` passed package checks and failed at npm authorization.
- A local exact-tarball publish attempt for `0.18.0` reached npm and failed with authorization `E404`.
- `0.18.1` exists because package templates changed after `v0.18.0`; publish only from its matching release commit or tarball.
- The release-triggered GitHub Publish workflow for `v0.18.1` passed package checks and failed at npm authorization.
- The release-triggered GitHub Publish workflow for `v0.19.0` passed package checks and failed at npm authorization.
- GitHub release `v0.20.0` is public for local release-note handoffs.
- The release-triggered GitHub Publish workflow for `v0.20.0` passed package checks and failed at npm authorization.
- The release-triggered GitHub Publish workflow for `v0.21.0` passed package checks and failed at npm authorization.
- The release-triggered GitHub Publish workflow for `v0.22.0` passed package checks and failed at npm authorization.
- After the current GitHub release lands on npm, normal semver releases resume.

## Near Term

- Complete npm browser/OTP authentication or trusted publishing for the current GitHub release.
- Optional schema-store submission after npm publishing is stable.

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
