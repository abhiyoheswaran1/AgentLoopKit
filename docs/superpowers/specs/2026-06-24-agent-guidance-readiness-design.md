# Agent Guidance Readiness Design

## Goal

Make existing AgentLoopKit repos auditable for the new Start/Context workflow before release.

The release already makes `agentloop start` the agent entry point. The remaining risk is that an older repo can keep generated guidance that mentions review-readiness commands, but never tells software agents to run Start before broad repo reads or expand source handles with `agentloop context show <handle>`.

## Product Decision

Add an upgrade-readiness topic to the existing harness audit rather than creating a new command.

`doctor` already calls `upgrade-harness`, and `upgrade-harness` already reports missing topics with copyable guidance. Extending that path keeps setup checks deterministic, read-only, and easy for existing users to understand.

## Behavior

`upgrade-harness` will treat Start/Context guidance as a current-loop topic. A harness file is current only when it mentions the agent preflight entry point and the source-handle expansion path.

The new topic is named `agent-start`. It is present when generated guidance contains evidence of:

- `agentloop start`
- `agentloop context show`

When missing, `upgrade-harness --details` will print copyable guidance that tells agents to run:

```text
agentloop start --for generic --goal implement --redact-paths
agentloop context show <handle>
```

`doctor` will keep its existing `Harness guidance` check. Its warning and next-action copy will be widened from "review-readiness loop topics" to "current agent-readiness topics" so users know the fix covers Start/Context as well as ship and PR evidence.

## User-Facing Docs

README, CLI reference, and getting-started docs should explain that:

- existing repos can run `doctor` and `upgrade-harness --details` to check whether their agent guidance points to Start
- the check is read-only and does not overwrite local instructions
- context-budget numbers are transparent planning estimates, not provider-token or billing claims

## Safety

This work is read-only diagnostics plus docs. It must not:

- mutate existing harness files during `doctor` or `upgrade-harness`
- run verification commands
- read `.env` contents
- call LLMs, provider APIs, GitHub APIs, or registry APIs
- publish, tag, upload, or bump package versions

## Tests

Add focused coverage:

- old harness guidance reports missing `agent-start`
- `upgrade-harness --details` includes Start/Context copyable guidance
- freshly initialized harness guidance passes the new topic
- `doctor` warning and next-action copy mention agent-readiness topics including Start/Context
