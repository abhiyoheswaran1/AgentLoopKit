# Interview Cycle 98

## Context

AgentLoopKit now includes a security-review workflow example. The next trust gap is explaining `doctor` risk-file warnings in one public page so users understand category meanings, limits, and reviewer actions. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Security Reviewer
- AI-Skeptical Senior Engineer
- Open Source Maintainer
- Platform Engineer

## Feedback summary

The strongest signal is clarity. `doctor` risk warnings are useful only if users know they are path-based prompts for review, not scanner results.

## Raw simulated feedback

### Security Reviewer

- What they liked: `doctor` caps path examples and avoids env file contents.
- What confused them: Users may not know which strings map to each category.
- What they would need before using it: A category table and explicit env-file handling rules.
- What would make them recommend/star it: No secret scanning claims and clear human-review triggers.
- What would make them abandon it: Any implication that path heuristics prove security risk.

### AI-Skeptical Senior Engineer

- What they liked: Warning-only output keeps the CLI boring.
- What confused them: Whether a warning means a file is dangerous.
- What they would need before using it: Plain wording that warnings shape review scope.
- What would make them recommend/star it: Deterministic behavior with honest limits.
- What would make them abandon it: Risk scores or magic claims.

### Open Source Maintainer

- What they liked: Risk categories help reviewers ask better questions.
- What confused them: The guidance is currently scattered across README and getting-started docs.
- What they would need before using it: One link to give contributors when a PR touches auth, billing, deployment, or lockfiles.
- What would make them recommend/star it: Copyable task-contract advice.
- What would make them abandon it: Docs that make review feel bureaucratic.

### Platform Engineer

- What they liked: The output can feed local policy and task-contract workflows.
- What confused them: Whether AgentLoopKit parses dependency advisories or source code.
- What they would need before using it: A limits section covering path heuristics and no dependency-audit behavior.
- What would make them recommend/star it: Clear separation between visibility and enforcement.
- What would make them abandon it: A hidden policy engine.

## Product council debate

- Abhi: This makes the trust story easier to explain without adding features.
- Maya: Docs only. Do not change JSON shape or detection code.
- Elias: Link it from README and getting started.
- Nora: Include a table and reviewer questions.
- Samir: State that env files are paths only.
- Lina: Add task-contract fields agents should fill from the warnings.
- Tom: Say a warning is not proof.
- Rachel: Teams can use this as lightweight review governance.

## Decision

Add `docs/doctor-risk-files.md` with categories, examples, limits, env-file handling, task-contract usage, and reviewer questions.

## Non-decisions

- Do not change doctor behavior.
- Do not add risk scores.
- Do not scan secrets, parse source, run audits, or enforce policy.
- Do not add dependencies.

## Resulting tasks

- Add the docs page.
- Link it from README, getting-started docs, and security-review docs.
- Update backlog, dogfood log, and final handoff.
- Verify links, whitespace, projscan, and AgentLoop verification.

## Success criteria

- Users can interpret every risk-file category from one page.
- Docs make env-file path-only handling explicit.
- Docs say warnings shape review scope and do not prove risk.
- Checks pass.
