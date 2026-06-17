# Decouple Maintenance Check Release Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep `npm run maintenance:check` useful during active development without requiring strict live public release-channel proof.

**Architecture:** Leave `agentloop release-proof --strict` unchanged for approved release gates. Change only the regular maintenance plan to run a bounded release-proof smoke check that proves the command surface is healthy without failing on intentionally deferred public channels.

**Tech Stack:** Node.js maintenance script, Vitest, TypeScript source CLI through `tsx`, Markdown docs.

---

### Task 1: Lock Maintenance Step Behavior

**Files:**
- Modify: `tests/maintenance-check-script.test.ts`
- Modify: `tests/autonomous-dogfood.test.ts`

- [ ] **Step 1: Write failing tests**

Update the maintenance step expectations so the release proof step is named as a smoke check and uses a bounded command, for example `release-proof --only npm --redact-paths`, not all-channel `--strict`.

- [ ] **Step 2: Run targeted tests to verify RED**

Run:

```bash
npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts
```

Expected: FAIL because the current maintenance script still runs `release-proof --strict --redact-paths`.

### Task 2: Update Maintenance Guard

**Files:**
- Modify: `scripts/maintenance-check.mjs`
- Modify: `README.md`
- Modify: `docs/maintenance-guards.md`

- [ ] **Step 1: Update maintenance steps**

Change the release proof maintenance step from strict all-channel proof to a bounded smoke check that still invokes the CLI locally and keeps `allowFailure: false`.

- [ ] **Step 2: Update help/docs**

Describe `maintenance:check` as checking release-proof smoke behavior, not strict live release proof. Keep docs saying full release proof belongs to approved release gates.

- [ ] **Step 3: Run targeted tests to verify GREEN**

Run:

```bash
npm test -- tests/maintenance-check-script.test.ts tests/autonomous-dogfood.test.ts tests/package-scripts.test.ts
```

Expected: PASS.

### Task 3: Bug Pass and Verification

**Files:**
- Inspect changed files from Task 1 and Task 2.

- [ ] **Step 1: Run static and focused verification**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 2: Run the original failing guard**

Run:

```bash
npm run maintenance:check
```

Expected: PASS without publishing, version bumps, tags, or token-like environment.

- [ ] **Step 3: Run strict dogfood**

Run:

```bash
npm run dogfood:strict
```

Expected: PASS.

### Task 4: AgentLoop Evidence

**Files:**
- Active task contract under `.agentloop/tasks/`
- Generated reports/runs/handoff under `.agentloop/`

- [ ] **Step 1: Record task verification**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md --task-commands --only-task-commands --write-run --redact-paths --progress
```

Expected: PASS.

- [ ] **Step 2: Produce handoff evidence**

Run:

```bash
npx --no-install tsx src/cli/index.ts handoff --task .agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof-2.md --write-run --redact-paths
```

Expected: Handoff file and run are written.
