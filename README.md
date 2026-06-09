# AgentLoopKit

A drop-in engineering loop for coding agents.

Your coding agent can write code. AgentLoopKit gives it the repo habits reviewers need: scoped task contracts, safety rules, verification evidence, review summaries, and clean handoffs.

Vibe coding produces code. Agentic engineering produces auditable work.

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-showcase.png" alt="AgentLoopKit workflow showing task contracts, verification reports, and handoff artifacts" width="100%">
</p>

The screenshots and terminal demo in this README are generated from committed sources in `docs/assets/readme/` with Playwright and VHS.

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

Source on `main` targets `0.15.1`. npm currently serves `0.1.1`; GitHub release candidates from `0.2.0` onward were produced while npm publishing auth was blocked. The next successful npm publish may jump to `0.15.1`, then normal semver releases resume.

Run the CLI after install:

```bash
npx agentloopkit doctor
npx agentloopkit create-task --title "Add settings page" --type feature
npx agentloopkit task list
npx agentloopkit task show .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task set .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
npx agentloopkit status
npx agentloopkit verify
npx agentloopkit handoff
npx agentloopkit check-gates
npx agentloopkit check-gates --strict
npx agentloopkit report
npx agentloopkit task archive .agentloop/tasks/2026-06-09-add-settings-page.md
npx agentloopkit install-agent codex
npx agentloopkit install-agent all
npx agentloopkit completion zsh
```

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-cli.gif" alt="Terminal demo running AgentLoopKit init, create-task, task list, task show, task status, completion, verify, handoff, report, and task archive commands" width="100%">
</p>

The VHS demo runs the local built CLI so the command flow matches this repository even when npm is behind.

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

| Command                                 | Purpose                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| `agentloop init`                        | Generate the repo harness and config                                           |
| `agentloop init --dry-run`              | Preview generated files without writing them                                   |
| `agentloop doctor`                      | Check setup health, commands, git state, monorepo markers, and risk categories |
| `agentloop create-task`                 | Create a task contract in `.agentloop/tasks/`                                  |
| `agentloop task list`                   | List task contracts and show the pinned active task                            |
| `agentloop task show <path>`            | Print a task contract without changing active state                            |
| `agentloop task set <path>`             | Pin the active task for status and handoffs                                    |
| `agentloop task status <path> <status>` | Update a task contract status line                                             |
| `agentloop task archive <path>`         | Move a task contract into `.agentloop/tasks/archive/`                          |
| `agentloop task current`                | Print the pinned active task                                                   |
| `agentloop task clear`                  | Clear the active task pointer                                                  |
| `agentloop status`                      | Show active task, latest report, dirty files, next step                        |
| `agentloop check-gates`                 | Check task, verification, handoff, harness, policy, and git evidence           |
| `agentloop check-gates --strict`        | Treat warning gates as failures for CI                                         |
| `agentloop verify`                      | Run configured checks and write a verification report                          |
| `agentloop summarize`                   | Generate a deterministic PR or reviewer summary                                |
| `agentloop handoff`                     | Write a reviewer handoff summary                                               |
| `agentloop report`                      | Write a local static HTML evidence report                                      |
| `agentloop install-agent codex`         | Add agent-specific instructions                                                |
| `agentloop install-agent all`           | Add all bundled agent instruction files                                        |
| `agentloop list-templates`              | List bundled templates                                                         |
| `agentloop completion <shell>`          | Print bash, zsh, or fish completion scripts                                    |
| `agentloop version`                     | Print the CLI version                                                          |

The package exposes two binaries:

```bash
agentloop init
agentloopkit init
```

## Shell Completions

AgentLoopKit prints completion scripts to stdout. It does not edit `.zshrc`, `.bashrc`, fish config, or other shell profile files.

Inspect a script before installing it:

```bash
agentloop completion zsh
agentloop completion bash
agentloop completion fish
```

Example zsh setup:

```bash
mkdir -p ~/.zsh/completions
agentloop completion zsh > ~/.zsh/completions/_agentloop
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

The package ships `schema/agentloop.config.schema.json` for editors and config validation. Generated configs use the GitHub raw schema URL for editor support; the CLI validates config locally and does not fetch that URL at runtime.

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
agentloop task status .agentloop/tasks/2026-06-09-add-settings-page.md in-progress
agentloop task archive .agentloop/tasks/2026-06-09-add-settings-page.md
agentloop task current
agentloop task clear
```

`task list --json` gives agents a deterministic list with `path`, `title`, `status`, `active`, and `modifiedAt`. Listing tasks does not create or update `.agentloop/state.json`.
`create-task --json` returns the created task path and Markdown content so agents do not need to parse the human success line.
`task show --json` returns the selected task metadata and Markdown content without changing active state.
`task status --json` updates only the `- Status:` line. Supported values are `proposed`, `in-progress`, `blocked`, `review`, and `done`. Status is not verification evidence; run `agentloop verify` before claiming completion.
`task archive --json` moves one named Markdown contract into `.agentloop/tasks/archive/`, refuses to overwrite an existing archive file, and clears the active task pointer when it archives the active task. Archive after verification and handoff, not as a substitute for either.

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

When `agentloop verify` runs in GitHub Actions, the report records the workflow, event, ref, commit, run URL, and run attempt. Local reports stay quiet. AgentLoopKit does not read `.env` files or print arbitrary environment variables.

In monorepos, `doctor` warns on common workspace markers and suggests package-specific verification commands. Add package checks to the task contract when root commands do not cover the touched package, for example `pnpm --filter web test` or `npm --workspace api test`. AgentLoopKit records and runs configured commands; it does not infer package graphs or run workspace commands automatically.

`doctor` also reports potential risk files by category, such as migrations, auth, deployment, lockfiles, and env files. It lists path examples only. It does not read `.env` contents or claim to scan secrets.

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

## Gate Checks

`agentloop check-gates` checks review evidence without running tests or calling an LLM. It looks for:

- a task contract
- a generated verification report
- a generated handoff summary
- repo harness files
- core safety policies
- git working tree context

Use JSON output in scripts:

```bash
agentloop check-gates --json
agentloop check-gates --strict
```

Warnings keep exit code `0` by default. Use `--strict` in CI when warning gates should fail the command.

`doctor` checks setup health. `check-gates` checks whether the current work session has the evidence reviewers expect.

See `docs/check-gates.md` for gate statuses and exit-code behavior.

## HTML Reports

`agentloop report` writes a local static HTML page from the current task contract, latest verification report, latest handoff, git status, diff stats, and deterministic review summary:

```bash
agentloop report
agentloop report --json
agentloop report --out .agentloop/reports/review.html
```

The command does not run tests, call an LLM, fetch assets, read `.env` contents, or send data anywhere. It writes one local file under `.agentloop/reports/` by default. Use it after `verify` and `handoff` when you want a browser-readable artifact for a PR or CI upload.

See `docs/html-reports.md` for inputs, output paths, and safety behavior.

<p align="center">
  <img src="https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/docs/assets/readme/agentloopkit-verification.png" alt="AgentLoopKit verification report screenshot showing command results and reviewer handoff sections" width="100%">
</p>

## GitHub Actions

Use `agentloop check-gates --strict` as a review-evidence gate in pull request CI. Use `agentloop verify` and `agentloop handoff` in CI when you want reports and handoffs uploaded as build artifacts.

CI-generated verification reports include GitHub Actions provenance when available, so reviewers can trace an artifact back to the workflow run that created it.

See `docs/github-actions.md` and `examples/github-actions/` for copy-pasteable workflows. Because npm latest is still `0.1.1`, the examples pin the `v0.15.1` GitHub tarball. Switch them to normal npm usage after npm publishing catches up.

## PR Summaries

`agentloop handoff` writes a reviewer-ready summary using deterministic inputs:

- git status
- git diff stats
- active task contract, or newest task when no active task is pinned
- latest verification report
- config settings

The summary groups changed files into review areas such as source, tests, docs, CI, config, AgentLoop artifacts, and risk-sensitive paths. It adds review-focus hints from file paths only.

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
- `examples/github-actions`

See `docs/stack-recipes.md` for Next.js, React/Vite, Node API, Python, docs-only, empty-repo, and monorepo verification recipes.

## Roadmap

See `ROADMAP.md`.

## Publishing Status

AgentLoopKit is published on npm as `agentloopkit`, but npm currently serves `0.1.1` while GitHub release `v0.15.1` is the latest source release. The next successful npm publish may jump from `0.1.1` to `0.15.1`, then normal semver releases resume.

The repository includes a GitHub Actions publish workflow for npm trusted publishing after the package is configured on npm. The workflow runs checks before `npm publish` and skips publish when the version already exists.

See `docs/launch-checklist.md` before publishing.

## Contributing

See `CONTRIBUTING.md`.

## License

MIT.
