# AGENTS

<!-- agentloopkit:start -->

This repository uses AgentLoopKit.

Before changing code:

- Read AGENTLOOP.md.
- Check .agentloop/tasks/ for an active task contract.
- Use `agentloop task list` to inspect available task contracts before choosing one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop task archive <path>` only after verification and handoff are complete.
- Run `agentloop status` when you need the current task, verification, dirty-file, and next-action state.
- Run `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` before touching security, dependency, database, git, public API, or secret-handling areas.
- Treat local `.agentloop/policies/*.md` files as the repo's safety guidance. A `modified` policy is a local decision to review, not a failure.
- Run `agentloop check-gates` before stopping to check review evidence.
- Run `agentloop report` after verification and handoff when a local HTML evidence artifact helps review.
- Run `agentloop badge` when a local SVG evidence badge helps review or CI artifact uploads.
- Run `agentloop ci-summary --write` in CI when reviewers need a compact provenance and evidence summary.
- Run `agentloop release-notes --write` before a release when reviewers need local release-note evidence.
- Follow the Specify, Constrain, Plan, Implement, Verify, Review, Handoff loop.
- Keep changes small and tied to the task contract.
- Do not run destructive git or filesystem commands unless the user asks for them.
- Do not read or print secrets. If env files exist, mention only their paths.
- Run the configured verification commands before claiming completion.
- Generate a handoff summary with changed files, tests run, risks, and rollback notes.

Safety rules:

- Treat migrations, auth, billing, deployment, lockfiles, public APIs, and security code as high-risk.
- Do not change dependencies without a clear reason and verification plan.
- Preserve existing user work. Do not revert unrelated changes.
- Update DECISIONS.md when architecture or public behavior changes.
<!-- agentloopkit:end -->
