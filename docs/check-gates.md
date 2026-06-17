# Gate Checks

`agentloop check-gates` checks whether the current work session has review evidence.

It inspects local files only:

- task contract
- generated verification report
- generated handoff summary
- task-folder hygiene diagnostics from `agentloop task doctor`
- repo harness files
- core safety policies
- git working tree, root, and target context

It does not run tests, call an LLM, score code quality, or block human review.

If a verified task was archived after handoff, `check-gates` can use the latest run ledger entry when it still points to an existing task contract under `.agentloop/tasks/archive/`.

```bash
agentloop check-gates
agentloop check-gates --json
agentloop check-gates --strict
agentloop check-gates --redact-paths
```

Use `--redact-paths` before pasting gate output into a public issue, PR, or CI log. It replaces the absolute Git root with `[git-root]` while preserving repo-relative AgentLoop artifact paths.
Default JSON keeps the absolute Git root for scripts that need it.
Human-readable output keeps dynamic values inside single-line inline code. Task paths, branch names, and gate messages with unusual characters stay on one Markdown list line. JSON output keeps raw values for scripts.

Statuses:

- `pass`: evidence exists
- `warn`: evidence is useful but not mandatory
- `fail`: core evidence is missing or failed

The command exits with code `1` when any gate fails. Warnings keep exit code `0`.
Task-folder hygiene issues are warnings by default. Run `agentloop task doctor` for the detailed cleanup list.
When task, verification, and handoff evidence are present but task hygiene still warns, the next action points to `agentloop task doctor`.
When a clean Git tree has current task, verification, and handoff evidence, the Git context gate passes and reports that no changed files were detected.
When the working tree is dirty, the Git context output keeps the total changed-file count and separates non-evidence files from generated AgentLoop evidence files. This is informational only; it does not hide, delete, archive, or ignore either group.
When the working tree has dirty files, the handoff gate warns unless the latest review-evidence run covers those dirty files. Review-evidence runs are `handoff` runs and `ship` runs that record a handoff path.
When dirty files are covered for the active non-terminal task, the next action points to `agentloop task done`. When the covered evidence belongs to an archived or completed task, the next action points to `agentloop create-task` for new work.

Use `--strict` when CI should fail on warnings:

```bash
agentloop check-gates --strict
agentloop check-gates --strict --json
```

Strict mode preserves each gate status in the output, but it reports overall status `fail` when any gate is `warn`.

With `--json`, invalid `agentloop.config.json` files return a `CONFIG_ERROR` object.

Use `agentloop doctor` for setup health. Use `agentloop check-gates` after implementation, verification, and handoff to see whether the work has the evidence reviewers expect.

For GitHub Actions recipes that use strict gates, see `github-actions.md`.
