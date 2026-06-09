# Task Contracts

Task contracts turn fuzzy requests into scoped work.

Create one with:

```bash
agentloop create-task --type bugfix --title "Fix checkout redirect" \
  --constraint "Keep route names stable" \
  --likely-file src/auth \
  --forbidden-file migrations/ \
  --acceptance "Redirect returns users to checkout" \
  --verify-command "pnpm test"
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

Agents should use the contract as the boundary for implementation and review.
