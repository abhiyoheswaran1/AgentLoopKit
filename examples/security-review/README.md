# Security Review Example

This example shows how to use AgentLoopKit to make a security review easier to scope, verify, and hand off.

AgentLoopKit does not scan code, certify security, or replace a human security review. It gives reviewers a plain Markdown trail: what was reviewed, which files needed caution, which checks ran, and what still needs human attention.

## Command starter

```json
{
  "commands": {
    "test": "pnpm test",
    "lint": "pnpm lint",
    "typecheck": "pnpm typecheck",
    "build": "pnpm build",
    "format": "pnpm format"
  }
}
```

## Task contract starter

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

## Suggested loop

1. Run `agentloop doctor` and note risk-file categories.
2. Create or pin a `security-review` task contract.
3. Ask the coding agent to read `AGENTS.md`, `AGENTLOOP.md`, and `.agentloop/policies/security-policy.md`.
4. Keep scope narrow: name the auth, secrets, permissions, dependency, or deployment files under review.
5. Run `agentloop verify --task <task>`.
6. Run `agentloop handoff --task <task>`.
7. Ask a human reviewer to inspect risk notes and any checks that did not run.

## Review focus

- auth and session boundaries
- token creation, expiry, rotation, and logging
- permission checks
- secret handling
- dependency changes
- migration or deployment side effects

## Example artifacts

- `.agentloop/tasks/2026-06-10-review-password-reset-flow.md`
- `.agentloop/reports/2026-06-10-10-00-verification-report.md`
- `.agentloop/handoffs/2026-06-10-10-05-pr-summary.md`

These files are illustrative. Replace paths, commands, and acceptance criteria with the repository's own security review scope.
