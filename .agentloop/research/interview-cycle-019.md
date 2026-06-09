# Interview Cycle 19

## Context

Cycle 17 fixed repeated non-interactive `create-task` list flags. While recording that cycle, the product panel found another task-contract gap: the CLI could not set likely files or files not to touch without using the interactive prompt, even though those fields are central to the Specify and Constrain steps.

This is simulated/internal product-panel output, not real user research.

## Personas interviewed

- Power User / Agentic Engineer
- Developer Experience Designer
- Open Source Maintainer
- AI-Skeptical Senior Developer
- Principal Engineer

## Feedback summary

The strongest signal is scriptable scoping. Agents and maintainers need non-interactive task contracts that include likely files and protected areas. Without those flags, automated task creation misses two fields that keep changes focused.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: Repeated flags now preserve all values.
- What confused them: They still could not pass likely files from a command.
- What they would need before using it: Non-interactive task creation should cover all core scoping fields.
- What would make them recommend/star it: Copy-pasteable task commands for agent sessions.
- What would make them abandon it: Having to open an editor for every task contract.

### Developer Experience Designer

- What they liked: The flags map directly to visible task sections.
- What confused them: `--likely-file` and `--forbidden-file` did not exist before.
- What they would need before using it: Short docs examples.
- What would make them recommend/star it: Task commands that read like a compact contract.
- What would make them abandon it: Long flag names that hide intent.

### Open Source Maintainer

- What they liked: Files not to touch can now be captured in scripted task setup.
- What confused them: No migration concern.
- What they would need before using it: Keep generated Markdown unchanged.
- What would make them recommend/star it: Contributors can include protected areas before coding.
- What would make them abandon it: Flags that silently rewrite existing tasks.

### AI-Skeptical Senior Developer

- What they liked: The change improves reviewability without an LLM.
- What confused them: None after seeing the task contract output.
- What they would need before using it: A test proving the fields land in the right sections.
- What would make them recommend/star it: Better constraints before code changes.
- What would make them abandon it: Process language without actual CLI support.

### Principal Engineer

- What they liked: The core already supports the fields.
- What confused them: The CLI lagged behind the data model.
- What they would need before using it: Add flags without changing task rendering.
- What would make them recommend/star it: Small additive command surface.
- What would make them abandon it: New abstractions for two options.

## Product council debate

- Abhi: This strengthens the product wedge: concrete contracts, not vague process.
- Maya: Add two repeatable flags and no new abstraction.
- Elias: Update README and task-contract docs with one example.
- Nora: The names should match task sections closely.
- Samir: `--forbidden-file` helps protect sensitive areas before agents edit.
- Lina: Agents can now create complete scoped tasks from a single command.
- Tom: Test the actual generated Markdown.
- Rachel: Teams can use this in templates and internal task scripts.

## Decision

Add repeatable `--likely-file` and `--forbidden-file` options to `agentloop create-task`. Map them to existing `likelyFiles` and `forbiddenFiles` task contract fields. Keep the task Markdown format unchanged.

## Non-decisions

- Do not redesign interactive prompts.
- Do not add a task database.
- Do not change generated task section names.
- Do not add aliases until users ask for them.

## Resulting tasks

- Extend the create-task CLI regression test.
- Add the two repeatable options.
- Update README, getting-started docs, task-contract docs, changelog, backlog, dogfood log, and final handoff.
- Run full verification and `projscan`.

## Success criteria

- Repeated `--likely-file` values appear under Likely Files or Areas.
- Repeated `--forbidden-file` values appear under Files or Areas Not to Touch.
- Existing repeatable task flags still pass.
- Full Vitest, typecheck, build, and projscan checks pass.
