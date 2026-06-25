# AgentLoop Start Usefulness Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `agentloop start` prove its usefulness in the first screen with measurable local impact, repeatable demo evidence, stricter agent-readiness guidance, and clearer research-to-decision docs.

**Architecture:** Keep `agentloop start` as a thin orchestration layer over Context Contract and Evidence Map. Add an additive `usefulnessProof` object in `src/core/agent-start.ts`; keep existing fields and safety boundaries stable. Treat docs and demo evidence as deterministic local artifacts, not release work or external user proof.

**Tech Stack:** TypeScript, Commander, Vitest, local Markdown docs, AgentLoopKit dogfood evidence, ProjScan, AgentFlight.

---

## File Structure

- Modify `src/core/agent-start.ts`: derive `usefulnessProof`, render a `## Usefulness Proof` Markdown section, and expose JSON fields.
- Modify `tests/agent-start.test.ts`: add red tests for proof-card Markdown and JSON.
- Modify `src/core/upgrade-harness.ts`: require agent guidance to mention Start, context handle expansion, and broad-read avoidance.
- Modify `tests/upgrade-harness.test.ts`: add red tests for broad-read guidance.
- Add `docs/start-usefulness-demo.md`: repeatable local demo/trial artifact with safe commands and expected evidence shape.
- Modify `README.md`, `docs/context.md`, `docs/cli-reference.md`: make the usefulness proof and demo discoverable.
- Modify `docs/research.md`, `src/templates/loops/research.md`, `.agentloop/loops/research.md`: clarify research-to-decision handoff boundaries.
- Do not modify `package.json` versions, `server.json` versions, changelog release sections, release workflows, or publishing behavior.

## Task 1: Start Usefulness Proof Card

**Files:**
- Modify: `tests/agent-start.test.ts`
- Modify: `src/core/agent-start.ts`

- [ ] **Step 1: Write failing tests**

Add expectations to `prints a compact agent briefing with routing and impact metrics`:

```ts
expect(result.stdout).toContain('## Usefulness Proof');
expect(result.stdout).toContain('Agent readiness:');
expect(result.stdout).toContain('Context avoided:');
expect(result.stdout).toContain('Source handles available:');
expect(result.stdout).toContain('Next safe command:');
```

Add expectations to `emits JSON for agents and automation`:

```ts
expect(payload.usefulnessProof).toMatchObject({
  agentReadiness: 'ready-to-continue',
  staleProofCaught: false,
  scopeDriftCaught: false,
  nextSafeCommand: 'agentloop ship',
});
expect(payload.usefulnessProof.sourceHandlesAvailable).toEqual(
  expect.arrayContaining(['task:active', 'evidence-map:current', 'context-budget:current']),
);
expect(payload.usefulnessProof.summary).toContain('agent can continue');
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:unit -- tests/agent-start.test.ts
```

Expected: fail because `usefulnessProof` and `## Usefulness Proof` do not exist.

- [ ] **Step 3: Implement minimal behavior**

In `src/core/agent-start.ts`, add:

```ts
export type AgentStartUsefulnessProof = {
  agentReadiness: AgentStartPreflightState;
  summary: string;
  contextAvoidedTokens: number;
  contextReductionPercent: number | null;
  broadChangedFilesAvoided: number;
  staleProofCaught: boolean;
  scopeDriftCaught: boolean;
  verificationFreshness: EvidenceMap['verification']['label'];
  sourceHandlesAvailable: string[];
  nextSafeCommand: string;
};
```

Derive it from preflight, impact, source handles, and next command. Add it to `AgentStartResult`, JSON output, and Markdown before `## Active Task`.

- [ ] **Step 4: Verify green**

Run:

```bash
npm run test:unit -- tests/agent-start.test.ts
```

Expected: all `agent-start` tests pass.

## Task 2: Repeatable Demo Trial Artifact

**Files:**
- Add: `docs/start-usefulness-demo.md`
- Modify: `README.md`
- Modify: `docs/context.md`

- [ ] **Step 1: Write the artifact**

Create a demo doc that shows how to reproduce a messy-repo Start run in a temporary repo:

```md
# Start Usefulness Demo

This demo shows how to measure broad changed-file context against the compact Start briefing in a local temporary repo.
```

Include commands for `init`, `create-task`, committing the harness baseline, making scoped and out-of-scope changes, running `agentloop start`, and expanding handles. State that percentages are heuristic planning estimates.

- [ ] **Step 2: Link the artifact**

Add links from README and `docs/context.md` near the current context-budget/demo sections.

- [ ] **Step 3: Verify docs hygiene**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Expected: both commands pass.

## Task 3: Agent-Readiness Audit Tightening

**Files:**
- Modify: `tests/upgrade-harness.test.ts`
- Modify: `src/core/upgrade-harness.ts`
- Modify: `src/templates/root/AGENTS.md`
- Modify: `src/templates/root/AGENTLOOP.md`
- Modify: `src/templates/harness/commands.md`
- Modify: `src/templates/agents/*.md`

- [ ] **Step 1: Write failing tests**

Add a test where guidance mentions `agentloop start` and `agentloop context show`, but not broad-read avoidance:

```ts
await writeFile(
  path.join(dir, 'AGENTS.md'),
  '# AGENTS\n\nRun `agentloop start --for generic --goal implement --redact-paths`, then `agentloop context show <handle>`.\n',
);
```

Expected JSON: `missingTopics` contains `agent-start`.

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:unit -- tests/upgrade-harness.test.ts
```

Expected: fail because current detector only checks Start and context show.

- [ ] **Step 3: Implement detector and template copy**

Change `agent-start` needles to require all three:

```ts
needles: ['agentloop start', 'agentloop context show', 'broad']
```

Update copyable guidance and generated templates to say agents should run Start before broad repo reads and expand handles only when needed.

- [ ] **Step 4: Verify green**

Run:

```bash
npm run test:unit -- tests/upgrade-harness.test.ts tests/doctor.test.ts tests/init.test.ts
```

Expected: all tests pass.

## Task 4: Research-To-Decision Polish

**Files:**
- Modify: `docs/research.md`
- Modify: `src/templates/loops/research.md`
- Modify: `.agentloop/loops/research.md`

- [ ] **Step 1: Update prose**

Add a compact research-to-decision structure:

```md
## Research-To-Decision Shape

- Question
- Evidence source
- Boundary
- Findings
- Decision
- Follow-up task
```

State that AgentLoopKit structures local research evidence and follow-up tasks; it does not recruit users, run interviews, or convert simulated personas into external proof.

- [ ] **Step 2: Stop-slop pass**

Scan docs for vague claims, passive voice, and marketing overreach. Keep the language direct and local-first.

- [ ] **Step 3: Verify docs**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Expected: both commands pass.

## Task 5: Final Verification And Dogfood

**Files:**
- Generated AgentLoop reports and handoff artifacts only after verification.

- [ ] **Step 1: Focused task verification**

Run:

```bash
npm run test:unit -- tests/agent-start.test.ts tests/context-contract.test.ts tests/doctor.test.ts tests/upgrade-harness.test.ts
npm run check:public-docs
npm run build
```

- [ ] **Step 2: Security and performance pass**

Run:

```bash
npm run typecheck
npx --yes projscan doctor --format markdown
npx --yes projscan preflight --mode before_commit --format json
```

Confirm no new dependency, secret-read, release, publishing, telemetry, proxy, or provider-interception behavior.

- [ ] **Step 3: AgentLoop and AgentFlight proof**

Run:

```bash
node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-prove-agentloop-start-usefulness-2.md --task-commands --only-task-commands --progress --write-run --redact-paths
npx --yes agentflight verify -- npm run test:unit -- tests/agent-start.test.ts tests/context-contract.test.ts tests/doctor.test.ts tests/upgrade-harness.test.ts
node dist/cli/index.js ship --redact-paths
node dist/cli/index.js prepare-pr --redact-paths
npm run dogfood:strict
npx --yes agentflight status
npx --yes agentflight report
```

Expected: product checks pass. If AgentFlight retains an older failed command as blocking despite later pass evidence, report that as an AgentFlight issue and do not mislabel AgentLoopKit verification.

## Self-Review

- Spec coverage: covers proof card, demo artifact, agent-readiness audit, research docs, bug/security/performance/dogfood passes, and no-release boundary.
- Placeholder scan: no TBD, TODO, or unspecified implementation steps.
- Type consistency: `AgentStartUsefulnessProof` uses existing `AgentStartPreflightState`, `EvidenceMap`, source handle, and next-command types.
