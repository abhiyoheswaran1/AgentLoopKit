# Commands

Detected during AgentLoopKit init:

- Test: npx pnpm@10.12.1 test
- Lint: npx pnpm@10.12.1 lint
- Typecheck: npx pnpm@10.12.1 typecheck
- Build: npx pnpm@10.12.1 build
- Format: npx pnpm@10.12.1 format
- Repo health: npx projscan doctor --format markdown

Rules:

- Use `agentloop task list` to inspect task contracts before pinning one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop task archive <path>` only after verification and handoff are complete.
- Use `agentloop status` to inspect active task, latest report, dirty files, and next action.
- Use `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` to inspect local safety guidance and template drift before risky edits.
- Follow local `.agentloop/policies/*.md` files as repo policy. Treat `modified` as a reviewed local rule, not an error.
- Use `agentloop report` after verification and handoff when reviewers need one local HTML evidence artifact.
- Use `agentloop badge` when reviewers or CI need a local SVG evidence badge.
- Use `agentloop ci-summary --write` in CI when reviewers need a compact provenance and evidence summary.
- Run targeted checks while developing.
- Run configured verification before claiming completion.
- Dogfood projscan during implementation work in this repository.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.

## CI Usage

Use `agentloop ci-summary --write` after verification and handoff when CI should upload one compact Markdown summary of CI provenance, AgentLoop evidence, and gate status. It does not run checks or replace the verification report.
