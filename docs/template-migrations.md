# Template Migrations

AgentLoopKit writes generated guidance files into `.agentloop/`, `AGENTS.md`, and `AGENTLOOP.md`. Those files are meant to be read and edited by maintainers, so AgentLoopKit does not overwrite them during normal upgrades.

## Existing Repos

Update the CLI first:

```bash
cd /path/to/existing/repo
npx --yes agentloopkit@latest version
npx --yes agentloopkit@latest doctor --redact-paths
```

Then inspect the local harness:

```bash
npx --yes agentloopkit@latest upgrade-harness --dry-run --redact-paths
npx --yes agentloopkit@latest upgrade-harness --details --redact-paths
npx --yes agentloopkit@latest upgrade-harness --json
npx --yes agentloopkit@latest init --dry-run
```

`upgrade-harness` reads existing generated guidance and reports whether it mentions the current agent-readiness loop:

The exact topic list comes from the installed CLI. This repository may document newer unreleased topics before they are available in `agentloopkit@latest`; use [release status](release-status.md) when you need to compare published behavior with `main`.

- `agentloop doctor`
- `agentloop start`
- `agentloop context handles`
- `agentloop context show`
- broad-read avoidance
- `agentloop ship`
- `agentloop prepare-pr`
- `.agentloop/runs/`, `agentloop runs`, or `agentloop intent`
- `agentloop maintainer-check`
- `agentloop review-context`
- `agentloop upgrade-harness`

The command writes nothing. Use `--details` for copyable guidance, then manually copy the relevant sections into `AGENTS.md`, `AGENTLOOP.md`, or `.agentloop/harness/*`.

Human output keeps dynamic paths on one Markdown line. JSON output keeps raw values for automation.

`init --dry-run` shows missing generated files. A non-dry `init` creates missing files and skips existing ones. It does not merge templates into files that already exist.

You can use the current CLI loop before refreshing old generated guidance:

```bash
npx --yes agentloopkit@latest create-task --type bugfix --title "Fix checkout bug"
npx --yes agentloopkit@latest verify
npx --yes agentloopkit@latest ship
npx --yes agentloopkit@latest prepare-pr
npx --yes agentloopkit@latest maintainer-check
```

## Manifest

Fresh `agentloop init` creates:

```text
.agentloop/manifest.json
```

The manifest records:

- `version`: manifest format version
- `templateVersion`: bundled template generation version
- `generatedBy`: package name

`agentloop doctor` reads this file and reports whether the installed template generation is current for the CLI you are running.

## Template Version 2

Version 2 adds Agent Start readiness guidance to generated `AGENTS.md`, `AGENTLOOP.md`, `.agentloop/harness/commands.md`, and `.agentloop/README.md`.

Existing repos do not need an automatic rewrite. Run `agentloop upgrade-harness --details` and copy the Start/Context guidance that fits your repo:

```text
agentloop doctor --redact-paths
agentloop start --for generic --goal implement --redact-paths
agentloop context handles
agentloop context show <handle>
```

This keeps software agents pointed at the current repo preflight before broad reads, lists available source handles, and avoids broad repo scans when the compact briefing is enough.

## Doctor Warnings

`doctor` keeps template manifest issues as warnings:

- Missing manifest: rerun `agentloop init` to add missing files. Existing files are skipped or appended safely.
- Older template version: review this page, then rerun `agentloop init` to add files that do not exist yet.
- Newer template version: upgrade AgentLoopKit before changing generated harness files.
- Invalid manifest: inspect `.agentloop/manifest.json`; recreate it with `agentloop init` if needed.

## Manual Review

When templates change, compare the current templates with your repo-local files before copying anything over. Treat generated files as repo policy, not package-owned state.

Suggested review flow:

```bash
agentloop doctor
agentloop upgrade-harness
agentloop init --dry-run
agentloop list-templates
agentloop policy status
```

Then inspect the relevant files under `.agentloop/`, `AGENTS.md`, and `AGENTLOOP.md`.

For policy files, treat `modified` as a local repo decision to review. Do not copy bundled policy text over a customized local policy unless the maintainer wants that rule change.

## Non-Goals

AgentLoopKit does not:

- rewrite edited harness files
- merge policy files
- fetch remote templates
- migrate task contracts
- mutate `agentloop.config.json` for template updates

The manifest is a local provenance marker and a `doctor` signal. It is not an automatic migration system.
