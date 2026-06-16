# Interview Cycle 120

## Context

AgentLoopKit already has a near-term maintenance gate for release proof, public docs, SchemaStore, policy packs, GitHub metadata, AgentFlight, ProjScan, and dogfooding. A roadmap audit found that the GitHub metadata step checked only `agentloop github import --help`, even though the product promise is stronger: imported GitHub metadata must stay optional, local, read-only, token-free, and safe to omit.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- AI-Skeptical Senior Engineer
- Small Team CTO

## Feedback summary

The panel agreed that the GitHub metadata feature is useful only if users can trust the safety boundary. The strongest signal was that recurring gates should check behavior, not just command existence. No persona asked for GitHub API calls, posting, tokens, or required GitHub metadata.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: local JSON import and clear no-token wording.
- What confused them: why the maintenance gate only checked command help.
- What they would need before using it: a gate that fails if metadata import becomes unsafe.
- What would make them recommend/star it: strong evidence that optional context stays optional.
- What would make them abandon it: silent GitHub API calls, token reads, or required metadata.

### Platform Engineer

- What they liked: read-only import fits internal policy constraints.
- What confused them: whether metadata behavior is tested in release maintenance.
- What they would need before using it: focused tests in the recurring gate.
- What would make them recommend/star it: easy local proof that policy boundaries are intact.
- What would make them abandon it: remote policy or GitHub dependencies inside local checks.

### AI-Skeptical Senior Engineer

- What they liked: deterministic local context instead of another AI wrapper.
- What confused them: a help check does not prove the safety contract.
- What they would need before using it: tests for env refusal, repo confinement, and no writes on dry-run.
- What would make them recommend/star it: boring checks that catch regressions.
- What would make them abandon it: marketing claims without executable proof.

### Small Team CTO

- What they liked: optional GitHub metadata can improve PR review context.
- What confused them: whether missing metadata blocks the loop.
- What they would need before using it: docs that say the gate covers safety and missing metadata is neutral.
- What would make them recommend/star it: confidence teams can adopt it without credentials.
- What would make them abandon it: required GitHub setup before local use.

## Product council debate

- Abhi: Keep this small. The wedge is review evidence, not GitHub automation.
- Maya: A focused test step is enough. Do not build a workflow engine.
- Elias: Public docs should describe the user-facing guard, not internal research.
- Nora: The maintenance output should name what it checks.
- Samir: Behavior tests matter more than help text for trust.
- Lina: Long agent sessions need gates that prove safety without memory.
- Tom: This is practical. Help output alone is not proof.
- Rachel: Good team signal, but do not require GitHub metadata.

## Decision

Add focused `tests/github-metadata.test.ts` coverage to `npm run maintenance:check`, keep the existing help-surface check, and update public maintenance docs to say the gate checks GitHub metadata safety directly.

## Non-decisions

- Do not add GitHub API calls.
- Do not run `gh`.
- Do not read GitHub tokens.
- Do not post comments.
- Do not make GitHub metadata required.
- Do not change `github import` file-write semantics.

## Resulting tasks

- Add a maintenance-check step named `github metadata safety tests`.
- Update tests that lock the maintenance step list.
- Update public maintenance docs and README wording.
- Record the decision and dogfood evidence.

## Success criteria

- Focused TDD fails before the maintenance step exists and passes after implementation.
- `maintenance:check` includes both `github import --help` and `npm test -- tests/github-metadata.test.ts`.
- Public docs remain user-facing.
- Dogfood, maintenance, typecheck, lint, and build pass.
