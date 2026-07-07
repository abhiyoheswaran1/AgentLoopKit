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

### Task 2: Surface-coverage tests and final verification

**Files:**
- Test: `tests/next.test.ts`, `tests/agent-start.test.ts` (or `tests/status.test.ts`) — add explicit end-to-end coverage; and `tests/mcp-tools.test.ts` for the MCP `nextAction`
- No source changes expected

**Interfaces:**
- Consumes: the behavior from Task 1 (`map.nextActions[0]` is `agentloop harden` for a thin active contract).

- [ ] **Step 1: Write failing surface-coverage tests**

Prove the recommendation actually propagates to the agent-facing surfaces (not just `buildEvidenceMap`). Add a test in `tests/next.test.ts` following that file's existing CLI-invocation pattern (`execa(tsxPath, [cliPath, 'next', ...])` in a fixture repo with a thin active contract):

```ts
test('next recommends harden for a thin active contract', async () => {
  // Arrange: fixture repo + active contract with "## Files or Areas Not to Touch\n- None recorded yet."
  const result = await execa(tsxPath, [cliPath, 'next'], { cwd: dir, reject: false });
  expect(result.stdout).toContain('agentloop harden');
});
```

Add an equivalent assertion for `start` (in `tests/agent-start.test.ts`) and for the MCP `nextAction` field (in `tests/mcp-tools.test.ts`, following that file's pattern for reading the `agentloop_next`/status tool output — assert the `nextAction.command` is `agentloop harden` for the thin-contract fixture).

- [ ] **Step 2: Run the tests to verify they fail or pass**

Run: `npx vitest run tests/next.test.ts tests/agent-start.test.ts tests/mcp-tools.test.ts -t harden`
Expected: These should PASS immediately if Task 1 wired the shared source correctly (they consume `map.nextActions[0]`). If any FAILS, that surface does not consume the shared evidence-map next-action source — STOP and report it, because the spec's architecture assumption (single source feeds all surfaces) would be wrong for that surface and needs a design decision, not a silent workaround.

- [ ] **Step 3: Full verification**

Run, expecting all green:

```bash
npm run typecheck
npm run lint
npm test
npm run contract:check
```

`contract:check` should stay green: the `--json` shape lock reduces arrays to first-element shape and the `nextAction` object shape (`{ command, reason }`) is unchanged, so adding a new possible command/reason value does not drift the shape.

- [ ] **Step 4: Commit**

```bash
git add tests/next.test.ts tests/agent-start.test.ts tests/mcp-tools.test.ts
git commit -m "test: cover harden next-action across next, start, and MCP surfaces"
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
