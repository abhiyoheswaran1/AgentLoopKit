# Interview Cycle 177: Ship Scope Area Counts

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Ship reports warn when a non-evidence change set is broad, but the scope-control reason does not summarize the review areas behind that warning. Should ship readiness reuse the compact area counts already proven in maintainer-check?

## Persona Notes

- Tom, Skeptical Senior Developer: A broad-scope warning is more useful when it names whether the work is mostly source, tests, docs, CI, config, or AgentLoop files.
- Lina, Agentic Engineer: Long autonomous sessions need fast evidence triage without opening several commands.
- Nora, Developer Experience Designer: The warning should stay on one line and remain scannable in ship reports.
- Dogfood Steward: The current repo has many accumulated non-evidence files, making this a visible daily dogfood gap.

## Decision

Add a shared `renderChangeAreaCounts` formatter and use it in readiness scoring when the broad non-evidence scope threshold fires. Keep maintainer-check on the same formatter so the two review surfaces stay aligned.

## Constraints

- Do not change readiness score weights, dimensions, gates, changed-file collection, or run-ledger data.
- Do not read file contents; classify by paths already present in Git status.
- Do not release, tag, publish, or bump package versions.
