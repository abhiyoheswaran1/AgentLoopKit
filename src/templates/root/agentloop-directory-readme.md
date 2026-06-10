# AgentLoopKit Workspace

This directory contains repo-local engineering loop artifacts for coding agents and reviewers.

`manifest.json` records the AgentLoopKit template generation used to create this harness. `agentloop doctor` reads it and warns when the local harness is missing template metadata, older than the current CLI, invalid, or newer than the CLI supports.

## Start Here

1. Read `../AGENTS.md`.
2. Read `../AGENTLOOP.md`.
3. Create or inspect a task contract:

```bash
agentloop create-task --title "Describe the next focused change" --type feature
agentloop task list
agentloop task show .agentloop/tasks/<task-file>.md
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
agentloop task archive .agentloop/tasks/<task-file>.md
```

Archive only after verification and handoff. The archive command moves one named Markdown file into `.agentloop/tasks/archive/` and keeps normal task lists focused.

4. Check current loop state:

```bash
agentloop status
```

5. Inspect safety policies when the task touches protected areas:

```bash
agentloop policy list
agentloop policy show security
agentloop policy status
```

6. Run verification when work is ready:

```bash
agentloop verify
```

7. Generate a reviewer handoff:

```bash
agentloop handoff
```

8. Optional: write a local HTML evidence report:

```bash
agentloop report
```

9. Optional: write a local SVG evidence badge:

```bash
agentloop badge
agentloop badge --source gates
```

10. Check review gates:

```bash
agentloop check-gates
agentloop check-gates --strict
```

`check-gates` inspects local evidence. It does not run tests or call an LLM.
`report` reads local evidence and writes one static HTML file under `reports/`.
`badge` reads local evidence and writes SVG files under `reports/`.
Use `--strict` in CI when warning gates should fail.

CI can either check committed AgentLoop evidence or generate reports and handoffs as build artifacts. Do not let CI commit generated files unless maintainers explicitly want that behavior.

When GitHub Actions runs `agentloop verify`, the report records allowlisted CI provenance fields such as workflow, event, ref, commit, run URL, and run attempt. AgentLoopKit does not print arbitrary environment variables.

## Directories

- `loops/`: task-specific workflows
- `manifest.json`: generated template version metadata
- `gates/`: pass/fail checklists
- `policies/`: safety rules
- `tasks/`: task contracts
- `reports/`: verification reports
- `handoffs/`: PR summaries and reviewer briefs
- `agents/`: agent-specific instructions
- `harness/`: repo working agreement and commands

## Monorepo Notes

When this repository has workspace markers, use both root and package-level checks as needed. Put package-specific verification commands in the task contract so agents and reviewers can see what the change requires.

Examples:

```bash
pnpm --filter <package> test
npm --workspace <package> test
cd packages/<name> && npm test
```

Root checks are useful when they cover the touched package. If they do not, say what was not verified in the handoff.
