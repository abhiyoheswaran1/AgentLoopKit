# Redaction Guidance Smoke Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep README public-output redaction guidance covered by packed-release smoke tests for every command named in the guidance.

**Architecture:** The README smoke helper keeps a fixed allowlist of commands that must appear on the public `--redact-paths` guidance line. This task only extends that allowlist and tests the missing-command failure path for `verify`, `summarize`, and `handoff`; CLI behavior stays unchanged.

**Tech Stack:** Node.js ESM smoke helper, Vitest, README Markdown guidance.

---

### Task 1: Add Failing Guard Coverage

**Files:**
- Modify: `tests/release-smoke.test.ts`

- [ ] **Step 1: Add a failing test**

Add a test that builds README guidance without `verify`, `summarize`, or `handoff` and expects `assertReadmeRedactionGuidance` to report the first missing command.

- [ ] **Step 2: Run focused test**

Run: `npm test -- tests/release-smoke.test.ts`

Expected: FAIL because `scripts/smoke-packed-release.mjs` does not yet require `verify`.

### Task 2: Complete The Guard List

**Files:**
- Modify: `scripts/smoke-packed-release.mjs`
- Modify: `tests/release-smoke.test.ts`

- [ ] **Step 1: Add missing commands to the smoke allowlist**

Add `verify`, `summarize`, and `handoff` to `README_REDACTION_COMMANDS` in the same order used by README guidance.

- [ ] **Step 2: Update accepted guidance fixture**

Update the positive README guidance fixture in `tests/release-smoke.test.ts` so it includes all commands now required by the guard.

- [ ] **Step 3: Run focused test**

Run: `npm test -- tests/release-smoke.test.ts`

Expected: PASS.

### Task 3: Bug Pass And Verification

**Files:**
- No additional source files expected.

- [ ] **Step 1: Run the targeted bug pass**

Run: `npm test -- tests/release-smoke.test.ts`

Expected: PASS with the new guard coverage.

- [ ] **Step 2: Run configured verification**

Run:

```bash
npm run typecheck
npm run lint
npm test
npm run check:public-docs
npm run check:links
```

Expected: all commands exit 0.

- [ ] **Step 3: Capture AgentLoop evidence**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-complete-redaction-guidance-smoke-coverage.md --task-commands --write-run --redact-paths
npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
npm run dogfood:strict
```

Expected: AgentLoop verification and strict dogfood pass.
