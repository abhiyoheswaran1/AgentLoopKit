# Interview Cycle 16

## Context

AgentLoopKit already had deterministic `summarize` and a `status` command that suggested `agentloop summarize --write` when a task, verification report, and dirty working tree existed. The product panel reviewed the final loop step after npm publishing remained blocked by npm-side authorization.

This is simulated/internal product-panel output, not real user research.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Developer Experience Designer

## Feedback summary

The strongest signal: the command for the final loop step should use the word users already see in the methodology. `summarize --write` is accurate, but `handoff` maps to the loop and gives agents a clearer next action.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: `status` tells them what to do next.
- What confused them: The loop says handoff, but the command says summarize.
- What they would need before using it: One obvious command after `verify`.
- What would make them recommend/star it: A command sequence they can remember after one read.
- What would make them abandon it: Extra ceremony for creating a PR note.

### Claude Code Power User

- What they liked: Deterministic output works across agents.
- What confused them: Whether `summarize` writes a file or only prints.
- What they would need before using it: Stable command names that can be pasted into agent instructions.
- What would make them recommend/star it: `agentloop handoff` as the default final step.
- What would make them abandon it: A second summary implementation with different behavior.

### Open Source Maintainer

- What they liked: Handoff files are review artifacts, not model output.
- What confused them: `summarize --write` sounds optional, even when maintainers want a required handoff.
- What they would need before using it: README and PR docs that name the handoff command.
- What would make them recommend/star it: Consistent language in CLI, docs, and generated harness files.
- What would make them abandon it: A command that rewrites history or modifies source files.

### AI-Skeptical Senior Engineer

- What they liked: The command stays deterministic.
- What confused them: No concern if `handoff` is just an alias.
- What they would need before using it: Proof that `summarize` remains read-only by default.
- What would make them recommend/star it: Tests that lock both behaviors.
- What would make them abandon it: Hidden LLM summary generation.

### Developer Experience Designer

- What they liked: The loop can now read `create-task`, `verify`, `handoff`.
- What confused them: Repeated `create-task --constraint` flags collapsed while dogfooding.
- What they would need before using it: Backlog follow-up for repeated option accumulation.
- What would make them recommend/star it: `status` suggesting `handoff` at the right moment.
- What would make them abandon it: CLI wording that makes the last step feel optional.

## Product council debate

- Abhi: This protects the wedge. It makes the loop easier to explain without adding a platform.
- Maya: Reuse the summary core. Do not create parallel behavior.
- Elias: Update README, generated README, and PR summary docs together.
- Nora: `handoff` should write by default. Preview belongs to `summarize`.
- Samir: Keep the command local and deterministic. No network, no credential access.
- Lina: Agents can follow `agentloop status` better if it returns `agentloop handoff`.
- Tom: The alias is useful only if tests prove `summarize` remains read-only.
- Rachel: This helps teams standardize the last step without adding process weight.

## Decision

Add `agentloop handoff` as a write-by-default command that reuses `summarizeRepository`. Keep `agentloop summarize` read-only unless `--write` is passed. Update `agentloop status` to suggest `agentloop handoff` after passing verification evidence exists and the working tree has changes.

## Non-decisions

- Do not create a static dashboard.
- Do not add LLM-generated summaries.
- Do not remove `agentloop summarize --write`.
- Do not fix repeated `create-task` option accumulation in this cycle.

## Resulting tasks

- Add CLI coverage for `agentloop handoff`.
- Add a regression guard for read-only `agentloop summarize`.
- Update status next action.
- Update README, getting-started docs, PR summary docs, status docs, and generated workspace README template.
- Prepare `0.3.0` on `main` because this behavior lands after the public `v0.2.1` tag.
- Add repeated `create-task` flag accumulation as a later backlog item.

## Success criteria

- `agentloop handoff --json` writes a handoff file and returns `outPath`.
- `agentloop summarize --json` does not write a handoff file.
- `agentloop status --json` suggests `agentloop handoff` for the final loop step.
- Full Vitest, typecheck, build, and projscan checks pass.
