# AgentLoop Context Contract V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a unified `agentloop context` surface that measures context pressure, creates auditable context packs, and lets agents retrieve local source truth by handle.

**Architecture:** Add a focused `src/core/context-contract.ts` module that composes existing evidence-map, context-budget, resume-pack target, task-state, run, and artifact helpers. Add a `src/cli/commands/context.ts` command group with `budget`, `pack`, and `show` subcommands. Expose the same read-only behavior through MCP and generated agent guidance.

**Tech Stack:** TypeScript, Commander, Vitest, existing AgentLoopKit core modules, existing Markdown formatting helpers.

---

## File Structure

- Create `src/core/context-contract.ts`: build context budgets, context packs, receipts, handles, and handle expansion.
- Create `src/cli/commands/context.ts`: parse CLI options, validate targets/goals, print Markdown or JSON.
- Modify `src/cli/index.ts`: register `context`.
- Modify `src/core/mcp-tools.ts`: expose `agentloop_context_budget`, `agentloop_context_pack`, and `agentloop_context_show`.
- Modify `src/mcp/server.ts`: update read-only MCP instructions.
- Modify `src/templates/agents/*.md`: teach agents to run context packs before broad reads.
- Modify `docs/cli-reference.md`, `README.md`, and create `docs/context.md`: document context contract, token-saving estimates, receipts, handles, and research boundaries.
- Modify `tests/cli-docs-drift.test.ts`: add `context` to public command drift checks.
- Create `tests/context-contract.test.ts`: cover CLI behavior and core JSON shape.
- Modify `tests/mcp-server.test.ts`: cover MCP context tools.

## Task 1: Failing CLI/Core Tests

**Files:**
- Create: `tests/context-contract.test.ts`
- Modify: `tests/cli-docs-drift.test.ts`

- [ ] **Step 1: Write failing tests for `agentloop context budget`, `pack`, and `show`**

Create `tests/context-contract.test.ts` with a fixture similar to `tests/resume-pack.test.ts`. The tests must assert:

```ts
expect(result.stdout).toContain('# AgentLoopKit Context Budget');
expect(result.stdout).toContain('Estimated changed-file list tokens');
expect(result.stdout).toContain('not a provider tokenizer or billing meter');

expect(pack.stdout).toContain('# AgentLoopKit Context Pack');
expect(pack.stdout).toContain('- Target: `codex`');
expect(pack.stdout).toContain('- Goal: `continue`');
expect(pack.stdout).toContain('## Receipt');
expect(pack.stdout).toContain('## Source Handles');
expect(pack.stdout).toContain('task:active');

expect(show.stdout).toContain('# Fix auth copy');
```

- [ ] **Step 2: Write failing JSON tests**

In the same file, assert that:

```ts
expect(payload.target).toBe('codex');
expect(payload.goal).toBe('continue');
expect(payload.contextBudget.heuristic).toBe('chars-divided-by-four');
expect(payload.receipt.included.length).toBeGreaterThan(0);
expect(payload.receipt.omitted.length).toBeGreaterThan(0);
expect(payload.handles.some((handle: { id: string }) => handle.id === 'task:active')).toBe(true);
expect(payload.safety).toMatchObject({
  readOnly: true,
  localEvidenceOnly: true,
  commandsRun: [],
});
```

- [ ] **Step 3: Update CLI docs drift expected command list**

Add `'context'` to `publicCommands` in `tests/cli-docs-drift.test.ts`.

- [ ] **Step 4: Run tests to verify red**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/context-contract.test.ts tests/cli-docs-drift.test.ts
```

Expected: fail because `context` command and docs do not exist yet.

## Task 2: Core Context Contract Module

**Files:**
- Create: `src/core/context-contract.ts`
- Test: `tests/context-contract.test.ts`

- [ ] **Step 1: Implement targets, goals, and receipt types**

Create constants:

```ts
export const CONTEXT_PACK_GOALS = ['continue', 'review', 'debug', 'handoff', 'research'] as const;
export type ContextPackGoal = (typeof CONTEXT_PACK_GOALS)[number];
```

Reuse `RESUME_PACK_TARGETS` and `ResumePackTarget` from `src/core/resume-pack.ts`.

- [ ] **Step 2: Implement `buildContextBudgetContract`**

Use `buildEvidenceMap` and `buildContextBudget` with:

```ts
savingsCommand: 'agentloop context pack --for codex --goal continue --redact-paths'
```

Return evidence map, context budget, Markdown, and safety metadata.

- [ ] **Step 3: Implement `buildContextPack`**

Build:

- evidence map
- context budget with the exact selected target and goal in `savingsCommand`
- receipt with included sections for task, evidence map, verification, next actions, context budget, and source handles
- omitted sections for chat history, broad file contents, full logs, old runs, and provider traffic
- handles for `task:active`, `verification:latest`, `run:latest`, `evidence-map:current`, and `context-budget:current` when available

- [ ] **Step 4: Implement handle expansion**

Implement `showContextHandle({ cwd, config, handle })`:

- `task:active`: read active task content.
- `verification:latest`: read latest verification report content.
- `run:latest`: read latest run ledger record as JSON.
- `evidence-map:current`: render current evidence map Markdown.
- `context-budget:current`: render current context budget Markdown.

Unsupported handles throw `AgentLoopError` with a clear message listing supported handles.

- [ ] **Step 5: Run context tests**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/context-contract.test.ts
```

Expected: still fail until CLI wiring is complete.

## Task 3: CLI Command Group

**Files:**
- Create: `src/cli/commands/context.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/context-contract.test.ts`

- [ ] **Step 1: Add `context budget`**

Implement:

```bash
agentloop context budget
agentloop context budget --json
agentloop context budget --redact-paths
```

Print the Markdown from `buildContextBudgetContract`, or JSON for scripts.

- [ ] **Step 2: Add `context pack`**

Implement:

```bash
agentloop context pack --for codex --goal continue
agentloop context pack --for claude --goal review
agentloop context pack --for cursor --goal research
agentloop context pack --json --redact-paths
```

Validate targets against `RESUME_PACK_TARGETS` and goals against `CONTEXT_PACK_GOALS`.

- [ ] **Step 3: Add `context show <handle>`**

Implement:

```bash
agentloop context show task:active
agentloop context show verification:latest
agentloop context show run:latest
agentloop context show evidence-map:current
agentloop context show context-budget:current
```

Print Markdown/text by default and `{ handle, content }` for JSON.

- [ ] **Step 4: Register command**

Import and add `contextCommand()` in `src/cli/index.ts` near `review-context`, `explain-diff`, `resume-pack`, and `guard`.

- [ ] **Step 5: Run context tests**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/context-contract.test.ts
```

Expected: pass for CLI behavior.

## Task 4: MCP Context Tools

**Files:**
- Modify: `src/core/mcp-tools.ts`
- Modify: `src/mcp/server.ts`
- Modify: `tests/mcp-server.test.ts`

- [ ] **Step 1: Add MCP tool definitions**

Add:

- `agentloop_context_budget`
- `agentloop_context_pack`
- `agentloop_context_show`

Inputs:

- `agentloop_context_pack`: optional `target`, optional `goal`
- `agentloop_context_show`: required `handle`

- [ ] **Step 2: Wire MCP tool calls**

Reuse `buildContextBudgetContract`, `buildContextPack`, and `showContextHandle`.

- [ ] **Step 3: Update MCP server instructions**

Mention context budgets, context packs, and source-handle expansion while preserving the read-only safety language.

- [ ] **Step 4: Add MCP tests**

Update `tests/mcp-server.test.ts` to assert the tool list contains `agentloop_context_pack` and `callMcpTool` returns a payload with `contextPack` or equivalent context contract data.

- [ ] **Step 5: Run MCP tests**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/mcp-server.test.ts
```

Expected: pass.

## Task 5: Agent Guidance and Docs

**Files:**
- Modify: `src/templates/agents/codex.md`
- Modify: `src/templates/agents/claude-code.md`
- Modify: `src/templates/agents/cursor.md`
- Modify: `src/templates/agents/generic.md`
- Modify: `src/templates/agents/opencode.md`
- Modify: `src/templates/agents/gemini-cli.md`
- Modify: `src/templates/agents/github-copilot-cli.md`
- Create: `docs/context.md`
- Modify: `docs/cli-reference.md`
- Modify: `README.md`

- [ ] **Step 1: Update generated agent templates**

Add a short instruction before broad reads:

```md
- Run `agentloop context pack --for <agent> --goal continue --redact-paths` before broad file reads or long-session continuation. Use `agentloop context show <handle>` to expand local source truth only when needed.
```

- [ ] **Step 2: Add public context docs**

Create `docs/context.md` explaining:

- context budget
- context pack
- receipt
- handles
- research goal
- heuristic token estimates
- no proxy, no telemetry, no billing claim

- [ ] **Step 3: Update CLI reference**

Add an `AgentLoop Context` section with command examples and safety boundaries.

- [ ] **Step 4: Update README**

Add `agentloop context pack --for codex --goal continue --redact-paths` to the first useful loop and mention measurable heuristic context reduction.

- [ ] **Step 5: Run docs drift tests**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/cli-docs-drift.test.ts tests/product-positioning.test.ts tests/public-docs-hygiene.test.ts
```

Expected: pass.

## Task 6: Full Verification and Dogfood

**Files:**
- No new code files expected.

- [ ] **Step 1: Run focused context tests**

```bash
npx pnpm@10.12.1 vitest run tests/context-contract.test.ts tests/mcp-server.test.ts tests/cli-docs-drift.test.ts
```

- [ ] **Step 2: Run configured verification**

```bash
npx pnpm@10.12.1 test
npx pnpm@10.12.1 lint
npx pnpm@10.12.1 typecheck
npx pnpm@10.12.1 build
```

- [ ] **Step 3: Run dogfood and repo-risk checks**

```bash
npm run dogfood
npx --yes projscan doctor --format markdown
npx --yes agentflight status
npx --yes agentflight doctor
npx --yes agentflight report
```

- [ ] **Step 4: Run AgentLoop evidence pass**

```bash
node dist/cli/index.js explain-diff --redact-paths
node dist/cli/index.js review-context --redact-paths
node dist/cli/index.js verify --task-commands --progress --redact-paths
node dist/cli/index.js handoff --write-run --redact-paths
```

## Self-Review

- Spec coverage: covers CLI, JSON, MCP, docs, generated agent instructions, token-saving measurement, source handles, and research-goal support.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `ContextPackGoal`, `ContextPackResult`, `ContextHandle`, and command names are consistent across tasks.
- Scope check: reducers and proxy behavior are intentionally excluded from v1.
