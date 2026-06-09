# AGENTS

<!-- agentloopkit:start -->

This repository uses AgentLoopKit.

Before changing code:

- Read AGENTLOOP.md.
- Check .agentloop/tasks/ for an active task contract.
- Use `agentloop task list` to inspect available task contracts before choosing one.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Run `agentloop status` when you need the current task, verification, dirty-file, and next-action state.
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
