# Interview Cycle 174: AgentFlight Status In Dogfood

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Dogfooding showed `npm run dogfood:strict` can pass AgentFlight doctor while `agentflight status` reports the current session as blocked by an earlier failed verification. Should the dogfood gate surface AgentFlight session status as well as doctor health?

## Persona Notes

- Lina, Agentic Engineer: Long autonomous sessions need the flight recorder's readiness state visible near the rest of the handoff evidence.
- Samir, Security Reviewer: Do not rewrite or hide failed AgentFlight evidence. Surface it and keep the gate contract explicit.
- Nora, Developer Experience Designer: Doctor and status answer different questions; dogfood logs should make that distinction visible.
- Dogfood Steward: The issue surfaced after an incorrect AgentFlight verify invocation remained as a failed record even though later test evidence passed.

## Decision

Run `agentflight status` after `agentflight doctor` in the dogfood gate. Treat it as normal command evidence: the dogfood script honors its exit code but does not parse AgentFlight human output for readiness.

## Constraints

- Do not mutate AgentFlight sessions, evidence, or failed verification records.
- Do not parse AgentFlight human output.
- Do not change maintainer-check warning semantics.
- Do not release, tag, publish, or bump package versions.
