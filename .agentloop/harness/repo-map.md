# Repo Map

Project name: agentloopkit
Project type: typescript-package
Package manager: pnpm

Key files:

- AGENTS.md: agent instructions
- AGENTLOOP.md: methodology and repo loop
- agentloop.config.json: commands and safety settings
- .agentloop/tasks/: task contracts
- .agentloop/reports/: verification reports
- .agentloop/handoffs/: reviewer summaries
- .agentloop/product-panel.md: internal product-team personas for decision support
- .agentloop/user-personas.md: target user personas for simulated review
- .agentloop/research/: simulated research cycles; never present these as real user evidence
- .agentloop/harness/autonomous-dogfooding.md: AgentLoopKit + ProjScan + AgentFlight workflow for this repo
- .agentflight/config.json: local-first AgentFlight session-recorder config

Before changing code, inspect the files directly related to the task. Do not infer behavior from filenames alone.
