# Verification Report

- Timestamp: `2026-06-23T12:39:27.820Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `792edea2`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-23-build-agentloop-start-context-router-and-impact-ledger.md`
- Title: `Build AgentLoop Start context router and impact ledger`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.40.0 typecheck
> tsc --noEmit

```

### task: `npm test`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.40.0 test
> vitest run


 RUN  v4.1.8 [git-root]


 Test Files  71 passed (71)
      Tests  903 passed (903)
   Start at  14:39:40
   Duration  916.92s (transform 751ms, setup 0ms, import 3.58s, tests 3622.00s, environment 4ms)

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.40.0 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
Public docs checked: 78
Repo harness files checked: 2
Public docs hygiene passed.
```

### task: `npm run dogfood`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.40.0 dogfood
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
AgentLoopKit: task="Build AgentLoop Start context router and impact ledger" status="in-progress"; verification=missing; run="verify pass"; tree=dirty (34; 32 non-evidence, 2 AgentLoop evidence); next="agentloop verify"
Reason: A task exists, but no verification report was found.

## public docs hygiene
$ node scripts/public-docs-hygiene.mjs
# AgentLoopKit Public Docs Hygiene
Version: 0.40.0
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

## review evidence gates
$ npx --no-install tsx src/cli/index.ts check-gates --redact-paths
# AgentLoopKit Gates

- Overall status: `fa

[output truncated: showing first 2500 and last 2500 characters of 12555 total]

ates/agents/gemini-cli.md, src/templates/agents/generic.md, src/templates/agents/github-copilot-cli.md, src/templates/agents/opencode.md, src/templates/root/AGENTLOOP.md, src/templates/root/AGENTS.md, .agentloop/tasks/2026-06-23-build-agentloop-start-context-router-and-impact-ledger-2.md, .agentloop/tasks/2026-06-23-build-agentloop-start-context-router-and-impact-ledger.md, docs/superpowers/plans/2026-06-23-agentloop-start-context-router.md, docs/superpowers/specs/2026-06-23-agentloop-start-context-router-design.md
- unknown: src/cli/index.ts, src/core/completions.ts, src/core/mcp-tools.ts, src/mcp/server.ts, src/cli/commands/start.ts, src/core/agent-start.ts
- tests: tests/cli-docs-drift.test.ts, tests/mcp-server.test.ts, tests/mcp-tools.test.ts, tests/agent-start.test.ts

Risk: medium
- Risk is based on changed file categories.

Verification Evidence:
0 passed, 0 failed
- No verification runs recorded.

Review first:
1. src/cli/commands/start.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. src/cli/index.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. src/core/agent-start.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. src/core/completions.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. src/core/mcp-tools.ts
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.

Proof gaps:
- warning: Test files changed without passing test evidence.
  Suggested proof: agentflight verify -- npm test

Latest snapshot:
- No snapshots recorded.

Readiness: Needs verification
Reason: Test files changed without passing test evidence.

Next action:
Run agentflight verify -- npm test

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
- lint: `npx pnpm@10.12.1 lint`
- typecheck: `npx pnpm@10.12.1 typecheck`
- build: `npx pnpm@10.12.1 build`

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
