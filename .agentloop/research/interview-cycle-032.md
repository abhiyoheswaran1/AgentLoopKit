# Interview Cycle 32

Internal simulated feedback. Do not present this as real user research.

## Context

Generated harness docs now explain package-level verification in monorepos. The remaining gap is the `doctor` warning itself: users see workspace markers, but the check does not say what to do next.

## Personas interviewed

- Platform Engineer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer
- Developer Experience Designer

## Feedback summary

The strongest signal is immediacy. The `doctor` warning should tell users to put package-specific verification commands in the task contract, with safe examples, while making clear that AgentLoopKit does not run workspace commands automatically.

## Raw simulated feedback

### Platform Engineer

- Liked: warning-only monorepo detection is portable.
- Confused: the warning names markers but gives no next step.
- Would need before using it: a doctor message that tells teams how to handle package checks.
- Would recommend/star it if: `doctor` teaches the right habit without taking over the build.
- Would abandon it if: the CLI runs package-manager commands without consent.

### Power User / Agentic Engineer

- Liked: task contracts can already carry extra verification commands.
- Confused: agents may ignore package checks if `doctor` does not mention them.
- Would need before using it: examples in the warning output itself.
- Would recommend/star it if: long agent sessions avoid false "verified" claims.
- Would abandon it if: command suggestions become package-manager-specific rules.

### AI-Skeptical Senior Engineer

- Liked: deterministic warnings are reviewable.
- Confused: "monorepo detected" alone is not actionable.
- Would need before using it: direct wording that root checks may not cover the touched package.
- Would recommend/star it if: the tool reduces overclaiming.
- Would abandon it if: the warning sounds like full monorepo support.

### Developer Experience Designer

- Liked: one-line doctor checks are scannable.
- Confused: long warnings can get noisy.
- Would need before using it: concise message with concrete examples.
- Would recommend/star it if: the warning gives the next command-writing habit.
- Would abandon it if: `doctor` becomes a wall of text.

## Product council debate

- Abhi: Improve the warning. Do not build a runner.
- Maya: Keep the existing JSON shape. Only change the message.
- Elias: The wording should be transparent enough for README readers and CI logs.
- Nora: Put examples in the message, but keep it one line.
- Samir: Repeat that AgentLoopKit does not execute workspace commands automatically.
- Lina: Agents need this cue before they claim verification.
- Tom: Say root checks may not prove package coverage.
- Rachel: This helps team consistency without governance sprawl.

## Decision

Update the Monorepo doctor check message to include package-specific verification guidance and safe command examples.

## Non-decisions

- Do not add package graph detection.
- Do not run workspace commands.
- Do not add a new config field.
- Do not add a separate monorepo command.

## Resulting tasks

- Add a failing doctor test for the new message.
- Update `src/core/doctor.ts`.
- Update public docs if the displayed behavior changes.
- Run focused and full verification.

## Success criteria

- `runDoctor` returns a Monorepo warning that mentions package-specific verification commands.
- Doctor markdown includes the same guidance.
- JSON output remains structurally compatible.
- Tests prove no serious setup failure is introduced.
