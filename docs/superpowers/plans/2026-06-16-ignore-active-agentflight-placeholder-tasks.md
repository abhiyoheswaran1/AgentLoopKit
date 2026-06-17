# Ignore Active AgentFlight Placeholder Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent exact AgentFlight placeholder task contracts from hijacking AgentLoopKit active-task guidance.

**Architecture:** Reuse the existing AgentFlight placeholder classifier in `task-state.ts`. `task doctor` reports a pinned placeholder as a recoverable hygiene warning, while `status` and `next` ignore that placeholder as active and fall back to the newest real open task or `create-task`.

**Tech Stack:** TypeScript core status/task-state logic, Commander CLI output, Vitest CLI integration tests, Markdown docs.

---

### Task 1: Regression Tests

**Files:**
- Modify: `tests/task-state.test.ts`
- Modify: `tests/status.test.ts`
- Modify: `tests/next.test.ts`

- [ ] **Step 1: Add task doctor regression**

Add coverage where `.agentloop/state.json` points at an exact AgentFlight placeholder task. Expected diagnostic: `active-task-agentflight-placeholder` with recovery commands.

- [ ] **Step 2: Add status regression**

Add coverage where the active pointer is an exact AgentFlight placeholder and a separate real open task exists. Expected JSON: `activeTask === null`, `latestTask` is the real task, and `agentFlightPlaceholderTasks` includes the placeholder.

- [ ] **Step 3: Add next regression**

Add matching `next --json` coverage. Expected command: `agentloop task set <real task path>`.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts`

Expected: FAIL because the current implementation treats the pinned placeholder as active and task doctor does not warn.

### Task 2: Source Changes

**Files:**
- Modify: `src/core/task-state.ts`
- Modify: `src/core/status.ts`

- [ ] **Step 1: Add task doctor diagnostic**

When `activeTask.source === 'agentflight-placeholder'`, add a warning diagnostic with bounded recovery commands: `agentloop task clear`, `agentloop task set <path>`, and `agentloop create-task`.

- [ ] **Step 2: Ignore active placeholders in status**

In `getAgentLoopStatus`, keep reading the pinned active path, but if the task source is `agentflight-placeholder`, treat it as no active task and allow `getFallbackTaskPath` to select a real open task.

- [ ] **Step 3: Preserve placeholder inventory**

Ensure the ignored active placeholder remains in `agentFlightPlaceholderTasks` and does not appear in `deferredTasks`.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts`

Expected: PASS.

### Task 3: Docs And Verification

**Files:**
- Modify: `docs/status.md`

- [ ] **Step 1: Document active placeholder behavior**

Add one sentence explaining exact AgentFlight placeholders are preserved but ignored as active status/next work when pinned.

- [ ] **Step 2: Run verification**

Run:

```bash
npm run typecheck
npm run lint
npm run build
npm test
npm run check:public-docs
npm run check:links
```

Expected: all commands exit 0.

- [ ] **Step 3: Capture AgentLoop evidence**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks.md --task-commands --write-run --redact-paths --progress
npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
npm run dogfood:strict
```

Expected: AgentLoop verification and strict dogfood pass.
