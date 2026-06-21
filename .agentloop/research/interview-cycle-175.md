# Interview Cycle 175: AgentFlight Verify Syntax Guide

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

An AgentFlight verification was invoked as one quoted command string, creating failed evidence for a command that did not actually run. Should the AgentLoopKit dogfood harness document the safe AgentFlight verify syntax?

## Persona Notes

- Lina, Agentic Engineer: Long sessions need copyable commands that preserve evidence quality.
- Nora, Developer Experience Designer: The correct `--` separator form should be visible near the verification checklist.
- Dogfood Steward: The issue surfaced while trying to record focused verification evidence after a task completed.

## Decision

Document `npx --yes agentflight verify -- npm test -- tests/example.test.ts` in the autonomous dogfood and maintenance guidance, and warn against passing the full verification command as one quoted string.

## Constraints

- Do not change AgentFlight behavior.
- Do not rewrite, delete, or hide existing failed AgentFlight evidence.
- Do not add cleanup automation.
- Do not release, tag, publish, or bump package versions.
