# Interview Cycle 28

Internal simulated feedback. Do not present this as real user research.

## Context

`v0.6.0` is public on GitHub with refreshed README visuals. npm latest remains `0.1.1` until trusted publishing or local browser/OTP auth succeeds. The next repo-local improvement should not depend on external npm settings.

## Personas interviewed

- Small Team CTO
- Platform Engineer
- Open Source Maintainer
- Power User / Agentic Engineer
- Skeptical Senior Developer

## Feedback summary

The strongest signal is monorepo clarity. Teams often run agents at a workspace root, and `doctor` should warn when common monorepo markers are present so users know to review root-level verification commands.

## Raw simulated feedback

### Small Team CTO

- Liked: AgentLoopKit stays lightweight and local.
- Confused: in a monorepo, it is not obvious whether `verify` checks every package.
- Would need before using it: a visible doctor warning when the repo is a workspace root.
- Would recommend/star it if: the tool helps teams avoid false confidence.
- Would abandon it if: AgentLoopKit silently treats a monorepo like a single package.

### Platform Engineer

- Liked: policy and gate templates fit internal standards.
- Confused: package workspaces, Turbo, Nx, Lerna, and Rush have different command shapes.
- Would need before using it: detection first, orchestration later.
- Would recommend/star it if: detection is transparent and does not run package-manager introspection.
- Would abandon it if: the tool adds heavy workspace management.

### Open Source Maintainer

- Liked: `doctor --json` can surface warnings in issue templates or CI.
- Confused: existing docs do not mention monorepos.
- Would need before using it: README and getting-started notes.
- Would recommend/star it if: warnings are honest and do not fail healthy setups.
- Would abandon it if: warnings block simple repos.

### Power User / Agentic Engineer

- Liked: agents get a concrete risk cue before editing.
- Confused: without a warning, agents may run only root tests and overclaim coverage.
- Would need before using it: a `Monorepo` check in doctor markdown and JSON.
- Would recommend/star it if: the warning names the detected markers.
- Would abandon it if: per-package behavior is faked.

### Skeptical Senior Developer

- Liked: a warning is more honest than pretending to support every workspace tool.
- Confused: "monorepo support" can mean too much.
- Would need before using it: file-marker detection only, documented clearly.
- Would recommend/star it if: no schema or public API churn is required.
- Would abandon it if: detection changes existing project type semantics.

## Product council debate

- Abhi: This improves team usefulness without becoming a workspace orchestrator.
- Maya: Keep config schema stable. Add a separate detector and doctor check.
- Elias: This is a good trust feature for maintainers reviewing generated work.
- Nora: The warning needs to tell users what was detected and what to review next.
- Samir: Do not run package-manager commands or inspect hidden files.
- Lina: Agents should see workspace markers before verification.
- Tom: Name the limitation. Detection is not per-package verification.
- Rachel: This helps teams adopt the tool across repo types.

## Decision

Add monorepo marker detection to `doctor` as a warning. Detect `package.json` workspaces, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, and `rush.json`. Keep project type unchanged.

## Non-decisions

- Do not add per-package verification routing yet.
- Do not add a new `monorepo` project type.
- Do not parse workspace dependency graphs.
- Do not run package-manager commands during doctor.

## Resulting tasks

- Add `detectMonorepo`.
- Add a `Monorepo` doctor check in markdown and JSON output.
- Add Vitest coverage for detection and doctor behavior.
- Update README and getting-started docs.
- Dogfood with AgentLoopKit verification and handoff.

## Success criteria

- Focused red tests fail before implementation and pass after implementation.
- `agentloop doctor` reports workspace markers as a warning without serious failures.
- Existing project type detection remains unchanged.
- Full lint, typecheck, tests, build, and projscan pass.
