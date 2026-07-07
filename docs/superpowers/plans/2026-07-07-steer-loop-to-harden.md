# Steer the Loop to Harden Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the active task contract has blocking soft spots, make `agentloop next`/`start`/`status` and the `nextAction` field recommend `agentloop harden` as the top next step (before verify), by adding one action to the shared evidence-map next-action source.

**Architecture:** `nextActions()` in `src/core/evidence-map.ts` builds the ordered recommendation array that `nextAction(map)` (= `map.nextActions[0]`) exposes to `next`/`start`/`status`/MCP. Add a `blockingSoftSpotCount` input and push an `agentloop harden` action — positioned after the `create-task` block and before the verification block — when the count is > 0. `buildEvidenceMap` computes the count with the existing deterministic `analyzeContract` on the active task's already-loaded `.content`.

**Tech Stack:** TypeScript (ESM, `.js` import specifiers), vitest, tsx-based CLI integration tests. Follows existing `src/core` patterns.

## Global Constraints

- No LLM, no network, no telemetry — detection reuses the existing deterministic `analyzeContract`/`hasBlockingSoftSpots` from `src/core/harden.js`.
- Deterministic output — no timestamps/randomness (the reason string contains only a count).
- Additive/opt-in — no existing command behavior changes except that a thin active contract now recommends `harden` first; no CLI surface added.
- ESM imports use explicit `.js` extensions.
- Fires on **blocking** soft spots only (advisory never triggers it), matching the `check-gates`/`ready` harden gate.
- Scope stays on the shared evidence-map next-action source; do NOT touch `guard`'s separate `nextActions[]`.
- CLI integration tests invoke the CLI via `execa(tsxPath, [path.resolve('src/cli/index.ts'), ...])`, NEVER `node dist/cli/index.js` (CI runs tests before build; `dist/` is gitignored).

---

### Task 1: Add the harden next-action and wire the blocking-soft-spot count

**Files:**
- Modify: `src/core/evidence-map.ts` (the `nextActions()` function at ~line 333 and its call site inside `buildEvidenceMap` at ~line 490)
- Test: `tests/evidence-map.test.ts` (add a case; follow the file's existing `buildEvidenceMap` fixture setup)
- Modify (migration): any existing fixtures whose contracts now newly recommend `harden` — discovered by running the full suite (see Step 6)

**Interfaces:**
- Consumes: `analyzeContract`, `hasBlockingSoftSpots` from `./harden.js`; `TaskContract` (has `.content: string`), already imported/loaded in this file.
- Produces: `nextActions()` gains an input field `blockingSoftSpotCount: number` and pushes `{ command: 'agentloop harden', reason: '<N> blocking soft spot(s) in the task contract — harden it before implementing or verifying.' }` when `input.task && input.blockingSoftSpotCount > 0`, positioned before the verification actions. `buildEvidenceMap` computes and passes the count.

- [ ] **Step 1: Write the failing test**

Add to `tests/evidence-map.test.ts`, using the file's existing helper for creating a repo + active task contract and calling `buildEvidenceMap` (mirror an existing test in that file for the exact setup — the repo dir, git init, and the `buildEvidenceMap({ cwd, config })` call). The active contract must contain a blocking soft spot (an unfilled "Files or Areas Not to Touch"):

```ts
test('recommends harden first when the active contract has blocking soft spots', async () => {
  // Arrange: use this file's existing fixture helper to create a repo with an
  // active task contract whose body includes:
  //   ## Files or Areas Not to Touch
  //   - None recorded yet.
  // and NO verification report (so the verify action would otherwise be first).
  const map = await buildEvidenceMap({ cwd: dir, config });
  expect(map.nextActions[0].command).toBe('agentloop harden');
  expect(map.nextActions[0].reason).toMatch(/blocking soft spot/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/evidence-map.test.ts -t "recommends harden first"`
Expected: FAIL — `nextActions[0].command` is `agentloop verify ...` (or `create-task`), not `agentloop harden`.

- [ ] **Step 3: Implement the nextActions action + the count wiring**

In `src/core/evidence-map.ts`:

Add the import near the other `./` imports:

```ts
import { analyzeContract } from './harden.js';
```

Add `blockingSoftSpotCount` to the `nextActions()` input type and push the action after the `create-task` block, before the `verification.status` block:

```ts
function nextActions(input: {
  task: TaskContract | null;
  verification: EvidenceMapVerification;
  unexplainedCount: number;
  forbiddenCount: number;
  blockingSoftSpotCount: number;
}) {
  const actions: EvidenceMapNextAction[] = [];
  if (!input.task) {
    actions.push({
      command: 'agentloop create-task',
      reason: 'No current task contract was found for the changed files.',
    });
  }
  if (input.task && input.blockingSoftSpotCount > 0) {
    actions.push({
      command: 'agentloop harden',
      reason: `${input.blockingSoftSpotCount} blocking soft spot(s) in the task contract — harden it before implementing or verifying.`,
    });
  }
  if (input.verification.status === 'missing') {
    // ... unchanged
```

At the `nextActions({ ... })` call site inside `buildEvidenceMap` (~line 490), compute and pass the count from the already-loaded `task.content` (`analyzeContract` is total over strings — it cannot throw — so a non-null task always yields a valid count; a null task yields 0):

```ts
    nextActions: nextActions({
      task,
      verification,
      unexplainedCount: unexplainedFiles.length,
      forbiddenCount: forbiddenFiles.length,
      blockingSoftSpotCount: task
        ? analyzeContract(task.content).filter((spot) => spot.severity === 'blocking').length
        : 0,
    }),
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/evidence-map.test.ts -t "recommends harden first"`
Expected: PASS.

- [ ] **Step 5: Add the "clean contract unchanged" test**

Add a second test asserting no behavior change for a hardened contract:

```ts
test('does not recommend harden when the active contract has no blocking soft spots', async () => {
  // Arrange: same helper, but the contract fills every section (e.g. a real
  // "## Files or Areas Not to Touch\n- node_modules/") so analyzeContract finds
  // no blocking spots, and there IS a fresh passing verification report.
  const map = await buildEvidenceMap({ cwd: dir, config });
  expect(map.nextActions.some((a) => a.command === 'agentloop harden')).toBe(false);
});
```

Run: `npx vitest run tests/evidence-map.test.ts -t "does not recommend harden"`
Expected: PASS.

- [ ] **Step 6: Run the full suite and migrate any fixtures that newly recommend harden**

Run: `npm test`

Some existing tests (likely in `tests/evidence-map.test.ts`, `tests/agent-start.test.ts`, `tests/next.test.ts`, `tests/status.test.ts`, `tests/context-contract.test.ts`, `tests/cli-explain-diff.test.ts`, `tests/mcp-tools.test.ts`) use minimal/default task contracts that ship with an unfilled "Files or Areas Not to Touch" (`- None recorded yet.`), which is now a blocking `unbounded-scope` soft spot — so those contracts will newly recommend `agentloop harden` first.

For EACH failing test, apply the correct fix (do NOT weaken assertions):
- If the test's intent is a *well-formed* contract flowing to verify/handoff/ship, HARDEN the fixture contract: add a real `## Files or Areas Not to Touch` entry (e.g. `- node_modules/`) and fill any other placeholder section it relies on, so `analyzeContract` finds no blocking spots and the original assertion holds.
- If the test is specifically about a thin/placeholder contract, UPDATE the expected next-action to `agentloop harden` (that is now the correct behavior).

Re-run `npm test` until 0 failures. Then run `npm run typecheck` and `npm run lint` (green).

- [ ] **Step 7: Commit**

```bash
git add src/core/evidence-map.ts tests/evidence-map.test.ts
# plus any fixture files you hardened in Step 6:
git add -A
git commit -m "feat: recommend agentloop harden as next action for thin contracts"
```

(Stage only your intended files; do NOT stage `.agentloop/tasks/2026-07-06-agentloopkit-1-0-stability-release.md`.)

---

### Task 2: Wire `status.ts` `chooseNextAction` to recommend harden, and cover all surfaces

**Discovered during Task 2's surface tests:** `next`/`status`/MCP do NOT consume the `evidence-map` next-action source wired in Task 1 — only `start` does. They derive `nextAction` from `chooseNextAction()` in `src/core/status.ts`, which currently recommends `agentloop task doctor` for placeholder contracts. This task upgrades that slot to recommend `agentloop harden` on blocking soft spots (user-approved behavior change), which is what makes the `next`/MCP surface tests pass.

**Files:**
- Modify: `src/core/status.ts` — `chooseNextAction()` (~line 262, the `activeTaskHasReviewCriticalPlaceholders` slot at ~line 354) and its caller where `activeTaskHasReviewCriticalPlaceholders` is computed (~line 145)
- Test: `tests/status.test.ts` (migrate the existing placeholder→task-doctor assertion to harden), and the surface tests in `tests/next.test.ts`, `tests/agent-start.test.ts`, `tests/mcp-tools.test.ts` (already written, must pass)

**Interfaces:**
- Consumes: `analyzeContract` from `./harden.js`; the active task's markdown `content`.
- Produces: `chooseNextAction()` recommends `{ command: 'agentloop harden', reason: '<N> blocking soft spot(s) in the task contract — harden it before implementing or verifying.' }` when the active task has blocking soft spots, in the slot before the verification checks.

- [ ] **Step 1: Migrate the existing status test to expect harden**

Find the test in `tests/status.test.ts` that asserts `chooseNextAction`/`getAgentLoopStatus` recommends `agentloop task doctor` for a contract with review-critical placeholders. Change its expectation to `agentloop harden` (that is the new correct behavior). Run it to confirm it now FAILS (still returns `task doctor`).

- [ ] **Step 2: Wire `status.ts`**

Import `analyzeContract` from `./harden.js` (explicit `.js`). Where the caller currently computes `activeTaskHasReviewCriticalPlaceholders` (~line 145, from task-doctor diagnostics), instead compute `activeTaskBlockingSoftSpotCount` from the active task's markdown: `analyzeContract(activeTask.content).filter((s) => s.severity === 'blocking').length` (guard for a missing/unreadable content → 0). Thread that number into `chooseNextAction` as `activeTaskBlockingSoftSpotCount: number`, replacing the `activeTaskHasReviewCriticalPlaceholders` param. In the slot at ~line 354, replace the `task doctor` return with:

```ts
  if (input.activeTaskBlockingSoftSpotCount > 0) {
    return {
      command: 'agentloop harden',
      reason: `${input.activeTaskBlockingSoftSpotCount} blocking soft spot(s) in the task contract — harden it before implementing or verifying.`,
    };
  }
```

Keep the slot's POSITION (after the done/archive checks, before the `!input.latestReport` verify check) so precedence is preserved.

- [ ] **Step 3: Run the migrated status test + the surface tests**

Run: `npx vitest run tests/status.test.ts tests/next.test.ts tests/agent-start.test.ts tests/mcp-tools.test.ts`
Expected: PASS — the status test now returns `agentloop harden`, and the `next`/`start`/MCP surface tests all assert `agentloop harden` for a thin contract.

- [ ] **Step 4: Migrate any other fixtures that now recommend harden**

Run the full suite SEQUENTIALLY (this machine OOM-kills parallel vitest): `npx vitest run --no-file-parallelism`. For any other test that breaks because a thin fixture contract now recommends `harden`, harden the fixture (preserve intent) or update the expectation to `harden` if the test is specifically about a thin contract. Never weaken an assertion.

- [ ] **Step 5: Full verification**

Run, expecting all green (full suite SEQUENTIAL to avoid OOM):

```bash
npm run typecheck
npm run lint
npx vitest run --no-file-parallelism
npm run contract:check
```

`contract:check` stays green: the `nextAction` object shape (`{ command, reason }`) is unchanged; only a possible command/reason value changes, which the shape lock does not capture.

- [ ] **Step 6: Commit**

```bash
git add src/core/status.ts tests/status.test.ts tests/next.test.ts tests/agent-start.test.ts tests/mcp-tools.test.ts
git commit -m "feat: recommend harden (not task doctor) for thin contracts in next/status/MCP"
```

---

## Self-Review

**Spec coverage:**
- New action in `nextActions()` before verify, on blocking soft spots → Task 1. ✓
- `buildEvidenceMap` computes count via `analyzeContract` on `task.content`, fail-safe (null task → 0; `analyzeContract` total over strings) → Task 1. ✓
- Blocking-only, precedence regardless of verification state → Task 1 tests (thin contract with no verification report → harden is `[0]`). ✓
- Surface coverage (next/start/status/MCP) → Task 2. ✓
- Test migration of thin-contract fixtures → Task 1 Step 6. ✓
- Determinism, additive, no `guard` change → Global Constraints + code. ✓

**Placeholder scan:** No TBD/TODO. Task 1 Step 6 references "the file's existing fixture helper" because `tests/evidence-map.test.ts` has an established repo/contract setup the implementer must reuse rather than duplicate — the assertion and contract content are concrete.

**Type consistency:** `blockingSoftSpotCount: number`, `analyzeContract`, `EvidenceMapNextAction` (`{ command, reason }`), and the `agentloop harden` command string are used identically across both tasks.

## Notes for the implementer

- Before Task 1 Step 1, open `tests/evidence-map.test.ts` and copy its exact fixture setup (temp dir, git init, writing the active task contract, `buildEvidenceMap` call) rather than inventing a new one.
- The `agentloop harden` command takes the active task by default, so the reason string does not need a path.
