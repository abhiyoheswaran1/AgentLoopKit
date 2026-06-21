# Interview Cycle 170: Dogfood Strict Warning Boundary

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Strict dogfood passed while `maintainer-check` reported warnings during a long dirty implementation batch. Should strict dogfood fail on maintainer-check warnings, or should guidance clarify the warning boundary?

## Persona Notes

- Nora, Developer Experience Designer: The command did the right thing, but the wording should tell agents which warnings are blocking.
- Tom, Skeptical Senior Developer: Do not parse human output to infer failure. Exit codes are the contract.
- Samir, Security Reviewer: Keep `check-gates --strict` as the blocking review gate; maintainer warnings should stay visible for human review.
- Dogfood Steward: The issue surfaced during real dogfood after the package manifest warning precision fix.

## Decision

Keep dogfood behavior unchanged. Strict dogfood blocks review-gate warnings through `check-gates --strict`; maintainer-check warnings remain reviewer guidance unless the maintainer-check command exits non-zero.

## Constraints

- Do not change dogfood step behavior.
- Do not change maintainer-check exit codes.
- Do not parse maintainer-check human output.
- Do not release, tag, or publish.
