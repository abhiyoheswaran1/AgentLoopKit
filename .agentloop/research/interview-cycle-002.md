# Interview Cycle 2

## Context

Cycle 1 added a generated `.agentloop/README.md` and improved first-run orientation. This cycle focuses on agent compatibility and generated instructions.

## Personas interviewed

- Claude Code Power User
- Cursor Developer
- Platform Engineer
- Power User / Agentic Engineer

## Feedback summary

Agent-specific files are useful, but multi-agent users do not want to run seven separate install commands. The product should make broad compatibility easy while still keeping generated instructions transparent.

## Raw simulated feedback

### Claude Code Power User

- Liked: task contracts and verification reports.
- Confused: whether `install-agent` should be repeated for each tool.
- Needs before using it: a way to install all common instructions.
- Would recommend/star: if it fits alongside existing skill systems.
- Would abandon: if it fights existing Claude Code setup.

### Cursor Developer

- Liked: `AGENTS.md` integration.
- Confused: where Cursor-specific instructions should live.
- Needs before using it: generated guidance that can be linked from IDE rules.
- Would recommend/star: if setup stays inside the repo.
- Would abandon: if it requires a separate app.

### Platform Engineer

- Liked: policies, gates, and harness files.
- Confused: how to standardise across several agent tools.
- Needs before using it: one command for common agent instructions.
- Would recommend/star: if platform teams can roll it into starter repos.
- Would abandon: if every repo needs manual agent setup.

### Power User / Agentic Engineer

- Liked: compatibility across Codex, Claude Code, Cursor, OpenCode, Gemini CLI, and Copilot CLI.
- Confused: why there is no bulk install.
- Needs before using it: lower ceremony for multi-agent workflows.
- Would recommend/star: if it makes long sessions more disciplined.
- Would abandon: if instructions are too generic to help.

## Product council debate

- Abhi: "Agent compatibility is a headline. Add `install-agent all`."
- Maya: "Loop through existing templates. Keep it simple."
- Elias: "Bulk install is easy to explain in README."
- Nora: "The command should print a count and next step."
- Samir: "Safe as long as it only writes transparent Markdown."
- Lina: "This matches how power users actually work."
- Tom: "This is practical. It saves commands."
- Rachel: "Useful for teams standardising repo setup."

## Decision

Add `agentloop install-agent all`.

## Non-decisions

- Do not create third-party hidden config files without certainty.
- Do not claim exact support for external conventions not implemented.
- Do not add agent detection.

## Resulting tasks

- Add `installAllAgentInstructions`.
- Update CLI to accept `all`.
- Add tests.
- Update README.

## Success criteria

- `install-agent all` writes all bundled agent files.
- `AGENTS.md` references all bundled agent instructions.
- Existing single-agent behavior still works.
