# Interview Cycle 51

Internal simulated feedback. Do not present this as real user research.

## Context

`agentloop check-gates` shipped in GitHub release `v0.13.0`. It gives agents a deterministic local evidence check, but CI users cannot make warning-level gates fail without writing their own JSON parser.

## Personas interviewed

- Power User / Agentic Engineer
- Startup CTO
- Security Reviewer
- Skeptical Senior Developer
- Developer Experience Designer

## Feedback summary

The strongest signal is opt-in strictness. The default command should stay friendly for local use, but CI and team workflows need a one-flag way to treat warnings as failures.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: `check-gates --json` lets agents inspect task, report, handoff, harness, policy, and git evidence.
- What confused them: Warning-only output can still exit zero, so automation needs custom parsing.
- What they would need before using it: `--strict` that fails on any warning.
- What would make them recommend/star it: CI examples can use one command.
- What would make them abandon it: Default local behavior becoming too harsh.

### Startup CTO

- What they liked: Teams can start with lightweight review gates.
- What confused them: The difference between human warning and CI failure.
- What they would need before using it: A clear flag for team policy without extra config.
- What would make them recommend/star it: PR checks can block missing handoffs.
- What would make them abandon it: A new policy DSL.

### Security Reviewer

- What they liked: The command reads files and does not execute verification commands.
- What confused them: Whether strict mode would run extra checks.
- What they would need before using it: Strict mode must only change status/exit behavior.
- What would make them recommend/star it: No network calls, no secret reads, no new dependencies.
- What would make them abandon it: Hidden command execution.

### Skeptical Senior Developer

- What they liked: Deterministic gates are more useful than vague methodology.
- What confused them: Why warnings are not failures in CI.
- What they would need before using it: The docs should say strict mode treats warnings as failures.
- What would make them recommend/star it: It catches missing handoffs before review.
- What would make them abandon it: Calling warning-only output success in team checks.

### Developer Experience Designer

- What they liked: `check-gates` gives a clear next action.
- What confused them: Strict mode needs to show why the result failed.
- What they would need before using it: Markdown and JSON should show strict mode.
- What would make them recommend/star it: The flag is discoverable in README and CLI help.
- What would make them abandon it: New terminology around compliance.

## Product council debate

- Abhi: Build it if it stays one flag and does not become governance software.
- Maya: Keep the implementation as a small option passed into `checkGates`.
- Elias: Document it as a CI convenience, not a hard process mandate.
- Nora: The output should name strict mode so users understand the non-zero exit.
- Samir: No extra command execution. No env reads. No new dependency.
- Lina: This removes custom JSON parsing from agent scripts.
- Tom: Good. Deterministic and testable.
- Rachel: This helps small teams standardize without a platform.

## Decision

Add `agentloop check-gates --strict`. Strict mode treats warning gates as failures for `overallStatus` and CLI exit code while preserving each gate's original status. Default behavior stays unchanged.

## Non-decisions

- Do not add a policy DSL.
- Do not change default check-gates behavior.
- Do not run verification commands.
- Do not add CI templates in this cycle.

## Resulting tasks

- Add failing Vitest coverage for warning-only gates under default and strict modes.
- Add a `strict` option to `checkGates` and CLI command parsing.
- Include strict mode in JSON and Markdown output.
- Update README, gate-check docs, generated harness commands, backlog, dogfood log, and final handoff.

## Success criteria

- `agentloop check-gates --strict --json` exits non-zero when any gate warns.
- `agentloop check-gates --json` still exits zero when only warnings exist.
- JSON includes `strict: true` when strict mode is enabled.
- Markdown output explains that strict mode treats warnings as failures.
