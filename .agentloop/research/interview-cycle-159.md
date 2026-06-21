# Interview Cycle 159

## Context

Task doctor and status already treat exact AgentFlight placeholder task files as preserved session evidence. During dogfooding, generated root, harness, and agent instruction templates still told direct AgentFlight users to run only `agentloop status --redact-paths` and `agentloop task set <path>` when a placeholder became active.

This is simulated internal product-panel feedback plus dogfood observation. It is not real user research.

## Personas Interviewed

- Agentic Engineer Power User
- Security Reviewer
- Developer Experience Designer
- Template and Harness Engineer

## Feedback Summary

The panel wanted generated guidance to match the bounded recovery path already exposed by task doctor: inspect status, run task doctor, preserve the placeholder file, clear active state, then pin or create a real task.

## Product Council Debate

- Lina: Direct AgentFlight users follow generated agent instructions, so stale recovery copy can keep reactivating placeholders.
- Samir: The guidance must say not to edit or delete placeholder files as the default recovery.
- Nora: Keep the command sequence short enough for AGENTS.md and per-agent files.
- Template and Harness Engineer: Update root, harness, and agent templates together so fresh init and install-agent agree.

## Decision

Align generated AgentFlight placeholder recovery guidance across root templates, harness commands, bundled agent instructions, and this repo's local harness.

## Non-Decisions

- Do not change AgentFlight behavior.
- Do not change task-state, status, next, or task-doctor runtime behavior.
- Do not add cleanup automation.
- Do not delete or rewrite existing placeholder evidence.
- Do not release or publish.

## Success Criteria

- Fresh init root guidance mentions `agentloop status --redact-paths` and `agentloop task doctor --redact-paths`.
- Fresh init root guidance mentions `agentloop task clear`, `agentloop task set <path>`, and `agentloop create-task`.
- Installed agent guidance describes AgentFlight placeholders as preserved session evidence.
