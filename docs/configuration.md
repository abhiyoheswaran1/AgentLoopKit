# Configuration

AgentLoopKit stores repo settings in `agentloop.config.json`.

`agentloop init` writes this file into the current directory. After that, repo commands search upward from the shell's current folder for the nearest `agentloop.config.json` and use that folder as the AgentLoop root. This keeps nested command sessions tied to the initialized root instead of creating `.agentloop/` folders inside `src/`, `packages/web/`, or other child directories.

The package ships a JSON schema:

```text
schema/agentloop.config.schema.json
```

Generated configs use the GitHub raw URL for editor `$schema` support:

```text
https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json
```

The CLI validates config with its packaged TypeScript schema. It does not fetch this URL at runtime.

AgentLoopKit is registered in SchemaStore for `agentloop.config.json`: <https://github.com/SchemaStore/schemastore/pull/5783>. Editors that use SchemaStore can discover the schema automatically, and generated configs still include the `$schema` URL for clarity.

Generated template provenance lives in `.agentloop/manifest.json`, not in `agentloop.config.json`. This keeps existing configs valid when generated harness templates evolve.

The config controls:

- project name, type, and package manager
- generated path locations
- verification commands
- safety settings
- summary settings

Path values under `paths` must be local repo-relative paths. AgentLoopKit rejects:

- absolute paths, including POSIX and UNC-style paths
- Windows drive-qualified paths such as `C:\agentloop\reports` or `C:agentloop\reports`
- parent traversal segments such as `../outside` or `.agentloop/../outside`
- null bytes

This keeps generated task contracts, verification reports, handoffs, and harness files tied to the repository where the CLI is running.

AgentLoopKit also resolves existing symlinks before writing generated task, report, and handoff artifacts. A repo-relative path such as `.agentloop/reports` is rejected when it points outside the current repo through a symlink.

Run this before writing files:

```bash
agentloop init --dry-run
```

Then initialize:

```bash
agentloop init
```

`doctor` validates `agentloop.config.json` with the same rules used by the CLI. Malformed JSON and schema-invalid values are both reported as invalid AgentLoopKit config. Commands that support `--json` return `CONFIG_ERROR` for those failures.

`doctor` also checks `.agentloop/manifest.json` and points stale or missing template metadata to `template-migrations.md`.
