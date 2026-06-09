# Gate Checks

`agentloop check-gates` checks whether the current work session has review evidence.

It inspects local files only:

- task contract
- generated verification report
- generated handoff summary
- repo harness files
- core safety policies
- git working tree context

It does not run tests, call an LLM, score code quality, or block human review.

```bash
agentloop check-gates
agentloop check-gates --json
agentloop check-gates --strict
```

Statuses:

- `pass`: evidence exists
- `warn`: evidence is useful but not mandatory
- `fail`: core evidence is missing or failed

The command exits with code `1` when any gate fails. Warnings keep exit code `0`.

Use `--strict` when CI should fail on warnings:

```bash
agentloop check-gates --strict
agentloop check-gates --strict --json
```

Strict mode preserves each gate status in the output, but it reports overall status `fail` when any gate is `warn`.

Use `agentloop doctor` for setup health. Use `agentloop check-gates` after implementation, verification, and handoff to see whether the work has the evidence reviewers expect.
