# Interview Cycle 122

## Context

AgentLoopKit now has a public real-repo trial checklist for policy packs and imported GitHub metadata. The roadmap says that checklist should be used before adding more bundled policy packs or changing GitHub metadata scoring. Dogfooding showed that public docs hygiene already blocks unsupported adoption, testimonial, hosted-service, and channel claims, but it does not directly protect the trial checklist's local-first and no-public-proof boundaries.

This is simulated internal product-panel feedback. It is not real user research.

## Personas interviewed

- Open Source Maintainer
- Platform Engineer
- AI-Skeptical Senior Engineer
- Small Team CTO

## Feedback summary

The panel prioritized keeping the trial checklist trustworthy over adding new trial features. The strongest signal was that trial docs can drift into public proof, compliance wording, token-bearing GitHub automation, or premature scoring claims unless recurring hygiene checks lock the boundary.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: the checklist gives maintainers a safe way to try policy packs and metadata in a real repo.
- What confused them: whether trial notes can be quoted publicly as proof of usage.
- What they would need before using it: clear no-public-proof and no-credential boundaries that stay enforced.
- What would make them recommend/star it: a checklist that stays honest without becoming marketing copy.
- What would make them abandon it: claims about adoption, compliance, or customer proof based on informal trials.

### Platform Engineer

- What they liked: local-only trial guidance fits internal review standards.
- What confused them: whether GitHub metadata import will become required after trials.
- What they would need before using it: missing metadata must remain neutral and scoring changes must stay separate.
- What would make them recommend/star it: explicit trial records that do not add remote services or org-wide enforcement.
- What would make them abandon it: automatic GitHub posting, token reads, or remote policy distribution.

### AI-Skeptical Senior Engineer

- What they liked: the checklist asks for commands and reviewer usefulness, not vibes.
- What confused them: "real repo" could sound like public proof if the docs are not careful.
- What they would need before using it: recurring tests that fail if the checklist drops safety language.
- What would make them recommend/star it: deterministic hygiene that keeps public docs grounded.
- What would make them abandon it: marketing claims or scoring changes without separate evidence.

### Small Team CTO

- What they liked: the checklist can help a team decide whether policies and metadata are useful before standardizing them.
- What confused them: whether one trial can trigger bundled pack changes.
- What they would need before using it: a decision gate that prevents one-off trial notes from driving product changes.
- What would make them recommend/star it: lightweight trial guidance with no SaaS or telemetry.
- What would make them abandon it: a hidden push toward hosted dashboards or compliance posture.

## Product council debate

- Abhi: Improve the guardrails around the trial checklist before adding more policy-pack or metadata capability.
- Maya: This belongs in the existing public-doc hygiene helper. Avoid a new command.
- Elias: Public docs should keep the trial useful, but never imply adoption proof.
- Nora: The failure message should tell maintainers exactly which boundary went missing.
- Samir: Require local-only, no-token, no-telemetry, missing-metadata-neutral, and no-ship-scoring language.
- Lina: Long-running agents need the recurring hygiene gate to catch drift.
- Tom: Good. A test is more trustworthy than remembering the positioning.
- Rachel: Trial guidance is useful for teams only if it avoids premature centralized governance.

## Decision

Add a public-doc hygiene guard for `docs/real-repo-trials.md` that requires the trial checklist to keep its no-public-proof, local-only/no-token/no-telemetry, missing-metadata-neutral, no-ship-scoring, and no-release-channel-change boundaries.

## Non-decisions

- Do not add new bundled policy packs.
- Do not change GitHub metadata import behavior.
- Do not make metadata required.
- Do not let imported metadata affect `ship` scoring.
- Do not add telemetry, remote services, GitHub posting, token reads, release work, or publishing behavior.

## Resulting task

- Guard real-repo trial guidance in public-doc hygiene with TDD.
- Update the backlog, decision log, and changelog.
- Run a bug pass immediately after implementation.

## Success criteria

- Public-doc hygiene fails when `docs/real-repo-trials.md` drops the no-public-proof boundary.
- Public-doc hygiene fails when it drops local-only/no-token/no-telemetry boundaries.
- Public-doc hygiene fails when it drops missing-metadata-neutral or no-ship-scoring boundaries.
- Existing public docs pass.
- Focused tests, typecheck, lint, build, AgentLoop evidence, ProjScan, and AgentFlight checks pass.
