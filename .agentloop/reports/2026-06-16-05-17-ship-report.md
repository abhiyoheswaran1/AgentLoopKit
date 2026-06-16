# AgentLoopKit Ship Report

Make agent-generated code reviewable, verifiable, and merge-ready.

- Generated: `2026-06-16-05-17`
- Review readiness score: `92`/100
- Task: `Make install-agent output Markdown-safe` (`done`) - `.agentloop/tasks/archive/2026-06-16-make-install-agent-output-markdown-safe.md`
- Verification: `pass` - `.agentloop/reports/2026-06-16-05-13-verification-report.md`
- Handoff: `.agentloop/handoffs/2026-06-16-05-17-pr-summary-2.md`
- Gates: `warn`

## Score Boundary

- This is a review-readiness score, not a code-quality score.
- The score is deterministic and based only on local AgentLoopKit evidence.

## Dimensions

- `Task clarity`: `100`/100 (weight `15`) - `100/100 task evidence present.`
- `Scope control`: `75`/100 (weight `15`) - `25 changed files is reviewable but not small.`
- `Verification evidence`: `100`/100 (weight `25`) - `Latest verification report passed.`
- `Evidence freshness`: `100`/100 (weight `15`) - `Verification evidence matches current task timing.`
- `Policy and gate compliance`: `70`/100 (weight `15`) - `Review gates passed with warnings.`
- `Handoff readiness`: `100`/100 (weight `10`) - `Reviewer handoff evidence exists.`
- `Risk flags`: `100`/100 (weight `5`) - `No risk-sensitive files detected.`

## Strengths

- Task contract has problem, outcome, acceptance criteria, verification commands, risk notes, and rollback notes.
- Verification evidence is passing.
- Reviewer handoff exists.

## Warnings

- Medium-sized change set; check scope carefully.
- Review gates have warnings.

## Blockers

- No blockers recorded.

## Recommended Next Actions

- Review the diff and open the PR when ready.

## Changed Files

- M `.agentloop/backlog.md`
- M `.agentloop/dogfood-log.md`
- M `CHANGELOG.md`
- M `docs/cli-reference.md`
- M `src/cli/commands/install-agent.ts`
- M `tests/agent-installation.test.ts`
- ?? `.agentloop/handoffs/2026-06-16-05-15-pr-summary.md`
- ?? `.agentloop/handoffs/2026-06-16-05-16-pr-summary.md`
- ?? `.agentloop/reports/2026-06-16-05-11-verification-report.md`
- ?? `.agentloop/reports/2026-06-16-05-13-verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-13-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-13-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-13-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-15-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-15-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-15-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-15-handoff/pr-summary.md`
- ?? `.agentloop/runs/2026-06-16-05-15-verify/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-15-verify/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-15-verify/verification-report.md`
- ?? `.agentloop/runs/2026-06-16-05-16-handoff/changed-files.json`
- ?? `.agentloop/runs/2026-06-16-05-16-handoff/diffstat.txt`
- ?? `.agentloop/runs/2026-06-16-05-16-handoff/metadata.json`
- ?? `.agentloop/runs/2026-06-16-05-16-handoff/pr-summary.md`
- ?? `.agentloop/tasks/archive/2026-06-16-make-install-agent-output-markdown-safe.md`

## Diff Stat

```text
.agentloop/backlog.md             |  6 +++++
 .agentloop/dogfood-log.md         | 50 +++++++++++++++++++++++++++++++++++++++
 CHANGELOG.md                      |  1 +
 docs/cli-reference.md             |  2 ++
 src/cli/commands/install-agent.ts |  2 +-
 tests/agent-installation.test.ts  | 21 +++++++++++++++-
 6 files changed, 80 insertions(+), 2 deletions(-)
```

## Gate Summary

- [`pass`] `Task contract`: `Make install-agent output Markdown-safe`
- [`pass`] `Verification report`: `Overall status: pass`
- [`warn`] `Handoff summary`: `Latest handoff does not cover the current dirty files.`
- [`pass`] `Task hygiene`: `Task folder hygiene checks passed.`
- [`pass`] `Repo harness`: `Required repo and harness files exist.`
- [`pass`] `Safety policies`: `Core safety policy files exist.`
- [`pass`] `Git context`: `31 changed file(s) detected.`
- [`pass`] `Git target`: `Current directory is the Git root.`
