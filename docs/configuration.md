# Configuration

AgentLoopKit stores repo settings in `agentloop.config.json`.

The package ships a JSON schema:

```text
schema/agentloop.config.schema.json
```

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

`doctor` validates `agentloop.config.json` with the same rules used by the CLI.
