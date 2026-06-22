# AgentLoop Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `agentloop guard` for local drift, proof-debt, and context-budget control over AgentLoopKit evidence.

**Architecture:** Add a focused `src/core/guard.ts` composition module over Evidence Map, artifact path helpers, and file-system helpers. Add a small CLI wrapper in `src/cli/commands/guard.ts`, register it, document it, and update completions and docs drift coverage.

**Tech Stack:** TypeScript, Commander, Vitest, existing AgentLoopKit config/task/evidence/artifact helpers, no new dependencies.

---

## File Structure

- Create `src/core/guard.ts`: Guard snapshot building, findings, baseline read/write, report rendering, watch loop, context-budget estimates.
- Create `src/cli/commands/guard.ts`: Commander command, option validation, JSON errors, strict exit code.
- Modify `src/cli/index.ts`: register `guard`.
- Modify `src/core/completions.ts`: include `guard` in shell completions.
- Create `tests/guard.test.ts`: CLI and core behavior tests.
- Modify `tests/cli-docs-drift.test.ts`: include `guard` in public command list.
- Create `docs/guard.md`: user-facing Guard guide.
- Modify `README.md`, `docs/cli-reference.md`, `ROADMAP.md`, `DECISIONS.md`: user-facing docs and local decision record.

## Task 1: Guard Tests First

**Files:**
- Create: `tests/guard.test.ts`
- Modify: `tests/cli-docs-drift.test.ts`

- [ ] Write failing tests for:
  - `agentloop guard --redact-paths` prints `# AgentLoopKit Guard`, status, findings, context budget, and next actions.
  - `agentloop guard --json --redact-paths` returns `status`, `findings`, `contextBudget`, `evidenceMap`, `safety`, and no absolute temp paths.
  - `agentloop guard --strict --json` exits 1 for missing verification or unexplained files after printing JSON.
  - `agentloop guard --strict --json` exits 0 for a fresh verified task-covered change.
  - `agentloop guard --watch --max-iterations 2 --interval-ms 5 --json` returns two snapshots and exits.
  - `agentloop guard --write-report --json --redact-paths` writes a Markdown report under `.agentloop/reports`.
  - `agentloop guard --write-baseline .agentloop/guard/baseline.json --json --redact-paths` writes baseline JSON.
  - `agentloop guard --baseline .agentloop/guard/baseline.json --json --redact-paths` reports `newChangedFileCount`.
  - invalid numeric options return `GUARD_OPTION_INVALID` in JSON.
  - report/baseline paths outside allowed directories fail in JSON.
- [ ] Run `npm test -- tests/guard.test.ts tests/cli-docs-drift.test.ts`.
- [ ] Confirm failures are caused by missing `guard` behavior, not test setup.

## Task 2: Guard Core

**Files:**
- Create: `src/core/guard.ts`

- [ ] Add types:
  - `GuardStatus = 'pass' | 'warn' | 'fail'`
  - `GuardFindingSeverity = 'info' | 'warn' | 'fail'`
  - `GuardFinding`
  - `GuardContextBudget`
  - `GuardBaseline`
  - `GuardSnapshot`
  - `GuardReportResult`
- [ ] Implement `buildGuardSnapshot({ cwd, config, strict, baselinePath })`.
- [ ] Reuse `buildEvidenceMap`.
- [ ] Convert evidence-map state to findings:
  - missing task: fail
  - missing/failed/stale verification: fail
  - forbidden files: warn
  - unexplained files: warn
  - context budget pressure: info or warn depending on size
- [ ] Estimate token budget with a documented heuristic:
  - `estimatedFileListTokens = ceil(joined changed path chars / 4)`
  - `estimatedResumePackTokens = ceil(rendered compact summary chars / 4)`
  - `savingsHint = "Use agentloop resume-pack ..."`
- [ ] Implement `writeGuardReport`.
- [ ] Implement `writeGuardBaseline` and `readGuardBaseline`.
- [ ] Implement `runGuardWatch` with `intervalMs`, optional `maxIterations`, and snapshot callback.
- [ ] Implement `renderGuardMarkdown`.
- [ ] Run `npm test -- tests/guard.test.ts`.

## Task 3: Guard CLI and Completions

**Files:**
- Create: `src/cli/commands/guard.ts`
- Modify: `src/cli/index.ts`
- Modify: `src/core/completions.ts`

- [ ] Add command flags:
  - `--strict`
  - `--watch`
  - `--interval-ms <ms>`
  - `--max-iterations <count>`
  - `--write-report`
  - `--out <path>`
  - `--baseline <path>`
  - `--write-baseline <path>`
  - `--json`
  - `--redact-paths`
- [ ] Validate numeric options before workspace work.
- [ ] Load workspace through `loadWorkspaceForJsonCommand`.
- [ ] Print JSON or Markdown.
- [ ] Set `process.exitCode = 1` when strict mode sees `warn` or `fail`.
- [ ] Add `guard` to CLI registration and completion command metadata.
- [ ] Run `npm test -- tests/guard.test.ts tests/completion.test.ts tests/cli-docs-drift.test.ts`.

## Task 4: Docs and Product Records

**Files:**
- Create: `docs/guard.md`
- Modify: `README.md`
- Modify: `docs/cli-reference.md`
- Modify: `ROADMAP.md`
- Modify: `DECISIONS.md`

- [ ] Document one-shot use, strict mode, watch mode, report writing, baseline writing, and context-budget estimates.
- [ ] State safety boundaries: read-only by default, explicit writes only, no telemetry, no prompt interception, no exact token-count promise.
- [ ] Update README command examples and command table.
- [ ] Update CLI reference with examples.
- [ ] Add a decision note that Guard is repo-aware context budget control, not transparent compression/proxying.
- [ ] Run `npm run check:public-docs` and `npm run check:links`.

## Task 5: Bug, Security, Performance, and Internal Document Pass

**Files:**
- Review changed source, tests, docs, and task evidence.

- [ ] Bug pass: run focused Guard tests, then manually exercise:
  - `npx --no-install tsx src/cli/index.ts guard --json --redact-paths`
  - `npx --no-install tsx src/cli/index.ts guard --watch --max-iterations 2 --interval-ms 5 --redact-paths`
- [ ] Security pass:
  - confirm no shell execution was added
  - confirm no secret/env file reads were added
  - confirm baseline/report paths are bounded
  - run `rg "process\\.env|exec\\(|spawn\\(|curl|fetch\\(" src/core/guard.ts src/cli/commands/guard.ts`
- [ ] Performance pass:
  - build once
  - run `/usr/bin/time -l node dist/cli/index.js guard --json --redact-paths`
  - confirm Guard stays evidence-map based and does not scan the whole repository
- [ ] Internal document pass:
  - verify `.agentloop/product-panel.md`, `.agentloop/user-personas.md`, `.agentloop/backlog.md`, and latest `.agentloop/research` constraints are honored
  - verify public docs do not present simulated internal research as real feedback
- [ ] Full verification:
  - `npm test -- tests/guard.test.ts`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm run check:public-docs`
  - `npm run check:links`
  - `git diff --check`
  - `npm run maintenance:check`
  - `npm run dogfood:strict`
  - `npx --yes projscan doctor --format markdown`
  - `npx --yes agentflight doctor`
  - `npx --yes agentflight status`

## Self-Review

- Spec coverage: Guard, watch mode, reports, baseline, strict exits, context-budget estimates, docs, safety, and no-release constraints are all represented.
- Placeholder scan: no TBD or TODO placeholders.
- Type consistency: command names, option names, and type names match across tasks.
