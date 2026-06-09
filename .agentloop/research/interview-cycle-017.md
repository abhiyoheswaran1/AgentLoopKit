# Interview Cycle 17

## Context

During Cycle 16 dogfooding, `agentloop create-task` kept only the last repeated non-interactive list flag. The task contract for the handoff alias lost earlier `--constraint`, `--non-goal`, `--acceptance`, and `--verify-command` values. The root cause was the CLI parser helper, not task contract rendering.

This is simulated/internal product-panel output, not real user research.

## Personas interviewed

- Power User / Agentic Engineer
- Principal Engineer
- Developer Experience Designer
- AI-Skeptical Senior Developer
- Open Source Maintainer

## Feedback summary

The strongest signal is trust in task contracts. If a user passes repeated constraints or acceptance criteria, AgentLoopKit must preserve them exactly. Dropping earlier values makes the generated contract incomplete and can weaken review discipline.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: Non-interactive task creation works well for scripts and agent sessions.
- What confused them: Repeated flags looked accepted but vanished from the output.
- What they would need before using it: All repeated list values must survive.
- What would make them recommend/star it: Reliable task contracts in automation.
- What would make them abandon it: Silent loss of constraints.

### Principal Engineer

- What they liked: The bug has a narrow parser root cause.
- What confused them: The helper name `lines` hid that it should accumulate previous values.
- What they would need before using it: A CLI test at the command boundary.
- What would make them recommend/star it: Small fix, no task format churn.
- What would make them abandon it: A broader refactor bundled with a parser fix.

### Developer Experience Designer

- What they liked: Users can repeat flags instead of building long multiline strings.
- What confused them: The CLI help said repeat, but behavior contradicted it.
- What they would need before using it: The help text and behavior must match.
- What would make them recommend/star it: Predictable output from copy-pasteable commands.
- What would make them abandon it: Generated files that omit user intent.

### AI-Skeptical Senior Developer

- What they liked: The failing test reproduced the exact lost-value behavior.
- What confused them: No concern after seeing red-green evidence.
- What they would need before using it: Proof that task rendering already handles arrays.
- What would make them recommend/star it: Fixing boring CLI correctness issues quickly.
- What would make them abandon it: Claiming methodology while dropping acceptance criteria.

### Open Source Maintainer

- What they liked: The bug came from dogfooding.
- What confused them: Whether existing task files need migration.
- What they would need before using it: No migration unless users want to edit affected tasks manually.
- What would make them recommend/star it: Transparent changelog note.
- What would make them abandon it: Hidden behavior changes to task contract format.

## Product council debate

- Abhi: This is a trust bug. Fix it before another release attempt.
- Maya: Reuse Commander’s previous-value parser argument. Do not refactor the command.
- Elias: Mention it in `0.3.0`; no separate version until npm publishing works.
- Nora: The help text already promises repeatable flags. Behavior must match.
- Samir: No security issue, but losing constraints can create safety drift.
- Lina: Agent sessions will use repeated flags. Keep non-interactive mode reliable.
- Tom: The test should assert all repeated fields, not only constraints.
- Rachel: Teams will script task creation. Silent data loss blocks adoption.

## Decision

Fix the `create-task` list option parser so repeated flags append values. Cover `--constraint`, `--non-goal`, `--acceptance`, and `--verify-command` in one CLI regression test.

## Non-decisions

- Do not redesign interactive prompts.
- Do not change task contract Markdown format.
- Do not add a task database.
- Do not migrate existing task files.

## Resulting tasks

- Add a failing CLI test for repeated create-task flags.
- Update the parser helper to append current lines to previous values.
- Update changelog, backlog, dogfood log, and final handoff.
- Run full verification and `projscan`.

## Success criteria

- The new CLI test fails before the fix and passes after it.
- Repeated constraints, non-goals, acceptance criteria, and verification commands all appear in the generated task contract.
- Full Vitest, typecheck, build, and projscan checks pass.
