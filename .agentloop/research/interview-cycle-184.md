# Interview Cycle 184: Dirty Next-Action Examples

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

When `status` or `next` recommends `agentloop create-task` while dirty non-evidence files already exist, should the advisory reason include bounded path examples?

## Persona Notes

- Nora, Developer Experience Designer: A count tells users there is risk; a few repo-relative examples tell them what to inspect next.
- Lina, Agentic Engineer: Agents need the examples before creating the next task so they can decide whether the dirty work belongs there.
- Tom, Skeptical Senior Developer: Keep this deterministic and bounded; no content reads or ownership inference.
- Dogfood Steward: The issue surfaced in long autonomous sessions where status showed 100+ dirty non-evidence files and asked for confirmation without examples.

## Decision

Append up to five repo-relative dirty non-evidence file examples to `create-task` next-action reasons when dirty-work guidance is emitted. Keep AgentLoop evidence-only dirt excluded from that guidance.

## Constraints

- Do not change task selection, next-action command selection, verification selection, dirty-file collection, file-content reads, release behavior, dependencies, tags, publishing, or package versions.
