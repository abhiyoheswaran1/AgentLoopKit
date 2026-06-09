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
agentloop task set .agentloop/tasks/2026-06-09-fix-checkout-redirect.md
```

Agents should use the contract as the boundary for implementation and review.
