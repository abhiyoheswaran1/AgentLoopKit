# Interview Cycle 191: Ship Inherited Dirty-Work Baseline

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Should ship reports promote the dirty-work baseline that `create-task` records when a task starts over existing dirty non-evidence files?

## Persona Notes

- Lina, Agentic Engineer: Long autonomous sessions often keep many unreleased files dirty. Reviewers need to know whether a broad count is inherited session context or current-task expansion.
- Tom, Skeptical Senior Developer: Do not pretend to know file-level attribution without a baseline snapshot. A count comparison is honest and useful.
- Nora, Developer Experience Designer: The ship report should surface this near the review-readiness sections, not bury it only inside raw task Risk Notes.
- Dogfood Steward: The live ship report showed 113 non-evidence files after creating a one-slice task, while the task Risk Notes already recorded that all 113 were pre-existing.

## Decision

Add a human `Inherited Dirty Work` section to ship reports when task Risk Notes include the generated pre-existing dirty non-evidence count. Compare that baseline with the current non-evidence changed-file count from the already-collected ship changed-file inventory.

## Constraints

- Do not change readiness scores, ship JSON shape, create-task behavior, run-ledger schema, gate decisions, file-level attribution, release behavior, dependencies, tags, publishing, or package versions.
