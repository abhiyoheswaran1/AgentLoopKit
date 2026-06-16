# AgentLoopKit

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/logo/icon.svg" alt="AgentLoopKit logo" width="96" height="96">
</p>

A drop-in engineering loop for coding agents.

An open-source Baseframe Labs developer tool.

Your coding agent can write code. AgentLoopKit helps you decide whether that code is reviewable, verifiable, and merge-ready.

It gives Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and other coding agents a local acceptance layer: task contracts, safety rules, verification evidence, review-readiness scores, PR descriptions, and reviewer handoffs.

Vibe coding produces code. Agentic engineering produces auditable work.

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-showcase.png" alt="AgentLoopKit workflow showing task contracts, verification reports, and handoff artifacts" width="100%">
</p>

The screenshots and terminal demo in this README are generated from committed sources in `docs/assets/readme/` with Playwright and VHS.

## What It Does

AgentLoopKit is a repo-level toolkit for developers using Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and other coding agents.

Keep your agent, IDE, and CLI. AgentLoopKit gives those tools a repeatable local workflow:

1. Specify the task.
2. Constrain the risk.
3. Implement the smallest useful change.
4. Verify with real commands.
5. Review the diff.
6. Hand off with evidence.
7. Ship only when the work is reviewable.

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

After setup, non-init commands search upward for the nearest `agentloop.config.json` and use that folder as the AgentLoop root. You can run `agentloop status`, `agentloop verify`, `agentloop ship`, or `agentloop prepare-pr` from a nested source folder and still write tasks, reports, runs, and handoffs to the initialized repo root.

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

## Existing Repos

Repos that already use AgentLoopKit can update the CLI without rewriting local harness files:

```bash
cd /path/to/existing/repo
npx --yes agentloopkit@latest version
npx --yes agentloopkit@latest doctor --redact-paths
npx --yes agentloopkit@latest upgrade-harness --details --redact-paths
npx --yes agentloopkit@latest init --dry-run
```

`init` skips existing generated files and appends to unmarked `AGENTS.md` files instead of overwriting maintainer edits. Use `upgrade-harness` to find older guidance that does not mention the current review-readiness loop, then copy only the useful pieces into `AGENTS.md`, `AGENTLOOP.md`, or `.agentloop/harness/*`.

You can use the latest loop before refreshing old guidance:

```bash
npx --yes agentloopkit@latest create-task --type bugfix --title "Fix checkout bug"
npx --yes agentloopkit@latest verify
npx --yes agentloopkit@latest ship
npx --yes agentloopkit@latest prepare-pr
npx --yes agentloopkit@latest maintainer-check
```

## Core Workflow

```bash
npx agentloopkit init
agentloop create-task --title "Fix login redirect bug" --type bugfix \
  --acceptance "Password-reset login redirects to the requested page" \
  --include-config-commands \
  --verification "npm test -- auth"

# Run Codex, Claude Code, Cursor, OpenCode, Gemini CLI, or another coding agent.

agentloop verify --task-commands --only-task-commands --progress
agentloop ship --github-comment
agentloop prepare-pr
```

`create-task` sets the new contract as the active task. Use `agentloop task set <path>` only when you need to switch to another contract.
Add `--include-config-commands` when you want the task contract to copy non-empty `test`, `lint`, `typecheck`, and `build` commands from `agentloop.config.json`. Task creation records those commands; it does not run them. Use `verify --task-commands --only-task-commands` when the active contract already includes the full check list.
After verification and `ship`, use `agentloop prepare-pr` for reviewer copy and `agentloop task done` to close the active task before starting unrelated work.

Use `agentloop status` or `agentloop next` when an agent needs the next local action without reading every file:

```bash
npx agentloopkit status
npx agentloopkit status --brief
npx agentloopkit next
npx agentloopkit next --redact-paths
```

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-cli.gif" alt="Terminal demo running AgentLoopKit init, task creation, task-aware verification, review-readiness scoring, PR preparation, review context, run history, and file intent lookup" width="100%">
</p>

The terminal demo is generated from committed VHS sources in this repository.

## Dogfood Gate

AgentLoopKit uses its own loop in this repo. Contributors can run the same local self-check:

```bash
npm run dogfood
```

That command checks task-folder hygiene, current loop status, public docs hygiene, dependency audit results, harness upgrade state, review gates, artifact inventory, maintainer reviewability, agent review context, AgentFlight health, and ProjScan health. It does not publish packages, create tags, post comments, read tokens, read `.env` contents, or run verification commands.

Use JSON output when an agent or CI job needs a structured dogfood summary:

```bash
npm run dogfood:json
npm run dogfood:strict:json
```

The JSON summary reports the mode, overall status, step results, exit codes, durations, and safety notes. It redacts the current workspace root as `[git-root]` before printing structured output.

Run the public-doc check by itself when you edit README, examples, or release-channel docs:

```bash
npm run check:public-docs
```

Use the stricter gate before a release or final handoff:

```bash
npm run dogfood:strict
```

## Commands

The package exposes two binaries:

```bash
agentloop init
agentloopkit init
```

| Command                          | Purpose                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------ |
| `agentloop init`                 | Generate the repo harness and config                                           |
| `agentloop doctor`               | Check setup health, commands, git state, and risk files                        |
| `agentloop create-task`          | Create a scoped task contract                                                  |
| `agentloop task ...`             | List, show, pin, update, archive, and inspect task state                       |
| `agentloop status`               | Show active task, latest report, latest run, dirty files, and next step        |
| `agentloop next`                 | Print only the next recommended loop action                                    |
| `agentloop review-context`       | Show one read-only reviewability context snapshot                              |
| `agentloop verify`               | Run configured checks and write a verification report                          |
| `agentloop ship`                 | Score review readiness, write a ship report, and optionally print a PR comment |
| `agentloop prepare-pr`           | Generate a PR title, grouped body, and optional GitHub comment                 |
| `agentloop summarize`            | Preview a deterministic reviewer summary                                       |
| `agentloop handoff`              | Write a reviewer handoff summary                                               |
| `agentloop check-gates`          | Check review evidence without running tests                                    |
| `agentloop runs --latest`        | Show the newest local ship, verify, or handoff run entry                       |
| `agentloop show-run <id>`        | Show one local run ledger entry                                                |
| `agentloop intent <file>`        | Show which runs touched a file and why                                         |
| `agentloop maintainer-check`     | Check whether an AI-assisted PR is reviewable                                  |
| `agentloop artifacts`            | Inventory local tasks, reports, ship reports, badges, and run evidence         |
| `agentloop artifacts --stale`    | Preview capped older local evidence candidates without deleting files          |
| `agentloop upgrade-harness`      | Inspect older generated guidance without overwriting local edits               |
| `agentloop report`               | Write a local static HTML evidence report                                      |
| `agentloop badge`                | Write a local SVG evidence badge                                               |
| `agentloop ci-summary`           | Summarize CI context and existing AgentLoop evidence                           |
| `agentloop release-notes`        | Draft local release notes from repo evidence                                   |
| `agentloop release-check`        | Check local release readiness without publishing                               |
| `agentloop release-proof`        | Check post-release proof across public release channels                        |
| `agentloop npm-status`           | Check npm registry status without publishing                                   |
| `agentloop mcp-server`           | Start the read-only MCP stdio server                                           |
| `agentloop policy ...`           | Read and compare local safety policies                                         |
| `agentloop schemastore`          | Print the config schema catalog entry                                          |
| `agentloop github import`        | Import explicit local GitHub issue or PR JSON                                  |
| `agentloop install-agent <name>` | Add agent-specific instructions                                                |
| `agentloop list-templates`       | List bundled templates                                                         |
| `agentloop completion <shell>`   | Print shell completion scripts                                                 |
| `agentloop version`              | Print the CLI version                                                          |

Clean up finished task contracts after verification and review-readiness evidence:

```bash
agentloop task archive --status done --dry-run
agentloop task archive --status done
```

See [docs/cli-reference.md](docs/cli-reference.md) for command examples, JSON modes, and safety notes.

Maintainers can run a faster focused sanity set while iterating:

```bash
npm run test:quick
npm run test:integration
```

Run the full suite before release:

```bash
npm run test:release
npm run release-flow
```

`test:quick` runs the fast unit-oriented set. `test:integration` runs slower CLI workflow coverage. `test:release` is the full Vitest suite. `release-flow` runs the local release gate without publishing packages, creating tags, or creating GitHub releases.

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

AgentLoopKit writes repo-local Markdown instructions. Re-running `install-agent` is safe: existing `.agentloop/agents/<agent>.md` files are skipped so local edits are preserved, while `AGENTS.md` is updated with any missing AgentLoopKit references. When exact third-party config conventions are uncertain, it keeps the output generic instead of pretending to own another tool's setup.

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

`agentloop ship` reuses current verification evidence by default. Pass `--run-verify` when you want it to run verification as part of the readiness flow. Pass `--github-comment` when CI needs compact Markdown for a pull request comment. AgentLoopKit does not post the comment itself.

`agentloop prepare-pr` groups changed files by review area, including risk-sensitive paths, source, tests, AgentLoop evidence, docs, CI, config, and other files.

For narrower evidence history, `agentloop verify --write-run` and `agentloop handoff --write-run` can add their own local run records without changing the default command behavior.

`agentloop status` includes the newest local run ledger entry when `.agentloop/runs/` exists, so agents can see the latest review-readiness or verification evidence without opening every report.
Run ledger output uses safe display paths: `.agentloop/...` for AgentLoopKit artifacts, repo-relative paths for repo files, and filenames for older outside absolute paths.
Use `--redact-paths` with `doctor`, `status`, `next`, `review-context`, `check-gates`, `verify`, `summarize`, `handoff`, `ship`, `prepare-pr`, `maintainer-check`, `upgrade-harness`, `release-check`, or `release-proof` before pasting output into a public issue, PR, or CI log. That mode replaces local root paths with a placeholder.
`agentloop review-context --json` gives non-MCP agents one read-only local snapshot with status, gates, policies, artifacts, recent runs, latest ship evidence, and the next action.
`agentloop upgrade-harness` is read-only. It tells existing users which generated guidance files need manual review after a CLI upgrade. It does not merge templates or overwrite local edits.
`agentloop schemastore --json` prints the catalog entry for `agentloop.config.json`. Use it when preparing a SchemaStore contribution; the CLI does not submit that contribution for you.
`agentloop github import --issue-json issue.json --pr-json pr.json` imports explicit local GitHub metadata into `.agentloop/github/context.json`. `review-context`, `prepare-pr`, and `maintainer-check` use that local context when it exists. Missing metadata does not block the loop. The CLI does not call GitHub APIs, read tokens, or run `gh`.
`agentloop release-proof` checks post-release evidence for npm, GitHub Releases, GHCR, and MCP Registry. Use `--only <channel>` to re-check one channel. It can query public metadata or read captured JSON files that you pass explicitly. It does not publish, tag, upload, post comments, or read tokens.
Shell completions include fixed values for task types and status transitions, the `done` archive status, agent names, policy subcommands, completion shells, artifact types, badge sources, `summarize` and `handoff` formats, and `release-proof --only` channels.

## More Docs

- [Getting started](docs/getting-started.md)
- [CLI reference](docs/cli-reference.md)
- [Upgrading existing repos](docs/upgrading-existing-repos.md)
- [Configuration](docs/configuration.md)
- [Task contracts](docs/task-contracts.md)
- [Verification reports](docs/verification-reports.md)
- [Status and next action](docs/status.md)
- [Gate checks](docs/check-gates.md)
- [HTML reports](docs/html-reports.md)
- [PR summaries and handoffs](docs/pr-summaries.md)
- [Policies](docs/policies.md)
- [SchemaStore support](docs/schemastore.md)
- [GitHub metadata import](docs/github-metadata.md)
- [Release proof](docs/release-proof.md)
- [MCP server](docs/mcp.md)
- [Template and harness upgrades](docs/template-migrations.md)
- [CI examples](docs/github-actions.md)
- [Distribution channels](docs/distribution-channels.md)
- [Comparison](docs/comparison.md)

## Examples

See `examples/` for sample generated harnesses and CI recipes:

- [End-to-end workflow](examples/end-to-end/README.md)
- [Bugfix PR](examples/bugfix-pr/README.md)
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
