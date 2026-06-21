# Interview Cycle 172: Stale Artifact Type Summary

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Dogfooding `agentloop artifacts --stale --limit 5` in this repo showed thousands of stale evidence candidates, but the bounded preview can show only the first candidate type. Should stale previews summarize candidate counts by artifact type before listing bounded paths?

## Persona Notes

- Lina, Agentic Engineer: Long autonomous sessions need a quick sense of whether old evidence is mostly reports, handoffs, ship reports, or runs before deciding what to inspect.
- Nora, Developer Experience Designer: A bounded preview should still explain the shape of hidden content. Otherwise users have to rerun with several filters or parse JSON.
- Tom, Skeptical Senior Developer: Keep it deterministic and read-only. Do not turn this into cleanup automation.
- Dogfood Steward: This surfaced while inspecting a repo with thousands of stale candidates after repeated verify, ship, and handoff runs.

## Decision

Add a compact candidate summary grouped by artifact type to `artifacts --stale` Markdown output and expose the same deterministic summary in JSON.

## Constraints

- Do not delete, move, archive, or prune evidence files.
- Do not change stale candidate ordering, filters, limits, or kept-evidence protection.
- Do not read artifact file contents beyond existing metadata behavior.
- Do not release, tag, publish, or bump package versions.
