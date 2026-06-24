# AgentLoop Start Preflight Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `agentloop start` the sharpest existing AgentLoopKit workflow by improving its status model, briefing shape, impact summary, docs, and demo evidence.

**Architecture:** Keep Start as a thin orchestration layer over Context Contract and Evidence Map. Add additive preflight/risk/impact fields in `src/core/agent-start.ts`, keep CLI and MCP command names stable, and update docs/templates around Start as the hero path.

**Tech Stack:** TypeScript, Commander, Vitest, local Markdown docs, VHS demo assets.

---

## File Structure

- Modify `src/core/agent-start.ts`: status/preflight model, risk summary, impact summary, Markdown rendering.
- Modify `src/cli/commands/start.ts`: help copy only if needed.
- Modify `src/core/mcp-tools.ts` and `src/mcp/server.ts`: tests should prove payload includes new fields; implementation may already flow through automatically.
- Modify `tests/agent-start.test.ts`: TDD coverage for new states and compact output.
- Modify `tests/mcp-tools.test.ts` and `tests/mcp-server.test.ts`: new payload assertions if needed.
- Modify `tests/cli-docs-drift.test.ts`: only if command docs drift.
- Modify `README.md`, `docs/context.md`, `docs/cli-reference.md`, `docs/getting-started.md`, `docs/mcp.md`: Start-first docs.
- Modify `docs/assets/readme/agentloopkit-context-contract.tape` and regenerate `docs/assets/readme/agentloopkit-context-contract.gif`.

### Task 1: Add Preflight Model Tests

**Files:**
- Modify: `tests/agent-start.test.ts`
- Modify: `src/core/agent-start.ts`

- [ ] Write failing tests that expect `payload.preflight.state`, `headline`, `reason`, and `task`.
- [ ] Add fixture variants for missing task, missing verification, scope drift, and forbidden files.
- [ ] Assert current ready fixture produces `ready-to-continue` or `review-ready` according to reviewability and next action.
- [ ] Run: `npm test -- tests/agent-start.test.ts`
- [ ] Expected before implementation: fail on missing `preflight`.

### Task 2: Implement Preflight State Selection

**Files:**
- Modify: `src/core/agent-start.ts`

- [ ] Add `AgentStartPreflight` type.
- [ ] Add state selection in this order: forbidden/blocker risk -> missing task -> missing/failed/unknown/stale verification -> scope drift -> reviewable with ship/done next action -> evidence-only -> ready.
- [ ] Keep top-level `status` as the selected preflight state for new output.
- [ ] Add task summary from `evidenceMap.task`.
- [ ] Run: `npm test -- tests/agent-start.test.ts`
- [ ] Expected after implementation: preflight tests pass.

### Task 3: Add Risk and Impact Summary

**Files:**
- Modify: `src/core/agent-start.ts`
- Modify: `tests/agent-start.test.ts`

- [ ] Add `riskSummary` with blocker count, warning count, and top risk codes.
- [ ] Add `impact.summary` as one human-readable estimate string.
- [ ] Keep all existing numeric fields.
- [ ] Assert JSON does not include nested `contextPack` or broad `files`.
- [ ] Run: `npm test -- tests/agent-start.test.ts`

### Task 4: Refine Markdown Rendering

**Files:**
- Modify: `src/core/agent-start.ts`
- Modify: `tests/agent-start.test.ts`

- [ ] Move state, task, and next safe command above Read First.
- [ ] Keep output bounded and single-line Markdown-safe for dynamic values.
- [ ] Ensure no double punctuation or bad pluralization.
- [ ] Run: `npm test -- tests/agent-start.test.ts`

### Task 5: MCP and CLI Stability

**Files:**
- Modify: `tests/mcp-tools.test.ts`
- Modify: `tests/mcp-server.test.ts`
- Modify: `src/core/mcp-tools.ts` only if test reveals a gap.

- [ ] Assert `agentloop_start` payload includes `preflight`, `riskSummary`, and `impact.summary`.
- [ ] Run: `npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts`

### Task 6: Docs and Demo

**Files:**
- Modify: `README.md`
- Modify: `docs/context.md`
- Modify: `docs/cli-reference.md`
- Modify: `docs/getting-started.md`
- Modify: `docs/mcp.md`
- Modify: `docs/assets/readme/agentloopkit-context-contract.tape`
- Modify: `docs/assets/readme/agentloopkit-context-contract.gif`

- [ ] Rewrite the Start section around "agents stop guessing."
- [ ] Explain Context as the lower-level receipt under Start.
- [ ] Update ASCII diagram labels to "Start Preflight".
- [ ] Update demo tape to run `agentloop start` first.
- [ ] Regenerate GIF with `vhs docs/assets/readme/agentloopkit-context-contract.tape`.
- [ ] Run: `npm run check:public-docs`

### Task 7: Bug, Security, Performance, and Verification Passes

**Files:**
- Review all changed files.

- [ ] Run focused tests after each implementation change.
- [ ] Run invalid option checks for `agentloop start --json`.
- [ ] Run security scan for file writes, command execution, network calls, env reads, publish/tag behavior in touched code.
- [ ] Run performance comparison: `time node dist/cli/index.js start --for codex --goal implement --redact-paths`.
- [ ] Run: `npm run typecheck`
- [ ] Run: `npm test`
- [ ] Run: `npm run check:public-docs`
- [ ] Run: `npm run dogfood`
- [ ] Run: `node dist/cli/index.js verify --task-commands --only-task-commands --progress --write-run --redact-paths`
- [ ] Run: `node dist/cli/index.js ship --redact-paths`
- [ ] Run: `node dist/cli/index.js prepare-pr --redact-paths`

## Self-Review

- Spec coverage: plan covers model, output, JSON/MCP, docs/demo, bug/security/performance/full verification.
- Placeholder scan: no TBD/TODO placeholders.
- Type consistency: `preflight`, `riskSummary`, and `impact.summary` names are consistent across tasks.
