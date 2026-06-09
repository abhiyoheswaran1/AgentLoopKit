# Interview Cycle 42

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now supports task creation, task listing, task reading, active task pinning, task status updates, status, verification, handoff, shell completions, and GitHub release packaging. Completed tasks still remain in `.agentloop/tasks/` and appear in the normal task list.

## Personas interviewed

- Developer Experience Designer
- Power User / Agentic Engineer
- Open Source Maintainer
- AI-Skeptical Senior Developer
- Security Reviewer

## Feedback summary

The strongest signal is task hygiene. Repeat users need a way to keep the active task list focused without deleting history or adding a task database. The command should move files, preserve content, and never overwrite an archive target.

## Raw simulated feedback

### Developer Experience Designer

- What they liked: Task status and task list make the loop easy to follow.
- What confused them: Done tasks stay in the same list as active work.
- What they would need before using it: `agentloop task archive <path>` with a clear destination.
- What would make them recommend/star it: The command clears the active pointer when it archives the active task.
- What would make them abandon it: A command that deletes task files.

### Power User / Agentic Engineer

- What they liked: Task contracts now work across long sessions.
- What confused them: Task lists get noisy after several iterations.
- What they would need before using it: Archived tasks stay inspectable as Markdown.
- What would make them recommend/star it: List output stays focused on current work.
- What would make them abandon it: Bulk behavior that moves files they did not name.

### Open Source Maintainer

- What they liked: Moving files into an archive directory is auditable in git.
- What confused them: Whether archive files can be overwritten.
- What they would need before using it: Collision checks and tests.
- What would make them recommend/star it: No database and no hidden state.
- What would make them abandon it: A task history feature that becomes a project-management app.

### AI-Skeptical Senior Developer

- What they liked: This is file hygiene, not AI ceremony.
- What confused them: Whether archived tasks still count as active work.
- What they would need before using it: `task list` excludes archived tasks by default.
- What would make them recommend/star it: The command does one concrete thing.
- What would make them abandon it: Any claim that archive status equals verification.

### Security Reviewer

- What they liked: A named file move is low risk.
- What confused them: Destination collision behavior.
- What they would need before using it: Refuse overwrite, preserve content, clear stale active pointer.
- What would make them recommend/star it: No deletion and no shell execution.
- What would make them abandon it: Recursive moves or glob-based archive commands in the first version.

## Product council debate

- Abhi: Build it; the task workflow needs cleanup before adding bigger gate checks.
- Maya: Keep it as a file move with a small helper and tests.
- Elias: Document the archive path and collision behavior.
- Nora: The command shape should be `agentloop task archive <path>`.
- Samir: Refuse overwrite and never delete content.
- Lina: Clear the active task pointer when the active task gets archived.
- Tom: Do not turn this into a task manager.
- Rachel: This helps teams preserve audit history without a new platform.

## Decision

Add `agentloop task archive <path>` as a local file-move command. It moves one task contract into `.agentloop/tasks/archive/`, refuses destination collisions, clears the active pointer when the archived task was active, and leaves archived tasks out of normal `task list` output.

## Non-decisions

- Do not add bulk archive.
- Do not add task deletion.
- Do not add a task database.
- Do not add archive search or restore yet.
- Do not claim archived means verified.

## Resulting tasks

- Add failing tests for archive behavior and CLI output.
- Implement an `archiveTask` core helper.
- Add `task archive` to the CLI.
- Update shell completions.
- Update README and getting-started docs.
- Dogfood, verify, and record findings.

## Success criteria

- `agentloop task archive <path>` moves the Markdown file into `.agentloop/tasks/archive/`.
- Archived tasks do not appear in `agentloop task list`.
- Archiving the active task clears `.agentloop/state.json`.
- Destination collisions fail without overwriting files.
- Docs explain that archiving preserves Markdown history and does not delete content.
