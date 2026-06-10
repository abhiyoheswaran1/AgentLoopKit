# Interview Cycle 82

## Context

GitHub release `v0.21.0` is public, npm still serves `0.1.1`, and the next meaningful repo-local improvement should not depend on external npm authentication. Verification reports already keep first and last output excerpts, but failed reports still make reviewers scan command sections to find the actionable lines.

This cycle is internal simulated feedback for product judgment. It is not real user research.

## Personas interviewed

- Skeptical Senior Developer
- Power User / Agentic Engineer
- Startup CTO
- Security Reviewer
- Developer Experience Designer

## Feedback summary

The strongest signal was failure readability. Users trust a tool more when failed verification reports show the failing command and useful final output lines without hiding raw evidence.

## Raw simulated feedback

### Skeptical Senior Developer

- What they liked: AgentLoopKit does not pretend failed checks passed.
- What confused them: A failed report can still require scanning long logs.
- What they would need before using it: A short failure summary above the full output.
- What would make them recommend/star it: Reports that make review faster without adding AI diagnosis.
- What would make them abandon it: Summaries that guess root cause or omit raw output.

### Power User / Agentic Engineer

- What they liked: `agentloop next` already points back to verification after failed reports.
- What confused them: The next agent still needs to find the failing line.
- What they would need before using it: Tail lines near the failure copied into a predictable section.
- What would make them recommend/star it: Failed reports that survive context resets.
- What would make them abandon it: Tool-specific parsers that break across projects.

### Startup CTO

- What they liked: Verification reports create review evidence for teams.
- What confused them: Whether a manager or reviewer can skim the failure.
- What they would need before using it: Clear failed-command status in the report.
- What would make them recommend/star it: Junior engineers and agents can hand off failures cleanly.
- What would make them abandon it: A noisy report format.

### Security Reviewer

- What they liked: Current reports avoid hidden network calls and env dumps.
- What confused them: Whether summaries might accidentally leak more output.
- What they would need before using it: Use the same captured command output, with no extra file reads.
- What would make them recommend/star it: Deterministic excerpts and unchanged raw output.
- What would make them abandon it: Secret scanning claims or broad environment inspection.

### Developer Experience Designer

- What they liked: The existing report structure is simple.
- What confused them: Failure evidence is buried below metadata.
- What they would need before using it: A `Failure Summary` section before `Commands Run`.
- What would make them recommend/star it: One screen shows what failed and why the next step is `verify`.
- What would make them abandon it: Extra headings on passing reports.

## Product council debate

- Abhi: "This makes the core loop more useful without becoming a diagnostic bot."
- Maya: "Keep it a renderer change. No parser framework."
- Elias: "This improves review trust and README claims."
- Nora: "Put the summary before command output so users see it fast."
- Samir: "Do not read more files or print more environment data."
- Lina: "Tail lines help the next agent resume after context loss."
- Tom: "Do not guess. Show command, exit code, and output lines."
- Rachel: "This is useful team evidence without adding process weight."

## Decision

Add a deterministic `Failure Summary` section only for failed reports. Include failed command, exit code, and final non-empty output lines. Keep the existing full command output excerpt.

## Non-decisions

- Do not add AI diagnosis.
- Do not parse framework-specific stack traces.
- Do not add severity scoring.
- Do not add network calls or upload logs.

## Resulting tasks

- Add failing test coverage for failed report summaries.
- Implement a small summary renderer in `src/core/verification.ts`.
- Update README and verification docs.
- Run focused and full verification.

## Success criteria

- Failed reports include `## Failure Summary`.
- Passing and not-run reports do not include failure summary noise.
- Full output excerpts remain available.
- Vitest, typecheck, lint, link check, and projscan pass.
