# Scope-Coverage Precision (B3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Checkbox steps.

**Goal:** When a changed file is covered by task scope, state in its evidence-map explanation whether it matched an exact likely-file entry (strong) or only a directory scope (weaker).

**Architecture:** `taskCoverageKind` helper + thread the kind into `explanationFor`'s `coveredByTask` branch in `evidence-map.ts`. Value-only (explanation is already a `--json` string field) — no shape/contract change.

## Global Constraints
- No LLM/network/telemetry; pure reclassification. Deterministic. ESM `.js`.
- Value-only: NO `--json` shape change, NO snapshot update (assert contract:check unchanged).
- `coveredByTask` boolean is unchanged (both exact and directory are in-scope).
- Vitest focused/sequential (parallel OOM-kills); read `contract:check` IN FULL.

---

### Task 1: Distinguish exact vs directory task coverage in the explanation

**Files:**
- Modify: `src/core/evidence-map.ts` (`taskCoverageKind`; `explanationFor`; `buildEvidenceMap` file loop)
- Test: `tests/evidence-map.test.ts`

**Interfaces:**
- Produces: `taskCoverageKind(filePath: string, patterns: PathPattern[]): 'exact' | 'directory' | undefined`.

- [ ] **Step 1: Write failing tests**

In `tests/evidence-map.test.ts`:

```ts
test('a file under a directory likely-file entry is covered by directory scope (weaker), stated in its explanation', async () => {
  // Arrange a real evidence map: task Likely Files = "src/core/" (a directory), changed file "src/core/foo.ts".
  const foo = map.files.find((f) => f.path.endsWith('src/core/foo.ts'));
  expect(foo?.coveredByTask).toBe(true);
  expect(foo?.explanation).toMatch(/directory/i);
  expect(foo?.explanation).not.toMatch(/exact/i);
});

test('a file that exactly matches a likely-file entry is covered by an exact entry, stated in its explanation', async () => {
  // Arrange: task Likely Files = "src/core/foo.ts" (exact), changed file "src/core/foo.ts".
  const foo = map.files.find((f) => f.path.endsWith('src/core/foo.ts'));
  expect(foo?.explanation).toMatch(/exact/i);
});
```

(If the test file's fixture helper doesn't let you set Likely Files easily, add a small helper or write the task contract markdown directly with a `## Likely Files or Areas` section, then `buildEvidenceMap`.)

Also add direct unit tests for `taskCoverageKind` if it is exported (export it): exact-file entry → `exact`; file-under-directory → `directory`; file-equal-to-directory-entry → `exact`; no match → `undefined`.

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/evidence-map.test.ts -t "directory scope"`
Expected: FAIL — explanation says the generic "matches the task likely-file scope."

- [ ] **Step 3: Implement**

In `src/core/evidence-map.ts`, add (near `pathMatchesPattern`):

```ts
export function taskCoverageKind(
  filePath: string,
  patterns: PathPattern[],
): 'exact' | 'directory' | undefined {
  const normalizedFile = normalizePath(filePath);
  let directory: 'directory' | undefined;
  for (const pattern of patterns) {
    if (normalizedFile === pattern.value) return 'exact';
    if (pattern.kind === 'directory' && normalizedFile.startsWith(`${pattern.value}/`)) {
      directory = 'directory';
    }
  }
  return directory;
}
```

In `explanationFor`, add a `coveredByTaskKind?: 'exact' | 'directory'` field to its input type, and replace the `coveredByTask` branch (currently `return 'Changed file matches the task likely-file scope.';`) with:

```ts
  if (input.coveredByTask) {
    return input.coveredByTaskKind === 'directory'
      ? 'Changed file is under a task likely-file directory scope — the file itself is not named.'
      : 'Changed file matches an exact task likely-file entry.';
  }
```

In `buildEvidenceMap`'s file loop, where `explanationFor({ ... })` is called, add `coveredByTaskKind: coveredByTask ? taskCoverageKind(file.path, likelyPatterns) : undefined,` to the argument object. (`coveredByTask` and `likelyPatterns` are already in scope there.)

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/evidence-map.test.ts -t "scope"`
Expected: PASS.

- [ ] **Step 5: Full verification (focused/sequential; contract:check IN FULL, NO snapshot change)**

- `npx vitest run tests/evidence-map.test.ts`, `tests/prepare-pr.test.ts`, `tests/explain-diff` (`tests/cli-explain-diff.test.ts`), `tests/guard.test.ts` individually — migrate any test asserting the OLD "matches the task likely-file scope." explanation string to the new wording (that is a correct behavior update, not a weakening).
- `npm run contract:check` — GREEN, NO snapshot update (value-only; if a snapshot mismatches, STOP).
- `npm run typecheck`, `npm run lint` green.

- [ ] **Step 6: Commit**

```bash
git add src/core/evidence-map.ts tests/
git commit -m "feat: distinguish exact vs directory task-scope coverage in evidence explanations"
```

---

## Self-Review

**Spec coverage:** `taskCoverageKind` (Task 1), explanation branch (Task 1), thread in loop (Task 1), value-only/no-contract-change (Task 1 Step 5). ✓

**Placeholder scan:** No TBD/TODO; fixtures concrete.

**Type consistency:** `taskCoverageKind(filePath, patterns)`, `coveredByTaskKind?: 'exact'|'directory'` used consistently.

## Notes for the implementer
- Any existing test that asserts the literal old explanation `Changed file matches the task likely-file scope.` must be updated to the new wording — this is the intended change, not a weakened assertion.
- `taskCoverageKind` must never disagree with `pathMatchesAny`/`coveredByTask` (same exact-vs-prefix logic).
