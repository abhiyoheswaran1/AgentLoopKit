# AgentLoop Start Truth Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Start and Context use strict current-work task evidence so archived completed work is never labeled active.

**Architecture:** Add an evidence-map task mode that separates review evidence fallback from current-work task selection. Start and Context opt into current-work mode; review surfaces keep the existing fallback. Tests pin the archived-run and archived-active-pointer regressions.

**Tech Stack:** TypeScript, Vitest, Node CLI via `tsx`, existing AgentLoopKit task-state and evidence-map modules.

---

### Task 1: Regression Tests

**Files:**
- Modify: `tests/agent-start.test.ts`
- Modify: `tests/context-contract.test.ts`

- [ ] Add an archived-run fixture with no active task and a latest run that points to an archived done task.
- [ ] Assert `agentloop start --json` returns `preflight.task: null`, `preflight.state: needs-task`, no `task:active` read-first route, and a next command that is not `agentloop ship`.
- [ ] Assert `agentloop context pack --json` returns `evidenceMap.task: null`, no `task:active` handle, and Markdown that does not label the archived task active.
- [ ] Add an archived-active-pointer fixture and assert `agentloop context show task:active` fails with `CONTEXT_HANDLE_EMPTY`.
- [ ] Run the focused tests and confirm they fail for the expected reason before implementation.

### Task 2: Current-Work Task Evidence

**Files:**
- Modify: `src/core/evidence.ts`
- Modify: `src/core/evidence-map.ts`
- Modify: `src/core/context-contract.ts`

- [ ] Add a current-work task resolver that accepts only open real tasks outside `.agentloop/tasks/archive`.
- [ ] Add a `taskEvidenceMode` option to `buildEvidenceMap`, defaulting to existing latest-run fallback behavior.
- [ ] Use current-work mode in `buildContextBudgetContract`, `buildContextPack`, and `showContextHandle` for `evidence-map:current`.
- [ ] Use the current-work resolver for `context show task:active`.
- [ ] Run the focused tests and confirm they pass.

### Task 3: Start Copy And Docs

**Files:**
- Modify: `README.md`
- Modify: `docs/context.md`
- Modify: `docs/cli-reference.md`
- Modify: `docs/mcp.md`

- [ ] Document the Start Guarantee: Start reports current work only, previous evidence is not active work, and source handles expand local truth.
- [ ] Keep token-saving language as transparent context estimates, not billing claims.
- [ ] Avoid unsupported “AI coding assistant” and “AI-assisted” positioning.
- [ ] Run public docs hygiene and stop-slop scan.

### Task 4: Verification Passes

**Files:**
- Evidence written under `.agentloop/` and `.agentflight/`

- [ ] Run focused Start and Context tests.
- [ ] Run `npm run test:unit`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run check:public-docs`.
- [ ] Run `npm run dogfood`.
- [ ] Run security inspection for new file reads, command execution, env reads, network behavior, mutation, publish, tag, and version changes.
- [ ] Run performance measurement for `agentloop start`.
- [ ] Run AgentFlight report and AgentLoop ship/handoff evidence.
