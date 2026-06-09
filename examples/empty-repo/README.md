# Empty Repo Example

AgentLoopKit also works in repositories before a language stack is chosen.

`doctor` will warn when no tests, package manager, or build commands are configured.

Start with a task contract:

```bash
agentloop init
agentloop create-task --type feature --title "Choose project stack" \
  --acceptance "Stack decision is recorded" \
  --acceptance "Initial verification command is documented" \
  --verification "agentloop doctor"
```

As tooling appears, update `agentloop.config.json` with real commands. Until then, use explicit one-off checks:

```bash
agentloop verify --command "agentloop doctor"
```
