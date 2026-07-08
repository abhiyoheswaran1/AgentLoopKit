# Hardening Gate Fails by Default (C1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Checkbox steps.

**Goal:** Flip the `contract-hardening` gate to fail (not warn) by default in `check-gates` and `ready` when a contract has blocking soft spots, with a `--allow-soft-spots` flag to downgrade to a warning.

**Architecture:** Gate status becomes `blockingCount>0 ? (allowSoftSpots?'warn':'fail') : 'pass'` in both `check-gates.ts` and `ready.ts`; `allowSoftSpots` threads from a new CLI flag on both commands.

**Tech Stack:** TypeScript (ESM `.js`), vitest.

## Global Constraints
- No LLM/network/telemetry; reuses the already-computed blocking count. Deterministic. ESM `.js`.
- Adding `--allow-soft-spots` changes the check-gates/ready `--help` → `cli-help.contract` snapshots updated DELIBERATELY (only the flag line). `--json` shapes unchanged (only a status VALUE changes).
- Migration of hardening-gate tests asserting the OLD warn/pass-default is a correct behavior update, NEVER a weakened assertion.
- Vitest focused/sequential (parallel OOM-kills); read `contract:check` IN FULL.

---

### Task 1: Flip the gate + thread `--allow-soft-spots`

**Files:**
- Modify: `src/core/check-gates.ts` (options + `contract-hardening` gate ~line 326), `src/cli/commands/check-gates.ts` (flag + thread)
- Modify: `src/core/ready.ts` (`buildReadyGates` + gate ~line 149), `src/cli/commands/ready.ts` (flag + thread)
- Test: `tests/check-gates.test.ts`, `tests/ready.test.ts`

**Interfaces:**
- Produces: `checkGates` options gain `allowSoftSpots?: boolean`; `buildReadyGates`/ready evaluation gain `allowSoftSpots?: boolean`.

- [ ] **Step 1: Write failing tests**

`tests/check-gates.test.ts` (reuse its fixture that sets up a thin active contract with an unfilled "Files or Areas Not to Touch"):

```ts
it('fails the contract-hardening gate by default on a thin contract', async () => {
  const result = await checkGates({ /* ...required opts..., */ strict: false });
  const gate = result.gates.find((g) => g.id === 'contract-hardening');
  expect(gate?.status).toBe('fail');
  expect(result.overallStatus).toBe('fail');
});

it('downgrades the hardening gate to warn with allowSoftSpots', async () => {
  const result = await checkGates({ /* ...required opts..., */ strict: false, allowSoftSpots: true });
  expect(result.gates.find((g) => g.id === 'contract-hardening')?.status).toBe('warn');
});
```

`tests/ready.test.ts` (reuse its thin-contract fixture):

```ts
it('blocks readiness on a thin contract by default; allowSoftSpots warns instead', async () => {
  const blocked = await evaluateReady({ /* ...opts... */ }); // adapt to the actual ready entrypoint
  expect(blocked.gates.find((g) => g.id === 'contract-hardening')?.status).toBe('fail');
  expect(blocked.status).toBe('blocked');
  const lenient = await evaluateReady({ /* ...opts..., allowSoftSpots: true */ });
  expect(lenient.gates.find((g) => g.id === 'contract-hardening')?.status).toBe('warn');
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/check-gates.test.ts -t "fails the contract-hardening gate by default"`
Expected: FAIL — gate is `warn` (old default).

- [ ] **Step 3: Implement**

- `src/core/check-gates.ts`: add `allowSoftSpots?: boolean` to the `checkGates` options type. Change the gate status expression (~line 326) from `blockingCount > 0 ? 'warn' : 'pass'` to:

```ts
        blockingCount > 0 ? (options.allowSoftSpots ? 'warn' : 'fail') : 'pass',
```

- `src/cli/commands/check-gates.ts`: add `.option('--allow-soft-spots', 'treat unresolved blocking soft spots as a warning instead of a failure')`; add `allowSoftSpots?: boolean` to the action options type; pass `allowSoftSpots: options.allowSoftSpots` into `checkGates({ ... })`.
- `src/core/ready.ts`: thread `allowSoftSpots?: boolean` into `buildReadyGates` (and whatever evaluation function the ready command calls). Change the gate (~line 149) from `blockingCount > 0 ? 'warn' : 'pass'` to `blockingCount > 0 ? (allowSoftSpots ? 'warn' : 'fail') : 'pass'`.
- `src/cli/commands/ready.ts`: add the same `.option('--allow-soft-spots', ...)`; add `allowSoftSpots?: boolean` to the action options; thread it into the ready evaluation.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/check-gates.test.ts tests/ready.test.ts -t "soft spot"` (adapt `-t`)
Expected: PASS.

- [ ] **Step 5: typecheck + lint + commit**

`npm run typecheck`, `npm run lint` green.

```bash
git add src/core/check-gates.ts src/cli/commands/check-gates.ts src/core/ready.ts src/cli/commands/ready.ts tests/check-gates.test.ts tests/ready.test.ts
git commit -m "feat: fail the contract-hardening gate by default (--allow-soft-spots downgrades to warn)"
```

---

### Task 2: Help snapshots, migration, docs, full verification

**Files:**
- Modify (deliberate): `tests/contract/__snapshots__/cli-help.contract.test.ts.snap` (check-gates + ready gain the flag)
- Modify (if needed): `docs/cli-reference.md`, README (only if a doc/drift test requires the flag)
- Migrate: any hardening-gate test asserting the OLD warn/pass-default

- [ ] **Step 1: Regenerate the deliberate help snapshots**

Run `npm run contract:check` and READ THE FULL OUTPUT. The `cli-help.contract` snapshots for `check-gates` and `ready` will mismatch (new flag). Regenerate: `npx vitest run tests/contract/cli-help.contract.test.ts -u`. Then `git diff` the snapshot and CONFIRM the ONLY changes are the added `--allow-soft-spots` flag lines under check-gates and ready. Re-run `npm run contract:check` → green.

- [ ] **Step 2: Migrate hardening-gate tests + full suite**

Run each affected file individually (parallel OOM-kills): `npx vitest run tests/check-gates.test.ts`, `tests/ready.test.ts`, `tests/status.test.ts`, `tests/ship.test.ts`, `tests/mcp-tools.test.ts`, `tests/evidence-map.test.ts`. For any test that now sees `fail`/`blocked` where it asserted `warn`/`pass`/`ready` on a contract WITH blocking soft spots: update the expectation to the new fail-by-default behavior (intended), OR if the test's intent is a well-formed contract, ensure its fixture is hardened (no soft spots). NEVER weaken an assertion. Report each migration.

- [ ] **Step 3: Docs**

If `docs/cli-reference.md` enumerates check-gates/ready flags, add `--allow-soft-spots`. Run any docs-drift test (`tests/cli-docs-drift.test.ts`, `tests/stability-docs.test.ts`) individually; satisfy them.

- [ ] **Step 4: Full verification**

`npm run typecheck`, `npm run lint`, `npm run contract:check` (FULL read) — all green.

- [ ] **Step 5: Commit**

```bash
git add tests/ docs/ 2>/dev/null; git commit -m "test: lock help snapshots and migrate tests for fail-by-default hardening gate"
```

---

## Self-Review

**Spec coverage:** flip check-gates gate (Task 1), flip ready gate (Task 1), `--allow-soft-spots` on both CLIs (Task 1), deliberate help-snapshot update (Task 2), migration (Task 2), docs (Task 2). ✓

**Placeholder scan:** the test `-t` patterns and option-object placeholders reference real fixtures the implementer adapts; behavior and gate ids are concrete.

**Type consistency:** `allowSoftSpots?: boolean` threaded identically through `checkGates`, `buildReadyGates`, and both CLI actions; gate id `contract-hardening`.

## Notes for the implementer
- Confirm the exact ready evaluation entrypoint the CLI calls and thread `allowSoftSpots` all the way through (it may pass through an options object into `buildReadyGates`).
- The MCP tools that call checkGates/ready use the default (fail) — no flag needed there.
- `--strict` interaction: with the gate already `fail` by default, `--strict` is a no-op for it; `--allow-soft-spots` makes it `warn`, and `--strict --allow-soft-spots` re-escalates that warn to fail (consistent, acceptable).
