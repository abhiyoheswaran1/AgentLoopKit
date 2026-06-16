# Interview Cycle 121

## Context

AgentLoopKit's near-term roadmap says bundled policy packs should stay small, local, safe, and useful for maintainers. The maintenance gate already listed policy-pack inventory, but it did not name focused policy-pack safety coverage. Dogfooding showed the same pattern as GitHub metadata: help or inventory checks prove the surface exists, while focused tests prove the safety contract.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- Startup CTO
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal was trust. Policy packs are useful only if they stay local, reviewable, and no-overwrite. The panel wanted maintenance proof that protects this boundary, but rejected remote packs, enforcement engines, compliance claims, and new bundled packs before real usage.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: bundled packs are plain files and easy to inspect.
- What confused them: inventory checks do not prove apply safety.
- What they would need before using it: a gate that catches overwrite or traversal regressions.
- What would make them recommend/star it: safe local policy guidance without a service.
- What would make them abandon it: remote policy downloads or compliance claims.

### Platform Engineer

- What they liked: repo-local packs can fit internal standards.
- What confused them: whether local pack paths and symlinks are still tested in maintenance.
- What they would need before using it: focused policy-pack tests in the recurring gate.
- What would make them recommend/star it: proof that packs remain local and bounded.
- What would make them abandon it: a centralized policy engine in the OSS CLI.

### Startup CTO

- What they liked: small policy packs can help teams standardize agent reviews.
- What confused them: how many packs AgentLoopKit intends to bundle.
- What they would need before using it: safe defaults and no overwrite surprises.
- What would make them recommend/star it: useful review rules that do not become bureaucracy.
- What would make them abandon it: enterprise governance features in the core CLI.

### AI-Skeptical Senior Engineer

- What they liked: policy packs are deterministic files, not AI-generated governance.
- What confused them: "policy" can sound like enforcement.
- What they would need before using it: tests proving no remote fetch and no overwrite behavior.
- What would make them recommend/star it: boring guardrails that reviewers can inspect.
- What would make them abandon it: hidden mutation or broad claims about compliance.

## Product council debate

- Abhi: Keep this about repo-level review discipline. Do not turn it into policy management.
- Maya: Add the focused test step. Do not add new pack abstractions.
- Elias: Public docs should say safety tests are part of maintenance, not pretend this is compliance.
- Nora: The step name should be explicit enough that future maintainers understand the gate.
- Samir: Policy-pack safety must include no overwrite, path confinement, and local-only assumptions.
- Lina: Long agent sessions need the gate to remember these rules.
- Tom: Inventory is not behavior proof. Tests are the right move.
- Rachel: Team usefulness matters, but no org dashboards or centralized policy yet.

## Decision

Add focused `tests/policy-packs.test.ts` coverage to `npm run maintenance:check`, keep the existing policy-pack inventory step, and update public maintenance docs to say policy-pack safety is checked directly.

## Non-decisions

- Do not add remote policy packs.
- Do not add a policy enforcement engine.
- Do not add new bundled packs.
- Do not add overwrite behavior.
- Do not add API calls, token reads, `.env` reads, release, or publishing behavior.

## Resulting tasks

- Add a maintenance-check step named `policy pack safety tests`.
- Update tests that lock the maintenance step list.
- Update public maintenance docs and README wording.
- Record the decision and dogfood evidence.

## Success criteria

- Focused TDD fails before the maintenance step exists and passes after implementation.
- `maintenance:check` includes both `policy packs --json` and `npm test -- tests/policy-packs.test.ts`.
- Public docs stay user-facing and avoid compliance or remote-pack claims.
- Dogfood, maintenance, typecheck, lint, and build pass.
