# Interview Cycle 5

## Context

AgentLoopKit has npm releases, README visuals, task contracts, verification reports, and PR summaries. The strongest remaining P1 backlog item is a quick local state readout for active agentic work.

## Personas interviewed

- Power User / Agentic Engineer
- Developer Experience Designer
- AI-Skeptical Senior Engineer
- Open Source Maintainer
- Small Team CTO

## Feedback summary

The strongest signal: users need one command that tells them where they are in the loop. The panel preferred a deterministic `status` command over a dashboard or HTML report.

## Raw simulated feedback

### Power User / Agentic Engineer

- Liked: task contracts and verification reports.
- Confused: which task/report the agent should treat as current.
- Needs before using it: a one-screen status command.
- Would recommend/star it if: agents can call one command before continuing work.
- Would abandon it if: status runs tests or mutates files.

### Developer Experience Designer

- Liked: `init`, `doctor`, and README visuals.
- Confused: after `create-task`, the next step is spread across docs.
- Needs before using it: a next action in terminal output.
- Would recommend/star it if: the command works in Markdown and JSON.
- Would abandon it if: output is too verbose.

### AI-Skeptical Senior Engineer

- Liked: deterministic output.
- Confused: whether the tool helps reviewability beyond generating markdown.
- Needs before using it: evidence of dirty files, latest report, and missing checks.
- Would recommend/star it if: status helps reviewers see current risk quickly.
- Would abandon it if: it infers semantic intent it cannot prove.

### Open Source Maintainer

- Liked: no telemetry and no postinstall behavior.
- Confused: how contributors know what evidence to provide before opening a PR.
- Needs before using it: a status command contributors can paste into issue/PR context.
- Would recommend/star it if: output stays plain and copyable.
- Would abandon it if: command output depends on local-only state that cannot be explained.

### Small Team CTO

- Liked: team consistency without a SaaS.
- Confused: how managers know whether agent work is ready for review.
- Needs before using it: local status that junior engineers and agents can run.
- Would recommend/star it if: it gives a next step without adding process meetings.
- Would abandon it if: it becomes a project management tool.

## Product council debate

- Abhi: This strengthens the wedge: repo-level engineering loop, not a dashboard.
- Maya: Keep it read-only and deterministic. No command execution.
- Elias: The command gives README readers a concrete reason to install.
- Nora: The next action matters more than a long report.
- Samir: Status must not read secrets or run arbitrary configured commands.
- Lina: Agents should call this before resuming work.
- Tom: Show evidence, not confidence.
- Rachel: This helps teams standardize without buying process software.

## Decision

Add `agentloop status` and `agentloop status --json`. It reads config, latest task, latest report, git status, configured commands, and emits a deterministic next action.

## Non-decisions

- No dashboard.
- No watch mode.
- No cloud state.
- No semantic code interpretation.

## Resulting tasks

- Add status core model and Markdown renderer.
- Add CLI command and JSON flag.
- Fix version output to read from `package.json`.
- Add Vitest coverage.
- Update docs and release notes.

## Success criteria

- `agentloop status` works in an initialized repo.
- `agentloop status --json` is machine-readable.
- The command does not execute verification commands.
- Tests, typecheck, build, and projscan pass.
