# Interview Cycle 48

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now supports task creation with JSON output, active task pinning, verification reports, handoffs, task status updates, archive, and release docs. The top remaining product backlog item that fits MVP scope is `agentloop check-gates`: a local command that checks whether an agent has the basic evidence needed before review.

## Personas interviewed

- Power User / Agentic Engineer
- Open Source Maintainer
- AI-Skeptical Senior Developer
- Startup CTO

## Feedback summary

The strongest signal is review readiness. Users do not need a workflow engine; they need a deterministic checklist that says whether task, verification, handoff, harness, policy, and git evidence exist.

## Raw simulated feedback

### Power User / Agentic Engineer

- What they liked: The existing loop already creates the right artifacts.
- What confused them: There is no single command that checks whether those artifacts exist before handoff.
- What they would need before using it: `agentloop check-gates --json` for automation and human output for terminal review.
- What would make them recommend/star it: The command does not run tests or mutate files.
- What would make them abandon it: A generic project-management gate system.

### Open Source Maintainer

- What they liked: Gate checks can help contributors submit reviewable PRs.
- What confused them: Whether warnings fail the command.
- What they would need before using it: Clear pass/warn/fail statuses and nonzero exit only for missing setup or hard failures.
- What would make them recommend/star it: Deterministic output tied to repo files, not AI opinions.
- What would make them abandon it: Overly strict gates that block legitimate work.

### AI-Skeptical Senior Developer

- What they liked: A local evidence checklist is practical.
- What confused them: Why this is different from `doctor`.
- What they would need before using it: `doctor` checks setup; `check-gates` checks work-session evidence.
- What would make them recommend/star it: It catches missing verification or handoff without pretending to review code.
- What would make them abandon it: Vague "quality score" language.

### Startup CTO

- What they liked: This gives teams a lightweight review ritual across repos.
- What confused them: Whether it needs cloud storage for audit logs.
- What they would need before using it: Keep reports local and machine-readable.
- What would make them recommend/star it: CI can run `agentloop check-gates --json` later.
- What would make them abandon it: A dashboard or login requirement.

## Product council debate

- Abhi: Build the local command. It strengthens the wedge without becoming a project-management app.
- Maya: Keep it small and testable. No policy engine or scoring model.
- Elias: Document the difference between `doctor` and `check-gates`.
- Nora: Make terminal output tell users the next missing artifact.
- Samir: Do not execute arbitrary verification commands. Inspect files only.
- Lina: JSON output matters for agent loops.
- Tom: Avoid fake quality claims. Say evidence present or missing.
- Rachel: This is useful for teams, but keep it local.

## Decision

Add `agentloop check-gates` with human and JSON output. It checks work-session evidence only: task contract, verification report, handoff, harness files, policies, and git working tree context. It does not run tests, call an LLM, score quality, or block review by default.

## Non-decisions

- Do not add a policy engine.
- Do not add static HTML report generation.
- Do not add a dashboard, login, telemetry, or cloud store.
- Do not execute verification commands from `check-gates`.

## Resulting tasks

- Add failing Vitest coverage for JSON and human output.
- Implement a small core gate checker.
- Wire `agentloop check-gates`.
- Update README, docs, templates, completions, and final handoff.
- Run focused and full verification.

## Success criteria

- `agentloop check-gates` prints a readable gate checklist.
- `agentloop check-gates --json` returns deterministic data.
- Missing evidence produces warnings or failures without hidden mutation.
- Tests cover ready and missing-evidence paths.
