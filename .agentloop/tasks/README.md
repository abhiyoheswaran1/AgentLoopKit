# Task Contracts

Create task contracts with:

```bash
agentloop create-task
```

Task contracts turn fuzzy requests into scoped engineering work. A good contract names the desired outcome, constraints, non-goals, likely files, files not to touch, acceptance criteria, verification commands, and rollback notes.

When several task contracts exist, pin the one in progress:

```bash
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task archive .agentloop/tasks/<task-file>.md
agentloop task doctor
```

Supported task statuses are `proposed`, `in-progress`, `blocked`, `deferred`, `review`, and `done`. Use `deferred` for parked work that should stay visible in `task list` without becoming the next unpinned task.
