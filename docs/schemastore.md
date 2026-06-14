# SchemaStore Support

AgentLoopKit ships a JSON schema for `agentloop.config.json`:

```text
schema/agentloop.config.schema.json
```

Generated configs include the raw GitHub schema URL:

```text
https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json
```

Print the SchemaStore catalog entry:

```bash
agentloop schemastore
agentloop schemastore --json
```

The committed entry lives at:

```text
schema/schemastore/agentloopkit.json
```

Use that JSON when preparing a SchemaStore contribution. AgentLoopKit does not submit the contribution, call GitHub APIs, write files, read tokens, or change package metadata.
