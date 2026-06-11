# AgentLoopKit

A drop-in engineering loop for coding agents.

An open-source Baseframe Labs developer tool.

Your coding agent can write code. AgentLoopKit gives it the repo habits reviewers need: task contracts, safety rules, verification evidence, review summaries, and clean handoffs.

Vibe coding produces code. Agentic engineering produces auditable work.

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-showcase.png" alt="AgentLoopKit workflow showing task contracts, verification reports, and handoff artifacts" width="100%">
</p>

The screenshots and terminal demo in this README are generated from committed sources in `docs/assets/readme/` with Playwright and VHS.

## What It Does

AgentLoopKit is a repo-level toolkit for developers using Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and other coding agents.

It does not replace your agent, IDE, or CLI. It gives those tools a repeatable local workflow:

1. Specify the task.
2. Constrain the risk.
3. Implement the smallest useful change.
4. Verify with real commands.
5. Review the diff.
6. Hand off with evidence.

Run `init` inside an existing repository and AgentLoopKit creates:

- `.agentloop/` for tasks, reports, handoffs, gates, policies, templates, and agent instructions
- `AGENTS.md` for agent-facing repo guidance
- `AGENTLOOP.md` for the working loop
- `agentloop.config.json` for local command and path settings

Generated `AGENTS.md` includes a specialist roster for product, CLI, template, verification, security, release, docs, compatibility, MCP, and repo-steward work. It helps future agent sessions split work without adding a background service.

## Install

Use it with `npx` from the repository you want to configure:

```bash
cd /path/to/your/repo
npx agentloopkit init --dry-run
npx agentloopkit init
```

`init` writes files into the current directory. `--dry-run` previews the same plan and writes nothing.

After setup, non-init commands search upward for the nearest `agentloop.config.json` and use that folder as the AgentLoop root. You can run `agentloop status`, `agentloop verify`, or `agentloop handoff` from a nested source folder and still write tasks, reports, and handoffs to the initialized repo root.

Do not run `init` from your home directory unless you intend to configure your home folder. If you want local agent guidance but do not want to commit the generated files, use local-only mode:

```bash
npx agentloopkit init --local-only
```

`--local-only` writes the harness, asks Git for this clone's metadata directory, then adds a marked block to that clone's `info/exclude` for `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json`. It does not edit `.gitignore`, global Git config, shell profiles, or other project files.

Check the published package explicitly:

```bash
npx --yes agentloopkit@latest version
npx --yes agentloopkit@latest init
```

For repeatable CI or team setup, replace `@latest` with a vetted version.

Pinned team usage:

```bash
pnpm add -D agentloopkit
pnpm agentloop init
```

## Core Workflow

```bash
npx agentloopkit doctor
npx agentloopkit create-task --title "Add settings page" --type feature
npx agentloopkit task set .agentloop/tasks/<task-file>.md
npx agentloopkit task status .agentloop/tasks/<task-file>.md in-progress
npx agentloopkit verify
npx agentloopkit handoff
npx agentloopkit check-gates
```

Use `agentloop status` or `agentloop next` when an agent needs the next local action without reading every file:

```bash
npx agentloopkit status
npx agentloopkit status --brief
npx agentloopkit next
```

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-cli.gif" alt="Terminal demo running AgentLoopKit init, doctor, task contract creation, task status, verification, handoff, gates, HTML report, and badge commands" width="100%">
</p>

The terminal demo is generated from committed VHS sources in this repository.

## Commands

The package exposes two binaries:

```bash
agentloop init
agentloopkit init
```

| Command                          | Purpose                                                      |
| -------------------------------- | ------------------------------------------------------------ |
| `agentloop init`                 | Generate the repo harness and config                         |
| `agentloop doctor`               | Check setup health, commands, git state, and risk files      |
| `agentloop create-task`          | Create a scoped task contract                                |
| `agentloop task ...`             | List, show, pin, update, archive, and inspect task state     |
| `agentloop status`               | Show active task, current report, dirty files, and next step |
| `agentloop next`                 | Print only the next recommended loop action                  |
| `agentloop verify`               | Run configured checks and write a verification report        |
| `agentloop summarize`            | Preview a deterministic reviewer summary                     |
| `agentloop handoff`              | Write a reviewer handoff summary                             |
| `agentloop check-gates`          | Check review evidence without running tests                  |
| `agentloop artifacts`            | Inventory local task, report, handoff, and badge evidence    |
| `agentloop report`               | Write a local static HTML evidence report                    |
| `agentloop badge`                | Write a local SVG evidence badge                             |
| `agentloop ci-summary`           | Summarize CI context and existing AgentLoop evidence         |
| `agentloop release-notes`        | Draft local release notes from repo evidence                 |
| `agentloop release-check`        | Check local release readiness without publishing             |
| `agentloop npm-status`           | Check npm registry status without publishing                 |
| `agentloop mcp-server`           | Start the read-only MCP stdio server                         |
| `agentloop policy ...`           | Read and compare local safety policies                       |
| `agentloop install-agent <name>` | Add agent-specific instructions                              |
| `agentloop list-templates`       | List bundled templates                                       |
| `agentloop completion <shell>`   | Print shell completion scripts                               |
| `agentloop version`              | Print the CLI version                                        |

See [docs/cli-reference.md](docs/cli-reference.md) for command examples, JSON modes, and safety notes.

## Agent Setup

Install instructions for the agent you use:

```bash
agentloop install-agent codex
agentloop install-agent claude-code
agentloop install-agent cursor
agentloop install-agent opencode
agentloop install-agent gemini-cli
agentloop install-agent github-copilot-cli
agentloop install-agent all
```

AgentLoopKit writes repo-local Markdown instructions. When exact third-party config conventions are uncertain, it keeps the output generic instead of pretending to own another tool's setup.

## Safety Model

AgentLoopKit is intentionally boring:

- no postinstall scripts
- no telemetry
- no cloud backend
- no database
- no API keys
- no hidden network calls
- no reading `.env` contents
- no destructive actions during install

Env files are reported by path only. Verification commands run only when you explicitly run `agentloop verify`.

## More Docs

- [Getting started](docs/getting-started.md)
- [CLI reference](docs/cli-reference.md)
- [Configuration](docs/configuration.md)
- [Task contracts](docs/task-contracts.md)
- [Verification reports](docs/verification-reports.md)
- [Status and next action](docs/status.md)
- [Gate checks](docs/check-gates.md)
- [HTML reports](docs/html-reports.md)
- [PR summaries and handoffs](docs/pr-summaries.md)
- [Policies](docs/policies.md)
- [MCP server](docs/mcp.md)
- [CI examples](docs/github-actions.md)
- [Distribution channels](docs/distribution-channels.md)
- [Comparison](docs/comparison.md)

## Examples

See `examples/` for sample generated harnesses and CI recipes:

- [End-to-end workflow](examples/end-to-end/README.md)
- [Next.js app](examples/nextjs-app/README.md)
- [Node API](examples/node-api/README.md)
- [Python service](examples/python-service/README.md)
- [Docs-only repo](examples/docs-only/README.md)
- [Empty repo](examples/empty-repo/README.md)
- [GitHub Actions](examples/github-actions/README.md)
- [GitLab CI](examples/gitlab-ci/README.md)
- [Buildkite](examples/buildkite/README.md)
- [Security review](examples/security-review/README.md)
- [Dependency upgrade](examples/dependency-upgrade/README.md)

See [docs/stack-recipes.md](docs/stack-recipes.md) for Next.js, React/Vite, Remix, SvelteKit, Node API, Django, FastAPI, Python, docs-only, empty-repo, and monorepo verification recipes.

## Compared With Plain AGENTS.md

`AGENTS.md` gives instructions. AgentLoopKit adds process artifacts: task contracts, gates, policies, verification reports, PR summaries, and rollback notes.

The result is easier to review because the work produces evidence, not only code.

## Compared With Prompt Collections

Prompt collections help an agent respond better. AgentLoopKit gives the repository a standing workflow that compatible agents can read and follow.

## Compared With Superpowers

Superpowers is a broader agent methodology and skills system. AgentLoopKit focuses on repo-level engineering loops, task contracts, verification evidence, and handoff artifacts.

They can be complementary. You can use AgentLoopKit alongside Superpowers. AgentLoopKit has no affiliation with Superpowers.

## Contributing

Contributor setup:

```bash
git clone https://github.com/abhiyoheswaran1/agentloopkit
cd agentloopkit
pnpm install
pnpm test
pnpm build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and PR expectations.

## License

MIT.
