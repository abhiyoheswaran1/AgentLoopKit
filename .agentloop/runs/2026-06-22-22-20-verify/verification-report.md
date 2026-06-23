# Verification Report

- Timestamp: `2026-06-22T20:19:06.853Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `d5f4631e`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-22-add-readme-demo-gif-and-context-polish.md`
- Title: `Add README demo GIF and public Context Contract polish`
- Task type: `docs`
- Status: `in-progress`





## Commands Run
### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.39.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run check:links`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 check:links
> tsx scripts/check-markdown-links.ts

Markdown links OK (4970 file(s) checked).
```

### task: `npx pnpm@10.12.1 vitest run tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts tests/cli-docs-drift.test.ts`

- Exit code: 0
- Status: pass


```text

 RUN  v4.1.8 [git-root]


 Test Files  3 passed (3)
      Tests  16 passed (16)
   Start at  22:19:21
   Duration  5.16s (transform 96ms, setup 0ms, import 159ms, tests 3.70s, environment 0ms)

```

### task: `npx pnpm@10.12.1 lint`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 lint [git-root]
> eslint .

```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.39.0 dogfood
> node scripts/dogfood.mjs

# AgentLoopKit Dogfood Gate
Mode: default

## task folder hygiene
$ npx --no-install tsx src/cli/index.ts task doctor
# AgentLoopKit Task Doctor

Status: `pass`
Checked: `25`
Diagnostics: `0`

No task folder hygiene issues found.

## current loop status
$ npx --no-install tsx src/cli/index.ts status --brief --redact-paths
AgentLoopKit: task="Add README demo GIF and public Context Contract polish" status="in-progress"; verification=pass; run="ship 92/100"; tree=dirty (61; 26 non-evidence, 35 AgentLoop evidence); next="agentloop task done"
Reason: Task, verification, and handoff evidence cover the current dirty files. Mark the task done when the handoff is ready, or keep it open if work is still in progress.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.39.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.

## dependency audit
$ npx --yes pnpm@10.12.1 audit --audit-level high
No known vulnerabilities found

## harness upgrade audit
$ npx --no-install tsx src/cli/index.ts upgrade-harness --redact-paths
# AgentLoopKit Harness Upgrade

- Overall status: `pass`
- Dry run: `no`
- Writes files: `no`
- Target: `[agentloop-root]`

## Manifest

- `current`: `.agentloop/manifest.json`
- Current template version: `1`
- Local template version: `1`

## Harness Files

- `current`: `AGENTS.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `AGENTLOOP.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/harness/commands.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none
- `current`: `.agentloop/README.md`
  Present topics: `ship`, `prepare-pr`, `run-ledger`, `maintainer-check`, `review-context`, `upgrade-safety`
  Missing topics: none

## Next Steps

- Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.
- Harness guidance already mentions the current review-readiness loop.

## Safety

This command reads local AgentLoopKit harness files only. It does not overwrite guidance, merge templates, run verification commands, read .env contents, call external APIs, or upload files.

## review evidence gate

[output truncated: showing first 2500 and last 2500 characters of 12541 total]

-and-public-context-contract-polish.md, .agentloop/tasks/2026-06-22-build-agentloop-context-contract-v1-2.md, docs/assets/readme/agentloopkit-context-contract.gif, docs/assets/readme/agentloopkit-context-contract.tape, docs/context.md, docs/superpowers/plans/2026-06-22-agentloop-context-contract-v1.md
- unknown: src/cli/index.ts, src/core/completions.ts, src/core/mcp-tools.ts, src/mcp/server.ts, src/cli/commands/context.ts, src/core/context-contract.ts
- tests: tests/cli-docs-drift.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/context-contract.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
2 passed, 0 failed
- passed: npm run check:public-docs (exit 0, 2016ms)
- passed: npx pnpm@10.12.1 vitest run tests/context-contract.test.ts tests/mcp-server.test.ts tests/mcp-tools.test.ts tests/cli-docs-drift.test.ts tests/public-docs-hygiene.test.ts tests/product-positioning.test.ts (exit 0, 41535ms)

Review first:
1. src/cli/commands/context.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/core/completions.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/core/context-contract.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/mcp-tools.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

Proof gaps:
- none

Latest snapshot:
- No snapshots recorded.

Readiness: Ready for review
Reason: Verification evidence matches the observed review risk.

Next action:
Generate or share the AgentFlight report/replay and request scoped human review.

## projscan project health
$ npx --yes projscan --format markdown doctor
# Project Health Report

**Health Score: A (90/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

Found **1** issue(s).

- ⚠️ **Install lifecycle script present: prepublishOnly** - The package manifest defines "prepublishOnly": "node scripts/prepublish-check.mjs && npm run typecheck && npm test && npm run build". Install lifecycle scripts execute during dependency installation and are a common supply-chain execution path; verify this script before release or install.

Dogfood gate passed.
```


## Not Run
- test: `npx pnpm@10.12.1 test`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
