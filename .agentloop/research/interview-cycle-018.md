# Interview Cycle 18

## Context

Cycle 16 dogfooding showed that `agentloop handoff` selected an older same-day task when no `--task` path was provided. `status` and `summarizeRepository` both selected Markdown artifacts by filename sort. AgentLoopKit task filenames include only the date and slug, so same-day task order can disagree with creation order.

This is simulated/internal product-panel output, not real user research.

## Personas interviewed

- Power User / Agentic Engineer
- Developer Experience Designer
- Open Source Maintainer
- Principal Engineer
- AI-Skeptical Senior Developer

## Feedback summary

The strongest signal is orientation quality. Agents trust `status` and `handoff` to use the current work item. Selecting an older same-day task can produce a misleading handoff, so latest artifact detection should use local filesystem recency instead of slug order.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: Explicit `--task` works as an escape hatch.
- What confused them: The default picked an older same-day task.
- What they would need before using it: Defaults should match the last task they touched.
- What would make them recommend/star it: Reliable `status` before long agent sessions.
- What would make them abandon it: Handoffs tied to the wrong task.

### Developer Experience Designer

- What they liked: The fix can stay invisible.
- What confused them: Date-only filenames look chronological but are not enough for same-day work.
- What they would need before using it: `status` and `handoff` should agree on active task selection.
- What would make them recommend/star it: Fewer surprising defaults.
- What would make them abandon it: Extra flags for common flows.

### Open Source Maintainer

- What they liked: README files already stay out of artifact selection.
- What confused them: Whether mtime is portable enough.
- What they would need before using it: Filename tie-breaker for deterministic behavior.
- What would make them recommend/star it: Reviewer summaries tied to the latest changed task.
- What would make them abandon it: Hidden state file or task database added too early.

### Principal Engineer

- What they liked: `status` and PR summary had duplicate latest-file logic that can be shared.
- What confused them: No concern after seeing the duplicate helper.
- What they would need before using it: One helper with tests through public behavior.
- What would make them recommend/star it: Small shared utility, no broad refactor.
- What would make them abandon it: Task lifecycle work bundled into recency selection.

### AI-Skeptical Senior Developer

- What they liked: The failing test shows the exact wrong task title.
- What confused them: None after the mtime rule was explicit.
- What they would need before using it: Deterministic fallback when mtimes match.
- What would make them recommend/star it: Honest handling of a boring edge case.
- What would make them abandon it: Claiming task intelligence without reliable defaults.

## Product council debate

- Abhi: Fix the default. Wrong task context hurts the product story.
- Maya: Use a shared helper and keep the scope to artifact selection.
- Elias: Changelog should mention latest artifact detection, but avoid overexplaining filesystem details.
- Nora: Users should not need `--task` for the normal latest-task flow.
- Samir: mtime does not read file contents beyond existing Markdown artifacts. No new risk.
- Lina: Long agent sessions need `status` and `handoff` to agree.
- Tom: The regression test must put filename order against mtime order.
- Rachel: This helps team workflows without adding process weight.

## Decision

Select latest Markdown artifacts by modification time, ignore `README.md`, and use filename order as a deterministic tie-breaker. Share the helper between status and PR summary generation.

## Non-decisions

- Do not add a task database.
- Do not add task lifecycle state in this cycle.
- Do not change task filenames.
- Do not require users to pass `--task` for normal handoffs.

## Resulting tasks

- Add failing status coverage for same-day task files where filename order disagrees with mtime.
- Add failing PR summary coverage for the same condition.
- Add a shared latest Markdown artifact helper.
- Update changelog, backlog, dogfood log, and final handoff.

## Success criteria

- `agentloop status --json` reports the newest modified task.
- `agentloop handoff`/summary defaults use the newest modified task context.
- README files remain ignored.
- Full Vitest, typecheck, build, and projscan checks pass.
