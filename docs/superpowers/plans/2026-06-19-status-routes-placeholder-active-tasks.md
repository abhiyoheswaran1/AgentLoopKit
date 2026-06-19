# Status Routes Placeholder Active Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Track progress with checkbox (`- [ ]`) syntax.

**Goal:** Prevent active task contracts with review-critical placeholder sections from flowing from `status` or `next` directly into handoff.

**Architecture:** Reuse the existing task-doctor placeholder diagnostics. `status` already computes stale task-state diagnostics through `inspectTaskDirectory`; it should reuse that task-doctor view once and feed an active-task placeholder boolean into next-action selection.

**Tech Stack:** TypeScript CLI, Vitest, existing AgentLoopKit task-state diagnostics.

---

### Task 1: Add The Regression Test

**Files:**

- Modify: `tests/status.test.ts`

- [x] **Step 1: Create an initialized temp repo with an active placeholder task**

Use the existing status test helpers to initialize AgentLoopKit, write a dirty source file, pin an active task, and create passing verification evidence.

- [x] **Step 2: Assert JSON and human next action**

Expected behavior:

```json
{
  "command": "agentloop task doctor",
  "reason": "Active task still has placeholder guidance in review-critical sections. Replace it before verification or handoff evidence."
}
```

The focused test must fail before production code changes because the previous behavior returned `agentloop handoff`.

### Task 2: Reuse Task-Doctor Diagnostics In Status

**Files:**

- Modify: `src/core/status.ts`

- [x] **Step 1: Detect active placeholder diagnostics**

Add a small helper that checks whether task-doctor diagnostics contain `placeholder-task-section` for the active task path.

- [x] **Step 2: Thread the signal into next-action selection**

Add `activeTaskHasReviewCriticalPlaceholders` to the `chooseNextAction` input and route it to `agentloop task doctor` before verification or handoff recommendations.

- [x] **Step 3: Avoid duplicate scans**

Call `inspectTaskDirectory` once in `getAgentLoopStatus`, then reuse the diagnostics for both stale task-state and placeholder routing.

### Task 3: Evidence And Bug Pass

**Files:**

- Create: `.agentloop/research/real-repo-usefulness-trials-2026-06-19.md`
- Create: `.agentloop/research/interview-cycle-123.md`
- Modify: `.agentloop/backlog.md`
- Modify: `DECISIONS.md`
- Modify: `CHANGELOG.md`

- [x] **Step 1: Record trial and persona evidence**

Record the internal trial notes and simulated product-panel synthesis. Keep the public-trust boundary clear: this is not real user feedback or public adoption proof.

- [x] **Step 2: Run focused tests**

Run:

```bash
npx pnpm@10.12.1 vitest run tests/status.test.ts -t "routes active task placeholder contracts to task doctor before handoff"
```

- [ ] **Step 3: Run broader verification**

Run the task contract commands, AgentLoop ship evidence, and strict dogfood before handoff.

## Self-Review

- Spec coverage: covers the repeated real-repo trial issue and limits the fix to next-action routing.
- Scope check: no template, scoring, release-channel, GitHub, telemetry, hosted-service, or mutation behavior changes.
- Maintenance check: reuses existing task-doctor diagnostics instead of adding a second placeholder parser.
