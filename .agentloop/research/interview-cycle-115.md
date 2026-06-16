# Interview Cycle 115

## Context

AgentLoopKit now preserves same-minute generated Markdown evidence and PR-description drafts. A follow-up writer audit found that generated `agentloop report` HTML exports still used an exact timestamped path, so a quick rerun could replace the prior browser-readable report.

This is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Open Source Maintainer
- Claude Code Power User
- Platform Engineer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal was consistency. If AgentLoopKit treats local evidence as auditable, generated HTML reports should follow the same preservation rule as Markdown evidence. Explicit `--out` paths should stay exact because scripts may rely on stable filenames.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: HTML reports give reviewers one browser-readable artifact.
- What confused them: Generated reports being replaceable while generated Markdown evidence is preserved.
- What they would need before using it: Consistent artifact history across report types.
- What would make them recommend/star it: Evidence behavior that is conservative by default.
- What would make them abandon it: Review artifacts disappearing after command reruns.

### Claude Code Power User

- What they liked: `agentloop report` is useful after verify, handoff, and ship.
- What confused them: Agents can rerun commands inside the same minute, so timestamp paths are not unique enough.
- What they would need before using it: Safe reruns that do not require remembering cleanup rules.
- What would make them recommend/star it: The tool handling autonomous retry behavior naturally.
- What would make them abandon it: Losing the first report after an agent retry.

### Platform Engineer

- What they liked: The fix uses the same allocator as other generated artifacts.
- What confused them: Whether this should also change badge behavior.
- What they would need before using it: Stable badge filenames should remain stable; HTML evidence can be versioned.
- What would make them recommend/star it: Clear distinction between evidence snapshots and status assets.
- What would make them abandon it: New global state or retention automation for a filename problem.

### AI-Skeptical Senior Engineer

- What they liked: Regression tests prove the bug and the explicit `--out` boundary.
- What confused them: Why a review evidence tool did not catch this class earlier.
- What they would need before using it: Continued boring fixes that improve inspectability.
- What would make them recommend/star it: Deterministic, local evidence preservation.
- What would make them abandon it: Product claims without artifact safety.

## Product council debate

- Abhi: This strengthens the acceptance-layer wedge without adding surface area.
- Maya: Keep it scoped to generated defaults and preserve explicit `--out`.
- Elias: Public docs need one sentence. Do not turn it into a feature announcement.
- Nora: Use the same suffix example users see in other commands.
- Samir: Evidence should be preserved by default.
- Lina: Rerun-safe artifact writers are important in long agent sessions.
- Tom: This is concrete value and easy to verify.
- Rachel: Consistent evidence history helps team review later.

## Decision

Change default generated `agentloop report` HTML output to allocate a numeric suffix when the minute-based path already exists.

## Non-decisions

- Do not change explicit `--out` behavior.
- Do not change badge output behavior.
- Do not add retention or cleanup automation.
- Do not change report HTML contents or metadata shape.
- Do not release or publish.

## Resulting tasks

- Add a regression test for same-minute generated HTML report preservation.
- Add a regression test that explicit `--out` stays exact.
- Use the existing collision-safe output artifact allocator for generated HTML report paths.
- Update public docs, changelog, dogfood log, and backlog.
- Run focused, static, full, and dogfood verification.

## Success criteria

- The first generated HTML report remains intact after a same-minute rerun.
- The second generated HTML report gets a deterministic numeric suffix.
- Explicit `--out` writes exactly where requested.
- Tests and dogfood gates pass.
