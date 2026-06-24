# AgentLoop Start Context Router Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `agentloop start` as the canonical repo briefing for software agents, with context routing, impact ledger metrics, MCP exposure, and updated user-facing docs.

**Architecture:** Add a focused `src/core/agent-start.ts` orchestration layer over the existing Context Contract module. Keep `agentloop context` as the lower-level handle/receipt surface, and expose `start` through CLI, MCP, templates, docs, and tests without release changes.

**Tech Stack:** TypeScript, Commander, Vitest, existing AgentLoopKit core modules, Markdown docs.

---

## File Structure

- Create `src/core/agent-start.ts`: build start briefings, route source handles, compute impact ledger, render Markdown.
- Create `src/cli/commands/start.ts`: CLI flag parsing and JSON/human output.
- Modify `src/cli/index.ts`: register `start`.
- Modify `src/core/mcp-tools.ts`: add `agentloop_start`.
- Modify `src/mcp/server.ts`: mention start in the read-only server description.
- Modify `src/core/completions.ts`: add `start` to generated completions.
- Modify `src/templates/agents/*.md`: route software agents to `agentloop start`.
- Modify `src/templates/root/AGENTS.md` and `src/templates/root/AGENTLOOP.md`: include the start workflow.
- Modify `README.md`, `docs/context.md`, `docs/cli-reference.md`, `docs/mcp.md`, and `DECISIONS.md`: document the flagship start workflow and safety boundary.
- Add `tests/agent-start.test.ts`: CLI and core behavior.
- Modify `tests/mcp-server.test.ts`, `tests/mcp-tools.test.ts`, and `tests/cli-docs-drift.test.ts` if needed for command/tool drift.

## Task 1: Failing CLI And Core Tests

- [ ] **Step 1: Add `tests/agent-start.test.ts` with fixture setup**

Create a fixture repo like `tests/context-contract.test.ts`: initialize Git, write `agentloop.config.json`, create `.agentloop/tasks`, `.agentloop/reports`, and `.agentloop/runs`, set an active task, commit the baseline, and change `src/auth/copy.ts`.

- [ ] **Step 2: Add failing Markdown CLI test**

Expected command:

```bash
node_modules/.bin/tsx src/cli/index.ts start --for codex --goal implement --redact-paths
```

Expected assertions:

- output contains `# AgentLoop Start`
- output contains `Agent briefing:`
- output contains `## Read First`
- output contains `task:active`
- output contains `## Do Not Broad-Scan`
- output contains `## Impact Ledger`
- output contains `Estimated context avoided`
- output contains `agentloop context show task:active`
- output does not contain the temp directory

- [ ] **Step 3: Add failing JSON CLI test**

Expected command:

```bash
node_modules/.bin/tsx src/cli/index.ts start --for codex --goal implement --json
```

Expected assertions:

- `target` is `codex`
- `goal` is `implement`
- `readFirst[0].handle` is `task:active`
- `impact.verificationFreshness` is `fresh`
- `impact.scopeDriftFileCount` is `0`
- `sourceHandles` contains `context-budget:current`
- `safety.commandsRun` equals `[]`

- [ ] **Step 4: Add failing review-routing test**

Expected command:

```bash
node_modules/.bin/tsx src/cli/index.ts start --for human --goal review --json
```

Expected assertion: `readFirst[0].handle` is `evidence-map:current`.

- [ ] **Step 5: Run tests and confirm red**

Run:

```bash
npm test -- tests/agent-start.test.ts
```

Expected: tests fail because `agentloop start` is not registered.

## Task 2: Core Start Builder

- [ ] **Step 1: Create `src/core/agent-start.ts`**

Implement:

- `AGENT_START_GOALS`
- `AgentStartGoal`
- `AgentStartResult`
- `buildAgentStart`
- `renderAgentStartMarkdown`

Reuse `buildContextPack`, `RESUME_PACK_TARGETS`, `ContextHandle`, and context safety.

- [ ] **Step 2: Implement goal mapping**

Map `implement` to `continue`; pass other shared goals through to `buildContextPack`.

- [ ] **Step 3: Implement route ordering**

Use the design route order. Omit missing handles. Each route includes `handle`, `reason`, `command`, and `priority`.

- [ ] **Step 4: Implement risk and impact**

Risk warnings come from:

- missing task
- verification labels `missing`, `failed`, `stale`, or `unknown`
- unexplained files
- forbidden files
- risk-sensitive files

Impact ledger uses context-budget and evidence-map values. Clamp avoided tokens and reduction percent at zero.

- [ ] **Step 5: Render Markdown**

Render sections:

- `# AgentLoop Start`
- `Agent briefing: <status>`
- `## Read First`
- `## Do Not Broad-Scan`
- `## Risk`
- `## Impact Ledger`
- `## Next Command`
- `## Source Handles`
- `## Safety Boundary`

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test -- tests/agent-start.test.ts
```

Expected: still fails until CLI registration exists.

## Task 3: CLI Command

- [ ] **Step 1: Create `src/cli/commands/start.ts`**

Parse:

- `--for <target>` with supported targets
- `--goal <goal>` with supported goals
- `--json`
- `--redact-paths`

Load workspace with `loadWorkspaceForJsonCommand`. Print JSON or Markdown.

- [ ] **Step 2: Register command in `src/cli/index.ts`**

Import and add `startCommand()` near `status`, `next`, `review-context`, and `context`.

- [ ] **Step 3: Add completion entry**

Add `start` with description `Brief a software agent with current task, evidence, risk, and context routing`.

- [ ] **Step 4: Run focused tests**

Run:

```bash
npm test -- tests/agent-start.test.ts
```

Expected: new tests pass.

## Task 4: MCP Start Tool

- [ ] **Step 1: Add MCP tool definition**

Add `agentloop_start` with optional `target` and `goal` arguments.

- [ ] **Step 2: Add MCP call handler**

Call `buildAgentStart({ cwd, config, target, goal })` and return `{ start: result }`.

- [ ] **Step 3: Update MCP server description**

Mention start briefings while preserving read-only safety language.

- [ ] **Step 4: Add tests**

Update MCP tests to assert the tool is listed and returns a start payload with `readFirst` and `impact`.

- [ ] **Step 5: Run MCP tests**

Run:

```bash
npm test -- tests/mcp-tools.test.ts tests/mcp-server.test.ts
```

Expected: MCP tests pass.

## Task 5: Docs, Templates, And Decision Record

- [ ] **Step 1: Update generated agent templates**

Replace the first broad-read guidance with target-specific `agentloop start --for <target> --goal implement --redact-paths`, then keep `agentloop context show <handle>` as expansion guidance.

- [ ] **Step 2: Update root generated guidance**

Add `agentloop start --for generic --goal implement --redact-paths` to root `AGENTS.md` and `AGENTLOOP.md` templates.

- [ ] **Step 3: Update README and docs**

Make `agentloop start` the first useful agent briefing after task creation. Document `start` in CLI reference and MCP docs. Update context docs to position context as the lower-level contract.

- [ ] **Step 4: Add decision record**

Append a `2026-06-23` decision explaining that `agentloop start` is the canonical repo-native agent briefing and that context-budget claims stay heuristic.

- [ ] **Step 5: Run docs checks**

Run:

```bash
npm run check:public-docs
npm test -- tests/cli-docs-drift.test.ts
```

Expected: docs checks pass.

## Task 6: Bug, Security, And Performance Passes

- [ ] **Step 1: Bug pass**

Run the focused start command against this repo:

```bash
node dist/cli/index.js start --for codex --goal implement --redact-paths
node dist/cli/index.js start --for codex --goal implement --json
```

If `dist` is stale, use:

```bash
npm run build
node dist/cli/index.js start --for codex --goal implement --redact-paths
```

- [ ] **Step 2: Security pass**

Check no new code reads `.env`, executes verification, calls network APIs, writes files, publishes, tags, or mutates task state. Verify docs state that boundary.

- [ ] **Step 3: Performance pass**

Compare start command runtime with context pack runtime using `/usr/bin/time -p` on this repo. The command should remain a thin wrapper over the existing context pack and avoid broad file-content scans.

- [ ] **Step 4: Fix issues found**

Use root-cause debugging for any failures, write a failing test when behavior changes, then patch and rerun focused checks.

## Task 7: Full Verification And Handoff

- [ ] **Step 1: Run verification commands**

Run:

```bash
npm run typecheck
npm test
npm run check:public-docs
npm run dogfood
```

- [ ] **Step 2: Run AgentLoop verification evidence**

Run:

```bash
node dist/cli/index.js verify --task-commands --only-task-commands --progress --write-run --redact-paths
```

- [ ] **Step 3: Run ship and AgentFlight report**

Run:

```bash
node dist/cli/index.js ship --redact-paths
npx --yes agentflight report
npx --yes agentflight status
```

- [ ] **Step 4: Inspect diff**

Run:

```bash
git diff --check
git status --short
```

- [ ] **Step 5: Stop before release**

Do not bump versions, tag, publish, or create a release. Wait for maintainer approval.

## Self-Review

- Spec coverage: the tasks cover core, CLI, MCP, docs, generated templates, decision record, bug pass, security pass, performance pass, and final verification.
- Placeholder scan: no `TBD`, `TODO`, or unbounded implementation placeholders remain.
- Type consistency: targets reuse `ResumePackTarget`; goals use `AgentStartGoal`; source handles reuse `ContextHandle`.
