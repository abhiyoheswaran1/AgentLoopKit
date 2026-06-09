# Interview Cycle 69

## Context

AgentLoopKit now has task contracts, active task state, verification reports, handoffs, gate checks, static HTML reports, local badges, and template manifest checks. GitHub release `v0.16.0` is public, while npm still needs browser/OTP auth before the current source lands on the registry. The next useful local-first improvement should make existing generated guidance easier to inspect without increasing setup weight.

## Personas interviewed

- Platform Engineer
- Power User / Agentic Engineer
- AI-Skeptical Senior Engineer
- Open Source Maintainer
- Security Reviewer

## Feedback summary

The strongest signal is that AgentLoopKit already generates practical policy files, but users and agents need a direct CLI path to read them. A small read-only `policy` command improves discoverability without turning AgentLoopKit into a policy engine.

## Raw simulated feedback

### Platform Engineer

- What they liked: The repo-local policies give teams a shared baseline.
- What confused them: They had to browse `.agentloop/policies/` manually to see what exists.
- What they would need before using it: A command that can list policies in a repo and show one by name.
- What would make them recommend/star it: JSON output for automation and agents.
- What would make them abandon it: Hidden enforcement or remote policy downloads.

### Power User / Agentic Engineer

- What they liked: Agents can read policies before touching risky areas.
- What confused them: `list-templates` shows bundled files, not the repo's current policy files.
- What they would need before using it: `agentloop policy list` and `agentloop policy show security`.
- What would make them recommend/star it: A short next step when the repo has not run `init`.
- What would make them abandon it: A command that rewrites policy files during inspection.

### AI-Skeptical Senior Engineer

- What they liked: Read-only policy inspection is concrete and deterministic.
- What confused them: Whether this command would claim compliance.
- What they would need before using it: Clear language that policies are guidance, not proof.
- What would make them recommend/star it: Boring file reads with predictable output.
- What would make them abandon it: Compliance theater.

### Open Source Maintainer

- What they liked: A policy command makes README examples easier to understand.
- What confused them: Whether old repos without `.agentloop/policies/` fail hard.
- What they would need before using it: Helpful errors that point to `agentloop init`.
- What would make them recommend/star it: A command that helps contributors find the safety rules before opening a PR.
- What would make them abandon it: Noisy output that hides the actual file names.

### Security Reviewer

- What they liked: The command can avoid network calls and credential access.
- What confused them: Whether `show` could read arbitrary files through path traversal.
- What they would need before using it: Name matching restricted to `.agentloop/policies/*.md`.
- What would make them recommend/star it: Tests for safe lookup and missing policy behavior.
- What would make them abandon it: Any arbitrary path read.

## Product council debate

- Abhi: This supports the wedge. Agents need to see policies before they act.
- Maya: Keep it file-based and read-only. No policy parser.
- Elias: Add README and docs examples, but do not oversell compliance.
- Nora: The command names should be obvious: `policy list` and `policy show`.
- Samir: Do not allow path traversal. Resolve only known Markdown files in `.agentloop/policies/`.
- Lina: Agents will use JSON output if the command returns paths and titles.
- Tom: This is useful if it says "guidance", not "enforced".
- Rachel: This can later support team policy packs, but the MVP should only inspect local files.

## Decision

Add `agentloop policy list` and `agentloop policy show <policy>` as read-only commands. The command reads local generated policies under `.agentloop/policies/`, supports JSON output, and restricts lookups to known Markdown policy files. It should give a clear init suggestion when the policy directory is missing.

## Non-decisions

- No policy enforcement engine.
- No remote policy packs.
- No organization policy registry.
- No automatic policy migration.
- No compliance claims.

## Resulting tasks

- Add a core policy reader with safe name matching.
- Add `agentloop policy list` and `agentloop policy show <policy>`.
- Add Vitest coverage before implementation.
- Add docs and README command examples.
- Update backlog and dogfood notes after verification.

## Success criteria

- `agentloop policy list` shows local policy files and titles.
- `agentloop policy list --json` returns deterministic policy metadata.
- `agentloop policy show security` prints `.agentloop/policies/security-policy.md`.
- `agentloop policy show ../AGENTS.md` does not read outside `.agentloop/policies/`.
- Missing policy setup points users to `agentloop init`.
