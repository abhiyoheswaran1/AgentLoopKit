# Artifact Inventory AgentFlight Placeholders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep `agentloop artifacts` task counts aligned with `status` and `next` by separating exact AgentFlight placeholders from ordinary task artifacts.

**Architecture:** Reuse task-state metadata parsing for task artifacts so placeholder classification is consistent. Keep placeholders visible in task artifact listings while excluding them from ordinary task counts and status counts.

**Tech Stack:** TypeScript artifact inventory module, Commander CLI rendering, Vitest integration tests, Markdown CLI docs.

---

### Task 1: Lock Artifact Placeholder Inventory

**Files:**
- Modify: `tests/artifacts.test.ts`
- Modify: `src/core/artifacts.ts`

- [ ] **Step 1: Write failing artifact tests**

Create a repo fixture with one ordinary task and one exact AgentFlight placeholder. Assert:

- `artifacts --json` reports `tasks.count` for ordinary tasks only.
- `tasks.agentFlightPlaceholderCount` is `1`.
- `tasks.agentFlightPlaceholders.latest` contains the placeholder task with `source: "agentflight-placeholder"`.
- `artifacts --type task --latest` still exposes the latest task artifact, including placeholders when they are latest.

- [ ] **Step 2: Run RED check**

Run:

```bash
npm test -- tests/artifacts.test.ts
```

Expected: FAIL because artifact inventory does not classify placeholders yet.

### Task 2: Implement Consistent Artifact Classification

**Files:**
- Modify: `src/core/artifacts.ts`
- Modify: `tests/artifacts.test.ts`

- [ ] **Step 1: Use task metadata parsing**

Replace the local task artifact Markdown parser with `readTaskMetadata(cwd, file.filePath)` so artifacts inherit exact placeholder detection.

- [ ] **Step 2: Split task summaries**

Compute ordinary tasks as `source !== "agentflight-placeholder"` and placeholder tasks as `source === "agentflight-placeholder"`. Keep `all` task artifacts available for filtered task output.

- [ ] **Step 3: Render placeholder summaries**

Add Markdown output for preserved AgentFlight placeholders and keep filtered task output able to show their label.

- [ ] **Step 4: Run targeted GREEN check**

Run:

```bash
npm test -- tests/artifacts.test.ts
```

Expected: PASS.

### Task 3: Docs And Evidence

**Files:**
- Modify: `docs/cli-reference.md`
- Active task contract under `.agentloop/tasks/`

- [ ] **Step 1: Update docs**

Document that `artifacts` reports preserved AgentFlight placeholder task artifacts separately from ordinary task counts.

- [ ] **Step 2: Run verification**

Run:

```bash
npm run check:public-docs
npm run check:links
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory-2.md --task-commands --only-task-commands --write-run --redact-paths --progress
```

Expected: PASS.

- [ ] **Step 3: Run bug pass**

Run:

```bash
npm test
npm run dogfood:strict
```

Expected: PASS without release, version, tag, Marketplace, npm publish, GHCR, or MCP Registry actions.
