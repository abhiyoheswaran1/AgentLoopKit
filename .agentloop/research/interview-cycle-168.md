# Interview Cycle 168: Readiness Unit Guard Coverage

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

After fixing readiness-score parser behavior, dogfooding found `tests/readiness-score.test.ts` was not included in `npm run test:unit`, which is the first step of `maintenance:check`. Should the fast unit guard include this test file?

## Persona Notes

- Maya, Principal Engineer: Deterministic scoring is core product behavior and should be in the fast guard.
- Tom, Skeptical Senior Developer: Review-readiness claims need recurring tests, not one-off verification.
- Dogfood Steward: This directly follows a bug found during implementation; add the coverage where maintenance will run it.

## Decision

Add `tests/readiness-score.test.ts` to `test:unit` and assert that inclusion in `tests/package-scripts.test.ts`.

## Constraints

- Do not change scoring behavior.
- Do not expand the full integration suite into `test:unit`.
- Do not change maintenance-check step ordering.
- Do not release, tag, publish, or bump versions.
