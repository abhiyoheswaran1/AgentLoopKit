# Interview Cycle 165: Ship Report Task Risk Notes

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

`create-task` now persists dirty-work baselines into task Risk Notes, but `agentloop ship` reports do not render those notes. Should ship reports surface task-level risks directly?

## Persona Notes

- Tom, Skeptical Senior Developer: The primary review report should include the risks that the task author already wrote down. Otherwise the score can look detached from the task context.
- Lina, Agentic Engineer: Long autonomous sessions need the dirty baseline visible in the same artifact reviewers open first.
- Elias, Open Source Maintainer: Put the risk notes in ship reports, but avoid changing JSON shape or scoring. Keep the public explanation simple.
- Samir, Security Reviewer: Escape Markdown prose and do not add dirty-file content reads, broader scans, token handling, or release behavior.

## Decision

Add a `Task Risk Notes` section to ship report Markdown, sourced from the task contract already loaded for readiness scoring. Render list items as escaped single-line prose and show a clear fallback when no risk notes are recorded.

## Constraints

- Do not change review-readiness scoring.
- Do not change run-ledger JSON or `prepare-pr` behavior.
- Do not read dirty file contents or add new scans.
- Do not release, tag, publish, or bump versions.
