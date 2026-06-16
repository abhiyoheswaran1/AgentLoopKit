# Interview Cycle 113

## Context
AgentLoopKit had already fixed same-minute handoff and ship report collisions. Dogfooding then found the same evidence-loss class in default generated verification reports, CI summaries, and release-note drafts.

## Personas interviewed
- Open Source Maintainer
- Claude Code Power User
- AI-Skeptical Senior Engineer
- Security Reviewer

## Feedback summary
The strongest signal was evidence preservation. Users can rerun local checks several times in one minute during agent work. If a rerun replaces the previous artifact, reviewers lose useful context and agents cannot prove what happened.

## Raw simulated feedback
### Open Source Maintainer
- What they liked: AgentLoopKit keeps evidence as local files reviewers can inspect.
- What confused them: why some commands kept same-minute artifacts while others replaced them.
- What they would need before using it: predictable artifact names and no hidden cleanup.
- What would make them recommend/star it: repeated local runs preserve review history.
- What would make them abandon it: silent evidence replacement.

### Claude Code Power User
- What they liked: verification reports and release notes are easy to paste into handoffs.
- What confused them: why rerunning a command quickly could change the latest report in place.
- What they would need before using it: suffixes for generated artifacts when collisions happen.
- What would make them recommend/star it: safer long-running agent sessions.
- What would make them abandon it: lost verification output after a rerun.

### AI-Skeptical Senior Engineer
- What they liked: deterministic outputs and no LLM dependency.
- What confused them: inconsistent collision behavior across evidence commands.
- What they would need before using it: tests that prove artifacts do not get replaced by default.
- What would make them recommend/star it: boring file semantics that match reviewer expectations.
- What would make them abandon it: a tool that claims auditability while overwriting audit artifacts.

### Security Reviewer
- What they liked: explicit `--out` safety checks already exist.
- What confused them: whether collision handling weakens output-path validation.
- What they would need before using it: default suffix allocation that still rejects unsafe output roots.
- What would make them recommend/star it: no network calls, no token reads, and no destructive cleanup.
- What would make them abandon it: auto-deleting or moving evidence without explicit user action.

## Product council debate
- Abhi: This is in the product wedge. Reviewable agent work needs durable local evidence.
- Maya: Use the existing artifact allocator. Do not add a second naming system.
- Elias: Document the behavior where users look for written artifact paths.
- Nora: Keep the behavior invisible until a collision happens.
- Samir: Preserve explicit output path checks and do not add cleanup automation.
- Lina: Long sessions rerun commands often. Suffixes are the least surprising behavior.
- Tom: Add red-green tests. Auditability fails if the test only checks the returned path.
- Rachel: This improves team trust without adding process overhead.

## Decision
Change default generated `verify`, `ci-summary --write`, and `release-notes --write` paths to allocate suffixes when the generated filename exists.

## Non-decisions
- No release in this task.
- No badge output rename. Badges intentionally refresh stable SVG paths.
- No artifact retention policy.
- No automatic cleanup.
- No GitHub, npm, or CI provider API calls.

## Resulting tasks
- Add regression tests for verification report, CI summary, and release-note collisions.
- Reuse the existing unique artifact allocator for generated default paths.
- Update CLI reference and focused docs.
- Record dogfood evidence and run AgentLoopKit, AgentFlight, and ProjScan checks.

## Success criteria
- Same-minute generated artifacts keep prior evidence and write a suffixed file.
- Explicit output paths keep existing safety semantics.
- Focused tests, typecheck, lint, build, public-doc hygiene, AgentLoopKit verification, AgentFlight, and ProjScan pass.
