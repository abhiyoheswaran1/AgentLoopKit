# Interview Cycle 79

## Context

AgentLoopKit has a status engine that reads the active task, latest verification report, configured commands, and git state. The full `agentloop status` output is useful, but agents and shell scripts often need only one answer: the next local command to run.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal was that `agentloop status` is too much output when an agent is deciding the next step in a loop. Users wanted a tiny, deterministic command that can be called before stopping or after a context reset.

## Raw simulated feedback

### Indie Hacker Using Codex

- Liked: `status` already points to a next action.
- Confused by: needing to parse a full status block for one command.
- Needs before use: a command that prints the next action without changing files.
- Would recommend/star it if: it helps long Codex sessions recover their place.
- Would abandon it if: it starts acting like a planner or runs checks without consent.

### Claude Code Power User

- Liked: task state, verification reports, and handoffs work across agents.
- Confused by: whether `status` is for humans or automation.
- Needs before use: JSON output with the command, reason, active task, latest report, and dirty state.
- Would recommend/star it if: it can be wired into custom commands or skills.
- Would abandon it if: it duplicates status logic and starts disagreeing with `status`.

### Open Source Maintainer

- Liked: deterministic evidence artifacts.
- Confused by: which command to tell contributors to run after a partial task.
- Needs before use: a short next-step command that can be copied into issue and PR guidance.
- Would recommend/star it if: it lowers onboarding friction.
- Would abandon it if: the output sounds like an AI coach instead of local repo evidence.

### AI-Skeptical Senior Engineer

- Liked: no LLM dependency.
- Confused by: whether "next action" is a recommendation or a hidden automation decision.
- Needs before use: clear wording that the command only reads local artifacts.
- Would recommend/star it if: it stays boring and inspectable.
- Would abandon it if: it hides failure state or claims completion.

### Platform Engineer

- Liked: JSON-friendly commands for CI and internal wrappers.
- Confused by: how to discover the active task without parsing Markdown.
- Needs before use: machine-readable output that includes task and verification context.
- Would recommend/star it if: it improves agent compatibility without introducing another service.
- Would abandon it if: it requires cloud setup or stores run history in a database.

## Product council debate

- Abhi: "This is aligned with the wedge. It makes AgentLoopKit feel like a loop, not a folder of Markdown."
- Maya: "Reuse the existing status engine. A second decision function will drift."
- Elias: "Good for docs and examples. It is easy to explain in one sentence."
- Nora: "This should be the smallest output in the CLI. One next command, one reason, then context."
- Samir: "Read-only only. Do not run verification commands. Do not mutate active task state."
- Lina: "Agents need this after context compaction. JSON matters."
- Tom: "Keep the wording evidence-based. Do not pretend this is intelligence."
- Rachel: "Teams can add this to their internal agent instructions without adding process weight."

## Decision

Add `agentloop next` with human and JSON output. It will call the existing status engine, print the status engine's next action, and include minimal context. It will not write files, run checks, call external services, or read secret contents.

## Non-decisions

- Do not add a scheduler.
- Do not add an AI planner.
- Do not add a task database.
- Do not add cloud run history.
- Do not make `next` change task status.

## Resulting tasks

- Add Vitest coverage for `agentloop next`.
- Register the command and shell completions.
- Document the command in README, generated harness docs, and public docs.
- Dogfood the command before final verification.

## Success criteria

- `agentloop next` prints the same recommendation as `agentloop status`.
- `agentloop next --json` includes command, reason, task, latest report, and working-tree context.
- Calling `agentloop next` does not create `.agentloop/state.json` or execute configured verification scripts.
- Tests, typecheck, build, link checks, and projscan pass before release work.
