# Interview Cycle 45

Internal simulated feedback. Do not present this as real user research.

## Context

While dogfooding the `0.11.0` release, `agentloop create-task --json` failed because `create-task` did not expose a JSON option. Other task lifecycle commands already support JSON output, and agents benefit from stable machine-readable command results.

## Personas interviewed

- Power User / Agentic Engineer
- Developer Experience Designer
- Open Source Maintainer
- AI-Skeptical Senior Developer

## Feedback summary

The strongest signal is CLI consistency. `create-task` is the entry point for task contracts, so agents should be able to consume its result without parsing prose.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: Task commands already return JSON for list, show, set, status, archive, current, and clear.
- What confused them: The command that creates the task is the one that lacks JSON.
- What they would need before using it: `create-task --json` with the path and Markdown content.
- What would make them recommend/star it: Agents can create a task and immediately pin or inspect the returned path.
- What would make them abandon it: A breaking change to the default human-readable output.

### Developer Experience Designer

- What they liked: Default text output is concise.
- What confused them: JSON exists on nearby commands but not here.
- What they would need before using it: Keep text output unchanged and add JSON as opt-in.
- What would make them recommend/star it: A stable shape: `{ "task": { "path": "...", "markdown": "..." } }`.
- What would make them abandon it: A redesign of interactive prompts in the same change.

### Open Source Maintainer

- What they liked: This is a small, testable CLI compatibility fix.
- What confused them: Whether absolute paths leak into JSON output.
- What they would need before using it: Preserve the current returned path semantics, then document the shape.
- What would make them recommend/star it: Focused tests and no new dependency.
- What would make them abandon it: Adding a task database or state write.

### AI-Skeptical Senior Developer

- What they liked: This removes brittle text parsing.
- What confused them: Why this was not supported from the start.
- What they would need before using it: Proof the default output still works.
- What would make them recommend/star it: Deterministic output without LLM involvement.
- What would make them abandon it: Over-claiming the feature as automation magic.

## Product council debate

- Abhi: Build it; this helps agents and release automation.
- Maya: Keep it in the CLI command only; no core API change is needed.
- Elias: Document the flag in README and task-contract docs.
- Nora: Make JSON opt-in and leave the existing success line alone.
- Samir: Do not add any file reads beyond the created Markdown already returned by core.
- Lina: This makes autonomous sessions less brittle.
- Tom: This is practical value, not AI ceremony.
- Rachel: Consistent JSON shapes help teams script the workflow later.

## Decision

Add `agentloop create-task --json` as an opt-in machine-readable output. It returns the created task path and Markdown content. Leave default text output unchanged.

## Non-decisions

- Do not redesign interactive prompts.
- Do not add task state changes.
- Do not alter task contract Markdown format.
- Do not add a database or schema migration.

## Resulting tasks

- Add a failing Vitest test for `create-task --json`.
- Implement the JSON option in `src/cli/commands/create-task.ts`.
- Update README and task-contract docs.
- Verify with focused and full tests.

## Success criteria

- `agentloop create-task --json` prints valid JSON.
- JSON includes the created task path and Markdown content.
- Default output remains `Task contract created: <path>`.
- No new dependency is added.
