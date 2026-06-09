# Interview Cycle 54

## Context

AgentLoopKit has `verify`, `handoff`, and `check-gates --strict`, plus public GitHub release `v0.14.0`. npm still serves `0.1.1`, so public docs must avoid implying that `npx agentloopkit` installs the newest release until publishing is repaired.

## Personas interviewed

- Small Team CTO
- Platform Engineer
- Open Source Maintainer
- Skeptical Senior Developer
- Security Reviewer

## Feedback summary

The strongest signal is adoption through copy-pasteable CI guidance. Teams want to know how AgentLoopKit fits into pull request checks without the tool silently installing workflows or pretending npm is current.

## Raw simulated feedback

### Small Team CTO

- What they liked: `check-gates --strict` can enforce review evidence.
- What confused them: Whether the command should run before or after tests.
- What they would need before using it: A GitHub Actions example that uploads reports and handoffs.
- What would make them recommend/star it: A lightweight PR evidence gate.
- What would make them abandon it: A workflow that mutates branches or posts comments without consent.

### Platform Engineer

- What they liked: Local files and deterministic outputs fit internal governance.
- What confused them: Whether AgentLoopKit expects committed reports or ephemeral CI-generated artifacts.
- What they would need before using it: Separate recipes for committed evidence and CI artifacts.
- What would make them recommend/star it: Clear failure semantics for strict gates.
- What would make them abandon it: A hidden policy engine or network dependency.

### Open Source Maintainer

- What they liked: Docs can set expectations for AI-generated PRs.
- What confused them: npm latest still lacks newer commands.
- What they would need before using it: npm-status-honest installation notes.
- What would make them recommend/star it: A PR template plus CI recipe that asks for task, verify, handoff, and gate evidence.
- What would make them abandon it: Docs that tell contributors to run commands unavailable on npm latest.

### Skeptical Senior Developer

- What they liked: `check-gates` inspects files instead of calling an LLM.
- What confused them: Whether `handoff` in CI creates noise.
- What they would need before using it: An explanation that CI artifacts are not a substitute for human review.
- What would make them recommend/star it: Failing CI when review evidence is missing.
- What would make them abandon it: Framing markdown generation as proof the code is correct.

### Security Reviewer

- What they liked: A docs-only recipe does not create or modify workflows in user repos.
- What confused them: Whether tarball URLs are temporary.
- What they would need before using it: Clear choice between normal npm usage and temporary GitHub release tarball usage.
- What would make them recommend/star it: No tokens, no secrets, no environment content printed.
- What would make them abandon it: Workflow steps that read `.env` or upload the repo.

## Product council debate

- Abhi: Add the recipe. It helps teams try the product without expanding scope.
- Maya: Keep this as docs and examples. Do not add a workflow generator yet.
- Elias: Link it from README and getting-started so GitHub readers can find it.
- Nora: Split the recipes by use case: committed evidence versus ephemeral CI artifacts.
- Samir: Mention npm status and avoid secret access or branch mutation.
- Lina: Agents need a deterministic CI target after they produce task, report, and handoff artifacts.
- Tom: Say `check-gates` checks evidence, not correctness.
- Rachel: This is useful for teams and does not push us toward a SaaS.

## Decision

Add GitHub Actions documentation and examples for review-evidence gates. Keep the implementation docs-only: no CLI installer, no generated `.github` files in `init`, and no workflow mutation.

## Non-decisions

- Do not add `agentloop install-ci`.
- Do not change existing workflows.
- Do not claim npm latest includes `check-gates --strict`.
- Do not add artifact dashboards or PR comments.

## Resulting tasks

- Add `docs/github-actions.md`.
- Add `examples/github-actions/README.md`.
- Link the recipe from README and getting-started.
- Update generated harness command guidance with a short CI note.
- Update backlog, dogfood log, and final handoff.

## Success criteria

- Docs explain committed evidence mode and ephemeral artifact mode.
- Example uses transparent commands and uploads only `.agentloop/reports` and `.agentloop/handoffs`.
- Docs state that npm latest must contain the required commands, or users must pin a release tarball while npm is behind.
- Link check and project health checks pass.
