# Interview Cycle 164: Maintenance Check Typecheck Coverage

Internal simulated decision support for AgentLoopKit. Do not present this as real user research, adoption, testimonials, or interviews.

## Prompt

Dogfooding found that `npm run maintenance:check` did not run `npm run typecheck`, so a TypeScript regression could pass the recurring guard. Should the maintenance gate include typecheck directly?

## Persona Notes

- Maya, Principal Engineer: The recurring guard should catch compiler regressions before slower evidence checks. Put typecheck early and keep the implementation boring.
- Tom, Skeptical Senior Developer: A maintenance command that misses TypeScript errors is hard to trust. The value is deterministic proof, not more process.
- Samir, Security Reviewer: Keep the same secret-filtered environment. Do not add token reads, `.env` reads, network calls, or release behavior.
- Lina, Agentic Engineer: Long autonomous sessions need one command that catches common mistakes before handoff. Typecheck belongs in that guard.

## Decision

Implement a required `npm run typecheck` step in `maintenance:check` immediately after unit tests, update helper tests to lock the order, and update docs/records to describe the guard accurately.

## Constraints

- Do not change dependencies.
- Do not release, tag, publish, upload, or bump versions.
- Do not add new public release proof requirements to the development maintenance guard.
- Preserve token and `.env` safety behavior.
