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
