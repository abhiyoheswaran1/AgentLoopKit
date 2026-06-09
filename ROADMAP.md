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
- Local review-evidence gates with `agentloop check-gates` and `--strict`
- Agent instruction installers, including `agentloop install-agent all`
- Static bash, zsh, and fish completions
- GitHub Actions recipes for evidence checks and CI-generated artifacts
- Stack recipes for Next.js, React/Vite, Node API, Python, docs-only, empty repos, and monorepos
- Launch visuals generated from committed Playwright and VHS sources

## Current Blocker

- Configure npm trusted publishing for GitHub Actions.
- npm currently serves `agentloopkit@0.1.1`.
- GitHub release `v0.15.1` is public with a tarball asset.
- The next successful npm publish may jump from `0.1.1` to `0.15.1`, then normal semver releases resume.

## Near Term

- Repair npm publishing authorization.
- Add local static HTML report export.
- Add generated badges for local reports.
- Add policy pack customization.
- Add template version and migration guidance.
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
