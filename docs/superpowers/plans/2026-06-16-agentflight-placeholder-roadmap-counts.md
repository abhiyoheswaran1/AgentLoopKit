# AgentFlight Placeholder Roadmap Counts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep exact AgentFlight placeholder task contracts visible without treating them as actionable roadmap tasks.

**Architecture:** Classify exact AgentFlight placeholder Markdown while reading task metadata. Use that classification in fallback task selection, status, next, and task list rendering so preserved placeholders are separate from custom deferred tasks.

**Tech Stack:** TypeScript core task-state/status modules, Commander CLI rendering, Vitest integration tests.

---

### Task 1: Lock Task Metadata Classification

**Files:**
- Modify: `tests/task-state.test.ts`
- Modify: `src/core/task-state.ts`

- [ ] **Step 1: Write failing task-state tests**

Add a test with an exact AgentFlight placeholder contract:

```markdown
# Separate AgentFlight placeholders from roadmap task counts

- Status: deferred

## Problem Statement
AgentFlight session task: Separate AgentFlight placeholders from roadmap task counts

## Desired Outcome
Task is implemented with local verification evidence.
```

Assert `task list --json` includes `source: "agentflight-placeholder"` for that task and does not set `source` for a custom deferred task.

- [ ] **Step 2: Run RED check**

Run:

```bash
npm test -- tests/task-state.test.ts
```

Expected: FAIL because task metadata does not classify placeholders.

### Task 2: Separate Placeholder Counts In Status And Next

**Files:**
- Modify: `tests/status.test.ts`
- Modify: `tests/next.test.ts`
- Modify: `src/core/status.ts`
- Modify: `src/cli/commands/next.ts`

- [ ] **Step 1: Write failing status and next tests**

Create fixtures with one custom deferred task and one exact AgentFlight placeholder. Assert:

- `deferredTasks` includes only the custom deferred task.
- `agentFlightPlaceholderTasks` includes the placeholder.
- Human output has separate `Deferred tasks` and `AgentFlight placeholders` lines.
- `next` reasons use only the custom deferred count.

- [ ] **Step 2: Run RED check**

Run:

```bash
npm test -- tests/status.test.ts tests/next.test.ts
```

Expected: FAIL because placeholders are still included in deferred task counts and no separate list exists.

### Task 3: Implement Classification And Rendering

**Files:**
- Modify: `src/core/task-state.ts`
- Modify: `src/core/status.ts`
- Modify: `src/cli/commands/next.ts`
- Modify: `src/cli/commands/task.ts`

- [ ] **Step 1: Add exact placeholder detection**

In task-state metadata parsing, detect only contracts whose heading, `AgentFlight session task: <title>` problem statement, and `Task is implemented with local verification evidence.` desired outcome match.

- [ ] **Step 2: Exclude placeholders from fallback and deferred-roadmap counts**

Skip `source: "agentflight-placeholder"` in fallback task selection. In status, populate `agentFlightPlaceholderTasks` separately and exclude them from `deferredTasks`.

- [ ] **Step 3: Label placeholders in CLI output**

Render task list placeholders with a concise `AgentFlight placeholder` label. Render status/next placeholder lists separately while preserving JSON detail.

- [ ] **Step 4: Run targeted GREEN check**

Run:

```bash
npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts
```

Expected: PASS.

### Task 4: Bug Pass And Evidence

**Files:**
- Inspect changed files from Tasks 1-3.

- [ ] **Step 1: Run static checks**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 2: Run task verification**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts-2.md --task-commands --only-task-commands --write-run --redact-paths --progress
```

Expected: PASS.

- [ ] **Step 3: Run bug pass**

Run:

```bash
npm test
npm run dogfood:strict
```

Expected: PASS without release, version, tag, Marketplace, npm publish, GHCR, or MCP Registry actions.
