# Interview Cycle 66

## Context

AgentLoopKit now creates task contracts, verification reports, handoffs, gate checks, local HTML evidence reports, and README visuals. The current public blocker remains npm publishing authorization, but repo-local product polish can continue.

This cycle is internal simulated feedback only. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- Small Team CTO
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is that local reports are useful, but users still need a tiny status artifact for README snippets, CI artifacts, and PR descriptions. The panel rejected remote badge endpoints and hosted status services. The aligned version is a local SVG badge generated from existing verification or gate evidence.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: The README now shows the workflow and HTML evidence artifact.
- What confused them: Whether a project can show AgentLoop evidence status without linking to a long report.
- What they would need before using it: A local SVG badge that can be committed or uploaded as an artifact.
- What would make them recommend/star it: A badge command that does not depend on shields.io or any hosted service.
- What would make them abandon it: Badges that imply success without a real verification report.

### Platform Engineer

- What they liked: `check-gates --strict` and `report` are CI-friendly.
- What confused them: Which status a badge should represent when verification and gates disagree.
- What they would need before using it: Explicit `--source verification` and `--source gates` modes.
- What would make them recommend/star it: Machine-readable output and deterministic paths.
- What would make them abandon it: A command that runs tests unexpectedly.

### Small Team CTO

- What they liked: Local reports create review evidence without buying a tool.
- What confused them: How to tell at a glance whether the agent loop is healthy on a PR.
- What they would need before using it: A small artifact that can sit next to the HTML report.
- What would make them recommend/star it: Badge output that is simple enough for non-experts to understand.
- What would make them abandon it: Anything that starts to look like a dashboard roadmap too early.

### Power User / Agentic Engineer

- What they liked: The final report command gives agents a clean stopping ritual.
- What confused them: Whether badges should be generated before or after handoff.
- What they would need before using it: A command agents can run after `verify`, `handoff`, and `check-gates`.
- What would make them recommend/star it: Local SVG output and compact JSON.
- What would make them abandon it: Another task lifecycle command that mutates task status.

### AI-Skeptical Senior Engineer

- What they liked: The product remains deterministic and local.
- What confused them: Whether a badge is meaningful or just decoration.
- What they would need before using it: Clear wording that badges mirror evidence and do not replace review.
- What would make them recommend/star it: Badge labels that say `verification pass`, `verification fail`, or `gates warn` plainly.
- What would make them abandon it: A green badge when no verification report exists.

## Product council debate

- Abhi: This is a small launch-polish feature that helps GitHub adoption without changing the core product.
- Maya: Keep it dependency-free. One renderer, one command, no badge service, no parser.
- Elias: A local badge helps README trust, but docs must say it mirrors evidence.
- Nora: The default should work with no flags: `agentloop badge`.
- Samir: Do not run tests. Escape SVG text. Do not read `.env`.
- Lina: Add `--source gates` because agents already run `check-gates`.
- Tom: Missing evidence should produce a warning-colored badge, not a pass.
- Rachel: CI artifact upload can include SVG next to Markdown and HTML reports.

## Decision

Add `agentloop badge` to write a local SVG badge. Default source is latest verification report. `--source gates` reads current local gate status without running verification commands. `--json` returns path, source, status, label, and message without embedding SVG contents.

## Non-decisions

- No hosted badge endpoint.
- No shields.io dependency.
- No command execution from `agentloop badge`.
- No badge matrix.
- No dashboard.
- No package version bump in this cycle.

## Resulting tasks

- Add failing badge tests for SVG escaping, verification badge output, and gate-source output.
- Implement `src/core/badge.ts`.
- Implement `src/cli/commands/badge.ts`.
- Register the command and shell completions.
- Update README, docs, GitHub Actions examples, harness templates, backlog, dogfood log, and final handoff.

## Success criteria

- `agentloop badge` writes `.agentloop/reports/agentloop-verification.svg` by default.
- `agentloop badge --source gates` writes `.agentloop/reports/agentloop-gates.svg`.
- Missing or failing evidence does not produce a pass badge.
- Badge text is SVG-escaped.
- Tests, typecheck, build, link check, projscan, and CI pass.
