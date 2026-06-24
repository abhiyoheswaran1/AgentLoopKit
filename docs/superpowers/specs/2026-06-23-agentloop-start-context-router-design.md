# AgentLoop Start Context Router Design

## Summary

AgentLoopKit should become the first local command a software agent runs in a repo. `agentloop start` will turn the current task contract, evidence map, verification state, run ledger, and context budget into a compact briefing that tells the agent what to read first, what not to broad-scan, what risk needs attention, how much context pressure was avoided, and which local handles expand source truth.

## Product Shape

Add a top-level command:

```bash
agentloop start --for codex --goal implement --redact-paths
agentloop start --for claude --goal review --json
```

Supported targets match Context Contract targets: `codex`, `claude`, `cursor`, `generic`, and `human`.

Supported goals are `implement`, `continue`, `review`, `debug`, `handoff`, and `research`. The `implement` goal maps to the existing continuation evidence pack because it needs the same task, diff, verification, and next-action facts before file reads.

## Architecture

Create `src/core/agent-start.ts` as a thin orchestration layer over `buildContextPack`. It will not introduce a separate workflow engine. The module will:

- build the existing context pack for the selected target and mapped goal
- derive read-first routes from source handles and goal priority
- derive risk warnings from evidence-map verification, scope drift, forbidden files, and risk-sensitive paths
- derive an impact ledger from context-budget and evidence-map data
- render a compact human Markdown briefing and structured JSON

Add `src/cli/commands/start.ts` to parse flags and print Markdown or JSON. Register the command near `status`, `next`, `review-context`, and `context` so it reads as an entry point.

Expose the same read-only behavior as MCP tool `agentloop_start`.

## Data Contract

`AgentStartResult` will include:

- `target`
- `goal`
- `status`
- `summary`
- `readFirst`
- `doNotBroadScan`
- `risk`
- `impact`
- `nextCommand`
- `sourceHandles`
- `markdown`
- `safety`

The JSON shape is additive and local-only. It does not replace `context pack`.

## Impact Ledger

The ledger reports planning metrics, not billing claims:

- `estimatedBroadContextTokens`
- `estimatedCompactBriefTokens`
- `estimatedContextAvoidedTokens`
- `estimatedContextReductionPercent`
- `broadChangedFileCount`
- `broadNonEvidenceFileCount`
- `staleEvidenceCaught`
- `scopeDriftFileCount`
- `verificationFreshness`
- `reviewability`
- `reviewReadinessDelta`

Reduction percentage is `null` when the broad estimate is zero. Negative savings are clamped to zero.

## Router Rules

Route source handles by goal:

- `implement` and `continue`: task, evidence map, verification, context budget, latest run
- `review`: evidence map, verification, task, context budget, latest run
- `debug`: evidence map, verification, task, latest run, context budget
- `handoff`: task, verification, latest run, evidence map, context budget
- `research`: task, evidence map, context budget, latest run, verification

Missing handles are omitted. The briefing still explains missing task or verification evidence through risk warnings and next actions.

## Safety Boundary

`agentloop start` is read-only. It must not run verification, read changed file contents, read `.env` contents, call an LLM, intercept prompts, proxy provider traffic, upload files, post comments, publish packages, create tags, change versions, or mutate task state.

## Docs And Agent Guidance

Generated agent guidance should route agents to `agentloop start --for <target> --goal implement --redact-paths` before broad repo reads. Context docs should position `agentloop context` as the expandable lower-level contract surface behind `start`.

README and CLI reference should make `agentloop start` the first useful command after task creation.

## Test Strategy

Use TDD:

- CLI Markdown output includes read-first handles, do-not-broad-scan guidance, risk, impact, next command, and safety boundary.
- CLI JSON output exposes stable target, goal, read-first, impact, source handles, and safety fields.
- Goal routing changes read-first priority for `review`.
- Stale or missing verification produces risk and review-readiness signals.
- MCP lists and serves `agentloop_start`.
- Docs drift tests cover the new command.

## Non-Goals

- No release, tag, version bump, publish, registry update, Marketplace work, dependency addition, hosted state, telemetry, proxy mode, prompt rewriting, provider tokenization, billing-token claims, or external research collection.
