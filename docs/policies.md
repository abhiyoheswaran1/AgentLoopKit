# Policies

AgentLoopKit generates local policy files under `.agentloop/policies/`.

Use the policy command to inspect them without browsing the directory:

```bash
agentloop policy list
agentloop policy show security
agentloop policy show security-policy.md
agentloop policy status
agentloop policy list --json
agentloop policy show security --json
agentloop policy status --json
```

`policy list` reads Markdown files from `.agentloop/policies/` and prints their titles and paths. `policy show` accepts a policy slug, such as `security`, or the generated filename, such as `security-policy.md`.

`policy status` compares the local Markdown files with AgentLoopKit's bundled policy templates. It reports:

- `current`: local file matches the bundled template
- `modified`: local file exists and differs from the bundled template
- `missing`: bundled template has no matching local file
- `extra`: local file has no matching bundled template

The command is read-only. It does not enforce policy, scan code, call a service, read `.env` contents, download remote policy packs, or rewrite local policy files. It only reads Markdown files from `.agentloop/policies/` and bundled AgentLoopKit templates.

If the policy directory is missing, run:

```bash
agentloop init
```

`init` adds missing AgentLoopKit files and appends to an existing `AGENTS.md` instead of replacing it.

## Why this exists

Agents need a short path to the repo's safety rules before they edit code. Humans need the same path during review. `agentloop policy` makes the generated policies visible through the CLI while keeping the source of truth as plain Markdown in the repo.

## Common policies

Fresh installs include policies for:

- destructive actions
- database changes
- dependencies
- UI changes
- security
- public APIs
- secrets
- git usage

Edit these files when your repo needs stricter guidance. Review policy changes like code changes, especially in team repositories.

Run `agentloop policy status` after editing policies or upgrading AgentLoopKit. Treat `modified` as a prompt to review the local policy text, not as an error. Treat `missing` as a prompt to decide whether the repo needs that policy file.
