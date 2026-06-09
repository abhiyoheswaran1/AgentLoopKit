# Task Contracts

Task contracts turn fuzzy requests into scoped work.

Create one with:

```bash
agentloop create-task --type bugfix --title "Fix checkout redirect" \
  --problem-statement "Checkout loses the return path after login" \
  --desired-outcome "Users return to checkout after authentication" \
  --constraint "Keep route names stable" \
  --assumption "Auth callback already receives a return URL" \
  --likely-file src/auth \
  --forbidden-file migrations/ \
  --acceptance "Redirect returns users to checkout" \
  --verification "pnpm test" \
  --rollback "Revert the auth callback change"
```

A contract includes:

- problem statement
- desired outcome
- constraints
- non-goals
- assumptions
- likely files
- files not to touch
- acceptance criteria
- verification commands
- rollback notes

Pin the active contract for long sessions:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task set .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
agentloop task status .agentloop/tasks/2026-06-09-fix-checkout-redirect.md in-progress
```

Use `agentloop task list --json` when an agent needs a machine-readable list of contracts before choosing the active task. The list command is read-only and does not create `.agentloop/state.json`.
Use `agentloop task show --json` when an agent needs the selected contract content in a stable schema.
Use `agentloop task status --json` when an agent needs to update the contract state without hand-editing Markdown. Supported statuses are `proposed`, `in-progress`, `blocked`, `review`, and `done`.

Agents should use the contract as the boundary for implementation and review.
