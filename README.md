# AgentLoopKit

A drop-in engineering loop for coding agents.

Your coding agent can already write code. AgentLoopKit helps it work like a disciplined engineer: scoped task contracts, explicit safety rules, verification evidence, review summaries, and clean handoffs.

Vibe coding produces code. Agentic engineering produces auditable work.

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-showcase.png" alt="AgentLoopKit workflow showing task contracts, verification reports, and handoff artifacts" width="100%">
</p>

## What It Is

AgentLoopKit is a repo-level toolkit for developers using Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and other coding agents.

It does not replace your agent, IDE, or CLI. It gives those tools a repeatable engineering loop inside the repository they are editing.

AgentLoopKit generates:

- `AGENTS.md`
- `AGENTLOOP.md`
- `agentloop.config.json`
- `.agentloop/` with task templates, gates, policies, reports, handoffs, and agent instructions

## Why It Exists

Coding agents often move fast but leave reviewers with weak evidence: unclear scope, missing tests, broad diffs, and vague summaries. AgentLoopKit gives the agent a repo-local contract:

1. Specify the task.
2. Constrain risk.
3. Plan the change.
4. Implement the smallest useful diff.
5. Verify with configured commands.
6. Review the diff.
7. Handoff with evidence.

## Install

Use it with `npx` inside an existing repository:

```bash
npx agentloopkit init
npx agentloopkit init --dry-run
```

Current source on `main` documents `0.5.0`. npm latest is still `0.1.1` until trusted publishing or local npm authentication is repaired.

Run the CLI after install:

```bash
npx agentloopkit doctor
npx agentloopkit create-task --title "Add settings page" --type feature
npx agentloopkit task list
npx agentloopkit task show .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task set .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit status
npx agentloopkit verify
npx agentloopkit handoff
npx agentloopkit install-agent codex
npx agentloopkit install-agent all
```

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-cli.gif" alt="Terminal demo running AgentLoopKit init, doctor, create-task, and reviewer summary commands" width="100%">
</p>

Pinned team usage:

```bash
pnpm add -D agentloopkit
pnpm agentloop init
```

Contributor usage:

```bash
git clone https://github.com/abhiyoheswaran1/agentloopkit
cd agentloopkit
pnpm install
pnpm test
pnpm build
```

## CLI Commands

| Command                         | Purpose                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `agentloop init`                | Generate the repo harness and config                    |
| `agentloop init --dry-run`      | Preview generated files without writing them            |
| `agentloop doctor`              | Check setup health, commands, git state, and risk files |
| `agentloop create-task`         | Create a task contract in `.agentloop/tasks/`           |
| `agentloop task list`           | List task contracts and show the pinned active task     |
| `agentloop task show <path>`    | Print a task contract without changing active state     |
| `agentloop task set <path>`     | Pin the active task for status and handoffs             |
| `agentloop task current`        | Print the pinned active task                            |
| `agentloop task clear`          | Clear the active task pointer                           |
| `agentloop status`              | Show active task, latest report, dirty files, next step |
| `agentloop verify`              | Run configured checks and write a verification report   |
| `agentloop summarize`           | Generate a deterministic PR or reviewer summary         |
| `agentloop handoff`             | Write a reviewer handoff summary                        |
| `agentloop install-agent codex` | Add agent-specific instructions                         |
| `agentloop install-agent all`   | Add all bundled agent instruction files                 |
| `agentloop list-templates`      | List bundled templates                                  |
| `agentloop version`             | Print the CLI version                                   |

The package exposes two binaries:

```bash
agentloop init
agentloopkit init
```

## Generated Files

```text
.agentloop/
  loops/
  gates/
  handoffs/
  agents/
  policies/
  tasks/
  reports/
  harness/
AGENTS.md
AGENTLOOP.md
agentloop.config.json
```

`init` appends to an existing `AGENTS.md` instead of overwriting it.

The package ships `schema/agentloop.config.schema.json` for editors and config validation.

See `docs/configuration.md` for config fields and schema notes.

## Agent Usage

Install instructions for the agent you use:

```bash
agentloop install-agent codex
agentloop install-agent claude-code
agentloop install-agent cursor
agentloop install-agent opencode
agentloop install-agent gemini-cli
agentloop install-agent github-copilot-cli
```

AgentLoopKit only writes safe repo-local Markdown instructions when exact third-party config conventions are uncertain.

## Task Contracts

Create a contract before a coding session:

```bash
agentloop create-task --type feature --title "Add settings page" \
  --problem-statement "Users cannot manage account preferences" \
  --desired-outcome "Users can update settings from the app" \
  --likely-file src/settings \
  --forbidden-file migrations/ \
  --acceptance "Settings can be saved" \
  --verification "pnpm test" \
  --rollback "Remove the settings route"
```

Pin the contract when more than one task exists:

```bash
agentloop task list
agentloop task show .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task set .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task current
agentloop task clear
```

`task list --json` gives agents a deterministic list with `path`, `title`, `status`, `active`, and `modifiedAt`. Listing tasks does not create or update `.agentloop/state.json`.
`task show --json` returns the selected task metadata and Markdown content without changing active state.

Each contract records:

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

## Verification Reports

`agentloop verify` reads `agentloop.config.json`, runs configured commands, captures output excerpts, and writes a report:

```text
.agentloop/reports/YYYY-MM-DD-HH-mm-verification-report.md
```

It does not hide failures. If long logs are truncated, the report keeps the first and last output so the final error stays visible. If no commands are configured, it writes a report saying nothing was verified.

## Status

`agentloop status` gives agents and humans a quick local readout:

- active task contract, using `agentloop task set` when present
- newest task contract when no active task is pinned
- latest verification report
- working tree state
- configured and missing commands
- next suggested command

Use JSON output in scripts:

```bash
agentloop status --json
```

See `docs/status.md` for output fields and next-action rules.

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-verification.png" alt="AgentLoopKit verification report screenshot showing command results and reviewer handoff sections" width="100%">
</p>

## PR Summaries

`agentloop handoff` writes a reviewer-ready summary using deterministic inputs:

- git status
- git diff stats
- active task contract, or newest task when no active task is pinned
- latest verification report
- config settings

It does not call an LLM.

Use `agentloop summarize` to preview the same output without writing a handoff file. `agentloop summarize --write` remains available for scripts.

## Safety Principles

AgentLoopKit is intentionally boring:

- no postinstall scripts
- no telemetry
- no cloud backend
- no database
- no API keys
- no hidden network calls
- no reading `.env` contents
- no destructive actions during install

Env files are reported by path only.

## Compared With Plain AGENTS.md

`AGENTS.md` gives instructions. AgentLoopKit adds process artifacts:

- task contracts
- gates
- policies
- verification reports
- PR summaries
- rollback notes

The result is easier to review because the work produces evidence, not only code.

## Compared With Prompt Collections

Prompt collections help an agent respond better. AgentLoopKit gives the repository a standing workflow that any compatible agent can read and follow.

## Compared With Superpowers

Superpowers is a broader agent methodology and skills system. AgentLoopKit focuses on repo-level engineering loops, task contracts, verification evidence, and handoff artifacts.

They can be complementary. You can use AgentLoopKit alongside Superpowers.

AgentLoopKit has no affiliation with Superpowers.

## Examples

See `examples/` for sample generated harnesses:

- `examples/nextjs-app`
- `examples/node-api`
- `examples/python-service`
- `examples/docs-only`
- `examples/empty-repo`

## Roadmap

See `ROADMAP.md`.

## Publishing Status

AgentLoopKit is published on npm as `agentloopkit`.

The repository includes a GitHub Actions publish workflow for npm trusted publishing after the package is configured on npm. The workflow runs checks before `npm publish` and skips publish when the version already exists.

See `docs/launch-checklist.md` before publishing.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT.
