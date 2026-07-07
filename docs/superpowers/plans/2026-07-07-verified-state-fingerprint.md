# Verified-State Fingerprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make verification freshness content-addressed — record a fingerprint of the working-tree state at `verify` time and compare it at freshness-check time, so freshness goes `stale` when source changes after a passing verify.

**Architecture:** A new deterministic primitive `computeVerifiedStateFingerprint` (sha256 over `git diff HEAD` + `git status --porcelain`) is recorded as a line in the verification report and re-checked in `resolveCurrentVerificationEvidence`. Fingerprint mismatch → stale; legacy reports with no fingerprint fall back to the existing mtime rule. The fix propagates to `guard`/`check-gates`/`ready`/`nextAction` because they all consume the shared evidence resolver.

**Tech Stack:** TypeScript (ESM, `.js` import specifiers), Node `crypto`, `execa` for git, vitest. Follows existing `src/core` patterns.

## Global Constraints

- No LLM, no network, no telemetry. Git calls are local `execa` with `reject: false` (never throw into the evidence pipeline).
- Deterministic: sha256, no timestamps/randomness in the fingerprint.
- Additive/opt-in: legacy reports (no fingerprint line) keep the current mtime behavior; only reports written from this feature onward get content-checked.
- ESM imports use explicit `.js` extensions.
- The fingerprint hashes tracked content (`git diff HEAD`) + path-level status (`git status --porcelain`); it does NOT hash untracked-file bodies (documented limitation).
- Report line format is exactly: `- Verified-state fingerprint: ` followed by the 64-hex sha256 wrapped in backticks.
- Vitest runs SEQUENTIALLY on this machine: `npx vitest run --no-file-parallelism` (parallel workers OOM-kill, exit 137). Run focused tests with `npx vitest run <file> -t <name>`; never background a full run and wait on a monitor.

---

### Task 1: The `computeVerifiedStateFingerprint` primitive

**Files:**
- Create: `src/core/verified-state.ts`
- Test: `tests/verified-state.test.ts`

**Interfaces:**
- Produces: `computeVerifiedStateFingerprint(options: { cwd: string }): Promise<string>` — a 64-char lowercase hex sha256. Deterministic; outside a git repo returns a stable sentinel hash (both git commands yield empty output).

- [ ] **Step 1: Write the failing tests**

Create `tests/verified-state.test.ts`. Use a temp git repo fixture (follow the git-init pattern in `tests/evidence-map.test.ts` / `tests/create-task.test.ts` — `execa('git', ['init', ...], { cwd })`, set user.email/user.name, write and commit a file).

```ts
import path from 'node:path';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { computeVerifiedStateFingerprint } from '../src/core/verified-state.js';

const dirs: string[] = [];
async function gitRepo() {
  const dir = await mkdtemp(path.join(tmpdir(), 'vsf-'));
  dirs.push(dir);
  await execa('git', ['init', '-q'], { cwd: dir });
  await execa('git', ['config', 'user.email', 'a@b.c'], { cwd: dir });
  await execa('git', ['config', 'user.name', 'Test'], { cwd: dir });
  await writeFile(path.join(dir, 'a.ts'), 'export const a = 1;\n');
  await execa('git', ['add', '.'], { cwd: dir });
  await execa('git', ['commit', '-q', '-m', 'init'], { cwd: dir });
  return dir;
}
afterEach(async () => { await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true }))); });

describe('computeVerifiedStateFingerprint', () => {
  test('is a deterministic 64-hex hash, stable across repeated calls', async () => {
    const dir = await gitRepo();
    const a = await computeVerifiedStateFingerprint({ cwd: dir });
    const b = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).toBe(b);
  });
  test('changes when a tracked file content changes', async () => {
    const dir = await gitRepo();
    const before = await computeVerifiedStateFingerprint({ cwd: dir });
    await writeFile(path.join(dir, 'a.ts'), 'export const a = 2;\n');
    const after = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(after).not.toBe(before);
  });
  test('changes when an untracked file is added (path-level)', async () => {
    const dir = await gitRepo();
    const before = await computeVerifiedStateFingerprint({ cwd: dir });
    await writeFile(path.join(dir, 'new.ts'), 'export const n = 1;\n');
    const after = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(after).not.toBe(before);
  });
  test('does not throw outside a git repo and returns a stable hash', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'vsf-nogit-'));
    dirs.push(dir);
    const a = await computeVerifiedStateFingerprint({ cwd: dir });
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).toBe(await computeVerifiedStateFingerprint({ cwd: dir }));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/verified-state.test.ts`
Expected: FAIL — cannot find module `verified-state.js`.

- [ ] **Step 3: Write the implementation**

```ts
// src/core/verified-state.ts
import { createHash } from 'node:crypto';
import { execa } from 'execa';

async function runGit(args: string[], cwd: string): Promise<string> {
  const result = await execa('git', args, { cwd, reject: false });
  return result.exitCode === 0 ? result.stdout : '';
}

// Deterministic content fingerprint of the working-tree state that verification
// ran against: tracked changes vs HEAD plus path-level dirty/untracked status.
// Outside a git repo both commands yield '' → a stable sentinel hash. Never throws.
export async function computeVerifiedStateFingerprint(options: { cwd: string }): Promise<string> {
  const [diff, status] = await Promise.all([
    runGit(['diff', 'HEAD'], options.cwd),
    runGit(['status', '--porcelain'], options.cwd),
  ]);
  return createHash('sha256').update(`diff\0${diff}\0status\0${status}`).digest('hex');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/verified-state.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/core/verified-state.ts tests/verified-state.test.ts
git commit -m "feat: add computeVerifiedStateFingerprint primitive"
```

---

### Task 2: Record the fingerprint in the verification report

**Files:**
- Modify: `src/core/verification.ts` (where the report captures branch/commit/working-tree — around lines 644-664)
- Test: `tests/verification*.test.ts` (add to the existing verification test file; if none targets report content, add a focused test near the other `verify` tests — search for a test that runs `verify` and reads the report markdown)

**Interfaces:**
- Consumes: `computeVerifiedStateFingerprint` from `./verified-state.js`.
- Produces: the written verification report contains a line `` - Verified-state fingerprint: `<64-hex>` `` alongside the existing Git branch/commit lines.

- [ ] **Step 1: Write the failing test**

Add a test that runs the real verify flow (follow the existing verify test's setup — a temp git repo, a task contract, a passing command) and asserts the report markdown contains the fingerprint line:

```ts
test('verification report records a verified-state fingerprint', async () => {
  // Arrange with this file's existing verify fixture helper (temp git repo + task + a trivial passing command).
  // Run the same verify entrypoint the other tests use, then read the written report markdown.
  expect(reportMarkdown).toMatch(/^- Verified-state fingerprint: `[a-f0-9]{64}`$/m);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/verification.test.ts -t "verified-state fingerprint"` (use the actual verify test file name)
Expected: FAIL — no fingerprint line in the report.

- [ ] **Step 3: Implement recording**

In `src/core/verification.ts`, near where `branch` and `commit` are resolved (around lines 644-645), compute the fingerprint:

```ts
import { computeVerifiedStateFingerprint } from './verified-state.js';
// ...
const verifiedStateFingerprint = await computeVerifiedStateFingerprint({ cwd: options.cwd });
```

Then in the report render where the `- Git commit: ...` line is emitted (around line 662), add immediately after it:

```ts
`- Verified-state fingerprint: ${inlineCode(verifiedStateFingerprint)}`,
```

Match the surrounding render style (the file uses `inlineCode(...)` for the branch/commit values and joins lines — insert the new line into the same array/template exactly where branch/commit are). Do not change any other report content or the overall status logic.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/verification.test.ts -t "verified-state fingerprint"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/core/verification.ts tests/verification.test.ts
git commit -m "feat: record verified-state fingerprint in verification reports"
```

---

### Task 3: Content-addressed freshness check + surface flow

**Files:**
- Modify: `src/core/evidence.ts` (`resolveCurrentVerificationEvidence`, lines 116-165)
- Test: `tests/evidence*.test.ts` and a surface test (`tests/check-gates.test.ts` or `tests/guard.test.ts`)
- Modify (migration): any existing test that verifies a fixture then mutates the tree before asserting `fresh`

**Interfaces:**
- Consumes: `computeVerifiedStateFingerprint` from `./verified-state.js`; the report line from Task 2.
- Produces: `resolveCurrentVerificationEvidence` returns `staleReport` with a fingerprint-mismatch message when the report's recorded fingerprint no longer matches the current working tree.

- [ ] **Step 1: Write the failing test**

Add to the evidence test file (follow its existing fixture setup — temp git repo, a task, a verify report). If the file lacks a real-verify helper, construct a report markdown containing a fingerprint line computed from the current tree, then mutate the tree:

```ts
test('freshness goes stale when the tree changes after verify (fingerprint mismatch)', async () => {
  // Arrange: a git repo + task contract + a verification report whose
  // `- Verified-state fingerprint:` line is the CURRENT computeVerifiedStateFingerprint({cwd}).
  // Ensure the report file mtime is >= the task mtime (so only the fingerprint governs).
  const before = await resolveCurrentVerificationEvidence({ cwd: dir, taskPath, reportPath });
  expect(before.currentReportPath).toBe(reportPath); // fresh

  await writeFile(path.join(dir, 'src/app.ts'), '// changed\n'); // mutate a tracked file
  const after = await resolveCurrentVerificationEvidence({ cwd: dir, taskPath, reportPath });
  expect(after.currentReportPath).toBeUndefined();
  expect(after.staleReport?.message).toMatch(/fingerprint/i);
});

test('legacy report with no fingerprint keeps mtime-based freshness', async () => {
  // Arrange: a report markdown with NO fingerprint line, report mtime >= task mtime.
  const result = await resolveCurrentVerificationEvidence({ cwd: dir, taskPath, reportPath });
  expect(result.currentReportPath).toBe(reportPath); // fresh via mtime fallback, unchanged
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/evidence.test.ts -t fingerprint` (use the actual evidence test file name)
Expected: FAIL — the mutated-tree case still returns fresh (no fingerprint check yet).

- [ ] **Step 3: Implement the freshness check**

In `src/core/evidence.ts`, add the import and a message constant near the existing `STALE_VERIFICATION_MESSAGE`:

```ts
import { computeVerifiedStateFingerprint } from './verified-state.js';
const FINGERPRINT_MISMATCH_MESSAGE =
  'The working tree changed since verification; the verified-state fingerprint no longer matches. Rerun verification.';
```

Add a helper to extract the fingerprint from report markdown:

```ts
function extractVerifiedStateFingerprint(markdown: string): string | undefined {
  return markdown.match(/^- Verified-state fingerprint: `([a-f0-9]{64})`$/m)?.[1];
}
```

In `resolveCurrentVerificationEvidence`, in the branch where both `taskPath` and `reportPath` exist (currently reads `taskStat`, `reportStat`, `taskMarkdown`), also read the report markdown and add the fingerprint check BEFORE the existing mtime check:

```ts
  const [taskStat, reportStat, taskMarkdown, reportMarkdown] = await Promise.all([
    stat(options.taskPath),
    stat(options.reportPath),
    readFile(options.taskPath, 'utf8'),
    readFile(options.reportPath, 'utf8'),
  ]);

  const recordedFingerprint = extractVerifiedStateFingerprint(reportMarkdown);
  if (recordedFingerprint) {
    const currentFingerprint = await computeVerifiedStateFingerprint({ cwd: options.cwd });
    if (currentFingerprint !== recordedFingerprint) {
      return {
        latestReportPath: options.reportPath,
        staleReport: {
          path: options.reportPath,
          relativePath: relativePath(options.cwd, options.reportPath),
          message: FINGERPRINT_MISMATCH_MESSAGE,
        },
      };
    }
  }

  if (
    reportStat.mtimeMs < taskStat.mtimeMs &&
    !isPostVerificationTaskStatus(extractTaskStatus(taskMarkdown))
  ) {
    // ... existing stale-by-mtime return, unchanged
  }

  return { currentReportPath: options.reportPath, latestReportPath: options.reportPath };
```

Legacy reports (no fingerprint) skip the compute entirely and fall through to the unchanged mtime logic.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/evidence.test.ts -t fingerprint`
Expected: PASS (both new tests).

- [ ] **Step 5: Surface flow test**

Add a test (in `tests/check-gates.test.ts` or `tests/guard.test.ts`, following its fixture setup) that verifies a fixture repo, confirms the `verification` gate/evidence is fresh/pass, then mutates a tracked file and confirms the same gate now reports the verification as stale/not-fresh — proving the fix flows through the shared resolver. Run it focused; confirm it passes.

- [ ] **Step 6: Full suite + migration**

Run the full suite SEQUENTIALLY: `npx vitest run --no-file-parallelism`. Some existing tests that `verify` a fixture and then modify the tree before asserting freshness may now correctly report `stale`. For each break: if the test's intent is "fresh after verify," ensure the tree is unchanged between verify and assertion (or the report fingerprint matches); if the test is about staleness, update it to the new content-addressed reason. Never weaken an assertion. Then `npm run typecheck`, `npm run lint`, `npm run contract:check` — all green.

- [ ] **Step 7: Commit**

```bash
git add src/core/evidence.ts tests/
git commit -m "feat: content-addressed verification freshness via verified-state fingerprint"
```

---

## Self-Review

**Spec coverage:**
- Primitive `computeVerifiedStateFingerprint` (sha256 over `git diff HEAD` + `git status --porcelain`, sentinel outside repo, no throw) → Task 1. ✓
- Record fingerprint line in report at verify time → Task 2. ✓
- Freshness: present+mismatch → stale (new message); present+match or absent → existing behavior; mtime guard retained → Task 3. ✓
- Propagation to guard/check-gates via shared resolver → Task 3 Step 5. ✓
- Legacy = mtime fallback (non-breaking) → Task 3 tests + logic. ✓
- Determinism, local-only, no untracked-body hashing → Global Constraints + Task 1 code. ✓
- Test migration → Task 3 Step 6. ✓

**Placeholder scan:** No TBD/TODO. Tasks 2 and 3 reference "the existing verify/evidence test fixture helper" because those suites have established real-`verify` setups the implementer must reuse; the assertions and the exact line/regex formats are concrete.

**Type consistency:** `computeVerifiedStateFingerprint({ cwd })`, the report line `` - Verified-state fingerprint: `<64-hex>` ``, `extractVerifiedStateFingerprint`, and `FINGERPRINT_MISMATCH_MESSAGE` are used identically across tasks.

## Notes for the implementer

- Before Task 2, open `src/core/verification.ts` around lines 640-702 to see the exact render array/template for the branch/commit lines and insert the fingerprint line in the same structure with `inlineCode(...)`.
- Before Task 3, confirm the exact evidence test file name (`tests/evidence.test.ts` or similar) and reuse its fixture helper for constructing a task + report.
