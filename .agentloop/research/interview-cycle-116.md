# Interview Cycle 116

Internal simulated feedback and product-panel output. This is not real user research.

## Context

AgentLoopKit already supports agent-specific instruction installation through `agentloop install-agent`. During dogfooding, the team found that rerunning the command could replace an edited `.agentloop/agents/<agent>.md` file. The command should be safe in existing repositories where maintainers have customized local agent guidance.

## Personas interviewed

- Claude Code Power User
- Cursor Developer
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal was safety and trust. Agent instruction files are likely to be edited after setup, so a setup command should not replace them silently. The group still wanted missing `AGENTS.md` references to be appended because that helps agents discover local guidance.

## Raw simulated feedback

### Claude Code Power User

- What they liked: Repo-local agent files make it easy to keep tool-specific instructions close to code.
- What confused them: It was not obvious whether rerunning setup refreshed templates or preserved edits.
- What they would need before using it: Clear skipped/created output and no silent replacement.
- What would make them recommend/star it: Safe reruns across multiple agent tools.
- What would make them abandon it: Losing custom Claude Code instructions.

### Cursor Developer

- What they liked: `AGENTS.md` remains the shared entry point.
- What confused them: Whether Cursor-specific notes are owned by AgentLoopKit after installation.
- What they would need before using it: Confidence that local edits remain local.
- What would make them recommend/star it: Low-friction setup that does not fight IDE workflows.
- What would make them abandon it: Generated files changing unexpectedly after reruns.

### Open Source Maintainer

- What they liked: Safe marker blocks in `AGENTS.md`.
- What confused them: Whether generated agent files should be committed or kept local.
- What they would need before using it: Documentation that says reruns skip existing agent files.
- What would make them recommend/star it: Trustworthy setup behavior for contributor repos.
- What would make them abandon it: A setup command that replaces reviewer instructions.

### AI-Skeptical Senior Engineer

- What they liked: Deterministic file writes are inspectable.
- What confused them: Any behavior that feels like a hidden prompt refresh.
- What they would need before using it: Transparent output and no destructive default.
- What would make them recommend/star it: Boring idempotence and clear evidence.
- What would make them abandon it: Markdown generators that overwrite edited files.

### Platform Engineer

- What they liked: One command can install guidance for several agent tools.
- What confused them: How template updates roll out across many repos.
- What they would need before using it: A safe default with manual upgrade control.
- What would make them recommend/star it: Predictable behavior across large repo sets.
- What would make them abandon it: A merge system that rewrites local policy text incorrectly.

## Product council debate

- Abhi: Preserve the wedge. Setup should feel safe enough to run inside a real repo.
- Maya: Use the existing write-if-missing helper. Do not build a merge engine.
- Elias: Mention the behavior in public docs, but keep it concise.
- Nora: Human output must say whether the file was written or skipped.
- Samir: Silent overwrite is a blocker. Skip by default.
- Lina: Long agent sessions rerun setup. Do not make reruns risky.
- Tom: This is practical value, not methodology fluff.
- Rachel: Teams will customize these files. Safe reruns matter more than auto-refresh.

## Decision

Change `install-agent` so existing `.agentloop/agents/<agent>.md` files are skipped by default. Continue appending missing `AGENTS.md` marker blocks. Report `agentFileStatus` and `agentsMdStatus` in JSON and clear created/skipped language in human output.

## Non-decisions

- Do not add a template merge engine.
- Do not add a `--force` flag yet.
- Do not write third-party agent configuration files.
- Do not change `init` template behavior.
- Do not cut or publish a release.

## Resulting tasks

- Add regression tests for preserving existing agent instruction files.
- Add JSON and human-output tests for skipped files.
- Update `install-agent` core behavior and CLI output.
- Update README, CLI reference, changelog, decision log, backlog, and dogfood log.
- Run focused, static, full, and dogfood verification.

## Success criteria

- Existing `.agentloop/agents/<agent>.md` content survives a rerun.
- Missing agent files are still created.
- Missing `AGENTS.md` references are still appended.
- JSON output reports created/skipped state.
- Human output is clear enough for a maintainer to trust the rerun.
