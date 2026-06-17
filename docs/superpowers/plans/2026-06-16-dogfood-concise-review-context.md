# Dogfood Concise Review Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep dogfood review-context coverage while making normal dogfood logs use the concise human snapshot instead of full JSON.

**Architecture:** `scripts/dogfood.mjs` already defines every dogfood step in `createDogfoodSteps()`. The change should alter only the `agent review context` step arguments from `review-context --json --redact-paths` to `review-context --redact-paths`; JSON mode for the dogfood script remains structured because `runStep()` already suppresses child output when `--json` is passed to the script.

**Tech Stack:** Node.js script, TypeScript/Vitest tests, AgentLoopKit source CLI.

---

### Task 1: Add RED Dogfood Step Coverage

**Files:**
- Modify: `tests/autonomous-dogfood.test.ts`

- [x] **Step 1: Add a focused step-argument assertion**

Add a test that imports `createDogfoodSteps()` from `scripts/dogfood.mjs` and asserts the `agent review context` step keeps redaction but does not use `--json`:

```ts
test('uses concise human review-context output in normal dogfood logs', async () => {
  // @ts-expect-error TS7016: script helper has no declaration file.
  const dogfoodModule = await import('../scripts/dogfood.mjs');
  const steps = dogfoodModule.createDogfoodSteps() as Array<{
    name: string;
    args: string[];
  }>;

  const reviewContextStep = steps.find((step) => step.name === 'agent review context');

  expect(reviewContextStep?.args).toEqual([
    '--no-install',
    'tsx',
    'src/cli/index.ts',
    'review-context',
    '--redact-paths',
  ]);
  expect(reviewContextStep?.args).not.toContain('--json');
});
```

- [x] **Step 2: Run RED test**

Run:

```bash
npm test -- tests/autonomous-dogfood.test.ts
```

Expected: FAIL because the current step still includes `--json`.

### Task 2: Implement Minimal Dogfood Argument Change

**Files:**
- Modify: `scripts/dogfood.mjs`
- Test: `tests/autonomous-dogfood.test.ts`

- [x] **Step 1: Change the review-context step arguments**

In `createDogfoodSteps()`, change:

```js
agentloopStep('agent review context', ['review-context', '--json', '--redact-paths']),
```

to:

```js
agentloopStep('agent review context', ['review-context', '--redact-paths']),
```

- [x] **Step 2: Run focused GREEN test**

Run:

```bash
npm test -- tests/autonomous-dogfood.test.ts
```

Expected: PASS.

### Task 3: Document Dogfood Output Behavior

**Files:**
- Modify: `docs/cli-reference.md`

- [x] **Step 1: Clarify normal dogfood logs**

Update the dogfood command description to say normal dogfood output uses concise human `review-context` output while dogfood `--json` remains a structured step-result summary.

- [x] **Step 2: Run public docs check**

Run:

```bash
npm run check:public-docs
```

Expected: PASS.

### Task 4: Bug Pass and Verification

**Files:**
- No planned source edits unless verification reveals a defect.

- [x] **Step 1: Run manual bug pass**

Run:

```bash
node scripts/dogfood.mjs --json
npm run dogfood
```

Expected: JSON mode prints structured step results; normal mode prints a concise `# AgentLoopKit Review Context` section instead of a large JSON payload.

- [x] **Step 2: Run verification commands**

Run:

```bash
npm test -- tests/autonomous-dogfood.test.ts
npm run typecheck
npm run lint
npm run build
npm test
```

Expected: PASS.

- [x] **Step 3: Run AgentLoop verification and strict dogfood after handoff**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-use-concise-review-context-in-dogfood-output.md --task-commands --write-run --redact-paths --progress
npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
npm run dogfood:strict
```

Expected: PASS after the current-task handoff exists.
