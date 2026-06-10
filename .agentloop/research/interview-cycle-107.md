# Interview Cycle 107

## Context

AgentLoopKit is live on npm and GitHub. A real dogfood case appeared while using AgentLoopKit inside another local repo: the harness was useful for Codex, Claude Code, Cursor, and similar agents, but the repo owner did not want to commit `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, or `agentloop.config.json`.

This cycle is simulated internal product-panel output. It is decision support, not evidence from real users.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Cursor Developer
- Open Source Maintainer
- AI-Skeptical Senior Engineer

## Feedback summary

The strongest signal is that AgentLoopKit needs an explicit local-only install path. Users should not have to know Git internals or copy a `.git/info/exclude` snippet by hand. The feature must stay opt-in because teams often want the generated harness committed.

## Raw simulated feedback

### Indie Hacker Using Codex

- Liked: one command can make a repo usable for agent sessions.
- Confused: whether generated files should be committed to every side project.
- Would need before using it: a command that keeps local agent setup out of git.
- Would recommend/star it if: the README shows the local-only path next to normal init.
- Would abandon it if: AgentLoopKit litters repos or forces committed process files.

### Claude Code Power User

- Liked: `AGENTS.md` and `.agentloop/agents/` give agent-readable repo rules.
- Confused: how to dogfood it in a client repo without changing that repo.
- Would need before using it: local instructions that tell agents not to commit the harness.
- Would recommend/star it if: the CLI prints the exact exclude file and undo path.
- Would abandon it if: the tool edits global Git config or shell profiles.

### Cursor Developer

- Liked: local files work with IDE agents because they live in the repo tree.
- Confused: whether Cursor will respect files hidden from git.
- Would need before using it: files still present on disk after local-only init.
- Would recommend/star it if: `git status` stays clean after init.
- Would abandon it if: local-only mode hides the files from the IDE.

### Open Source Maintainer

- Liked: contributors can use AgentLoopKit without adding process files to unrelated PRs.
- Confused: whether maintainers should commit the harness for project-wide use.
- Would need before using it: docs that distinguish local-only from shared setup.
- Would recommend/star it if: local-only mode never touches `.gitignore`.
- Would abandon it if: AgentLoopKit silently changed ignore rules.

### AI-Skeptical Senior Engineer

- Liked: deterministic Git exclude behavior is easy to inspect.
- Confused: whether this is just another prompt pile.
- Would need before using it: evidence that the command does not call APIs or read secrets.
- Would recommend/star it if: it solves the “keep agent artifacts out of my repo” problem cleanly.
- Would abandon it if: the default setup got more magical.

## Product council debate

- Abhi: Make it explicit. Keep normal `init` as the default because shared harnesses are the main wedge.
- Maya: Add this to `init` instead of a new command. Small surface area, easy tests.
- Elias: Document it in README and getting started. Do not bury it in internal docs.
- Nora: The output must say what file changed and how to undo it.
- Samir: Require a Git repo. Do not write `.git/info/exclude` guesses outside Git.
- Lina: Agents need an instruction inside generated files, not only CLI output.
- Tom: This is practical. It solves a real review-noise problem without AI claims.
- Rachel: Useful for pilots before a team chooses to commit the harness.

## Decision

Add `agentloop init --local-only`. It generates the normal harness, adds a marked block to this clone's `.git/info/exclude`, adds local-only instructions to `AGENTS.md` and `AGENTLOOP.md`, supports `--dry-run`, and refuses non-Git folders.

## Non-decisions

- Do not make local-only the default.
- Do not edit `.gitignore`.
- Do not edit global Git config.
- Do not add a cloud policy system or team dashboard.
- Do not claim every agent will obey the files.

## Resulting tasks

- Add local-only init tests for exclude behavior, idempotence, dry-run, and non-Git refusal.
- Implement Git exclude resolution for normal repos and `.git` file worktrees.
- Add CLI output for local-only mode.
- Update README and getting-started docs.
- Record dogfood learnings.

## Success criteria

- `agentloop init --local-only` keeps generated harness files out of `git status` in the current clone.
- The generated agent docs tell agents not to commit the local harness.
- Repeated runs do not duplicate the exclude block.
- Dry-run writes nothing.
- Normal `agentloop init` behavior stays unchanged.
