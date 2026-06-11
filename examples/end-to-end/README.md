# End-to-End Workflow

This walkthrough shows the local AgentLoopKit loop in a new or existing repo.

No cloud backend, telemetry, API key, or LLM call is involved.

## 1. Preview The Harness

```bash
agentloop init --dry-run
```

Dry run prints the files AgentLoopKit would create or update. It writes nothing.

## 2. Install The Harness

```bash
agentloop init
```

This creates `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json` in the current directory. Review the generated files before asking an agent to use them.

## 3. Check Setup Health

```bash
agentloop doctor
```

Doctor reports missing commands, stale harness metadata, monorepo hints, git root context, working tree state, and risk-file categories. It prints next steps when it finds warnings.

## 4. Create A Task Contract

```bash
agentloop create-task \
  --type feature \
  --title "Add account settings" \
  --problem-statement "Users cannot update account preferences" \
  --desired-outcome "Users can save account settings from the app" \
  --acceptance "Settings changes persist" \
  --verification "npm test"
```

Pin the task so future commands and agents read the same contract:

```bash
agentloop task set .agentloop/tasks/<task-file>.md
agentloop task status .agentloop/tasks/<task-file>.md in-progress
```

## 5. Verify The Work

```bash
agentloop verify
```

`verify` runs configured commands from `agentloop.config.json` and writes a Markdown report under `.agentloop/reports/`. Use `--task-commands` when you want to run verification commands recorded inside the active task.

## 6. Write The Handoff

```bash
agentloop handoff
```

`handoff` writes a deterministic reviewer summary under `.agentloop/handoffs/`. It reads git status, diff stats, the active task, and the latest verification report.

## 7. Check Review Gates

```bash
agentloop check-gates
agentloop check-gates --strict
```

Use default mode while developing. Use `--strict` in CI or before release when warning gates should fail.

## 8. Inspect Evidence

```bash
agentloop artifacts
agentloop artifacts --type verification --latest
agentloop artifacts --json
```

`artifacts` inventories local evidence without reading artifact contents into the response.

## 9. Check Release Readiness

```bash
agentloop release-check
agentloop release-check --strict
```

`release-check` reads local package metadata, changelog entries, release scripts, git state, verification evidence, handoff evidence, and release notes. It does not publish, tag, upload files, or read credentials.

## CI Variant

```yaml
name: AgentLoop Evidence

on:
  pull_request:

jobs:
  evidence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
      - run: npm ci
      - run: npx --yes agentloopkit@latest verify
      - run: npx --yes agentloopkit@latest handoff
      - run: npx --yes agentloopkit@latest check-gates --strict
      - run: npx --yes agentloopkit@latest artifacts --json
```

Use this when CI should generate local evidence as build artifacts. Do not let CI commit generated files unless maintainers choose that workflow.
