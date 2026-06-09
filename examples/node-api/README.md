# Node API Example

This example shows AgentLoopKit artifacts for a Node API.

Command starter:

```json
{
  "commands": {
    "test": "npm test",
    "lint": "npm run lint",
    "typecheck": "npm run typecheck",
    "build": "npm run build",
    "format": "npm run format"
  }
}
```

Task contract starter:

```bash
agentloop create-task --type bugfix --title "Reject invalid API payloads" \
  --likely-file src/routes \
  --likely-file src/validation \
  --forbidden-file migrations \
  --acceptance "Invalid payloads return a 400 response" \
  --acceptance "Existing valid requests still pass" \
  --verification "npm test" \
  --verification "npm run typecheck"
```

High-risk areas:

- auth middleware
- request validation
- database migrations
- deployment config
