# Dogfood Placeholder Task Clutter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep `npm run dogfood:start` from leaving an AgentFlight placeholder task beside the detailed AgentLoop task.

**Architecture:** Leave AgentFlight behavior unchanged and keep AgentLoop task files as durable evidence. Add a bounded helper inside `scripts/dogfood-start.mjs` that detects only exact same-title AgentFlight placeholder contracts and parks them with `agentloop task status <path> deferred` after the detailed task contract is created.

**Tech Stack:** Node.js helper script, Vitest, Markdown harness docs, AgentLoopKit source CLI through `tsx`.

---

### Task 1: Lock Placeholder Detection

**Files:**
- Modify: `tests/dogfood-start-script.test.ts`
- Modify: `scripts/dogfood-start.mjs`

- [ ] **Step 1: Write failing tests**

Add tests that create a temporary `.agentloop/tasks/` directory with:

```markdown
# Prevent dogfood start placeholder task clutter

- Created date: 2026-06-16
- Task type: feature
- Status: proposed

## Problem Statement
AgentFlight session task: Prevent dogfood start placeholder task clutter

## Desired Outcome
Task is implemented with local verification evidence.
```

The test should assert that the new exported detector returns only this placeholder path and ignores a same-title detailed contract whose problem statement is not the AgentFlight placeholder text.

- [ ] **Step 2: Run targeted RED check**

Run:

```bash
npm test -- tests/dogfood-start-script.test.ts
```

Expected: FAIL because the detector does not exist yet.

### Task 2: Park Exact Placeholder Duplicates

**Files:**
- Modify: `scripts/dogfood-start.mjs`
- Modify: `tests/dogfood-start-script.test.ts`

- [ ] **Step 1: Implement minimal detector**

Add `findAgentFlightPlaceholderTaskPaths({ cwd, title })` that:

- Reads only direct Markdown files under `.agentloop/tasks/`.
- Matches `# <title>`.
- Requires `- Status: proposed`.
- Requires `AgentFlight session task: <title>`.
- Requires `Task is implemented with local verification evidence.`
- Returns relative paths using forward slashes.

- [ ] **Step 2: Add dogfood cleanup step**

After the `agentloop task contract` step passes, call the detector and run one `agentloop task status <path> deferred` step per match. Keep the existing status and ProjScan steps after cleanup so the final status reflects the parked placeholder.

- [ ] **Step 3: Run targeted GREEN check**

Run:

```bash
npm test -- tests/dogfood-start-script.test.ts
```

Expected: PASS.

### Task 3: Document The Behavior

**Files:**
- Modify: `.agentloop/harness/autonomous-dogfooding.md`
- Modify: `tests/autonomous-dogfood.test.ts`

- [ ] **Step 1: Update harness guide**

Explain that `dogfood:start` parks exact AgentFlight placeholder duplicates after creating the detailed AgentLoop task. State that it does not delete task evidence and does not touch custom task contracts.

- [ ] **Step 2: Lock docs wording with tests**

Update `tests/autonomous-dogfood.test.ts` so future edits keep the placeholder parking behavior documented.

- [ ] **Step 3: Run docs-targeted tests**

Run:

```bash
npm test -- tests/dogfood-start-script.test.ts tests/autonomous-dogfood.test.ts
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
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter-2.md --task-commands --only-task-commands --write-run --redact-paths --progress
```

Expected: PASS.

- [ ] **Step 3: Run dogfood bug pass**

Run:

```bash
npm run dogfood:strict
npx --yes agentflight doctor
```

Expected: PASS without release, version, tag, Marketplace, npm publish, GHCR, or MCP Registry actions.
