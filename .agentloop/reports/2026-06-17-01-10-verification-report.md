# Verification Report

- Timestamp: `2026-06-16T23:10:28.923Z`
- Repo: `AgentLoopKit`
- Git branch: `main`
- Git commit: `370a9fe`
- Working tree: `dirty`
- Overall status: pass


## Task Context
- Path: `.agentloop/tasks/2026-06-17-separate-agentloop-evidence-churn-in-run-ledger-output-2.md`
- Title: `Separate AgentLoop evidence churn in run ledger output`
- Task type: `feature`
- Status: `in-progress`





## Commands Run
### task: `npm test -- tests/runs.test.ts -t "separates AgentLoop evidence churn in human run ledger output"`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/runs.test.ts -t separates AgentLoop evidence churn in human run ledger output


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  1 passed | 12 skipped (13)
   Start at  01:10:29
   Duration  1.80s (transform 87ms, setup 0ms, import 156ms, tests 1.52s, environment 0ms)

```

### task: `npm test -- tests/runs.test.ts`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 test
> vitest run tests/runs.test.ts


 RUN  v4.1.8 [git-root]


 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  01:10:32
   Duration  11.97s (transform 62ms, setup 0ms, import 126ms, tests 11.73s, environment 0ms)

```

### task: `npm run typecheck`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 typecheck
> tsc --noEmit

```

### task: `npm run check:public-docs`

- Exit code: 0
- Status: pass


```text

> agentloopkit@0.35.2 check:public-docs
> node scripts/public-docs-hygiene.mjs

# AgentLoopKit Public Docs Hygiene
Version: 0.35.2
Public docs checked: 73
Repo harness files checked: 2
Public docs hygiene passed.
```

## Post-Verification Gates
### post-verification: `npx --yes agentflight status`

- Exit code: 0
- Status: pass


```text
AgentFlight status

Task:
Separate AgentLoop evidence churn in run ledger output

Session duration:
2 minutes

Changed files:
122

Changed areas:
- agentflight/config: .agentflight/config.json
- docs: .agentloop/harness/autonomous-dogfooding.md, .agentloop/tasks/2026-06-16-prevent-stale-agentloop-task-state.md, .agentloop/tasks/2026-06-16-publish-github-marketplace-action.md, AGENTLOOP.md, README.md, docs/check-gates.md, docs/cli-reference.md, docs/configuration.md, docs/getting-started.md, docs/html-reports.md, docs/maintenance-guards.md, docs/policies.md, docs/status.md, docs/upgrading-existing-repos.md, src/templates/root/AGENTLOOP.md, .agentloop/tasks/2026-06-16-accept-redacted-artifact-inventory-flag.md, .agentloop/tasks/2026-06-16-accept-redacted-task-doctor-flag.md, .agentloop/tasks/2026-06-16-add-init-cli-next-step-guidance-2.md, .agentloop/tasks/2026-06-16-add-maintainer-check-review-area-counts.md, .agentloop/tasks/2026-06-16-add-policy-pack-maintenance-coverage-2.md, .agentloop/tasks/2026-06-16-align-check-gates-active-task-next-action-2.md, .agentloop/tasks/2026-06-16-align-strict-dogfood-guidance-with-handoff-evidence.md, .agentloop/tasks/2026-06-16-compact-agentloop-evidence-in-prepare-pr.md, .agentloop/tasks/2026-06-16-complete-redaction-guidance-smoke-coverage-2.md, .agentloop/tasks/2026-06-16-decouple-maintenance-check-from-strict-release-proof.md, .agentloop/tasks/2026-06-16-document-check-gates-task-done-next-action-2.md, .agentloop/tasks/2026-06-16-exclude-agentflight-placeholders-from-artifact-latest-task-2.md, .agentloop/tasks/2026-06-16-exclude-parked-tasks-from-artifact-latest-task-2.md, .agentloop/tasks/2026-06-16-group-agentflight-placeholders-in-task-list-2.md, .agentloop/tasks/2026-06-16-group-agentloop-evidence-churn-in-handoff-summaries-2.md, .agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholder-tasks-2.md, .agentloop/tasks/2026-06-16-ignore-active-agentflight-placeholders-in-check-gates-2.md, .agentloop/tasks/2026-06-16-ignore-agentloop-evidence-in-agentflight-changed-file-filters.md, .agentloop/tasks/2026-06-16-ignore-generated-evidence-in-projscan-scans.md, .agentloop/tasks/2026-06-16-prevent-dogfood-start-placeholder-task-clutter.md, .agentloop/tasks/2026-06-16-select-next-agentloopkit-dogfood-roadmap-task.md, .agentloop/tasks/2026-06-16-separate-agentflight-placeholders-from-roadmap-task-counts.md, .agentloop/tasks/2026-06-16-separate-agentflight-placeholders-in-artifact-inventory.md, .agentloop/tasks/2026-06-

[output truncated: showing first 2500 and last 2500 characters of 7692 total]

superpowers/plans/2026-06-16-review-context-agentflight-placeholders.md, docs/superpowers/plans/2026-06-16-task-list-agentflight-placeholder-grouping.md
- unknown: scripts/dogfood-start.mjs, scripts/dogfood.mjs, scripts/maintenance-check.mjs, scripts/smoke-packed-release.mjs, src/cli/commands/artifacts.ts, src/cli/commands/init.ts, src/cli/commands/next.ts, src/cli/commands/runs.ts, src/cli/commands/task.ts, src/core/artifacts.ts, src/core/change-areas.ts, src/core/check-gates.ts, src/core/evidence.ts, src/core/handoff-coverage.ts, src/core/html-report.ts, src/core/maintainer-check.ts, src/core/policy-packs.ts, src/core/pr-summary.ts, src/core/prepare-pr.ts, src/core/readiness-score.ts, src/core/review-context.ts, src/core/ship.ts, src/core/status.ts, src/core/task-state.ts, .projscanrc.json, src/core/agentloop-evidence.ts
- tests: tests/artifacts.test.ts, tests/autonomous-dogfood.test.ts, tests/check-gates.test.ts, tests/dogfood-script.test.ts, tests/dogfood-start-script.test.ts, tests/handoff.test.ts, tests/html-report.test.ts, tests/init.test.ts, tests/maintainer-check.test.ts, tests/maintenance-check-script.test.ts, tests/next.test.ts, tests/policy-packs.test.ts, tests/pr-summary.test.ts, tests/prepare-pr.test.ts, tests/readiness-score.test.ts, tests/release-smoke.test.ts, tests/review-context.test.ts, tests/runs.test.ts, tests/ship.test.ts, tests/status.test.ts, tests/task-state.test.ts

Risk: medium
- AgentFlight project configuration changed.

Verification Evidence:
0 passed, 0 failed
- No verification runs recorded.

Review first:
1. .projscanrc.json
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
2. scripts/dogfood-start.mjs
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
3. scripts/dogfood.mjs
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
4. scripts/maintenance-check.mjs
   Why: unknown file
   Focus: Inspect manually because AgentFlight could not classify this file.
5. scripts/smoke-packed-release.mjs
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
```

### post-verification: `npx --yes agentflight doctor`

- Exit code: 0
- Status: pass


```text
AgentFlight Doctor

Overall: OK

- OK Node.js version: v26.3.0 satisfies AgentFlight's Node.js 20+ target.
- OK npm availability: npm 11.16.0 is available.
- OK git availability: git is available.
- OK repository root: [git-root]
- OK package manager: pnpm
- OK .agentflight presence: .agentflight exists.
- OK config validity: .agentflight/config.json is valid.
- OK .agentflight writable: .agentflight is writable.
- OK current session: A current session exists.
- OK ProjScan availability: ProjScan is available.
- OK AgentLoopKit availability: AgentLoopKit is available.
- OK test script: npm run test is configured.
- OK build script: npm run build is configured.
- OK typecheck script: npm run typecheck is configured.
- OK lint script: npm run lint is configured.
```

### post-verification: `npx --yes projscan doctor --format markdown`

- Exit code: 0
- Status: pass


```text
# Project Health Report

**Health Score: A (100/100)**

[![projscan health](https://img.shields.io/badge/projscan-A-brightgreen)](https://github.com/abhiyoheswaran1/projscan)

No issues detected. Project looks healthy!
```


## Not Run
- test
- lint
- typecheck
- build

## Recommended Next Actions
- Review the diff and prepare a handoff summary.
