# Change-Intent Reconciliation (B2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Checkbox steps.

**Goal:** List the changed files not tied to intent (unexplained/forbidden-by-task) with explanations in the prepare-pr packet's Evidence Map section, so the reviewer sees the change-side of the reconciliation without expanding a handle.

**Architecture:** New `renderChangeIntentMarkdown` in `evidence-map.ts` (renders `evidenceMap.files`); placed in `prepare-pr.ts` `buildPrBody` under the Evidence Map section. Markdown-only — the data is already in `--json`, so no contract change.

## Global Constraints
- No LLM/network/telemetry; pure render of already-computed data. Deterministic. ESM `.js`.
- Markdown-only: NO `--json` shape change, NO snapshot update (assert `contract:check` unchanged).
- Vitest focused/sequential (parallel OOM-kills); read `contract:check` IN FULL.

---

### Task 1: Render change-intent files in the prepare-pr packet

**Files:**
- Modify: `src/core/evidence-map.ts` (add `renderChangeIntentMarkdown`)
- Modify: `src/core/prepare-pr.ts` (`buildPrBody`, after the compact Evidence Map line ~225)
- Test: `tests/evidence-map.test.ts`, `tests/prepare-pr.test.ts`

**Interfaces:**
- Produces: `renderChangeIntentMarkdown(map: Pick<EvidenceMap, 'files'>): string`.

- [ ] **Step 1: Write failing tests**

In `tests/evidence-map.test.ts`:

```ts
import { renderChangeIntentMarkdown } from '../src/core/evidence-map.js';

test('renderChangeIntentMarkdown lists files not tied to intent with explanations', async () => {
  // Build a real evidence map (reuse the file's fixture) with an unexplained changed file.
  const md = renderChangeIntentMarkdown(map);
  expect(md).toContain('unexplained-file.ts'); // or the fixture's unexplained path
  expect(md).not.toContain('All changed files are tied'); // because there IS one
});

test('renderChangeIntentMarkdown shows a positive line when everything is tied', () => {
  const md = renderChangeIntentMarkdown({ files: [
    { path: 'a.ts', status: 'M', unexplained: false, forbiddenByTask: false, explanation: 'x',
      agentLoopEvidence: false, coveredByTask: true, coveredByRun: false, riskSensitive: false, area: 'core' } as any,
  ] });
  expect(md).toContain('All changed files are tied to task scope or recorded evidence.');
});
```

In `tests/prepare-pr.test.ts` (reuse its fixture):

```ts
it('lists changes not tied to intent in the packet Evidence Map section', async () => {
  // Arrange: a changed file that is unexplained (not in Likely Files, no run coverage).
  expect(prBody).toMatch(/## Evidence Map[\s\S]*unexplained/); // the file appears under Evidence Map
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/evidence-map.test.ts -t "renderChangeIntentMarkdown"`
Expected: FAIL — function not exported.

- [ ] **Step 3: Implement**

In `src/core/evidence-map.ts` (uses `inlineCode`, `escapeMarkdownProse`, already in the file):

```ts
export function renderChangeIntentMarkdown(map: Pick<EvidenceMap, 'files'>): string {
  const notTied = map.files.filter((file) => file.unexplained || file.forbiddenByTask);
  if (notTied.length === 0) {
    return '- All changed files are tied to task scope or recorded evidence.';
  }
  return notTied
    .map(
      (file) =>
        `- ${inlineCode(file.path)} (${inlineCode(file.status)}): ${escapeMarkdownProse(file.explanation)}`,
    )
    .join('\n');
}
```

In `src/core/prepare-pr.ts` `buildPrBody`, import `renderChangeIntentMarkdown` (add to the existing `./evidence-map.js` import) and render it right after `${renderEvidenceMapCompactMarkdown(input.evidenceMap)}` in the `## Evidence Map` section:

```ts
${renderEvidenceMapCompactMarkdown(input.evidenceMap)}
${renderChangeIntentMarkdown(input.evidenceMap)}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/evidence-map.test.ts -t "renderChangeIntentMarkdown"` and `npx vitest run tests/prepare-pr.test.ts -t "not tied to intent"`
Expected: PASS.

- [ ] **Step 5: Full verification (focused/sequential; contract:check IN FULL, expect NO snapshot change)**

- `npx vitest run tests/evidence-map.test.ts`, `tests/prepare-pr.test.ts`, `tests/ship.test.ts` individually.
- `npm run contract:check` — GREEN with NO snapshot update needed (markdown-only; if a snapshot mismatches, STOP — something leaked into `--json`).
- `npm run typecheck`, `npm run lint` green.

- [ ] **Step 6: Commit**

```bash
git add src/core/evidence-map.ts src/core/prepare-pr.ts tests/
git commit -m "feat: list change-intent files in the prepare-pr packet"
```

---

## Self-Review

**Spec coverage:** renderer (Task 1), placement in buildPrBody Evidence Map section (Task 1), markdown-only/no-contract-change (Task 1 Step 5), positive line when none (Task 1). ✓

**Placeholder scan:** No TBD/TODO; fixtures reuse real suites.

**Type consistency:** `renderChangeIntentMarkdown(map: Pick<EvidenceMap, 'files'>)` used consistently.

## Notes for the implementer
- Confirm the `tests/evidence-map.test.ts` fixture can produce an `unexplained` file (a changed file not in the task's Likely Files and not run-covered); adapt the assertion to the fixture's actual path.
- Reuse the existing per-file `explanation` string (do not recompute it).
