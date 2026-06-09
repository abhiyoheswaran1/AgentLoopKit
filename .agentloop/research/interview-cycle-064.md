# Interview Cycle 64

## Context

AgentLoopKit can generate deterministic PR summaries, but the output lists changed files without grouping them by reviewer concern. Reviewers still have to infer whether a change is mostly source code, tests, docs, CI, config, AgentLoop artifacts, or risk-sensitive paths.

## Personas interviewed

- Open Source Maintainer
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Startup CTO

## Feedback summary

The strongest signal is reviewer speed. Keep the existing deterministic summary, but add a small "Change Areas" section and concrete review-focus hints. Do not add AI wording, risk scores, or content inspection.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Current handoffs include files, diff stats, and verification.
- What confused them: The file list does not separate docs, tests, source, and CI.
- What they would need before using it: A quick way to see what kind of review the PR needs.
- What would make them recommend/star it: Summaries that reduce reviewer scanning.
- What would make them abandon it: Noisy categories that feel like a project-management report.

### Power User / Agentic Engineer

- What they liked: `agentloop handoff` is deterministic and fast.
- What confused them: Agents still need to explain what changed in plain review terms.
- What they would need before using it: Category hints based on paths.
- What would make them recommend/star it: Review focus that catches CI, lockfile, auth, env, and migration paths.
- What would make them abandon it: Any LLM dependency or file-content scanning.

### Skeptical Senior Developer

- What they liked: No AI call is required.
- What confused them: The current risk section is generic for every summary.
- What they would need before using it: Specific hints tied to changed paths.
- What would make them recommend/star it: Clear, boring classification.
- What would make them abandon it: Fake confidence or severity scores.

### Startup CTO

- What they liked: The tool already creates review artifacts.
- What confused them: Team reviewers still need to triage what kind of review is required.
- What they would need before using it: Consistent categories across repos.
- What would make them recommend/star it: Handoffs that make PR review faster for small teams.
- What would make them abandon it: Config-heavy taxonomy.

## Product council debate

- Abhi: This improves the wedge: better reviewability from local evidence.
- Maya: Keep it a pure path classifier.
- Elias: Do not break existing Changed Files and Diff Stats sections.
- Nora: Use short labels that reviewers understand.
- Samir: Include risk-sensitive path hints without reading file contents.
- Lina: Agents can use the categories in their final handoff.
- Tom: No risk scores.
- Rachel: Teams benefit from consistent, low-ceremony triage.

## Decision

Add deterministic path-based change-area classification and review-focus hints to PR summaries.

## Non-decisions

- Do not add an LLM.
- Do not inspect file contents.
- Do not add dependencies.
- Do not make classification configurable yet.

## Resulting tasks

- Add Vitest coverage for classified summary output.
- Implement path-based categories in `src/core/pr-summary.ts`.
- Document the new summary sections.
- Dogfood through AgentLoop verification and handoff.

## Success criteria

- Summaries keep existing Changed Files and Diff Stats sections.
- Summaries include Change Areas grouped by source, tests, docs, CI, config/package, AgentLoop, risk-sensitive, and other paths as applicable.
- Summaries include review-focus hints tied to categories.
