# Interview Cycle 1

## Context

AgentLoopKit has an MVP CLI with init, doctor, create-task, verify, summarize, install-agent, templates, docs, examples, tests, config schema, and dry-run init. This cycle focuses on first-time user experience.

## Personas interviewed

- Indie Hacker Using Codex
- Open Source Maintainer
- AI-Skeptical Senior Engineer
- Agency Developer

## Feedback summary

The first run works, but the generated `.agentloop/` directory needs a clear index. Users understand `AGENTS.md` and `AGENTLOOP.md`, but `.agentloop/loops`, `gates`, `handoffs`, and `policies` feel like a lot of files without a "start here" page.

## Raw simulated feedback

### Indie Hacker Using Codex

- Liked: `npx agentloopkit init` and `init --dry-run`.
- Confused: what to open after init.
- Needs before using it: a next command that creates a real task.
- Would recommend/star: if the generated setup feels useful in under two minutes.
- Would abandon: if it looks like process overhead before shipping.

### Open Source Maintainer

- Liked: no telemetry, no postinstall, issue templates, CI.
- Confused: whether generated reports should be committed.
- Needs before using it: clear reviewer-facing handoff examples.
- Would recommend/star: if contributors can follow it without training.
- Would abandon: if generated files feel noisy.

### AI-Skeptical Senior Engineer

- Liked: deterministic outputs and no LLM dependency.
- Confused: whether this is methodology or a real tool.
- Needs before using it: proof that commands create useful artifacts.
- Would recommend/star: if it reduces review friction.
- Would abandon: if it produces markdown nobody reads.

### Agency Developer

- Liked: reusable repo install and examples.
- Confused: how to explain `.agentloop/` to a client.
- Needs before using it: concise directory map.
- Would recommend/star: if every client repo can get the same baseline.
- Would abandon: if setup requires custom training per repo.

## Product council debate

- Abhi: "The wedge is first-run clarity. Add a local `.agentloop/README.md`."
- Maya: "Do it with a static template. No new dependency."
- Elias: "This improves trust because users can inspect generated structure."
- Nora: "The generated directory needs a start page with copy-paste commands."
- Samir: "Do not hide what gets written. Keep dry-run useful."
- Lina: "Agents also need a directory map."
- Tom: "Make the README practical, not philosophical."
- Rachel: "This helps team onboarding without adding bureaucracy."

## Decision

Add generated `.agentloop/README.md` with next commands and a directory map.

## Non-decisions

- Do not add a UI.
- Do not generate HTML reports yet.
- Do not auto-commit generated files.

## Resulting tasks

- Add template for `.agentloop/README.md`.
- Update init to create it.
- Update init dry-run results.
- Add tests.

## Success criteria

- `agentloop init` creates `.agentloop/README.md`.
- `agentloop init --dry-run` reports it without writing files.
- New users get an obvious next command.
