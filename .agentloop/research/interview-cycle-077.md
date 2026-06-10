# Interview Cycle 77

## Context

AgentLoopKit can generate verification reports, handoffs, HTML reports, badges, and strict gate checks. GitHub Actions recipes upload those artifacts, but reviewers still need a small CI log summary that ties provenance, AgentLoop evidence, and gate status together.

## Personas interviewed

- Startup CTO
- Platform Engineer
- Open Source Maintainer
- Power User / Agentic Engineer
- Security Reviewer

## Feedback summary

The strongest signal is CI readability. Teams can upload many artifacts, but CI logs need one compact summary with run provenance, verification status, gate status, and next action. The command must stay local and read-only. It should not call GitHub APIs, post PR comments, read secrets, or run verification commands.

## Raw simulated feedback

### Startup CTO

- What they liked: AgentLoopKit already creates evidence a reviewer can inspect.
- What confused them: CI artifacts can be hard to scan quickly.
- What they would need before using it: A short CI summary in logs or as an uploaded Markdown artifact.
- What would make them recommend/star it: A clear path from CI run to task, verification, handoff, and gates.
- What would make them abandon it: A cloud dashboard before the local workflow earns trust.

### Platform Engineer

- What they liked: Existing GitHub Actions recipes avoid branch mutation.
- What confused them: Teams need a compact output for CI systems beyond GitHub.
- What they would need before using it: JSON output and a generic `CI=true` fallback.
- What would make them recommend/star it: Provider-agnostic behavior with no tokens.
- What would make them abandon it: GitHub-only API calls or token requirements.

### Open Source Maintainer

- What they liked: Gate checks make review expectations explicit.
- What confused them: Uploaded files can be missed in a busy PR.
- What they would need before using it: A short Markdown summary that can appear in CI logs.
- What would make them recommend/star it: Evidence paths and pass/fail state in one place.
- What would make them abandon it: PR comment automation that spams contributors.

### Power User / Agentic Engineer

- What they liked: Agents can already run `verify`, `handoff`, and `check-gates`.
- What confused them: Long autonomous sessions produce several artifacts.
- What they would need before using it: A deterministic command that summarizes the current session without running new commands.
- What would make them recommend/star it: JSON output for scripts and Markdown for humans.
- What would make them abandon it: CI summary artifacts replacing verification reports.

### Security Reviewer

- What they liked: Verification reports already use an allowlist for CI metadata.
- What confused them: New CI features often drift toward token access.
- What they would need before using it: A guarantee that the command reads only allowlisted provenance and local files.
- What would make them recommend/star it: No provider API calls, secret reads, uploads, or arbitrary env dumps.
- What would make them abandon it: Hidden network calls or broad environment scanning.

## Product council debate

- Abhi: This improves the team workflow without becoming a dashboard.
- Maya: Put artifact selection behind filename patterns so CI summaries do not replace verification reports.
- Elias: Add docs and examples for GitHub Actions, but keep the command useful outside GitHub.
- Nora: Make Markdown useful by default and JSON available for scripts.
- Samir: Block API calls, token reads, secret printing, and hidden uploads.
- Lina: Include active task, verification, handoff, gates, and next action.
- Tom: Do not call this compliance. It summarizes evidence; reviewers still review.
- Rachel: This is a credible team-value feature without SaaS scope.

## Decision

Add `agentloop ci-summary` with Markdown output, `--json`, and `--write`. It reads allowlisted CI metadata through the existing detection path, loads local AgentLoop evidence, includes gate status, and writes `.agentloop/reports/YYYY-MM-DD-HH-mm-ci-summary.md` only when requested. Verification consumers must keep reading `*-verification-report.md`.

## Non-decisions

- No GitHub API import.
- No PR comment automation.
- No dashboard.
- No telemetry.
- No token reads.
- No command execution from `ci-summary`.

## Resulting tasks

- Add core CI summary generation.
- Add CLI command registration and shell completions.
- Add tests for GitHub Actions, generic CI, JSON output, file writing, and verification-report lookup isolation.
- Update README, CI docs, examples, generated harness templates, roadmap, changelog, release docs, backlog, dogfood log, and final handoff.
- Bump package metadata to `0.19.0`.
- Refresh the VHS README terminal demo.

## Success criteria

- `agentloop ci-summary --json --write` returns CI context, evidence paths, gate status, next action, and a written path.
- A newer `*-ci-summary.md` does not change `status`, `check-gates`, `report`, `badge`, or `handoff` verification lookup.
- The command makes no network calls, reads no secrets, and runs no verification commands.
- Tests, typecheck, build, link checks, projscan, package dry-run, packed tarball smoke, and CI pass.
