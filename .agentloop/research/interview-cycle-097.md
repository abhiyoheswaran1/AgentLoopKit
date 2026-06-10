# Interview Cycle 97

## Context

AgentLoopKit already reports risk-file categories, exposes local policies, and generates verification reports and handoffs. The next gap is a concrete security-review example that shows how to use those pieces together without implying automated security assurance. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Security Reviewer
- AI-Skeptical Senior Engineer
- Open Source Maintainer
- Platform Engineer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is trust through specificity. Users need a copyable review workflow for auth and secrets work, but the docs must say that AgentLoopKit records review evidence and does not prove security.

## Raw simulated feedback

### Security Reviewer

- What they liked: Existing policies and risk-file warnings avoid secret reads.
- What confused them: Security guidance is spread across commands and policies.
- What they would need before using it: A sample task, report, and handoff that names unresolved review risks.
- What would make them recommend/star it: Honest limits and no scanner claims.
- What would make them abandon it: Claims of compliance or vulnerability detection.

### AI-Skeptical Senior Engineer

- What they liked: Deterministic artifacts beat vague security prose.
- What confused them: Whether a passing verification report means secure code.
- What they would need before using it: Direct wording that tests passing is not security proof.
- What would make them recommend/star it: Concrete reviewer checklist and rollback notes.
- What would make them abandon it: Security theater.

### Open Source Maintainer

- What they liked: Examples help contributors understand expected evidence.
- What confused them: The README examples list does not show a security-sensitive workflow.
- What they would need before using it: A public example linked from README and getting-started docs.
- What would make them recommend/star it: Copyable review language maintainers can ask contributors to follow.
- What would make them abandon it: Overstated trust claims.

### Platform Engineer

- What they liked: Policies and doctor risk categories are local files and local CLI output.
- What confused them: How to combine `doctor`, `policy`, `verify`, and `handoff`.
- What they would need before using it: A short sequence of commands for sensitive changes.
- What would make them recommend/star it: Works across stacks without a new service.
- What would make them abandon it: Required scanners, dashboards, or tokens.

### Power User / Agentic Engineer

- What they liked: Agents can follow a task contract for risky work.
- What confused them: Which acceptance criteria should a security-review task use.
- What they would need before using it: A realistic starter task for auth or secret handling.
- What would make them recommend/star it: Review checklists that reduce messy handoffs.
- What would make them abandon it: Long methodology docs without copyable artifacts.

## Product council debate

- Abhi: This strengthens the trust wedge without becoming a security product.
- Maya: Keep it docs-only. Do not add scanner behavior or dependencies.
- Elias: Link it from README and getting started so maintainers can find it.
- Nora: Make the flow command-first and copyable.
- Samir: State the limit in every public page that could be misread.
- Lina: Include a task, report, and handoff so agents can mimic the shape.
- Tom: Say plainly that passing tests do not prove security.
- Rachel: Small teams can use this as review discipline without buying a platform.

## Decision

Add a security-review example folder and a short public workflow doc. Link both from README and getting-started docs.

## Non-decisions

- Do not add a security scanner.
- Do not add compliance claims.
- Do not inspect `.env` contents.
- Do not add new dependencies.
- Do not create a policy engine or hosted dashboard.

## Resulting tasks

- Add `examples/security-review/README.md`.
- Add sample task, verification report, and PR summary under the example.
- Add `docs/security-review.md`.
- Link the example from README and getting-started docs.
- Verify links, whitespace, projscan, and AgentLoop verification.

## Success criteria

- The example is copyable and clearly scoped.
- Public docs state AgentLoopKit records review evidence but does not prove security.
- Link checks pass.
- Projscan remains clean.
