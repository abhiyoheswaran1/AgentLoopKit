# Agent Guidance Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend harness upgrade diagnostics so existing repos know whether their generated agent guidance points software agents to `agentloop start` and source-handle expansion.

**Architecture:** Reuse `src/core/upgrade-harness.ts` topic detection and `src/core/doctor.ts` next-action wiring. Add one `agent-start` topic, update focused tests, then refresh public docs with the new readiness language.

**Tech Stack:** TypeScript, Commander CLI, Vitest, Markdown docs, AgentLoopKit local evidence.

---

### Task 1: Add Failing Upgrade-Harness Tests

**Files:**
- Modify: `tests/upgrade-harness.test.ts`

- [ ] **Step 1: Add expectations for the new topic**

Add assertions to the existing old-harness test so stale guidance must report `agent-start`:

```ts
expect(output.files).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      path: 'AGENTS.md',
      status: 'review',
      missingTopics: expect.arrayContaining(['ship', 'prepare-pr', 'run-ledger', 'agent-start']),
    }),
  ]),
);
```

- [ ] **Step 2: Add copyable-guidance assertions**

In the suggestions test, assert the new topic and command copy:

```ts
expect(output.suggestions).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      topic: 'agent-start',
      copyMarkdown: expect.stringContaining('agentloop start --for generic --goal implement --redact-paths'),
    }),
  ]),
);
expect(humanResult.stdout).toContain('agentloop context show <handle>');
```

- [ ] **Step 3: Run the focused test and verify it fails**

Run:

```bash
npm run test:unit -- tests/upgrade-harness.test.ts
```

Expected: failure because `agent-start` is not a known topic yet.

### Task 2: Add Failing Doctor Test Expectations

**Files:**
- Modify: `tests/doctor.test.ts`

- [ ] **Step 1: Update the stale-guidance doctor expectation**

Change the warning message and next-action reason expectations so Doctor must mention agent-readiness and Start/Context.

```ts
expect(result.checks).toContainEqual({
  name: 'Harness guidance',
  status: 'warn',
  message:
    'generated guidance is missing current agent-readiness topics; run agentloop upgrade-harness --details for copyable suggestions',
});
```

Expected next-action reason:

```ts
'Generated guidance is missing current agent-readiness topics such as agentloop start, context source handles, ship, prepare-pr, run ledger, review context, or maintainer-check.'
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm run test:unit -- tests/doctor.test.ts
```

Expected: failure because Doctor still uses review-readiness-only copy.

### Task 3: Implement Agent-Start Harness Topic

**Files:**
- Modify: `src/core/upgrade-harness.ts`
- Modify: `src/core/doctor.ts`

- [ ] **Step 1: Add `agent-start` to `HarnessTopicId`**

Add the union member:

```ts
| 'agent-start'
```

- [ ] **Step 2: Add topic detection**

Add a topic definition:

```ts
{ id: 'agent-start', needles: ['agentloop start', 'agentloop context show'] },
```

- [ ] **Step 3: Add copyable guidance**

Add a `TOPIC_SUGGESTIONS` entry:

```ts
'agent-start': {
  title: 'Agent Start preflight and source handles',
  copyMarkdown:
    '- Before broad repo reads, run `agentloop start --for generic --goal implement --redact-paths`; then expand only needed source truth with `agentloop context show <handle>`.',
},
```

- [ ] **Step 4: Update next-step copy**

Update `buildNextSteps` and Doctor harness warning copy to say `agent-readiness` instead of review-readiness-only wording.

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
```

Expected: pass.

### Task 4: Update Docs

**Files:**
- Modify: `README.md`
- Modify: `docs/cli-reference.md`
- Modify: `docs/getting-started.md`

- [ ] **Step 1: Update existing-repo guidance**

Explain that `upgrade-harness --details` detects whether existing agent instructions mention Start/Context.

- [ ] **Step 2: Update CLI reference**

Expand the `upgrade-harness` and `doctor` sections to mention agent-readiness topics.

- [ ] **Step 3: Keep token-savings language bounded**

Ensure docs say estimates are planning heuristics, not provider-token or billing claims.

- [ ] **Step 4: Run docs checks**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Expected: pass.

### Task 5: Verification Passes

**Files:**
- Verify only.

- [ ] **Step 1: Run focused verification**

```bash
npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts
npm run typecheck
```

- [ ] **Step 2: Run maintenance and dogfood**

```bash
npm run dogfood
npm run maintenance:check
```

- [ ] **Step 3: Run performance smoke**

```bash
node dist/cli/index.js upgrade-harness --details --redact-paths >/dev/null
node dist/cli/index.js doctor --redact-paths >/dev/null
```

- [ ] **Step 4: Security review**

Confirm the diff adds no command execution, network calls, secret reads, destructive filesystem operations, release behavior, version bump, tag, or publish path.
