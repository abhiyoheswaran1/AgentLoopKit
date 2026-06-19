# Approved Research Improvement Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the five approved non-release research follow-ups in order, with a focused bug pass after each item.

**Architecture:** Keep behavior local-first and deterministic. Break the core module cycle by moving shared artifact-path primitives into a leaf module, then keep the remaining items mostly in CLI guidance, docs, and maintenance evidence rather than adding workflow machinery.

**Tech Stack:** TypeScript core modules, Vitest, AgentLoopKit CLI, ProjScan, AgentFlight, Markdown docs.

---

### Task 1: Break Core Circular Import

**Files:**
- Create: `src/core/artifact-paths.ts`
- Modify: `src/core/artifacts.ts`
- Modify: `src/core/task-state.ts`
- Test: ProjScan cycle detector plus focused core tests

- [ ] **Step 1: Verify the failing architecture check**

Run: `npx --yes projscan coupling --cycles-only`

Expected before implementation: reports a cycle involving `src/core/artifacts.ts`, `src/core/runs.ts`, and `src/core/task-state.ts`.

- [ ] **Step 2: Extract shared artifact-path primitives**

Move `verificationReportPattern`, `OutputArtifactType`, `OutputPathErrorReason`, `OutputPathError`, `resolveOutputArtifactPath`, and the output artifact label map from `src/core/artifacts.ts` to `src/core/artifact-paths.ts`.

- [ ] **Step 3: Rewire imports**

Import the extracted primitives from `src/core/artifact-paths.ts` in both `src/core/artifacts.ts` and `src/core/task-state.ts`. Keep public exports compatible for existing internal callers.

- [ ] **Step 4: Verify the cycle is gone**

Run: `npx --yes projscan coupling --cycles-only`

Expected after implementation: no cycle involving `artifacts`, `runs`, and `task-state`.

- [ ] **Step 5: Bug pass**

Run focused tests for artifact and task-state surfaces:

```bash
npm test -- tests/artifacts.test.ts tests/runs.test.ts tests/task-state.test.ts tests/status.test.ts
```

Fix any failures before starting Task 2.

### Task 2: Improve Direct AgentFlight Placeholder Recovery

**Files:**
- Modify: `src/core/task-state.ts`
- Modify: `src/cli/commands/task.ts` or current task command renderer if needed
- Modify: `.agentloop/harness/autonomous-dogfooding.md`
- Modify: `docs/status.md`
- Test: `tests/task-state.test.ts`, `tests/status.test.ts`, `tests/next.test.ts`, or `tests/check-gates.test.ts`

- [ ] **Step 1: Write a failing focused test**

Add or update a test that creates an exact AgentFlight placeholder as active state and asserts the recovery guidance includes the bounded sequence:

```text
agentloop task clear
agentloop task set <path>
agentloop create-task
```

The test should also assert that the warning says the placeholder is preserved as session evidence and should not be hand-edited or deleted as the default recovery.

- [ ] **Step 2: Implement clearer recovery output**

Update the task-doctor diagnostic or renderer to say the active pointer is stale because it points at a session placeholder, and to recommend clearing or pinning a real task contract.

- [ ] **Step 3: Update guidance**

Update the dogfood/status docs so direct `agentflight start` users know to run `agentloop status --redact-paths`, then `agentloop task doctor --redact-paths` or `agentloop task clear` before creating or pinning a real task.

- [ ] **Step 4: Bug pass**

Run:

```bash
npm test -- tests/task-state.test.ts tests/status.test.ts tests/next.test.ts tests/check-gates.test.ts
npx --no-install agentloop task doctor --redact-paths
```

Fix any failures before starting Task 3.

### Task 3: Tighten First-Task Onboarding

**Files:**
- Modify: `README.md`
- Modify: `docs/getting-started.md`
- Modify: `docs/cli-reference.md` if needed
- Test: docs hygiene and link checks

- [ ] **Step 1: Add the first useful loop**

Add a compact first-task path that starts after `init` and uses only the core sequence:

```bash
agentloop doctor
agentloop create-task --type bugfix --title "Fix checkout bug" --include-config-commands
agentloop status --brief
agentloop verify --task-commands --progress
agentloop ship
agentloop prepare-pr
agentloop task done
```

- [ ] **Step 2: Keep it scoped**

Explain that the sequence records evidence and does not post to GitHub, publish, call an LLM, or run hidden commands.

- [ ] **Step 3: Bug pass**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Fix any public-doc or link failure before starting Task 4.

### Task 4: Document `prepublishOnly` Trust Boundary

**Files:**
- Modify: `docs/npm-publishing.md`
- Modify: `docs/contributor-playbook.md` or `README.md` only if the rationale needs a public maintenance pointer
- Modify: `.projscanrc.json` only if the repo already supports documented local allowlisting
- Test: package script and public-doc checks

- [ ] **Step 1: Document why the lifecycle script exists**

State that `prepublishOnly` is release-time defense in depth, not install-time behavior, and that AgentLoopKit has no `postinstall` script.

- [ ] **Step 2: Keep ProjScan warning actionable**

Document the expected maintainer action when ProjScan reports `prepublishOnly`: verify `scripts/prepublish-check.mjs`, typecheck, tests, and build before release; do not silence unrelated lifecycle scripts.

- [ ] **Step 3: Bug pass**

Run:

```bash
npm test -- tests/package-scripts.test.ts tests/prepublish-check.test.ts tests/public-docs-hygiene.test.ts
npm run check:public-docs
```

Fix any failures before starting Task 5.

### Task 5: Add Real-Repo Trial Checklist

**Files:**
- Create: `docs/real-repo-trials.md`
- Modify: `README.md`
- Modify: `ROADMAP.md`
- Modify: `.agentloop/backlog.md` or `DECISIONS.md` if product direction changes
- Test: docs hygiene and link checks

- [ ] **Step 1: Add a trial checklist**

Create a user-facing guide for trying policy packs and imported GitHub metadata in real repositories. It must say missing metadata is neutral, policy packs are local files, and trial notes are for maintainers to evaluate before expanding bundled packs or scoring metadata.

- [ ] **Step 2: Avoid unsupported claims**

Do not claim testimonials, adoption, interviews, compliance, hosted dashboards, telemetry, real customer evidence, or release-channel availability.

- [ ] **Step 3: Bug pass**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Fix any failures before final verification.

### Final Verification

- [ ] Run task verification:

```bash
npx --no-install agentloop verify --task .agentloop/tasks/2026-06-19-implement-approved-research-improvement-batch.md --task-commands --progress --timeout-ms 900000 --redact-paths
```

- [ ] Run post-verification gates:

```bash
npx --no-install agentloop verify --task .agentloop/tasks/2026-06-19-implement-approved-research-improvement-batch.md --post-verification-gates --progress --timeout-ms 900000 --redact-paths
```

- [ ] Run AgentFlight doctor/report:

```bash
npx --yes agentflight doctor
npx --yes agentflight report
```

- [ ] Generate final handoff:

```bash
npx --no-install agentloop prepare-pr --redact-paths
npx --no-install agentloop handoff --task .agentloop/tasks/2026-06-19-implement-approved-research-improvement-batch.md --write-run --redact-paths
```
