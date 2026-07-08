# Gate-Bite Cheap Wins (C2 + C3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Checkbox steps.

**Goal:** C2 — the `ship` report lists skipped verification commands. C3 — `create-task` reports contract soft spots by default (remove the redundant `--harden` flag).

**Tech Stack:** TypeScript (ESM `.js`), vitest.

## Global Constraints
- No LLM/network/telemetry; reuse `verificationNotRunItems`/`analyzeContract`. Deterministic. ESM `.js`.
- C2 is markdown-only (`ship --json` unchanged). C3 removes an UNRELEASED flag (`--harden`) → create-task `--help` snapshot updates DELIBERATELY (only that line removed); `create-task --json` unchanged.
- Vitest focused/sequential (parallel OOM-kills); read `contract:check` IN FULL.

---

### Task 1: C2 — ship report lists skipped verification commands

**Files:**
- Modify: `src/core/verification-report-sections.ts` (export a shared `renderVerificationNotRun`)
- Modify: `src/core/pr-summary.ts` (use the shared renderer), `src/core/ship.ts` (`ShipMarkdownInput` + `renderShipMarkdown` + thread `verificationMarkdown`)
- Test: `tests/ship.test.ts`

**Interfaces:**
- Produces: `renderVerificationNotRun(markdown: string | undefined): string` exported from `verification-report-sections.ts`.

- [ ] **Step 1: Write failing test**

In `tests/ship.test.ts` (reuse its fixture; make a verification report where a command was skipped — the report's "Not Run" section lists it):

```ts
it('ship report lists skipped verification commands', async () => {
  // Arrange: a ship run whose verification report recorded a skipped command (e.g. build not configured).
  expect(shipMarkdown).toContain('Verification Not Run');
  expect(shipMarkdown).toMatch(/build/); // the skipped command appears (adapt to the fixture's skipped item)
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/ship.test.ts -t "skipped verification"`
Expected: FAIL — ship report has no such section.

- [ ] **Step 3: Implement**

- In `src/core/verification-report-sections.ts`, add and export `renderVerificationNotRun(markdown)` — move the exact body of `pr-summary.ts`'s private `renderVerificationNotRun` (lines ~75-85): no markdown → "- No verification report was available."; `verificationNotRunItems(markdown)` empty → "- No skipped commands were recorded."; else the mapped bullets (reuse the same `escapeMarkdownProse(...).replace(/\r/...)` formatting — import `escapeMarkdownProse` there).
- In `src/core/pr-summary.ts`, delete the private `renderVerificationNotRun` and import + use the shared one (behavior identical — existing pr-summary tests must stay green).
- In `src/core/ship.ts`: add `verificationMarkdown?: string` to `ShipMarkdownInput`; thread the already-read `verificationMarkdown` (ship.ts:252) into the `renderShipMarkdown({...})` call (ship.ts:360); in `renderShipMarkdown`, add a section:

```
## Verification Not Run
${renderVerificationNotRun(input.verificationMarkdown)}
```

placed near the existing Verification line. Import `renderVerificationNotRun` from `./verification-report-sections.js`.

- [ ] **Step 4: Run to verify pass + no regressions**

Run: `npx vitest run tests/ship.test.ts` and `npx vitest run tests/pr-summary.test.ts` (pr-summary unchanged behavior).
Expected: PASS. `npm run typecheck`, `npm run lint` green. `npm run contract:check` GREEN with NO snapshot change (ship markdown-only).

- [ ] **Step 5: Commit**

```bash
git add src/core/verification-report-sections.ts src/core/pr-summary.ts src/core/ship.ts tests/ship.test.ts
git commit -m "feat: list skipped verification commands in the ship report"
```

---

### Task 2: C3 — create-task reports soft spots by default

**Files:**
- Modify: `src/cli/commands/create-task.ts` (remove `--harden` flag + gate; always report in human path)
- Test: `tests/create-task.test.ts` (or `tests/prepare-pr`/the create-task CLI test)
- Modify (deliberate): `tests/contract/__snapshots__/cli-help.contract.test.ts.snap` (create-task loses `--harden`)
- Modify: `CHANGELOG.md` (update the harden bullet)

- [ ] **Step 1: Write failing test**

In the create-task CLI test file (uses `execa(tsxPath, [cliPath, 'create-task', ...])`):

```ts
it('reports contract soft spots by default for a thin contract', async () => {
  // create a thin task (no forbidden files / vague acceptance), no --harden flag
  const result = await execa(tsxPath, [cliPath, 'create-task', '--type', 'feature', '--title', 'thin', ...], { cwd, reject: false });
  expect(result.stdout).toMatch(/soft spot/i);
  expect(result.stdout).toContain('agentloop harden');
});

it('does not print the soft-spot report in --json mode', async () => {
  const result = await execa(tsxPath, [cliPath, 'create-task', '--type', 'feature', '--title', 'x', '--json', ...], { cwd, reject: false });
  expect(() => JSON.parse(result.stdout)).not.toThrow(); // clean JSON, no report appended
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/create-task.test.ts -t "soft spots by default"`
Expected: FAIL — report only prints with `--harden`.

- [ ] **Step 3: Implement**

- Remove the `.option('--harden', ...)` line (create-task.ts:371).
- Change the `if (options.harden === true) { ... }` block (create-task.ts:540) to run UNCONDITIONALLY in the human path — i.e. drop the `if (options.harden === true)` guard so the soft-spot report + hint always print (this block is already after the `--json` early-return, so `--json` output stays clean; VERIFY the block is after the json return — if not, guard it with `if (!options.json)`).

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/create-task.test.ts -t "soft spots"`
Expected: PASS (both).

- [ ] **Step 5: Deliberate snapshot + changelog + full verify**

- `npm run contract:check` (FULL read): the create-task `cli-help.contract` snapshot mismatches (`--harden` removed). Regenerate `npx vitest run tests/contract/cli-help.contract.test.ts -u`, `git diff` the snapshot, CONFIRM the only change is the removed `--harden` line under create-task. Re-run `contract:check` → green.
- In `CHANGELOG.md` `## Unreleased`, update the harden bullet that says `agentloop create-task --harden` to reflect that create-task now reports soft spots by default (remove the `--harden` reference).
- Run consumers individually: `tests/create-task.test.ts`, `tests/status.test.ts`. Migrate any test invoking `create-task --harden` (the flag is gone) to the new default behavior.
- `npm run typecheck`, `npm run lint` green.

- [ ] **Step 6: Commit**

```bash
git add src/cli/commands/create-task.ts tests/ CHANGELOG.md tests/contract/__snapshots__/cli-help.contract.test.ts.snap
git commit -m "feat: create-task reports contract soft spots by default"
```

---

## Self-Review

**Spec coverage:** C2 shared renderer + ship section + markdown-only (Task 1); C3 default report + flag removal + json-clean + deliberate snapshot + changelog (Task 2). ✓

**Placeholder scan:** fixtures reuse real suites; the skipped-command + thin-contract arrangements are concrete.

**Type consistency:** `renderVerificationNotRun(markdown)`, `verificationMarkdown?: string` on ShipMarkdownInput used consistently.

## Notes for the implementer
- C3: confirm the create-task soft-spot block is after the `if (options.json) { ...; return; }` early-return; if it is, dropping the `--harden` guard is safe for `--json`. If not, add `if (!options.json)`.
- Any existing test passing `create-task --harden` must be updated (flag removed) — the report is now default.
