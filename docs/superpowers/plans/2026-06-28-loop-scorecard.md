# Autonomous Loop Scorecard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only loop scorecard that gates autonomous loop continuation before another iteration runs.

**Architecture:** Reuse existing loop contracts, `evaluateReady`, and `buildContextPack`. Add scorecard types and evaluation in `src/core/loop-contract.ts`, expose it through `src/index.ts`, and add a `loop scorecard` CLI subcommand.

**Tech Stack:** TypeScript, Commander, Vitest, existing AgentLoopKit core modules.

---

### Task 1: Red Test

**Files:**
- Modify: `tests/loop-contract.test.ts`

- [ ] Add a test that creates a loop, runs `agentloop loop scorecard --json`, and asserts a read-only `continue` decision with readiness, token, guardrail, and context signals.
- [ ] Run `npm run test -- tests/loop-contract.test.ts -t "prints a loop scorecard"` and confirm it fails because the command does not exist.

### Task 2: Core Scorecard

**Files:**
- Modify: `src/core/loop-contract.ts`

- [ ] Add `LoopScorecardDecision`, `LoopScorecardReason`, and `LoopScorecardResult` types.
- [ ] Add `scoreLoop` that resolves the target loop, reads readiness and context pack evidence, computes remaining tokens and iterations, and returns ranked reasons.
- [ ] Render Markdown through `renderLoopScorecardMarkdown`.

### Task 3: CLI And API

**Files:**
- Modify: `src/cli/commands/loop.ts`
- Modify: `src/index.ts`

- [ ] Add `agentloop loop scorecard`.
- [ ] Support `--id`, `--json`, and `--redact-paths`.
- [ ] Export `scoreLoop`, `renderLoopScorecardMarkdown`, and scorecard types.

### Task 4: Docs

**Files:**
- Modify: `README.md`
- Modify: `docs/loop-contracts.md`
- Modify: `docs/cli-reference.md`
- Modify: `src/templates/root/AGENTLOOP.md`
- Modify: `src/templates/root/AGENTS.md`
- Modify: `src/templates/harness/commands.md`

- [ ] Document scorecard as a pre-flight gate.
- [ ] Keep copy local-first and evidence-bound.
- [ ] Run public-doc hygiene.

### Task 5: Verification

**Files:**
- Modify: `.agentloop/tasks/2026-06-28-add-autonomous-loop-scorecards.md`

- [ ] Run focused tests.
- [ ] Run lint and typecheck.
- [ ] Run public docs hygiene.
- [ ] Run dogfood and readiness gates.
- [ ] Mark the task done only after verification evidence exists.
