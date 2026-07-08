# Content-Addressed Run-Ledger Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make run-ledger coverage content-addressed — record a per-file git blob hash in each run's `changed-files.json` and count a file as `coveredByRun` only if its current content hash matches, so an edited-after-the-run file is no longer treated as covered.

**Architecture:** A new `computeFileContentHash` helper (git hash-object) in `src/core/verified-state.ts`; the three run-record functions in `runs.ts` record `{ status, path, hash? }` per changed file; `evidence-map.ts` compares recorded hashes against current hashes (lazily, only for run-covered-with-hash paths). Legacy runs (no hash) fall back to path-presence.

**Tech Stack:** TypeScript (ESM `.js` specifiers), `execa`, Node, vitest.

## Global Constraints

- No LLM/network/telemetry. Hashing is local `git hash-object`, `execa` `reject:false`, never throws.
- Deterministic (git blob hashes, no timestamps).
- Additive/non-breaking: legacy run entries with no `hash` keep path-presence coverage.
- ESM imports use explicit `.js` extensions.
- Vitest SEQUENTIAL on this machine: `npx vitest run --no-file-parallelism` (parallel OOM-kills, exit 137). Focused: `npx vitest run <file> -t <name>`. Never background a full run + wait on a monitor.

---

### Task 1: `computeFileContentHash` helper + record hashes in runs

**Files:**
- Modify: `src/core/verified-state.ts` (add the helper)
- Modify: `src/core/runs.ts` (`RunChangedFile` type, `changedFilesWithHashes`, the 3 write fns, `readRunChangedFiles` return type)
- Test: `tests/verified-state.test.ts`, `tests/runs*.test.ts` (or wherever runs are tested)

**Interfaces:**
- Produces: `computeFileContentHash(options: { cwd: string; filePath: string }): Promise<string | undefined>` — git blob hash of the file, or `undefined` if unhashable (deleted/missing/git failure). Never throws.
- Produces: `type RunChangedFile = { status: string; path: string; hash?: string }`; `readRunChangedFiles` returns `Promise<RunChangedFile[]>`.

- [ ] **Step 1: Write failing helper tests**

Add to `tests/verified-state.test.ts` (reuse its git-repo fixture helper):

```ts
import { computeFileContentHash } from '../src/core/verified-state.js';

test('computeFileContentHash returns a stable git blob hash for a tracked file', async () => {
  const dir = await gitRepo(); // existing helper: inits repo + commits a.ts
  const h1 = await computeFileContentHash({ cwd: dir, filePath: 'a.ts' });
  const h2 = await computeFileContentHash({ cwd: dir, filePath: 'a.ts' });
  expect(h1).toMatch(/^[a-f0-9]{40}$/);
  expect(h1).toBe(h2);
});
test('computeFileContentHash changes when content changes', async () => {
  const dir = await gitRepo();
  const before = await computeFileContentHash({ cwd: dir, filePath: 'a.ts' });
  await writeFile(path.join(dir, 'a.ts'), 'export const a = 99;\n');
  expect(await computeFileContentHash({ cwd: dir, filePath: 'a.ts' })).not.toBe(before);
});
test('computeFileContentHash returns undefined for a missing file, no throw', async () => {
  const dir = await gitRepo();
  expect(await computeFileContentHash({ cwd: dir, filePath: 'nope.ts' })).toBeUndefined();
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/verified-state.test.ts -t computeFileContentHash`
Expected: FAIL — not exported.

- [ ] **Step 3: Implement the helper**

In `src/core/verified-state.ts` (it already has a private `runGit`; reuse or mirror it):

```ts
export async function computeFileContentHash(options: {
  cwd: string;
  filePath: string;
}): Promise<string | undefined> {
  const result = await execa('git', ['hash-object', '--', options.filePath], {
    cwd: options.cwd,
    reject: false,
  });
  const hash = result.stdout.trim();
  return result.exitCode === 0 && /^[a-f0-9]{40}$/.test(hash) ? hash : undefined;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/verified-state.test.ts -t computeFileContentHash`
Expected: PASS.

- [ ] **Step 5: Write the record test**

Find the runs test file (search `tests/` for a test that calls `writeVerificationRun`/`writeShipRun`/`readRunChangedFiles`). Add a test that a recorded run's changed-files carry a hash:

```ts
test('recorded run changed-files include a content hash for existing files', async () => {
  // Arrange with the file's existing run-record fixture: a git repo with a changed tracked file,
  // then call the same write-run entrypoint the other tests use.
  const recorded = await readRunChangedFiles(cwd, runId);
  const entry = recorded.find((f) => f.path.endsWith('changed.ts'));
  expect(entry?.hash).toMatch(/^[a-f0-9]{40}$/);
});
```

- [ ] **Step 6: Run to verify fail**

Run: `npx vitest run tests/runs.test.ts -t "content hash"` (use the actual runs test file name)
Expected: FAIL — no hash recorded.

- [ ] **Step 7: Implement recording**

In `src/core/runs.ts`:
- Add `import { computeFileContentHash } from './verified-state.js';`
- Add the type: `export type RunChangedFile = { status: string; path: string; hash?: string };`
- Add an async builder beside `sanitizeChangedFiles` (which maps path → safe display path):

```ts
async function changedFilesWithHashes(
  cwd: string,
  changedFiles: GitFileStatus[],
): Promise<RunChangedFile[]> {
  return Promise.all(
    changedFiles.map(async (file) => {
      const hash = await computeFileContentHash({ cwd, filePath: file.path });
      const safe = toSafeDisplayPath(cwd, file.path);
      return hash ? { status: file.status, path: safe, hash } : { status: file.status, path: safe };
    }),
  );
}
```

- In each of `writeShipRun`, `writeVerificationRun`, `writeHandoffRun`, replace `const safeChangedFiles = sanitizeChangedFiles(options.cwd, options.changedFiles);` with `const safeChangedFiles = await changedFilesWithHashes(options.cwd, options.changedFiles);`. (Compute the hash on the REAL path before sanitizing — `changedFilesWithHashes` does this: it hashes `file.path` before `toSafeDisplayPath`.)
- Change `readRunChangedFiles` return type to `Promise<RunChangedFile[]>` (the JSON already round-trips the optional `hash`; just widen the type).

Keep `sanitizeChangedFiles` if other call sites use it; otherwise it may be removed if now unused (check references).

- [ ] **Step 8: Run to verify pass + no regressions**

Run: `npx vitest run tests/runs.test.ts` and `npx vitest run tests/verified-state.test.ts`
Expected: PASS. Then `npm run typecheck`, `npm run lint` (green).

- [ ] **Step 9: Commit**

```bash
git add src/core/verified-state.ts src/core/runs.ts tests/verified-state.test.ts tests/runs.test.ts
git commit -m "feat: record per-file content hash in run changed-files"
```

---

### Task 2: Content-addressed run coverage in the evidence map

**Files:**
- Modify: `src/core/evidence-map.ts` (`RecentRunCoverage` type ~line 105, `readRecentRunCoverage` ~258, `findRunCoverage` ~288, `buildEvidenceMap` file loop ~413-455)
- Test: `tests/evidence-map.test.ts`; surface test in `tests/cli-explain-diff.test.ts` or `tests/guard.test.ts`

**Interfaces:**
- Consumes: `computeFileContentHash` (Task 1); `readRunChangedFiles` now returns `RunChangedFile[]` with optional `hash`.
- Produces: a run-covered file is `coveredByRun` only when its recorded hash is absent (legacy) or matches its current content hash.

- [ ] **Step 1: Write failing tests**

In `tests/evidence-map.test.ts` (reuse its fixture: git repo + a recorded run + `buildEvidenceMap`):

```ts
test('run coverage drops when a covered file changes content after the run', async () => {
  // Arrange: repo with src/x.ts; record a run whose changed-files include src/x.ts WITH a hash
  // (use the real write-run entrypoint so the hash is recorded).
  const covered = await buildEvidenceMap({ cwd: dir, config });
  expect(covered.files.find((f) => f.path.endsWith('src/x.ts'))?.coveredByRun).toBe(true);

  await writeFile(path.join(dir, 'src/x.ts'), '// edited after the run\n');
  const after = await buildEvidenceMap({ cwd: dir, config });
  const x = after.files.find((f) => f.path.endsWith('src/x.ts'));
  expect(x?.coveredByRun).toBe(false);
});

test('legacy run entries without a hash keep path-presence coverage', async () => {
  // Arrange: write a run's changed-files.json manually with entries that have NO hash field,
  // covering src/x.ts; then edit src/x.ts. coveredByRun stays true (path-presence fallback).
  const map = await buildEvidenceMap({ cwd: dir, config });
  expect(map.files.find((f) => f.path.endsWith('src/x.ts'))?.coveredByRun).toBe(true);
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/evidence-map.test.ts -t "run coverage drops"`
Expected: FAIL — coveredByRun stays true after the edit (path-presence only).

- [ ] **Step 3: Implement content-addressed coverage**

In `src/core/evidence-map.ts`:
- Import: `import { computeFileContentHash } from './verified-state.js';`
- Change the `RecentRunCoverage` type (~line 105) from `paths: Set<string>` to `hashByPath: Map<string, string | undefined>`.
- In `readRecentRunCoverage` (~276-284), build the map:

```ts
    coverage.push({
      run,
      hashByPath: new Map(changedFiles.map((file) => [normalizePath(file.path), file.hash])),
    });
```

- In `buildEvidenceMap`, BEFORE the `changedFiles.map(...)` file loop (after `runs` is resolved ~line 421), precompute current hashes only for paths that some run covers WITH a recorded hash (bounded):

```ts
  const pathsNeedingHash = new Set<string>();
  for (const run of runs) {
    for (const [p, h] of run.hashByPath) if (h !== undefined) pathsNeedingHash.add(p);
  }
  const currentHashByPath = new Map<string, string | undefined>();
  for (const file of changedFiles) {
    const norm = normalizePath(file.path);
    if (pathsNeedingHash.has(norm)) {
      currentHashByPath.set(norm, await computeFileContentHash({ cwd: options.cwd, filePath: file.path }));
    }
  }
```

- Change `findRunCoverage` to take `currentHashByPath` and compare:

```ts
function findRunCoverage(
  filePath: string,
  runs: RecentRunCoverage[],
  currentHashByPath: Map<string, string | undefined>,
  currentTaskTitle?: string,
) {
  const normalizedPath = normalizePath(filePath);
  for (const run of runs) {
    if (!run.hashByPath.has(normalizedPath)) continue;
    const recordedHash = run.hashByPath.get(normalizedPath);
    if (recordedHash !== undefined) {
      const currentHash = currentHashByPath.get(normalizedPath);
      if (currentHash === undefined || currentHash !== recordedHash) continue; // changed since run
    }
    return {
      id: run.run.id,
      command: run.run.command,
      taskTitle: currentTaskTitle ?? run.run.task?.title ?? 'unknown task',
    };
  }
  return undefined;
}
```

- Update the call site (~line 433): `findRunCoverage(file.path, runs, currentHashByPath, task?.title)`.

Note: when `recordedHash` is present but `currentHash` is `undefined` (file unhashable now), the `continue` drops coverage for that run — but a legacy run (no recorded hash) for the same path would still cover it. If you want unhashable-current to fall back to path-presence even against a hashed run, that is a judgment call; the spec chose to treat a hashed run's mismatch/unhashable as not-covered (fail toward unexplained is the safe, north-star-aligned direction). Keep as written.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run tests/evidence-map.test.ts -t "run coverage"`
Expected: PASS (both the drop-on-edit and legacy tests).

- [ ] **Step 5: Surface flow test**

Add a test in `tests/cli-explain-diff.test.ts` or `tests/guard.test.ts` (reuse its fixture): record a run covering a file, confirm `explain-diff`/`guard` shows it explained/covered, edit the file, confirm it now shows unexplained. Run focused; confirm pass. If neither file has a workable run fixture, cover propagation via a focused `buildEvidenceMap`-level assertion and say so in the report.

- [ ] **Step 6: Full suite + migration**

Run SEQUENTIALLY: `npx vitest run --no-file-parallelism`. Migrate any test that records a run then mutates the covered file before asserting coverage — update to the content-addressed semantics or keep the file unchanged; never weaken. Then `npm run typecheck`, `npm run lint`, `npm run contract:check` — all green.

- [ ] **Step 7: Commit**

```bash
git add src/core/evidence-map.ts tests/
git commit -m "feat: content-addressed run coverage in the evidence map"
```

---

## Self-Review

**Spec coverage:** helper (Task 1), record hashes across 3 write fns (Task 1), content-addressed compare with lazy current-hash (Task 2), legacy path-presence fallback (both tasks), unhashable→safe direction (Task 2 note), surface propagation (Task 2 Step 5), migration (Task 2 Step 6). ✓

**Placeholder scan:** No TBD/TODO. References to "the existing fixture helper" point at real, reused suites; assertions and code are concrete.

**Type consistency:** `computeFileContentHash({ cwd, filePath })`, `RunChangedFile`, `hashByPath: Map<string, string | undefined>`, `currentHashByPath`, and the `findRunCoverage(filePath, runs, currentHashByPath, currentTaskTitle?)` signature are used identically across tasks.

## Notes for the implementer

- Before Task 1 Step 5 and Task 2, confirm the exact runs/evidence-map test file names and reuse their fixtures (`readRunChangedFiles`, `buildEvidenceMap`, the write-run entrypoints).
- `git hash-object -- <path>` hashes the working-tree file content (not the index), which is what we want for "current content."
