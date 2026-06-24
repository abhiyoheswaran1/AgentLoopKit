# AgentLoop Start Preflight Polish Design

## Goal

Make `agentloop start` feel like the product's hero workflow: the shortest, most decisive repo-native briefing a software agent can run before broad reads.

## Product Promise

`agentloop start` should answer the agent's first question: "What is true in this repo right now, what should I read next, what should I avoid, and what proof is missing?"

The output stays local, deterministic, and auditable. It does not become a wrapper, provider proxy, prompt rewriter, or compression layer.

## Current Shape

The current Start command already composes Context Contract, Evidence Map, verification freshness, run ledger, source handles, and context-budget estimates. It returns Markdown, JSON, and MCP payloads.

The remaining gap is product sharpness:

- status values are too generic for the user-facing promise
- the top of the briefing does not clearly show the task and next safe action
- risk summary and impact summary are useful but not scannable enough
- docs still explain Start and Context as adjacent surfaces instead of one hero workflow with Context underneath
- demo assets still emphasize the lower-level context loop more than Start

## Proposed Improvement

Refine existing Start behavior without adding a new subsystem.

### Sharper Status Model

Expose a `preflight` object with:

- `state`: `ready-to-continue`, `needs-task`, `needs-verification`, `scope-drift`, `review-ready`, `blocked-by-risk`, or `evidence-only`
- `headline`: short human line
- `reason`: one sentence explaining why the state was selected
- `task`: active task title/path/status when available

Keep the existing top-level `status` field for compatibility, but make it mirror `preflight.state` where possible.

### Compact Briefing Shape

Markdown order:

1. headline and state
2. active task
3. next safe command
4. read-first handles
5. do-not-broad-scan summary
6. risk summary
7. impact ledger
8. source handles
9. safety boundary

The first screen should tell a user whether the agent can continue, should verify, should create/pin a task, or should stop for risk.

### Better Risk Summary

Add a compact `riskSummary` object:

- `blockers`
- `warnings`
- `topRisks`

Do not remove detailed risks. The summary exists so humans and agents do not need to count risk rows.

### Better Impact Summary

Keep current impact fields, and add a human-readable `impact.summary` string such as:

`Avoided about 651 estimated context tokens by using source handles instead of broad changed-file context.`

This is still a planning estimate, not a provider tokenizer or billing claim.

### Source Handles Stay the Trust Layer

No file-content dumping. Start only returns handles and commands:

- `task:active`
- `evidence-map:current`
- `verification:latest`
- `context-budget:current`
- `run:latest`

Agents expand source truth only when needed through `agentloop context show <handle>`.

## Compatibility

- Existing CLI flags stay unchanged.
- JSON remains stable enough for current consumers; new fields are additive except top-level `status` gains more precise values.
- MCP `agentloop_start` returns the improved Start result without changing the tool name.
- Context Contract remains the lower-level detailed receipt.

## Safety Boundary

Start remains read-only. It must not:

- run verification
- read changed file contents
- read `.env` contents
- call LLMs or external APIs
- intercept prompts
- proxy provider traffic
- post comments
- publish packages
- create tags
- upload files
- mutate task, Git, release, or package state

## Documentation and Demo

README and context docs should lead with Start:

- "agents stop guessing" as the headline
- token/context reduction as measurable proof, not the core claim
- ASCII diagram centered on Start Preflight
- refreshed terminal demo that runs `agentloop start` first

## Acceptance

- Start status states are decisive and goal-aware.
- Markdown first screen shows state, task, next command, read-first handles, risk, and impact.
- JSON/MCP include preflight, risk summary, and impact summary.
- Docs and README center Start as the hero workflow.
- Tests cover ready, missing task, missing verification, scope drift, forbidden/risk-sensitive paths, compact JSON, and MCP payload.
- Bug, security, performance, docs, and full verification passes complete.
