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
agentloop policy status --redact-paths
agentloop policy packs
agentloop policy pack show agentloop-baseline
agentloop policy pack apply agentloop-baseline --dry-run
```

`policy list` reads Markdown files from `.agentloop/policies/` and prints their titles and paths. `policy show` accepts a policy slug, such as `security`, or the generated filename, such as `security-policy.md`.

When `.agentloop/policies/` is missing, policy commands with `--json` return a setup error with `code`, `message`, `policiesDir`, and `nextCommand`. When `policy show --json` cannot find a policy, it returns a JSON error with `requestedPolicy` and `availablePolicies`.
When `agentloop.config.json` is invalid, policy commands with `--json` return a `CONFIG_ERROR` object before reading local policy files.

Human-readable policy output keeps dynamic policy titles, pack metadata, paths, created files, and skipped files on one Markdown line. JSON output keeps raw values for scripts. Policy commands accept `--redact-paths` for consistency with other shareable evidence commands; policy paths are already repo-relative, so the flag does not change output values.

`policy status` compares the local Markdown files with AgentLoopKit's bundled policy templates. It reports:

- `current`: local file matches the bundled template
- `modified`: local file exists and differs from the bundled template
- `missing`: bundled template has no matching local file
- `extra`: local file has no matching bundled template

The list, show, and status commands are read-only. They do not enforce policy, scan code, call a service, read `.env` contents, download remote policy packs, or rewrite local policy files. They read Markdown files from `.agentloop/policies/` and bundled AgentLoopKit templates.

## Policy packs

Policy packs group policy Markdown files so maintainers can copy missing policy guidance into a repo without overwriting local edits.

Bundled packs:

- `agentloop-baseline`: the standard AgentLoopKit safety policies
- `maintainer-review`: reviewability rules for maintainers evaluating agent-assisted changes

List packs:

```bash
agentloop policy packs
agentloop policy packs --json
```

Show one pack:

```bash
agentloop policy pack show agentloop-baseline
agentloop policy pack show maintainer-review --json
```

Apply one pack:

```bash
agentloop policy pack apply maintainer-review --dry-run
agentloop policy pack apply maintainer-review
```

`apply` writes only missing files under `.agentloop/policies/`. Existing policy files are skipped. There is no overwrite flag.

Local organization packs are configured in `agentloop.config.json`:

```json
{
  "policies": {
    "packs": [
      {
        "name": "org-review",
        "path": ".agentloop/policy-packs/org-review"
      }
    ]
  }
}
```

Each local pack needs a manifest:

```json
{
  "name": "org-review",
  "title": "Org Review Pack",
  "description": "Local organization review rules.",
  "policies": ["review-evidence-policy.md"]
}
```

The manifest `name`, `title`, and `description` fields must be non-empty strings. For configured local packs, `manifest.name` must match the pack `name` in `agentloop.config.json` case-insensitively; AgentLoopKit rejects mismatches before listing, showing, or applying that pack.

Policy files live under the pack's `policies/` directory. AgentLoopKit reads local packs only when you run `policy packs`, `policy pack show`, or `policy pack apply`.
Local pack paths and policy files must resolve inside the repository and the pack's `policies/` directory. AgentLoopKit rejects symlinked policy files that point outside that boundary before reading their contents.

### Organization policy-pack workflow

Use local packs when a team wants the same review rules across several repos without a service or remote policy download.

Example layout:

```text
.agentloop/policy-packs/org-review/
  manifest.json
  policies/
    review-evidence-policy.md
    dependency-review-policy.md
```

Example manifest:

```json
{
  "name": "org-review",
  "title": "Organization Review Pack",
  "description": "Shared review evidence rules for this organization.",
  "policies": ["review-evidence-policy.md", "dependency-review-policy.md"]
}
```

Example `review-evidence-policy.md`:

```markdown
# Review Evidence Policy

- PRs that use an agent should include a task contract, verification report, and `agentloop prepare-pr` output.
- Maintainers should run `agentloop maintainer-check` before review when AgentLoopKit evidence exists.
- Changes to auth, billing, migrations, deployment, or lockfiles need explicit risk notes and rollback notes.
```

Example `dependency-review-policy.md`:

```markdown
# Dependency Review Policy

- Dependency changes must explain why the package changed.
- Lockfile changes must stay scoped to the dependency work.
- Verification must include the package manager's install or audit command when the repo has one.
```

Then configure the pack:

```json
{
  "policies": {
    "packs": [
      {
        "name": "org-review",
        "path": ".agentloop/policy-packs/org-review"
      }
    ]
  }
}
```

Preview before writing:

```bash
agentloop policy packs
agentloop policy pack show org-review
agentloop policy pack apply org-review --dry-run
```

Apply when the plan looks right:

```bash
agentloop policy pack apply org-review
agentloop policy status
```

`apply` copies missing files into `.agentloop/policies/` and skips existing files. It does not merge, overwrite, download, or enforce policy text.

## How to read status

| Status     | What it means                                                     | Maintainer action                                                                                                    |
| ---------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `current`  | The local policy matches the bundled AgentLoopKit template.       | No action unless your repo needs stricter guidance.                                                                  |
| `modified` | The local policy differs from the bundled template.               | Review the local text. Treat it as a repo decision, not an error.                                                    |
| `missing`  | A bundled policy template has no matching local file.             | Decide whether the repo needs that policy. Run `agentloop init` only if you want to restore missing generated files. |
| `extra`    | The repo has a policy file that is not bundled with AgentLoopKit. | Keep it if it captures repo-specific rules. Review it like any other policy file.                                    |

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
