# Interview Cycle 95

## Context

`agentloop ci-summary` exists, GitHub Actions recipes exist, and README now points at the current `v0.23.0` release. Teams on GitLab CI and Buildkite still lack copyable examples, and the GitHub Actions example README still pins the older `v0.19.0` tarball. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Startup CTO
- Platform Engineer
- Open Source Maintainer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is adoption outside GitHub Actions. Keep the CLI local-first and provider-agnostic, but show teams how to run the same evidence workflow in common CI systems.

## Raw simulated feedback

### Startup CTO

- What they liked: The GitHub Actions recipe shows the workflow without a dashboard.
- What confused them: Teams using GitLab CI or Buildkite must translate the recipe themselves.
- What they would need before using it: A copyable pipeline snippet and clear artifact paths.
- What would make them recommend/star it: The same evidence pattern works across CI providers.
- What would make them abandon it: A tool that assumes every team uses GitHub Actions.

### Platform Engineer

- What they liked: `check-gates --strict` is suitable for CI.
- What confused them: Provider-specific provenance is GitHub-only right now.
- What they would need before using it: Docs that say GitLab CI and Buildkite currently show Generic CI provenance.
- What would make them recommend/star it: Honest provider support and no hidden API calls.
- What would make them abandon it: Claims of GitLab or Buildkite integration without implementation.

### Open Source Maintainer

- What they liked: CI examples are examples only.
- What confused them: The GitHub example still pins `v0.19.0`.
- What they would need before using it: All examples pin the current public GitHub release tarball while npm lags.
- What would make them recommend/star it: The examples stay current and link from the README.
- What would make them abandon it: Stale install commands in launch docs.

### AI-Skeptical Senior Engineer

- What they liked: AgentLoopKit does not need an LLM or hosted service for CI evidence.
- What confused them: Whether CI summaries replace verification reports.
- What they would need before using it: A sentence saying `ci-summary` is a small reviewer artifact, not a test runner.
- What would make them recommend/star it: Deterministic, inspectable commands.
- What would make them abandon it: Provider-specific magic or token access.

## Product council debate

- Abhi: Add recipes, not integrations. Keep the wedge on repo-local evidence.
- Maya: Docs only. Do not add provider-specific CI env parsing until there is clear demand.
- Elias: Fix the stale GitHub example pin while adding new examples.
- Nora: Put copyable snippets in `examples/` and keep the README link short.
- Samir: State no secrets, no provider APIs, no workflow mutation.
- Lina: Agents can paste these snippets into task contracts or PR guidance.
- Tom: Be precise about Generic CI provenance.
- Rachel: CI examples help small teams standardize agent-generated PR review.

## Decision

Add GitLab CI and Buildkite example READMEs, update the GitHub Actions example to `v0.23.0`, and link provider examples from the public docs.

## Non-decisions

- Do not add a workflow installer.
- Do not add GitLab or Buildkite API calls.
- Do not add provider-specific environment allowlists in this cycle.
- Do not change package metadata or create a release.

## Resulting tasks

- Add `examples/gitlab-ci/README.md`.
- Add `examples/buildkite/README.md`.
- Update `examples/github-actions/README.md` tarball pins from `v0.19.0` to `v0.23.0`.
- Update README and CI docs to link the provider examples.
- Update backlog and dogfood notes.

## Success criteria

- GitHub Actions example pins `v0.23.0`.
- GitLab CI and Buildkite examples include evidence-gate and artifact workflows.
- Docs explain Generic CI provenance for non-GitHub providers.
- Verification and link checks pass.
