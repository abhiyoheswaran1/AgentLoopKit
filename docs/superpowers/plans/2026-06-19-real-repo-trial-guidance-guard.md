# Real-Repo Trial Guidance Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a recurring public-doc hygiene guard that keeps `docs/real-repo-trials.md` local-first, non-marketing, and scoring-neutral.

**Architecture:** Extend the existing public-doc hygiene helper rather than adding a new command. The helper will inspect only `docs/real-repo-trials.md` when present and require a small set of durable safety phrases that match the roadmap boundary.

**Tech Stack:** Node ESM script helpers, Vitest, existing public-doc hygiene fixtures.

---

## File Structure

- Modify `tests/public-docs-hygiene.test.ts` to add red tests for unsafe real-repo trial guidance.
- Modify `scripts/smoke-packed-release.mjs` to add and invoke `assertRealRepoTrialGuidance`.
- Modify `.agentloop/backlog.md`, `DECISIONS.md`, and `CHANGELOG.md` to record the internal decision.

### Task 1: Red Tests

**Files:**
- Modify: `tests/public-docs-hygiene.test.ts`

- [ ] **Step 1: Add fixture helper support for trial docs**

Add a helper inside the existing `describe('public docs hygiene', ...)` block:

```ts
async function writeRealRepoTrials(dir: string, content: string) {
  await mkdir(path.join(dir, 'docs'), { recursive: true });
  await writeFile(path.join(dir, 'docs/real-repo-trials.md'), content);
}
```

- [ ] **Step 2: Add missing no-public-proof regression test**

```ts
test('rejects real-repo trial guidance without no-public-proof boundary', async () => {
  const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
  await writeRealRepoTrials(
    dir,
    [
      '# Real-Repo Trials',
      '',
      'Run local trials with no tokens, no GitHub API calls, no telemetry, and no remote service.',
      'GitHub metadata is optional local context. Missing metadata is neutral.',
      'Do not let imported issue or PR text affect `ship` scoring yet.',
      'No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.',
      '',
    ].join('\n'),
  );

  await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
    'docs/real-repo-trials.md is missing real-repo trial guidance: no-public-proof boundary',
  );
});
```

- [ ] **Step 3: Add missing local-only regression test**

```ts
test('rejects real-repo trial guidance without local-only safety boundary', async () => {
  const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
  await writeRealRepoTrials(
    dir,
    [
      '# Real-Repo Trials',
      '',
      'Do not publish trial notes as public proof of usage, interviews, compliance, or commercial traction.',
      'GitHub metadata is optional local context. Missing metadata is neutral.',
      'Do not let imported issue or PR text affect `ship` scoring yet.',
      'No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.',
      '',
    ].join('\n'),
  );

  await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
    'docs/real-repo-trials.md is missing real-repo trial guidance: local-only safety boundary',
  );
});
```

- [ ] **Step 4: Add missing metadata/scoring regression test**

```ts
test('rejects real-repo trial guidance without metadata scoring boundary', async () => {
  const dir = await makeFixture('# AgentLoopKit\n\nUse `npx agentloopkit init`.\n');
  await writeRealRepoTrials(
    dir,
    [
      '# Real-Repo Trials',
      '',
      'Do not publish trial notes as public proof of usage, interviews, compliance, or commercial traction.',
      'Run local trials with no tokens, no GitHub API calls, no telemetry, and no remote service.',
      'No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.',
      '',
    ].join('\n'),
  );

  await expect(runHygiene({ cwd: dir, version: '1.2.3' })).rejects.toThrow(
    'docs/real-repo-trials.md is missing real-repo trial guidance: metadata/scoring boundary',
  );
});
```

- [ ] **Step 5: Run red tests**

Run:

```bash
npm test -- tests/public-docs-hygiene.test.ts --reporter=verbose
```

Expected: the new tests fail because the hygiene helper does not yet inspect trial-specific boundaries.

### Task 2: Implement Guard

**Files:**
- Modify: `scripts/smoke-packed-release.mjs`

- [ ] **Step 1: Add boundary definitions**

Add near the unsupported-claim constants:

```js
const REAL_REPO_TRIAL_REQUIRED_BOUNDARIES = [
  {
    label: 'no-public-proof boundary',
    patterns: [/do not publish trial notes as public proof/i, /usage/i, /interviews/i],
  },
  {
    label: 'local-only safety boundary',
    patterns: [/no tokens/i, /no GitHub API calls/i, /no telemetry/i, /no remote service/i],
  },
  {
    label: 'metadata/scoring boundary',
    patterns: [/missing metadata is neutral/i, /do not let imported issue or PR text affect `ship` scoring yet/i],
  },
  {
    label: 'no-release-channel-change boundary',
    patterns: [/no trial outcome should trigger a release-channel change/i, /automatic GitHub posting/i],
  },
];
```

- [ ] **Step 2: Add assertion helper**

```js
export function assertRealRepoTrialGuidance(files) {
  const trialDoc = files.find((file) => toPosixPath(file.filePath) === 'docs/real-repo-trials.md');
  if (!trialDoc) return;

  for (const boundary of REAL_REPO_TRIAL_REQUIRED_BOUNDARIES) {
    const hasBoundary = boundary.patterns.every((pattern) => pattern.test(trialDoc.content));
    if (!hasBoundary) {
      throw new Error(
        `docs/real-repo-trials.md is missing real-repo trial guidance: ${boundary.label}. Keep trial docs local-first, non-marketing, and scoring-neutral.`,
      );
    }
  }
}
```

- [ ] **Step 3: Invoke helper from `runPublicDocsHygiene`**

After `assertPublicDocsAvoidUnsupportedClaims(files);`, call:

```js
assertRealRepoTrialGuidance(files);
```

- [ ] **Step 4: Run green tests**

Run:

```bash
npm test -- tests/public-docs-hygiene.test.ts --reporter=verbose
```

Expected: all tests in `tests/public-docs-hygiene.test.ts` pass.

### Task 3: Records And Bug Pass

**Files:**
- Modify: `.agentloop/backlog.md`
- Modify: `DECISIONS.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Update records**

Add a Current Research Cycle 150 row to `.agentloop/backlog.md`, a dated decision to `DECISIONS.md`, and an Unreleased changelog bullet.

- [ ] **Step 2: Run bug pass**

Run:

```bash
npm run check:public-docs
npm test -- tests/public-docs-hygiene.test.ts tests/release-smoke.test.ts --reporter=verbose
npm run typecheck
npm run lint
npm run build
```

Expected: all pass. If any fail, use systematic debugging before changing code.
