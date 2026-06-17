# Upgrading Existing Repos

Use this when a repository already has `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, or `agentloop.config.json` from an older AgentLoopKit version.

AgentLoopKit updates the CLI first. It does not overwrite edited harness files during normal upgrades.

## Safe Upgrade Check

Run these from the repository root:

```bash
git status --short
npx --yes agentloopkit@latest version
npx --yes agentloopkit@latest doctor --redact-paths
npx --yes agentloopkit@latest upgrade-harness --details --redact-paths
npx --yes agentloopkit@latest init --dry-run
```

Read the output before changing files.

- `doctor` checks setup health, commands, Git root, risk files, and stale harness guidance.
- `upgrade-harness --details` prints copyable guidance for current-loop topics missing from local generated files.
- `init --dry-run` shows missing generated files without writing.

Human `upgrade-harness` output keeps dynamic paths on one Markdown line. JSON output keeps raw values for scripts.

## Recover Stale Task State

Run `agentloop task doctor` when an upgraded repo appears to have old task context, when `.agentloop/state.json` points at a missing or archived task, or when recent AgentLoop reports exist without a current active task.

The recovery check is bounded and local. It reads `.agentloop/state.json`, a capped set of task contracts, recent run metadata, and recent verification report filenames. It does not scan the whole repository, read `.env` files, call external services, or infer task history from changelogs, devlogs, or arbitrary prose.

If the active pointer is stale, use the printed recovery commands to clear, set, or create the current task contract:

```bash
agentloop task doctor
agentloop task clear
agentloop task set .agentloop/tasks/<current-task>.md
agentloop create-task --title "Current work"
```

## Apply The Latest CLI

If the repo uses `npx`, you already get the latest CLI when you run:

```bash
npx --yes agentloopkit@latest <command>
```

If the repo pins AgentLoopKit as a dev dependency, update the package:

```bash
pnpm up -D agentloopkit@latest
# or
npm install -D agentloopkit@latest
```

Then confirm the binary:

```bash
agentloop version
agentloop doctor
```

## Refresh Missing Files

Preview first:

```bash
npx --yes agentloopkit@latest init --dry-run
```

Then run init only when you want AgentLoopKit to create missing files:

```bash
npx --yes agentloopkit@latest init
```

`init` skips existing generated files. It may append a marked AgentLoopKit section to an unmarked `AGENTS.md`, but it does not merge new template text into edited `AGENTS.md`, `AGENTLOOP.md`, or `.agentloop/harness/*` files.

## Refresh Old Guidance Manually

Use:

```bash
npx --yes agentloopkit@latest upgrade-harness --details
```

Copy only the guidance that matches your repo. Current guidance should mention:

- `agentloop ship`
- `agentloop prepare-pr`
- `.agentloop/runs/`, `agentloop runs`, or `agentloop intent`
- `agentloop maintainer-check`
- `agentloop review-context`
- `agentloop upgrade-harness`

Keep local maintainer decisions. Do not replace a customized repo policy or agent rule just because the bundled text changed.

## Use The Current Loop Immediately

Old harness docs do not block the latest CLI commands. You can use the current review-readiness path right away:

```bash
npx --yes agentloopkit@latest create-task --type bugfix --title "Fix checkout bug"
npx --yes agentloopkit@latest verify
npx --yes agentloopkit@latest ship
npx --yes agentloopkit@latest prepare-pr
npx --yes agentloopkit@latest maintainer-check
```

If verification should run commands from the task contract:

```bash
npx --yes agentloopkit@latest verify --task-commands
```

If `ship` should run verification first:

```bash
npx --yes agentloopkit@latest ship --run-verify --task-commands
```

## Local-Only Harnesses

If AgentLoopKit files are for your local agent workflow only, use `--local-only` in a Git repository:

```bash
npx --yes agentloopkit@latest init --local-only
```

This writes the harness and adds a marked block to this clone's `.git/info/exclude`. It does not edit `.gitignore` or global Git config.

Use local-only mode when you do not want the harness committed. Commit the harness when contributors and agents should share the same workflow.

## Troubleshooting

If `doctor --strict` fails because it detects migrations, auth files, deployment workflows, lockfiles, or env file paths, that is a risk signal. It does not mean setup failed. Add protected files and verification commands to the task contract before asking an agent to edit those areas.

If `upgrade-harness` reports stale guidance, leave the files in place and copy the missing sections by hand.

If `init` refuses a home directory, move into the target project:

```bash
cd /path/to/repo
npx --yes agentloopkit@latest init
```

AgentLoopKit treats the current directory as the setup target. Run it inside the repo you want to configure.
