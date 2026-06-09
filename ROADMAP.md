# Roadmap

AgentLoopKit is local-first and npm-distributed. The open-source core stays focused on repo-level task contracts, verification evidence, safety policies, and reviewer handoffs.

## Shipped

- Repo harness generation with `agentloop init`
- Setup checks with `agentloop doctor`
- Task contracts with `agentloop create-task`
- Active task lifecycle with `agentloop task list`, `show`, `set`, `current`, `status`, `archive`, and `clear`
- Verification reports with configured commands, custom commands, long-output excerpts, and CI context
- Deterministic PR summaries and `agentloop handoff`
- PR summary change-area classification and path-based review-focus hints
- Local static HTML evidence reports with `agentloop report`
- Local SVG evidence badges with `agentloop badge`
- Local template manifest checks and manual migration guidance
- Local safety policy inspection with `agentloop policy`
- Local review-evidence gates with `agentloop check-gates` and `--strict`
- Agent instruction installers, including `agentloop install-agent all`
- Static bash, zsh, and fish completions
- GitHub Actions recipes for evidence checks and CI-generated artifacts
- Stack recipes for Next.js, React/Vite, Node API, Python, docs-only, empty repos, and monorepos
- Launch visuals generated from committed Playwright and VHS sources

## Current Blocker

- Configure npm trusted publishing for GitHub Actions.
- npm previously lagged at `agentloopkit@0.1.1` while GitHub release candidates reached `v0.15.1`.
- GitHub release `v0.16.0` is public with a tarball asset.
- Current source targets `0.17.0` because `main` has moved after `v0.16.0`.
- Local `npm publish --access public` for `0.16.0` passed package checks and stopped at npm OTP/browser authentication.
- The release-triggered GitHub Publish workflow for `v0.16.0` passed package checks and failed at npm authorization.
- After the current prepared release lands on npm, normal semver releases resume.

## Near Term

- Complete npm browser/OTP authentication or trusted publishing for the current prepared release.
- Add stricter policy editing and customization guidance.
- Improve contributor issue examples and good-first tasks.

## Later

- Add CI summary import.
- Add configurable organization policy packs.
- Add GitHub issue and PR metadata import.
- Add optional schema-store submission after npm publishing is stable.
- Evaluate paid team features only after npm publishing is stable and the open-source CLI matures.

## Non-Goals

- No hosted SaaS.
- No LLM wrapper.
- No telemetry.
- No database.
- No IDE replacement.
- No login, billing, or cloud dashboard in the MVP.
