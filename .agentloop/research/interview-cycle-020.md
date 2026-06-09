# Interview Cycle 20

Internal simulated feedback. Do not present this as real user research.

## Context

Cycle 19 added `create-task --likely-file` and `--forbidden-file`. During dogfooding for npm publish recovery, a full non-interactive task command failed because `create-task` rejected natural task-contract flags such as `--desired-outcome`, `--verification`, and `--rollback`.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal is that non-interactive task creation needs to accept the same field names the task contract teaches. Users should not need to remember that desired outcome is named `--outcome` while verification commands are named `--verify-command`.

## Raw simulated feedback

### Indie Hacker Using Codex

- Liked: one command can prepare a scoped task before an agent session.
- Confused: `--desired-outcome` sounds obvious but failed.
- Needs before using it: copy-paste examples that work on the first try.
- Would recommend/star it if: task creation feels faster than writing the Markdown manually.
- Would abandon it if: the CLI makes them learn internal field names.

### Claude Code Power User

- Liked: task contracts map well to autonomous coding sessions.
- Confused: aliases differ from the terms in `AGENTLOOP.md`.
- Needs before using it: non-interactive commands for scripted task creation.
- Would recommend/star it if: task files can be generated from shell scripts and agent prompts.
- Would abandon it if: creating a contract requires interactive prompts every time.

### Open Source Maintainer

- Liked: explicit rollback and verification fields improve PR review.
- Confused: rollback was only available through the interactive path.
- Needs before using it: a contributor can create a full contract without prompts.
- Would recommend/star it if: the CLI reduces review cleanup.
- Would abandon it if: generated contracts omit important fields because flags are missing.

### AI-Skeptical Senior Engineer

- Liked: deterministic task contracts are inspectable.
- Confused: the CLI promised a methodology but did not accept the methodology's field names.
- Needs before using it: fewer naming surprises.
- Would recommend/star it if: the command surface is boring and predictable.
- Would abandon it if: the tool feels like Markdown theater.

### Platform Engineer

- Liked: non-interactive task creation can become a team standard.
- Confused: script authors need aliases that match policy language.
- Needs before using it: stable CLI flags for all core task fields.
- Would recommend/star it if: repos can automate task-contract creation.
- Would abandon it if: the command requires fragile workarounds.

## Product council debate

- Abhi: Keep the product lightweight, but this is part of the wedge. The contract has to be easy to create.
- Maya: Add aliases at the CLI boundary. Do not redesign the task renderer.
- Elias: This improves trust because README examples can show a full contract command.
- Nora: Users will type `--desired-outcome` before `--outcome`. Let them.
- Samir: Avoid adding auth or token details to docs while recording the publish blocker.
- Lina: Long autonomous sessions need repeatable task setup from shell commands.
- Tom: The methodology earns trust when the command accepts the methodology's own words.
- Rachel: Teams can standardize on aliases that match review policies.

## Decision

Add non-interactive `create-task` aliases for full task-contract fields:

- `--problem-statement`
- `--desired-outcome`
- `--assumption`
- `--verification`
- `--rollback`

Keep existing flags working.

## Non-decisions

- Do not add a task database.
- Do not add cloud task storage.
- Do not change the generated Markdown layout.
- Do not add an LLM-based task generator.

## Resulting tasks

- Add a failing Vitest CLI test for the alias command shape.
- Implement the aliases in `src/cli/commands/create-task.ts`.
- Update README and task-contract docs with a full non-interactive example.
- Record the npm `EOTP` publish blocker without exposing secrets.

## Success criteria

- The focused create-task test fails before the implementation and passes after it.
- A dogfood task can be created with the alias flags.
- Public docs show a full task-contract command that matches the accepted flags.
- npm publish status remains honest.
