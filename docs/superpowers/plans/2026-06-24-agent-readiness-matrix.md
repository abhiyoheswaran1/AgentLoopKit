# Agent Readiness Matrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Agent Readiness Matrix to `agentloop doctor` so humans and agents can see whether repo guidance is ready for Start, context handles, broad-read avoidance, MCP, and common software-agent surfaces.

**Architecture:** Extend `src/core/doctor.ts` with a small local analyzer that reads generated harness files and optional `.agentloop/agents/*.md` files. Keep readiness additive in `DoctorResult.agentReadiness` and human Markdown; do not change existing `checks`, exit codes, strict-mode semantics, or release behavior. Reuse existing string detection instead of adding dependencies.

**Tech Stack:** TypeScript, Commander, Vitest, Markdown docs, local AgentLoopKit evidence.

---

## File Structure

- Modify `src/core/doctor.ts`: add `DoctorAgentReadiness`, matrix item types, local file detection, JSON field, and Markdown rendering.
- Modify `tests/doctor.test.ts`: add red tests for matrix Markdown and JSON.
- Modify `src/templates/root/AGENTS.md`, `src/templates/root/AGENTLOOP.md`, `src/templates/root/agentloop-directory-readme.md`, `src/templates/harness/commands.md`, and current repo generated guidance only if MCP guidance is missing.
- Modify `README.md`, `docs/cli-reference.md`, `docs/context.md`, `docs/mcp.md`, and `docs/start-usefulness-demo.md`: teach “Make Your Agent Start Here”.
- Modify `docs/assets/readme/agentloopkit-context-contract.tape`: show `doctor --redact-paths` before Start in the terminal demo source.
- Do not modify package versions, changelog release sections, server metadata, release workflows, dependencies, or publishing behavior.

## Task 1: Doctor Matrix Contract

**Files:**
- Modify: `tests/doctor.test.ts`
- Modify: `src/core/doctor.ts`

- [ ] **Step 1: Write failing tests**

Add expectations in `reports healthy initialized setup`:

```ts
expect(result.agentReadiness.required.startPreflight).toBe(true);
expect(result.agentReadiness.required.contextHandles).toBe(true);
expect(result.agentReadiness.required.broadReadAvoidance).toBe(true);
expect(result.markdown).toContain('## Agent Readiness Matrix');
expect(result.markdown).toContain('Codex guidance');
expect(result.markdown).toContain('MCP guidance');
```

Add a CLI JSON test:

```ts
const doctor = JSON.parse(result.stdout);
expect(doctor.agentReadiness.matrix).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ id: 'codex', label: 'Codex guidance' }),
    expect.objectContaining({ id: 'mcp', label: 'MCP guidance' }),
  ]),
);
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:unit -- tests/doctor.test.ts
```

Expected: fail because `agentReadiness` and the Markdown section do not exist.

- [ ] **Step 3: Implement minimal matrix**

Add types:

```ts
export type DoctorAgentReadinessStatus = 'ready' | 'needs-update' | 'missing' | 'documented';
export type DoctorAgentReadinessItem = {
  id: string;
  label: string;
  status: DoctorAgentReadinessStatus;
  required: boolean;
  source: string;
  message: string;
};
export type DoctorAgentReadiness = {
  status: 'pass' | 'warn';
  required: {
    startPreflight: boolean;
    contextHandles: boolean;
    broadReadAvoidance: boolean;
    mcpGuidance: boolean;
  };
  matrix: DoctorAgentReadinessItem[];
};
```

Build readiness from local Markdown contents. Add it to `DoctorResult`, JSON, and Markdown.

- [ ] **Step 4: Verify green**

Run:

```bash
npm run test:unit -- tests/doctor.test.ts
```

Expected: doctor tests pass.

## Task 2: MCP Guidance In Harness

**Files:**
- Modify: `src/templates/root/AGENTS.md`
- Modify: `src/templates/root/AGENTLOOP.md`
- Modify: `src/templates/root/agentloop-directory-readme.md`
- Modify: `src/templates/harness/commands.md`
- Modify: `AGENTS.md`
- Modify: `AGENTLOOP.md`
- Modify: `.agentloop/README.md`
- Modify: `.agentloop/harness/commands.md`
- Test: `tests/init.test.ts`

- [ ] **Step 1: Write failing tests**

Add init test expectations that generated guidance mentions:

```ts
expect(content).toContain('agentloop mcp-server');
expect(content).toContain('agentloop_start');
```

- [ ] **Step 2: Verify red**

Run:

```bash
npm run test:unit -- tests/init.test.ts
```

Expected: fail until templates include MCP guidance.

- [ ] **Step 3: Update templates and current harness**

Add concise guidance:

```md
- Optional MCP clients can run `agentloop mcp-server`; ask MCP-capable agents to call `agentloop_start` before broad reads.
```

- [ ] **Step 4: Verify green**

Run:

```bash
npm run test:unit -- tests/init.test.ts tests/doctor.test.ts tests/upgrade-harness.test.ts
```

Expected: tests pass.

## Task 3: Docs And Demo Refresh

**Files:**
- Modify: `README.md`
- Modify: `docs/cli-reference.md`
- Modify: `docs/context.md`
- Modify: `docs/mcp.md`
- Modify: `docs/start-usefulness-demo.md`
- Modify: `docs/assets/readme/agentloopkit-context-contract.tape`

- [ ] **Step 1: Add docs copy**

Add a “Make Your Agent Start Here” section to README and docs:

```md
## Make Your Agent Start Here

Run `agentloop doctor --redact-paths`, then `agentloop start --for codex --goal implement --redact-paths`. Doctor checks agent-readiness guidance; Start gives the current task, proof, risk, context budget, and source handles.
```

- [ ] **Step 2: Update demo tape source**

Insert:

```vhs
Type "npx agentloop doctor --redact-paths"
Enter
Wait
Sleep 1.4s
```

before the Start command. Do not regenerate the GIF unless local VHS works.

- [ ] **Step 3: Stop-slop pass**

Remove billing-token claims, fake adoption proof, and broad marketing language.

- [ ] **Step 4: Verify docs**

Run:

```bash
npm run check:public-docs
npm run check:links
```

Expected: both pass.

## Task 4: Final Verification

**Files:**
- Generated AgentLoop reports and handoffs only after verification.

- [ ] **Step 1: Focused verification**

Run:

```bash
npm run test:unit -- tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts
npm run check:public-docs
npm run build
```

- [ ] **Step 2: Security and performance pass**

Run:

```bash
npm run typecheck
npm run check:links
git diff --check
npx --yes projscan doctor --format markdown
npx --yes projscan preflight --mode before_commit --format json
```

- [ ] **Step 3: AgentLoop and AgentFlight proof**

Run:

```bash
node dist/cli/index.js verify --task .agentloop/tasks/2026-06-24-add-agentloop-agent-readiness-matrix-2.md --task-commands --only-task-commands --progress --write-run --redact-paths
npx --yes agentflight verify -- npm run test:unit -- tests/doctor.test.ts tests/upgrade-harness.test.ts tests/init.test.ts
node dist/cli/index.js ship --redact-paths
node dist/cli/index.js prepare-pr --redact-paths
npm run dogfood:strict
npx --yes agentflight status
npx --yes agentflight report
```

Expected: product checks pass. Known reviewed ProjScan `prepublishOnly` warning may remain.

## Self-Review

- Spec coverage: matrix, JSON, MCP guidance, docs/demo, and verification are covered.
- Placeholder scan: no TODO, TBD, or incomplete implementation steps.
- Type consistency: `DoctorAgentReadiness` is only additive to `DoctorResult`.
