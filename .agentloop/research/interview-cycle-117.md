# Interview Cycle 117

Internal simulated feedback and product-panel output. This is not real user research.

## Context

AgentLoopKit task contracts separate `Verification Commands` from `Post-Verification Gates`. Dogfooding showed that agents still had to remember a manual sequence after `agentloop verify` wrote fresh evidence. The product needed a safer way to run those gates without changing default command execution.

## Personas interviewed

- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal was sequencing. Users want one reviewed command to run report-dependent gates after verification evidence exists, but they do not want task Markdown to execute more commands during a normal verification run.

## Raw simulated feedback

### Claude Code Power User

- What they liked: Task contracts already name the post-verification gates.
- What confused them: The agent has to remember which gates run before or after the report exists.
- What they would need before using it: An explicit flag that preserves the safe default.
- What would make them recommend/star it: A shorter dogfood loop with clear report evidence.
- What would make them abandon it: Hidden execution of extra task commands.

### Open Source Maintainer

- What they liked: `Post-Verification Gates` make review evidence easier to audit.
- What confused them: Whether `verify --task-commands` also runs those gates.
- What they would need before using it: Documentation that says when gates run and what fails the command.
- What would make them recommend/star it: A final report that includes gate output.
- What would make them abandon it: A CLI that runs report-dependent commands without explicit approval.

### AI-Skeptical Senior Engineer

- What they liked: The behavior can stay deterministic.
- What confused them: Any automatic command movement between task sections.
- What they would need before using it: A clear opt-in flag and failing-gate exit code.
- What would make them recommend/star it: A boring command that writes proof before running post checks.
- What would make them abandon it: Methodology copy without executable evidence.

### Platform Engineer

- What they liked: Teams can standardize post-verification gates in task contracts.
- What confused them: How this works in CI when a task is active.
- What they would need before using it: JSON output with gate results.
- What would make them recommend/star it: A gate sequence that scripts can inspect.
- What would make them abandon it: Token, network, or GitHub posting behavior inside the CLI.

## Product council debate

- Abhi: Keep the product lightweight. This strengthens the acceptance-layer loop without adding a platform.
- Maya: Add one explicit flag. Do not refactor command execution into a workflow engine.
- Elias: Public docs should explain the safety boundary in one paragraph.
- Nora: Terminal and JSON output must tell users whether gates ran.
- Samir: Default behavior must remain unchanged. Extra task commands need explicit consent.
- Lina: This removes a real dogfood annoyance for long autonomous sessions.
- Tom: This is practical because a failing gate fails the command.
- Rachel: Teams can adopt this in CI later because JSON results are inspectable.

## Decision

Add `agentloop verify --post-verification-gates`. The command writes the normal verification report first, then runs commands from the task contract's `Post-Verification Gates` section, then updates the report with gate evidence. Normal `verify` and `verify --task-commands` do not run those gates.

## Non-decisions

- Do not run post-verification gates by default.
- Do not move commands between task sections automatically.
- Do not add GitHub posting, token access, network calls, release behavior, or a workflow engine.
- Do not cut or publish a release.

## Resulting tasks

- Add TDD coverage for explicit post-verification gate execution.
- Add CLI JSON coverage for the new flag.
- Update verification docs, CLI reference, generated harness guidance, changelog, decision log, backlog, and dogfood log.
- Run focused, static, full, dogfood, AgentFlight, and ProjScan verification.

## Success criteria

- `verify --task-commands` still skips `Post-Verification Gates`.
- `verify --post-verification-gates` runs gates after the report exists.
- A failing post-verification gate makes `verify` fail.
- Human and JSON output expose gate status.
- Docs explain the opt-in safety boundary.
