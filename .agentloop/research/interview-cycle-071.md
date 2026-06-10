# Interview Cycle 71

## Context

AgentLoopKit `v0.17.0` added read-only local policy inspection with `agentloop policy list` and `agentloop policy show <policy>`. The project still keeps policy behavior local and file-based. Dogfooding showed one publish blocker outside the repo: npm requires fresh OTP/browser authentication for `0.17.0`.

## Personas interviewed

- Platform Engineer
- Power User / Agentic Engineer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Open Source Maintainer

## Feedback summary

The strongest signal is policy drift visibility. Teams and agents can read policy files, but they cannot tell whether the local repo still matches AgentLoopKit's bundled policy templates, whether a policy is missing, or whether a team customized one on purpose. The next improvement should stay read-only and report status, not migrate or enforce.

## Raw simulated feedback

### Platform Engineer

- What they liked: Policy files are plain Markdown under `.agentloop/policies/`.
- What confused them: There is no way to know whether a repo has stale or customized policy files after several AgentLoopKit releases.
- What they would need before using it: A command that reports current, modified, missing, and extra policies.
- What would make them recommend/star it: JSON output that internal scripts can audit without network access.
- What would make them abandon it: Auto-updating policy files without review.

### Power User / Agentic Engineer

- What they liked: Agents can now inspect policy guidance without shelling out to `cat`.
- What confused them: `policy list` does not show whether a policy was edited locally.
- What they would need before using it: A quick status command before a long autonomous coding session.
- What would make them recommend/star it: Clear next action when a policy is missing or modified.
- What would make them abandon it: A policy engine that blocks local work.

### Security Reviewer

- What they liked: The policy command restricts reads to known local policy files.
- What confused them: Comparing policy contents could accidentally become a compliance claim.
- What they would need before using it: Explicit wording that status compares local files against bundled templates only.
- What would make them recommend/star it: No secret reads, no environment scans, no remote fetches, no mutation.
- What would make them abandon it: Any command that overwrites local policies.

### AI-Skeptical Senior Engineer

- What they liked: Read-only commands provide concrete review value.
- What confused them: The difference between template drift and a policy violation.
- What they would need before using it: Plain output that says "modified" means local Markdown differs from the bundled template.
- What would make them recommend/star it: Deterministic JSON and tests for missing/extra files.
- What would make them abandon it: Vague compliance language.

### Open Source Maintainer

- What they liked: The command makes generated content more discoverable.
- What confused them: README explains policy inspection but not policy customization.
- What they would need before using it: Docs that tell maintainers to review policy diffs before changing repo rules.
- What would make them recommend/star it: Helpful examples in README and `docs/policies.md`.
- What would make them abandon it: Another large subsystem with its own lifecycle.

## Product council debate

- Abhi: This sharpens the wedge. Repo-level harness, visible evidence, no cloud.
- Maya: Keep the comparison simple. Use bundled templates and local files, no hashes persisted to state.
- Elias: Document this as policy drift, not compliance.
- Nora: `agentloop policy status` is the obvious command name.
- Samir: Read-only only. Do not touch `.env`, do not follow arbitrary paths, do not fetch remote templates.
- Lina: Agents can run it before changing sensitive areas.
- Tom: Show direct statuses. Avoid moral language about "good" or "bad" policies.
- Rachel: This helps teams standardize later without forcing team features now.

## Decision

Add `agentloop policy status` and `agentloop policy status --json`. The command compares local `.agentloop/policies/*.md` files with bundled template files and reports each policy as `current`, `modified`, `missing`, or `extra`. It should include clear next actions in human output and deterministic entries in JSON output.

## Non-decisions

- No policy enforcement engine.
- No automatic migration or overwrite command.
- No remote policy packs.
- No organization registry.
- No compliance score.

## Resulting tasks

- Add failing tests for policy status current, modified, missing, extra, and CLI JSON output.
- Implement local policy template comparison in `src/core/policy.ts`.
- Add `policy status` to the CLI and completions.
- Update README, `docs/policies.md`, roadmap, backlog, decisions, and final handoff.
- Record the npm OTP publish blocker in the dogfood log.

## Success criteria

- `agentloop policy status` reports local policy drift without mutating files.
- `agentloop policy status --json` returns deterministic status entries.
- Missing `.agentloop/policies/` still points users to `agentloop init`.
- Tests cover current, modified, missing, extra, safe lookup, and completion behavior.
- Docs avoid compliance claims and describe the command as local template comparison.
