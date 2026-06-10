# Template Migrations

AgentLoopKit writes generated guidance files into `.agentloop/`, `AGENTS.md`, and `AGENTLOOP.md`. Those files are meant to be read and edited by maintainers, so AgentLoopKit does not overwrite them during normal upgrades.

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
