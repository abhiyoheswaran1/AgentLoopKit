# Configuration

AgentLoopKit stores repo settings in `agentloop.config.json`.

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

Run this before writing files:

```bash
agentloop init --dry-run
```

Then initialize:

```bash
agentloop init
```

`doctor` validates `agentloop.config.json` with the same rules used by the CLI. It also checks `.agentloop/manifest.json` and points stale or missing template metadata to `template-migrations.md`.
