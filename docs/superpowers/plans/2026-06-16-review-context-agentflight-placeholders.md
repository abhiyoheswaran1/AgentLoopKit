# Review Context AgentFlight Placeholders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface preserved AgentFlight placeholder task artifact counts in `agentloop review-context`.

**Architecture:** `review-context` already embeds the normalized artifact inventory via `renderArtifactInventoryJson(inventory)`. Keep that JSON as the data source and add a concise human Markdown summary when `artifacts.tasks.agentFlightPlaceholders` is present.

**Tech Stack:** TypeScript, Vitest, existing AgentLoopKit CLI/core helpers.

---

### Task 1: Add Review-Context Placeholder Coverage

**Files:**
- Modify: `tests/review-context.test.ts`

- [ ] **Step 1: Extend the review-context fixture**

Add one exact AgentFlight placeholder task contract and one ordinary task artifact to the temporary repo created by `createRepoWithReviewContextEvidence()`. The placeholder must match the existing exact detector:

```markdown
# Surface AgentFlight placeholders in review context

- Status: proposed

## Problem Statement
AgentFlight session task: Surface AgentFlight placeholders in review context

## Desired Outcome
Task is implemented with local verification evidence.
```

- [ ] **Step 2: Add JSON assertions**

In `prints a JSON review context snapshot without absolute artifact paths`, assert:

```ts
expect(payload.artifacts.tasks.count).toBe(1);
expect(payload.artifacts.tasks.agentFlightPlaceholders).toMatchObject({
  count: 1,
  latest: {
    path: '.agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context.md',
    title: 'Surface AgentFlight placeholders in review context',
    status: 'proposed',
    source: 'agentflight-placeholder',
  },
});
```

- [ ] **Step 3: Add Markdown assertions**

In `prints concise Markdown review context by default`, assert:

```ts
expect(result.stdout).toContain('- Artifacts: `1` task(s), `1` AgentFlight placeholder task(s), `1` verification report(s), `1` handoff(s)');
```

- [ ] **Step 4: Verify RED**

Run:

```bash
npm test -- tests/review-context.test.ts
```

Expected: FAIL because the Markdown output does not include the AgentFlight placeholder count.

### Task 2: Implement Review-Context Summary

**Files:**
- Modify: `src/core/review-context.ts`
- Modify: `docs/cli-reference.md`

- [ ] **Step 1: Add a small formatter helper**

In `src/core/review-context.ts`, add:

```ts
function formatArtifactSummary(artifacts: Awaited<ReturnType<typeof getReviewContext>>['artifacts']) {
  const placeholderCount = artifacts.tasks.agentFlightPlaceholders?.count ?? 0;
  const placeholderPart =
    placeholderCount > 0 ? `, ${inlineCode(String(placeholderCount))} AgentFlight placeholder task(s)` : '';
  return `${inlineCode(String(artifacts.tasks.count))} task(s)${placeholderPart}, ${inlineCode(
    String(artifacts.verificationReports.count),
  )} verification report(s), ${inlineCode(String(artifacts.handoffs.count))} handoff(s)`;
}
```

- [ ] **Step 2: Use the helper in Markdown rendering**

Replace the current inline artifact summary in `renderReviewContextMarkdown()` with:

```ts
- Artifacts: ${formatArtifactSummary(artifacts)}
```

- [ ] **Step 3: Document the review-context behavior**

In `docs/cli-reference.md`, update the `review-context` description to state that task artifact counts separate ordinary tasks from preserved AgentFlight placeholder tasks.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- tests/review-context.test.ts
```

Expected: PASS.

### Task 3: Bug Pass and Verification

**Files:**
- Review: `src/core/review-context.ts`
- Review: `tests/review-context.test.ts`
- Review: `docs/cli-reference.md`

- [ ] **Step 1: Inspect output manually**

Run:

```bash
npx --no-install tsx src/cli/index.ts review-context --redact-paths
```

Expected: Human output includes ordinary task count and AgentFlight placeholder task count.

- [ ] **Step 2: Run focused static checks**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 3: Run full tests**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Run AgentLoop evidence**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-surface-agentflight-placeholders-in-review-context-2.md --task-commands --write-run --redact-paths
npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
npm run dogfood:strict
```

Expected: AgentLoop verification, handoff, and strict dogfood pass.
