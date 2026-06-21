# Task Contracts

Create task contracts with:

```bash
agentloop create-task
```

Task contracts turn fuzzy requests into scoped engineering work. A good contract names the desired outcome, constraints, non-goals, likely files, files not to touch, acceptance criteria, verification commands, post-verification gates, risk notes, and rollback notes.

When `.agentloop/loops/<type>.md` exists for the selected task type, `create-task` prints that repo-local loop guidance path and includes it as optional `loopGuidance` in JSON output. This is a hint for the next step, not a workflow runner.

When Git already has dirty non-evidence files before the new task is written, `create-task` keeps creating the contract but prints a warning. JSON output includes `DIRTY_WORKTREE_BEFORE_TASK_CREATION` with a dirty-file count and bounded path examples so agents can confirm the existing work belongs to the new task before implementation. The generated contract also records a bounded Risk Notes bullet with the same count and examples for later review. AgentLoopKit does not read dirty file contents, clean files, or block task creation for this warning.
When the generated contract still contains review-critical placeholder sections, `create-task` keeps writing the draft contract but prints a warning. JSON output includes `TASK_CONTRACT_PLACEHOLDER_SECTIONS` with the section names so agents can pause before implementation, run `agentloop task doctor`, or fill in the missing task-specific content. Fully specified contracts do not produce this warning.

When several task contracts exist, pin the one in progress:

```bash
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task done
agentloop task archive .agentloop/tasks/<task-file>.md
agentloop task doctor
```

Supported task statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Use `deferred` for parked work that should stay visible in `task list` without becoming the next unpinned task.

Use the `research` task type for local research planning and findings work. Record the research question, evidence source, limits, and follow-up recommendations. If you use simulated persona notes, keep them labeled as internal decision support, not external evidence.
