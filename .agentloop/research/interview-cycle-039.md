# Interview Cycle 39

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now has a richer CLI workflow: task creation, task listing, task reading, active task pinning, task status updates, status, verify, handoff, and install-agent commands. Repeat users still need to remember subcommands and task subcommands manually.

## Personas interviewed

- Developer Experience Designer
- Power User / Agentic Engineer
- Open Source Maintainer
- AI-Skeptical Senior Developer
- Security Reviewer

## Feedback summary

The strongest signal is CLI ergonomics. Shell completions are useful for repeat users and easy to explain, but the command must only print scripts. It should not modify `.zshrc`, `.bashrc`, fish config, or any user shell profile.

## Raw simulated feedback

### Developer Experience Designer

- What they liked: The command set is now broad enough that tab completion matters.
- What confused them: Users need install instructions that do not look like magic.
- What they would need before using it: `agentloop completion zsh` with copy-pasteable setup examples.
- What would make them recommend/star it: Completion includes nested task commands.
- What would make them abandon it: A command that edits dotfiles without asking.

### Power User / Agentic Engineer

- What they liked: `task status` makes the loop smoother.
- What confused them: Remembering exact command names slows long sessions.
- What they would need before using it: bash, zsh, and fish support.
- What would make them recommend/star it: Completion covers `install-agent` names and task status values.
- What would make them abandon it: Completion scripts that call network services or mutate repo state.

### Open Source Maintainer

- What they liked: Shell completions are a familiar CLI polish feature.
- What confused them: How the scripts are generated and maintained.
- What they would need before using it: Tests that assert command names are present.
- What would make them recommend/star it: No new dependency and clear docs.
- What would make them abandon it: Generated scripts that are too clever to review.

### AI-Skeptical Senior Developer

- What they liked: This is practical, not AI theater.
- What confused them: Whether completion requires installing globally.
- What they would need before using it: Script output they can inspect before installing.
- What would make them recommend/star it: Plain static scripts.
- What would make them abandon it: Auto-install behavior in shell profiles.

### Security Reviewer

- What they liked: Printing completion scripts is low risk.
- What confused them: Shell integration often becomes a dotfile mutation path.
- What they would need before using it: Explicit no-dotfile-write behavior.
- What would make them recommend/star it: No network calls, no eval in the CLI, no credential access.
- What would make them abandon it: Any hidden shell execution.

## Product council debate

- Abhi: Build it. This is a launch-polish feature people expect from CLIs.
- Maya: Keep scripts static and covered by tests.
- Elias: Add README examples, but keep install caveats honest.
- Nora: Command shape should be `agentloop completion <shell>`.
- Samir: Print only; never edit dotfiles.
- Lina: Include nested task commands, agent names, and status values.
- Tom: If it is inspectable, it earns its place.
- Rachel: This helps teams standardize local usage without a platform.

## Decision

Add `agentloop completion <bash|zsh|fish>` as a static script generator. The command prints to stdout, supports JSON-free plain shell output, rejects unsupported shells, and never writes shell profile files.

## Non-decisions

- Do not add automatic shell-profile installation.
- Do not add shell detection.
- Do not add a completion daemon or dynamic shell execution.
- Do not add dependencies.

## Resulting tasks

- Add failing tests for bash, zsh, fish, and unsupported shell output.
- Implement `src/core/completions.ts`.
- Add `src/cli/commands/completion.ts`.
- Wire the command into the CLI.
- Update README and getting-started docs.
- Dogfood, verify, and record findings.

## Success criteria

- `agentloop completion zsh` includes top-level commands, nested task commands, task status values, and install-agent names.
- `agentloop completion bash` and `agentloop completion fish` print scripts for the same command surface.
- Unsupported shells fail with a clear error.
- Docs make it clear that AgentLoopKit prints scripts and does not edit shell profiles.
