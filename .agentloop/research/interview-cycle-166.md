# Interview Cycle 166: Review Context Risk-Note Count

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

`agentloop review-context` is a compact read-only snapshot, but it does not say whether the active task has Risk Notes. Should it expose risk-note context?

## Persona Notes

- Lina, Agentic Engineer: Agents need to know whether task risk context exists before handoff, without opening several files.
- Nora, DX Designer: A count-only line keeps the snapshot compact and avoids turning review-context into another task body dump.
- Tom, Skeptical Senior Developer: It is useful to know risks were recorded, but the actual prose belongs in task, ship, and PR evidence.
- Samir, Security Reviewer: Do not render task prose or broaden scans. Read the active task only, and keep the safety copy true.

## Decision

Add `status.activeTaskRiskNotes.count` to review-context JSON and a human `Active task risk notes` line when an active task exists. Do not print Risk Notes prose or full task Markdown.

## Constraints

- Count active task Risk Notes only.
- Do not include full Markdown artifact bodies.
- Do not change gates, scoring, ship, or prepare-pr behavior.
- Do not release, tag, publish, or bump versions.
