# Docs-Only Example

This example shows AgentLoopKit for a documentation repository.

Agents should verify commands and links when docs mention them.

Command starter:

```json
{
  "commands": {
    "test": "",
    "lint": "npx markdownlint-cli2 \"**/*.md\"",
    "typecheck": "",
    "build": "npx prettier --check \"**/*.md\"",
    "format": "npx prettier --write \"**/*.md\""
  }
}
```

Task contract starter:

```bash
agentloop create-task --type docs --title "Document release process" \
  --likely-file docs \
  --likely-file README.md \
  --acceptance "Release steps include verification and rollback notes" \
  --acceptance "Links resolve locally" \
  --verification "npx markdownlint-cli2 \"**/*.md\"" \
  --verification "npx prettier --check \"**/*.md\""
```

Extra care:

- command snippets
- local links
- screenshots
- public claims about adoption or support
