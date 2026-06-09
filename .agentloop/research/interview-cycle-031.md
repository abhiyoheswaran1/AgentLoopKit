# Interview Cycle 31

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop doctor` now detects monorepo markers as a warning. The next gap is guidance: generated harness files should tell agents how to handle root checks versus package-level checks without adding a workspace runner.

## Personas interviewed

- Small Team CTO
- Platform Engineer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer
- Developer Experience Designer

## Feedback summary

The strongest signal is scope clarity. Users need enough guidance to avoid false verification claims in monorepos, but AgentLoopKit should not orchestrate package checks yet.

## Raw simulated feedback

### Small Team CTO

- Liked: doctor warns when a repo is a workspace.
- Confused: root `pnpm test` may not cover every package.
- Would need before using it: a generated note about package-specific checks.
- Would recommend/star it if: teams can use the same task-contract habit across packages.
- Would abandon it if: agents claim full verification from one root command.

### Platform Engineer

- Liked: warning-only detection avoids brittle package graph logic.
- Confused: generated harness docs do not say where to put package commands.
- Would need before using it: root-versus-package command guidance in `.agentloop/harness/commands.md`.
- Would recommend/star it if: policies remain portable across repos.
- Would abandon it if: AgentLoopKit starts running workspace commands implicitly.

### Power User / Agentic Engineer

- Liked: task contracts already have verification fields.
- Confused: agents need an explicit instruction to add package checks to the task contract.
- Would need before using it: examples that mention `pnpm --filter`, `npm --workspace`, or package-local commands without forcing one package manager.
- Would recommend/star it if: the agent handoff says what was and was not verified.
- Would abandon it if: the tool hides missing package checks.

### AI-Skeptical Senior Engineer

- Liked: deterministic docs beat vague "AI workflow" language.
- Confused: "monorepo awareness" could sound like full monorepo support.
- Would need before using it: disclaimers that AgentLoopKit does not infer coverage.
- Would recommend/star it if: the guidance prevents overclaiming.
- Would abandon it if: the tool becomes a project manager or build orchestrator.

### Developer Experience Designer

- Liked: generated docs are the right place for first-run guidance.
- Confused: the current `.agentloop/README.md` does not mention package-level verification.
- Would need before using it: short, copy-pasteable examples and a next step.
- Would recommend/star it if: monorepo users know what to write in the task contract.
- Would abandon it if: the generated files become noisy.

## Product council debate

- Abhi: Add guidance, not infrastructure. Keep the wedge.
- Maya: Template-only change. No config schema or runner.
- Elias: Public docs should say what the tool does and does not do.
- Nora: Put the practical instructions where agents read them first.
- Samir: Avoid automatic command execution or secret inspection.
- Lina: Agents need explicit "do not overclaim" language.
- Tom: Use concrete package-check examples.
- Rachel: This helps teams adopt without enterprise process.

## Decision

Add concise monorepo verification guidance to generated harness docs, task guidance, and getting-started docs. Keep detection warning-only and avoid a workspace command runner.

## Non-decisions

- Do not add package graph detection.
- Do not add package manager abstraction.
- Do not run workspace commands automatically.
- Do not change `agentloop.config.json`.

## Resulting tasks

- Add tests that generated files contain monorepo verification guidance.
- Update `src/templates/harness/commands.md`.
- Update `src/templates/root/agentloop-directory-readme.md`.
- Update `src/templates/tasks/README.md`.
- Update `docs/getting-started.md`.
- Run focused and full verification.

## Success criteria

- Generated `.agentloop/harness/commands.md` tells agents to record package-specific checks.
- Generated `.agentloop/README.md` points monorepo users to root and package checks.
- Task-contract guidance explains package-specific verification commands.
- Docs avoid claiming AgentLoopKit runs monorepo orchestration.
