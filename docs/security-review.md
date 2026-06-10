# Security Review Workflow

AgentLoopKit helps you make security-review work reviewable. It does not scan code, find vulnerabilities, certify compliance, or replace a human reviewer.

Use a security-review task when a change touches auth, sessions, permissions, secrets, dependencies, deployment config, migrations, billing, or other sensitive areas.

## Create a scoped review task

```bash
agentloop create-task --type security-review --title "Review password reset flow" \
  --problem-statement "Password reset code changed and needs focused review before release" \
  --desired-outcome "Reviewers can see scope, risk areas, verification evidence, and follow-up risks" \
  --likely-file src/auth \
  --likely-file tests/auth \
  --forbidden-file .env \
  --acceptance "Password reset token creation and expiry are covered by tests" \
  --acceptance "No secrets or reset tokens are printed in logs" \
  --verification "pnpm test" \
  --verification "pnpm lint" \
  --verification "pnpm typecheck" \
  --rollback "Revert the password reset flow changes and restore the previous release"
```

Keep the contract narrow. A useful review task names the risky files, the files not to touch, the checks to run, and the reviewer concerns that need human judgment.

## Use doctor before review

```bash
agentloop doctor
```

`doctor` reports risk-file categories such as migrations, auth, security, billing, deployment, lockfiles, and env files. It prints env file paths only. It does not read `.env` contents or scan secrets.

Use those categories to decide whether the task contract needs stricter constraints or extra reviewers.

## Inspect local policies

```bash
agentloop policy show security
agentloop policy show secrets
agentloop policy status
```

Generated policies are guidance for agents and reviewers. They are not an enforcement engine. If a repo customizes policy files, treat those changes like code during review.

## Verify and hand off

```bash
agentloop verify --task .agentloop/tasks/2026-06-10-review-password-reset-flow.md
agentloop handoff --task .agentloop/tasks/2026-06-10-review-password-reset-flow.md
agentloop check-gates
```

The verification report records which configured checks passed or failed. The handoff should say what was not run, what needs human inspection, and how to roll back.

## What to include in the handoff

- auth, permission, dependency, deployment, migration, or secret-handling files touched
- configured checks run and their results
- checks not run
- unresolved risks
- reviewer checklist
- rollback notes

Do not treat a passing report as proof that code is secure. Treat it as evidence that the agreed local checks ran and that the review scope stayed visible.

## Example

See [`../examples/security-review/README.md`](../examples/security-review/README.md) for a copyable security-review task, verification report, and PR summary.
