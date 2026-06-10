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

## How to read status

| Status | What it means | Maintainer action |
| ------ | ------------- | ----------------- |
| `current` | The local policy matches the bundled AgentLoopKit template. | No action unless your repo needs stricter guidance. |
| `modified` | The local policy differs from the bundled template. | Review the local text. Treat it as a repo decision, not an error. |
| `missing` | A bundled policy template has no matching local file. | Decide whether the repo needs that policy. Run `agentloop init` only if you want to restore missing generated files. |
| `extra` | The repo has a policy file that is not bundled with AgentLoopKit. | Keep it if it captures repo-specific rules. Review it like any other policy file. |

Local policy files are the source of truth for the repo. Bundled templates are comparison material. Agents should follow `.agentloop/policies/*.md` during repo work, even when `policy status` reports `modified`.

## Customizing policies

Use this workflow when a repo needs stricter or more specific rules:

1. Open the relevant file under `.agentloop/policies/`.
2. Make the policy concrete enough for agents to follow during implementation and handoff.
3. Keep safety-sensitive relaxations explicit. If a change weakens guidance for secrets, destructive actions, dependencies, database changes, public APIs, or git history, require human review.
4. Run `agentloop policy status`.
5. Include policy changes in the task contract or PR summary so reviewers know the repo rules changed.

Good policy edits name the risky area, the allowed action, the approval trigger, and the verification evidence expected from the agent. Avoid broad values statements that do not change agent behavior.

When upgrading AgentLoopKit, compare modified local policies with the bundled templates before copying text over. Do not replace customized policy files just to make `policy status` show `current`.

See [policy examples](policy-examples.md) for repo-type snippets you can adapt for web apps, APIs, Python services, docs-only repos, monorepos, and open-source review workflows.
For a command-level security-review workflow that combines task contracts, policies, verification, and handoff evidence, see [security review workflow](security-review.md).
For package and lockfile changes, see [dependency upgrade workflow](dependency-upgrades.md).

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
