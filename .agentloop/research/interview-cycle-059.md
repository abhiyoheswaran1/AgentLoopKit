# Interview Cycle 59

## Context

GitHub release `v0.15.0` is public, while npm still serves `0.1.1` until publishing authorization is repaired. The next repo-owned improvement should keep launch quality moving without depending on npm account state. `doctor` already warns when potential risk files exist, but it only reports a total count.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- Skeptical Senior Developer
- Power User / Agentic Engineer
- Small Team CTO

## Feedback summary

The strongest signal is reviewer trust. A total risk-file count tells users that caution is needed, but not where. Add concise category-level risk checks so agents can mention migrations, auth, deployment, lockfiles, or env files in task contracts and handoffs.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: `doctor` gives a quick health check before a contributor starts.
- What confused them: A count like `5 risk file(s) detected` does not tell a reviewer where to look.
- What they would need before using it: Category names and path examples in `doctor --json`.
- What would make them recommend/star it: Better review evidence without extra setup.
- What would make them abandon it: Long walls of file paths.

### Security Reviewer

- What they liked: The scanner already ignores `.agentloop` and does not read `.env` contents.
- What confused them: Env files and security files need different handling, but the current output collapses them.
- What they would need before using it: Path-only reporting with no secret scanning and no file-content reads.
- What would make them recommend/star it: Explicit docs saying env file contents stay private.
- What would make them abandon it: Any attempt to print secret-looking values.

### Skeptical Senior Developer

- What they liked: `doctor` stays deterministic.
- What confused them: The current warning feels vague.
- What they would need before using it: A check that names the category and lets them decide whether human review is needed.
- What would make them recommend/star it: Practical output that improves review, not methodology prose.
- What would make them abandon it: Risk scoring that pretends to know impact.

### Power User / Agentic Engineer

- What they liked: Agents can run `doctor` before a task and cite the result.
- What confused them: Agents still need to inspect the repo to identify protected areas.
- What they would need before using it: JSON checks that agents can parse and copy into task contracts.
- What would make them recommend/star it: Short warnings with enough path examples to act.
- What would make them abandon it: A noisy scanner that distracts from the active task.

### Small Team CTO

- What they liked: The warning supports lightweight governance.
- What confused them: Teams need to know whether the risk is deployment, billing, or migrations.
- What they would need before using it: Actionable categories that developers can mention in review notes.
- What would make them recommend/star it: Safer first-run output with no enterprise process.
- What would make them abandon it: A policy engine that needs maintenance.

## Product council debate

- Abhi: Improve the wedge. `doctor` should make agentic work more reviewable in the first minute.
- Maya: Keep it to labels and capped examples. No scoring model.
- Elias: This helps contributors explain risk in PRs.
- Nora: Human output needs to stay scan-friendly.
- Samir: Paths only. No env reads. No secret detection claims.
- Lina: Agents can parse category checks and carry them into task contracts.
- Tom: A category warning is useful. A risk oracle is not.
- Rachel: This supports team consistency without adding workflow weight.

## Decision

Add category-level `Risk files: <category>` doctor checks when risk files exist. Each check lists up to three path examples and a `(+N more)` suffix when needed. Keep the existing aggregate `Potential risk files` check.

## Non-decisions

- Do not make risk files fail `doctor`.
- Do not read file contents.
- Do not scan secrets.
- Do not add policy packs or risk scores.
- Do not retry npm publishing during this cycle.

## Resulting tasks

- Add a failing doctor test for category-level risk checks and env-content privacy.
- Implement capped risk path formatting in `src/core/doctor.ts`.
- Update README and getting-started docs.
- Update backlog, dogfood log, decisions, and final handoff.

## Success criteria

- `doctor` emits category-level warnings for risk files.
- `doctor --json` carries the same category checks in the existing checks array.
- Env files appear only as paths.
- Existing no-risk behavior remains a passing aggregate risk check.
- Focused doctor and safety tests pass.
