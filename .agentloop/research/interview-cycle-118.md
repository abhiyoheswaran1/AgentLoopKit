# Interview Cycle 118

Internal simulated feedback and product-panel output. This is not real user research.

## Context

AgentLoopKit now writes timestamped evidence paths and collision-safe suffixes. Dogfooding found a stale-evidence bug after Git operations changed filesystem mtimes: `status` and `artifacts` selected an older generated report even though a newer timestamped report existed.

## Personas interviewed

- Open Source Maintainer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer
- Platform Engineer

## Feedback summary

The strongest signal was trust in evidence selection. If AgentLoopKit tells reviewers which verification or handoff is latest, it must use the product's generated timestamp contract instead of a filesystem detail that Git can rewrite.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Evidence files have readable names and can be reviewed in git.
- What confused them: An older report appeared as latest after local cleanup.
- What they would need before using it: Latest evidence should match the generated timestamp.
- What would make them recommend/star it: Review evidence stays deterministic after normal Git operations.
- What would make them abandon it: A green-looking handoff that points at stale verification.

### Power User / Agentic Engineer

- What they liked: `status`, `artifacts`, and `ship` make long sessions easier to resume.
- What confused them: Filesystem mtimes are invisible to agents and hard to explain.
- What they would need before using it: The CLI should follow the artifact filename order it creates.
- What would make them recommend/star it: Agents can trust `status` without opening every report.
- What would make them abandon it: Evidence selection changes after stash, checkout, or clone operations.

### AI-Skeptical Senior Engineer

- What they liked: The issue has a deterministic fix and regression tests.
- What confused them: Why a local tool would use mutable filesystem metadata when the filenames already encode order.
- What they would need before using it: No claims about code quality, only reliable evidence ordering.
- What would make them recommend/star it: A narrow fix that preserves manual file behavior.
- What would make them abandon it: More workflow machinery instead of fixing the selector.

### Platform Engineer

- What they liked: The maintenance gate already checks release proof, SchemaStore, policy packs, GitHub metadata, AgentFlight, ProjScan, and dogfood.
- What confused them: A maintenance gate can still read stale evidence if the shared selector is wrong.
- What they would need before using it: One shared comparator used by artifact inventory and latest report lookup.
- What would make them recommend/star it: CI and local agents agree about latest evidence.
- What would make them abandon it: Different commands choosing different "latest" reports.

## Product council debate

- Abhi: This protects the product promise: reviewable, verifiable, merge-ready work needs reliable evidence pointers.
- Maya: Fix the shared comparator. Do not add state, a database, or cleanup automation.
- Elias: Add one public docs note. Do not put internal dogfood chatter in README.
- Nora: Users can understand "timestamped filenames define order".
- Samir: Keep manual files on the old fallback path and avoid hidden destructive cleanup.
- Lina: This removes a real long-session failure after stash and checkout operations.
- Tom: Good. This is deterministic and testable, not methodology copy.
- Rachel: Teams need this before trusting release and maintainer gates.

## Decision

Sort generated timestamped evidence by filename timestamp and collision suffix in the shared artifact comparator. Keep mtime and filename fallback behavior for manual files that do not match AgentLoopKit's generated timestamp shape.

## Non-decisions

- Do not add a database or global artifact index.
- Do not add cleanup automation.
- Do not change release channels, publish a version, or bump package metadata.
- Do not change manual file ordering beyond the existing fallback.

## Resulting tasks

- Add regression coverage for `agentloop artifacts --json`.
- Add regression coverage for `agentloop status --json`.
- Update the shared artifact comparator.
- Update CLI reference, changelog, decisions, backlog, and dogfood log.
- Run focused tests, static checks, dogfood, AgentFlight, and ProjScan.

## Success criteria

- `artifacts --json` selects the newer timestamped verification, handoff, and ship report even when older files have newer mtimes.
- `status --json` selects the newer timestamped verification report in the same stale-mtime scenario.
- Manual files still have mtime fallback behavior.
- Public docs stay user-facing and free of internal release chatter.
