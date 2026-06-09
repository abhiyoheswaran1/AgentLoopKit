# Commands

Detected during AgentLoopKit init:

- Test: pnpm run test
- Lint: pnpm run lint
- Typecheck: pnpm run typecheck
- Build: pnpm run build
- Format: pnpm run format
- Repo health: npx projscan doctor --format markdown

Rules:

- Run targeted checks while developing.
- Run configured verification before claiming completion.
- Dogfood projscan during implementation work in this repository.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.
