# Artifacts Redact Paths Flag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `agentloop artifacts` accept `--redact-paths` as a no-op compatibility flag for shareable evidence output.

**Architecture:** Add the option at the CLI command layer only. Artifact inventory and stale preview rendering already emit repo-relative paths, so no core renderer or JSON-shape change is needed.

**Tech Stack:** TypeScript, Commander, Vitest.

---

### Task 1: Add RED Coverage

**Files:**
- Modify: `tests/artifacts.test.ts`
- Modify: `tests/release-smoke.test.ts`

- [ ] **Step 1: Add artifacts command assertions**

Add a test using `createRepoWithArtifacts()` that runs:

```ts
await execa(tsxPath, [cliPath, 'artifacts', '--redact-paths'], { cwd: dir, reject: false });
await execa(tsxPath, [cliPath, 'artifacts', '--json', '--redact-paths'], { cwd: dir, reject: false });
await execa(tsxPath, [cliPath, 'artifacts', '--type', 'task', '--latest', '--redact-paths'], { cwd: dir, reject: false });
```

Assert exit code `0`, empty stderr, and existing output shape.

- [ ] **Step 2: Add stale preview assertion**

Use `createRepoWithStaleEvidence()` and run:

```ts
await execa(tsxPath, [cliPath, 'artifacts', '--stale', '--redact-paths'], { cwd: dir, reject: false });
```

Assert exit code `0`, empty stderr, and `# AgentLoopKit Stale Artifact Preview` in stdout.

- [ ] **Step 3: Update README guidance test**

Update `tests/release-smoke.test.ts` expected complete redaction guidance to include `artifacts`.

- [ ] **Step 4: Verify RED**

Run:

```bash
npm test -- tests/artifacts.test.ts tests/release-smoke.test.ts
```

Expected: FAIL because `artifacts --redact-paths` is currently an unknown option and the README guidance assertion still expects the old command list.

### Task 2: Implement CLI Option

**Files:**
- Modify: `src/cli/commands/artifacts.ts`
- Modify: `README.md`
- Modify: `docs/cli-reference.md`

- [ ] **Step 1: Add the Commander option**

Extend `ArtifactsCommandOptions`:

```ts
redactPaths?: boolean;
```

Add the option:

```ts
.option('--redact-paths', 'accept common public-output redaction flag; artifact paths are already repo-relative')
```

No further code path change is needed.

- [ ] **Step 2: Update README guidance**

Add `artifacts` to the README `--redact-paths` command list.

- [ ] **Step 3: Update CLI reference**

Add `agentloop artifacts --redact-paths` to the Local Evidence Reports examples and note that the flag is accepted for consistency while artifact paths remain repo-relative.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
npm test -- tests/artifacts.test.ts tests/release-smoke.test.ts
```

Expected: PASS.

### Task 3: Bug Pass and Verification

**Files:**
- Review: `src/cli/commands/artifacts.ts`
- Review: `tests/artifacts.test.ts`
- Review: `README.md`
- Review: `docs/cli-reference.md`

- [ ] **Step 1: Manually inspect command behavior**

Run:

```bash
npx --no-install tsx src/cli/index.ts artifacts --redact-paths
npx --no-install tsx src/cli/index.ts artifacts --json --redact-paths
npx --no-install tsx src/cli/index.ts artifacts --stale --redact-paths
```

Expected: all succeed with repo-relative paths.

- [ ] **Step 2: Run static checks**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 3: Run full checks**

Run:

```bash
npm test
npm run check:public-docs
npm run check:links
```

Expected: all pass.

- [ ] **Step 4: Run AgentLoop evidence**

Run:

```bash
npx --no-install tsx src/cli/index.ts verify --task .agentloop/tasks/2026-06-16-accept-redacted-artifact-inventory-flag-2.md --task-commands --write-run --redact-paths
npx --no-install tsx src/cli/index.ts handoff --write-run --redact-paths
npm run dogfood:strict
```

Expected: AgentLoop verification, handoff, and strict dogfood pass.
