# AgentLoopKit

A drop-in engineering loop for coding agents.

Your coding agent can already write code. AgentLoopKit helps it work like a disciplined engineer: scoped task contracts, explicit safety rules, verification evidence, review summaries, and clean handoffs.

Vibe coding produces code. Agentic engineering produces auditable work.

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
```

Run the CLI after install:

```bash
npx agentloopkit doctor
npx agentloopkit create-task --title "Add settings page" --type feature
npx agentloopkit verify
npx agentloopkit summarize --write
npx agentloopkit install-agent codex
```

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
| `agentloop doctor`              | Check setup health, commands, git state, and risk files |
| `agentloop create-task`         | Create a task contract in `.agentloop/tasks/`           |
| `agentloop verify`              | Run configured checks and write a verification report   |
| `agentloop summarize`           | Generate a deterministic PR or reviewer summary         |
| `agentloop install-agent codex` | Add agent-specific instructions                         |
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
agentloop create-task --type feature --title "Add settings page"
```

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

It does not hide failures. If no commands are configured, it writes a report saying nothing was verified.

## PR Summaries

`agentloop summarize` uses deterministic inputs:

- git status
- git diff stats
- latest task contract
- latest verification report
- config settings

It does not call an LLM.

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

## Contributing

See `CONTRIBUTING.md`.

## License

MIT.
