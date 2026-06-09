# Interview Cycle 36

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now has task creation, active task pinning, task listing, task inspection, verification reports, deterministic handoffs, and release-status docs. Dogfooding exposed one remaining workflow gap: agents can read and pin task contracts, but they still need manual Markdown edits to move a task from proposed to in progress, review, blocked, or done.

## Personas interviewed

- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer
- Indie Hacker Using Codex

## Feedback summary

The strongest signal is task-loop continuity. Status transitions should live in the existing `agentloop task` namespace, edit only the task contract Markdown, and avoid any project-management scope.

## Raw simulated feedback

### Claude Code Power User

- What they liked: Active task state makes long sessions less ambiguous.
- What confused them: Status still requires opening the task file.
- What they would need before using it: A command that updates status without changing the task body.
- What would make them recommend/star it: A small lifecycle command agents can call before handoff.
- What would make them abandon it: A task database that fights their existing repo workflow.

### Open Source Maintainer

- What they liked: Task contracts and handoffs make reviews easier.
- What confused them: Contributors may forget to mark work ready for review.
- What they would need before using it: Clear status names and JSON output for automation.
- What would make them recommend/star it: Reviewers can see task state from `agentloop task list`.
- What would make them abandon it: Hidden state that diverges from Markdown.

### AI-Skeptical Senior Engineer

- What they liked: Deterministic Markdown beats LLM-generated status.
- What confused them: Whether the tool will become another workflow manager.
- What they would need before using it: A narrow command that edits one explicit line.
- What would make them recommend/star it: The command fails clearly on invalid input.
- What would make them abandon it: Automatic transitions that claim review readiness without verification.

### Platform Engineer

- What they liked: Local task contracts can standardize agent sessions across repos.
- What confused them: Teams may want consistent status values.
- What they would need before using it: A small allowed status set.
- What would make them recommend/star it: JSON output works in CI or wrapper scripts.
- What would make them abandon it: Repo-specific behavior that needs a server or database.

### Indie Hacker Using Codex

- What they liked: `task set` gives the agent a clear focus.
- What confused them: They still have to edit Markdown for simple lifecycle changes.
- What they would need before using it: Copy-pasteable commands in the README.
- What would make them recommend/star it: The command is obvious and quick.
- What would make them abandon it: Extra setup before the first useful result.

## Product council debate

- Abhi: Build the tiny command. It strengthens the loop without changing the wedge.
- Maya: Keep statuses as a fixed union and test the file rewrite.
- Elias: Add README examples so GitHub readers see the workflow.
- Nora: The command name should read like a sentence: `agentloop task status <path> <status>`.
- Samir: Reject paths outside `.agentloop/tasks` and never rewrite unrelated files.
- Lina: JSON output matters for agents and wrappers.
- Tom: Do not pretend status equals verification. It is just the task contract state.
- Rachel: Teams can standardize around this without a cloud product.

## Decision

Add `agentloop task status <path> <status>` to update the `- Status:` line in an existing task contract. Valid statuses are `proposed`, `in-progress`, `blocked`, `review`, and `done`. The command preserves the rest of the Markdown, enforces the existing task path safety rules, and supports `--json`.

## Non-decisions

- Do not add a task database.
- Do not add automatic transitions after `verify` or `handoff`.
- Do not add custom statuses in this cycle.
- Do not add a dashboard or kanban view.

## Resulting tasks

- Add failing tests for core status updates and CLI output.
- Implement status validation and Markdown rewriting in `src/core/task-state.ts`.
- Add the `task status` subcommand.
- Update README and getting-started docs with the new lifecycle command.
- Dogfood the command on this task.

## Success criteria

- `agentloop task status <path> <status>` changes only the status line and returns updated metadata.
- Invalid statuses fail with a clear error.
- Existing task list, show, set, current, and clear behavior remains stable.
- Full verification remains green after the docs and README updates.
