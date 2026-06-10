# Interview Cycle 75

## Context

AgentLoopKit now documents how maintainers can customize local policies, but the guidance remains abstract. Maintainers still need examples for common repo types before they can turn generated policy files into useful repo-specific rules.

## Personas interviewed

- Platform Engineer
- Agency Developer
- Open Source Maintainer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is example quality. Repo-specific policy examples help maintainers move from generic safety guidance to rules that an agent can follow. The examples should stay in GitHub docs and should not become a policy pack system, compliance product, or package release.

## Raw simulated feedback

### Platform Engineer

- What they liked: Policies are local Markdown and can be copied across repos.
- What confused them: Teams need starter examples for different repo shapes.
- What they would need before using it: Monorepo and API examples with verification commands.
- What would make them recommend/star it: Clear examples they can adapt without a central service.
- What would make them abandon it: A policy registry before the local workflow is mature.

### Agency Developer

- What they liked: AgentLoopKit can travel across client repos.
- What confused them: Client repos need different safety rules.
- What they would need before using it: Web, API, Python, docs, and monorepo examples.
- What would make them recommend/star it: Copyable snippets that reduce setup time.
- What would make them abandon it: Vague principles instead of examples.

### Open Source Maintainer

- What they liked: Local policy files make contributor expectations visible.
- What confused them: They need wording for AI-generated PR review expectations.
- What they would need before using it: Examples that ask contributors to record verification evidence.
- What would make them recommend/star it: Examples that avoid fake compliance language.
- What would make them abandon it: Anything that implies generated policy files prove security.

### Power User / Agentic Engineer

- What they liked: Agents can inspect policy files before risky edits.
- What confused them: Agents need repo-specific rules that mention real commands.
- What they would need before using it: Snippets that mention command, rollback, and handoff evidence.
- What would make them recommend/star it: Examples that help agents stay focused in long sessions.
- What would make them abandon it: Long policy prose agents cannot act on.

### AI-Skeptical Senior Engineer

- What they liked: Deterministic docs and plain Markdown beat AI ceremony.
- What confused them: Generic policy text can become shelfware.
- What they would need before using it: Concrete rules tied to risky changes.
- What would make them recommend/star it: Examples that change review behavior.
- What would make them abandon it: Claims that policies enforce anything.

## Product council debate

- Abhi: Keep this as docs. It improves adoption without widening the product.
- Maya: Do not add a policy-pack abstraction. Examples are enough.
- Elias: Link examples from `docs/policies.md`; no README change needed.
- Nora: Make snippets short enough to paste into policy files.
- Samir: State that examples guide agents and reviewers; they do not prove compliance.
- Lina: Include verification and rollback expectations in every example.
- Tom: Avoid slogans. Name the risky file types and commands.
- Rachel: These examples help teams standardize without buying a platform.

## Decision

Add `docs/policy-examples.md` with repo-type examples for web apps, APIs, Python services, docs-only repos, monorepos, and open-source maintainer workflows. Link it from `docs/policies.md`. Do not change package metadata, README, runtime behavior, or generated templates.

## Non-decisions

- No policy pack CLI.
- No enforcement engine.
- No compliance scoring.
- No organization registry.
- No package release for docs-only examples.

## Resulting tasks

- Add `docs/policy-examples.md`.
- Link it from `docs/policies.md`.
- Update roadmap and final handoff to mark deeper policy examples as shipped docs.
- Record dogfood evidence.
- Run Markdown link checks and projscan.

## Success criteria

- Examples cover at least five common repo types.
- Each example names concrete review or verification expectations.
- Docs avoid compliance and enforcement claims.
- No package files or runtime code change.
