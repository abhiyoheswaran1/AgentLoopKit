# Doctor Advisory Mode Design

## Purpose

Real-repo trials showed that `agentloop doctor` is useful before initialization, but its non-zero exit can stop copy-paste onboarding scripts before users see the rest of the loop. The product needs a clear way to use doctor as advisory preflight without weakening its role as a setup gate.

## Design

Add an explicit `--advisory` flag to `agentloop doctor`.

Default behavior stays unchanged:

- warnings exit `0`
- serious failures exit non-zero
- `--strict` treats warnings as failures

Advisory behavior:

- runs the same checks
- keeps the same `overallStatus`
- keeps serious failures visible in human and JSON output
- adds `advisory: true` to JSON/core results
- prints `Advisory mode: enabled` in human output
- exits `0` even when `overallStatus` is `fail`

## Scope

Files:

- `src/core/doctor.ts`
- `src/cli/commands/doctor.ts`
- `tests/doctor.test.ts`
- `docs/cli-reference.md`
- `docs/real-repo-trials.md`
- `README.md`
- `.agentloop/research/interview-cycle-124.md`
- `.agentloop/backlog.md`
- `DECISIONS.md`
- `CHANGELOG.md`

## Non-Goals

- Do not auto-run `init`.
- Do not change default doctor exit behavior.
- Do not hide or downgrade failures.
- Do not add shell-specific `|| true` examples.
- Do not add remote calls, telemetry, tokens, GitHub API usage, release, or publish behavior.

## Testing

Use TDD:

1. Add a failing test showing `doctor --advisory --json` exits `0` in an uninitialized repo while JSON still reports failure.
2. Add a human-output test for `Advisory mode: enabled`.
3. Confirm default `doctor --json` still exits non-zero for the same uninitialized repo.
4. Implement only enough code to pass.
5. Run focused doctor tests and the task verification gates.

## Compatibility

Existing scripts that rely on `agentloop doctor` failing on serious setup issues keep working. CI users can keep using `doctor` or `doctor --strict`. Onboarding docs can use `doctor --advisory --redact-paths` without teaching users to ignore failures globally.
