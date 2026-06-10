# Dependency Upgrade Example

This example shows how to scope and hand off a dependency upgrade with AgentLoopKit.

AgentLoopKit does not inspect package registries, run advisory scans, or decide whether a package is safe. It records the upgrade reason, lockfile impact, verification results, risks, and rollback notes.

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
agentloop create-task --type dependency-upgrade --title "Upgrade validation library" \
  --problem-statement "The validation package needs a patch upgrade for a parser bugfix" \
  --desired-outcome "The intended package and lockfile update with passing verification" \
  --likely-file package.json \
  --likely-file pnpm-lock.yaml \
  --forbidden-file src/auth \
  --acceptance "Only the validation package and expected lockfile entries changed" \
  --acceptance "Existing validation tests still pass" \
  --verification "pnpm install --frozen-lockfile" \
  --verification "pnpm test" \
  --verification "pnpm typecheck" \
  --verification "pnpm build" \
  --rollback "Revert package.json and pnpm-lock.yaml"
```

## Review focus

- package name, old version, and new version
- direct dependency changes
- transitive dependency churn
- lockfile consistency
- install scripts or native builds
- runtime compatibility
- rollback path

## Example artifacts

- `.agentloop/tasks/2026-06-10-upgrade-validation-library.md`
- `.agentloop/reports/2026-06-10-11-00-verification-report.md`
- `.agentloop/handoffs/2026-06-10-11-05-pr-summary.md`

Replace package names, commands, and lockfile paths with the repository's own package manager and scripts.
