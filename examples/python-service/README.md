# Python Service Example

This example shows AgentLoopKit artifacts for a Python service.

Configure commands in `agentloop.config.json`, for example:

```json
{
  "commands": {
    "test": "pytest",
    "lint": "ruff check .",
    "typecheck": "mypy .",
    "build": "",
    "format": "ruff format ."
  }
}
```

Task contract starter:

```bash
agentloop create-task --type refactor --title "Extract billing client" \
  --likely-file src/billing \
  --likely-file tests/billing \
  --forbidden-file migrations \
  --acceptance "Billing tests cover success and failure responses" \
  --acceptance "Public service interface stays compatible" \
  --verification "pytest" \
  --verification "ruff check ." \
  --verification "mypy ."
```

Extra care:

- migrations
- secrets handling
- background jobs
- external service clients
- deployment manifests
