# Interview Cycle 161

## Context

Dogfooding after archiving a completed task showed `agentloop artifacts` reporting current ordinary task counts while the "Latest task" line pointed at an archived done task. The data was correct, but the human label mixed current task inventory with archived evidence fallback.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Open Source Maintainer
- Developer Experience Designer
- Agentic Engineer Power User
- AI-Skeptical Senior Engineer

## Feedback Summary

The panel wanted reviewer-facing artifact output to say when a task is archived evidence instead of current work. The fix should keep the existing JSON data model and avoid introducing cleanup or lifecycle automation.

## Product Council Debate

- Elias: Reviewers should not have to infer from counts that the latest task line is an archived fallback.
- Nora: A different human label is enough; avoid a new command or schema.
- Lina: Agents use `artifacts --latest` in handoffs, so the label should also apply to filtered latest output.
- Tom: Keep the behavior deterministic and boring: same data, clearer prose.

## Decision

Label archived task fallback lines as `Latest archived task evidence` in human `artifacts` output, including `--type task --latest`, while preserving JSON compatibility through the existing `archived: true` marker.

## Non-Decisions

- Do not change task counting semantics.
- Do not remove archived fallback support.
- Do not add evidence cleanup, deletion, or reactivation behavior.
- Do not change AgentFlight placeholder handling.
- Do not release or publish.

## Success Criteria

- Archived fallback task evidence is clearly labeled in human artifact output.
- Open active task evidence keeps the existing `Latest task` label.
- JSON output remains compatible and keeps `archived: true` for fallback tasks.
