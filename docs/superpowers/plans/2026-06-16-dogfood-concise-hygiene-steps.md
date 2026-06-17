# Dogfood Concise Hygiene Steps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make normal dogfood logs use human-readable task hygiene and harness upgrade output while preserving structured parent JSON mode.

**Architecture:** Keep `scripts/dogfood.mjs` as the only behavior change by removing child `--json` flags from the task doctor and upgrade-harness dogfood steps. Lock the step arguments in focused tests and update CLI docs to describe normal dogfood as human-readable for hygiene, harness, evidence, and review context sections.

**Tech Stack:** Node.js script helpers, Vitest, AgentLoopKit source CLI.

---

### Task 1: Dogfood Step Arguments

**Files:**
- Modify: `tests/dogfood-script.test.ts`
- Modify: `tests/autonomous-dogfood.test.ts`
- Modify: `scripts/dogfood.mjs`
- Modify: `docs/cli-reference.md`

- [ ] **Step 1: Write the failing step-plan assertions**

In `tests/dogfood-script.test.ts`, expect the first step to run `task doctor` without `--json`, and the harness step to run `upgrade-harness --redact-paths` without `--json`.

- [ ] **Step 2: Add the autonomous harness guard**

In `tests/autonomous-dogfood.test.ts`, assert that `task folder hygiene` and `harness upgrade audit` omit `--json` in normal dogfood steps.

- [ ] **Step 3: Verify RED**

Run:

```bash
npm test -- tests/dogfood-script.test.ts tests/autonomous-dogfood.test.ts
```

Expected: failure showing the current extra `--json` argument on task doctor or upgrade-harness.

- [ ] **Step 4: Implement GREEN**

In `scripts/dogfood.mjs`, change:

```js
agentloopStep('task folder hygiene', ['task', 'doctor', '--json'])
```

to:

```js
agentloopStep('task folder hygiene', ['task', 'doctor'])
```

and change:

```js
agentloopStep('harness upgrade audit', [
  'upgrade-harness',
  '--json',
  '--redact-paths',
])
```

to:

```js
agentloopStep('harness upgrade audit', ['upgrade-harness', '--redact-paths'])
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
npm test -- tests/dogfood-script.test.ts tests/autonomous-dogfood.test.ts
```

Expected: pass.

- [ ] **Step 6: Update docs**

In `docs/cli-reference.md`, update the dogfood paragraph so normal dogfood output is described as concise human `task doctor`, `upgrade-harness --redact-paths`, `artifacts`, `maintainer-check --redact-paths`, and `review-context --redact-paths` output.

- [ ] **Step 7: Bug pass**

Run:

```bash
node scripts/dogfood.mjs --json
npm run dogfood
```

Expected: JSON mode stays a structured parent summary with child output suppressed; normal mode streams human task doctor and harness upgrade sections.
