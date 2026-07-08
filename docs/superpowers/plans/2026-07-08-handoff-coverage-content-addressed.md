# Content-Addressed Handoff Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make handoff coverage content-addressed — a changed file counts as covered by the latest handoff run's changed-files only if its current content hash matches the recorded one; artifact/handoff-prose/legacy coverage stays path-based.

**Architecture:** One function, `dirtyCoveredByLatestHandoffRun` in `src/core/handoff-coverage.ts`, builds a `runChangedHashByPath` map from the run's recorded changed-files (which carry a per-file hash since A2) and gates the run-changed-file coverage branch on a content-hash match, reusing `computeFileContentHash`.

**Tech Stack:** TypeScript (ESM `.js`), `execa` git, vitest.

## Global Constraints

- No LLM/network/telemetry; local git only; `computeFileContentHash` is `execa reject:false`, never throws. Deterministic.
- Additive/non-breaking: entries without a recorded `hash` (legacy runs, projected runs, artifact/prose paths) keep path-presence coverage.
- Only content-check paths that have a recorded hash; bounded hashing.
- Safe direction: recorded-hash mismatch/unhashable → not covered.
- ESM `.js` imports. Vitest SEQUENTIAL / focused files individually (parallel OOM-kills this machine); never background a full run + wait on a monitor. Read `contract:check` output IN FULL.

---

### Task 1: Content-addressed handoff coverage

**Files:**
- Modify: `src/core/handoff-coverage.ts` (`dirtyCoveredByLatestHandoffRun`, lines 78-123)
- Test: `tests/handoff-coverage.test.ts` (create if absent) or the file that currently tests `dirtyCoveredByLatestHandoffRun` (search `tests/` for it); surface test in `tests/check-gates.test.ts`

**Interfaces:**
- Consumes: `computeFileContentHash({ cwd, filePath })` from `./verified-state.js`; `RunChangedFile` (has optional `hash`) from `./runs.js`.

- [ ] **Step 1: Write the failing tests**

Find how `dirtyCoveredByLatestHandoffRun` is currently tested (search `tests/` for `dirtyCoveredByLatestHandoffRun`; likely `tests/handoff-coverage.test.ts` or `tests/status.test.ts`/`tests/check-gates.test.ts`). Reuse that fixture pattern (a git repo, a recorded review-evidence run via the real `writeShipRun`/`writeHandoffRun` entrypoint so changed-files carry a hash, then call the function). Add:

```ts
test('handoff coverage drops when a covered file changes content after the handoff run', async () => {
  // Arrange: repo with src/x.ts; record a review-evidence run (ship/handoff) whose changed-files
  // include src/x.ts WITH a hash; latestRun/handoff wired so coverage is true initially.
  expect(await dirtyCoveredByLatestHandoffRun(cwd, changedFiles, latestRun, undefined, handoffPath)).toBe(true);

  await writeFile(path.join(cwd, 'src/x.ts'), '// edited after the handoff run\n');
  const changedAfter = await parseGitStatus(await getGitStatus(cwd)); // current dirty set
  expect(await dirtyCoveredByLatestHandoffRun(cwd, changedAfter, latestRun, undefined, handoffPath)).toBe(false);
});

test('legacy run changed-files without a hash keep path-presence handoff coverage', async () => {
  // Arrange: a run whose changed-files.json entries have NO hash covering src/x.ts; edit src/x.ts.
  // Coverage stays true (path-presence fallback).
  expect(await dirtyCoveredByLatestHandoffRun(cwd, changedFiles, latestRun, undefined, handoffPath)).toBe(true);
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/handoff-coverage.test.ts -t "handoff coverage drops"` (use the actual test file)
Expected: FAIL — coverage stays true after the edit (path-presence only).

- [ ] **Step 3: Implement**

In `src/core/handoff-coverage.ts`:
- Add imports: `import { computeFileContentHash } from './verified-state.js';` and widen the `runs.js` import to include `RunChangedFile`.
- After `coveredPaths` is built (~line 94), build the hash map from the SAME source array used for `coveredPaths`:

```ts
  const runChangedFiles = (latestRunChangedFiles ?? latestRunRecord?.changedFiles ?? []) as RunChangedFile[];
  const runChangedHashByPath = new Map<string, string | undefined>(
    runChangedFiles.map((file) => [normalizeGitStatusPath(file.path), file.hash]),
  );
```

- Replace the final `return changedFiles.every((changedFile) => { ... });` (lines 117-122) with:

```ts
  const results = await Promise.all(
    changedFiles.map(async (changedFile) => {
      if (isLatestReviewEvidenceRunArtifact(changedFile.path, latestRun)) return true;
      if (isCoveredAgentLoopArtifactDirectory(changedFile.path, coveredPaths, latestRun)) return true;
      if (isCoveredByEvidenceGroup(changedFile.path, coveredEvidenceGroups)) return true;
      const norm = normalizeGitStatusPath(changedFile.path);
      if (!coveredPaths.has(norm)) return false;
      const recordedHash = runChangedHashByPath.get(norm);
      if (recordedHash === undefined) return true; // artifact/prose/legacy: path-presence
      const currentHash = await computeFileContentHash({ cwd, filePath: changedFile.path });
      return currentHash !== undefined && currentHash === recordedHash;
    }),
  );
  return results.every(Boolean);
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/handoff-coverage.test.ts -t "handoff coverage"`
Expected: PASS (drop-on-edit and legacy).

- [ ] **Step 5: Surface flow test**

In `tests/check-gates.test.ts` (reuse its fixture), add: a handoff run covers a file, the `handoff-summary` gate reports covered/pass; edit the covered file; the gate now reports the handoff as NOT covering the dirty files (warn/not-covered). Run focused; confirm pass. (If the check-gates fixture makes this awkward, cover propagation via a focused `dirtyCoveredByLatestHandoffRun` assertion and say so in the report.)

- [ ] **Step 6: Full verification (SEQUENTIAL / focused; read contract:check IN FULL)**

- Run the touched + consumer files individually: `npx vitest run tests/handoff-coverage.test.ts`, `tests/check-gates.test.ts`, `tests/status.test.ts`, `tests/maintainer-check.test.ts`, `tests/evidence-map.test.ts` — all pass. Migrate any test that creates a handoff run then mutates a covered file before asserting coverage (update to content-addressed semantics or keep the file unchanged; never weaken).
- `npm run typecheck`, `npm run lint`, `npm run contract:check` — all green (read the FULL contract:check output, not a truncated tail).

- [ ] **Step 7: Commit**

```bash
git add src/core/handoff-coverage.ts tests/
git commit -m "feat: content-addressed handoff coverage"
```

---

## Self-Review

**Spec coverage:** hash map from run changed-files (Step 3); content gate on the run-coverage branch only (Step 3); artifact/prose/legacy → path-presence (Step 3 `recordedHash === undefined`); bounded hashing (only when recordedHash defined); safe direction (mismatch/unhashable → not covered); surface propagation (Step 5); migration (Step 6). ✓

**Placeholder scan:** No TBD/TODO; "the actual test file" points at a real, discoverable suite; code + assertions concrete.

**Type consistency:** `runChangedHashByPath: Map<string, string | undefined>`, `RunChangedFile`, `computeFileContentHash({ cwd, filePath })`, `normalizeGitStatusPath` used consistently.

## Notes for the implementer
- The three early-return branches (artifact / agentloop-dir / evidence-group) are unchanged — only the final `coveredPaths.has` branch gains the hash gate.
- `latestRunRecord?.changedFiles` is `RunChangedFile[]` at runtime (has `hash`); the cast makes it explicit for the hash map.
