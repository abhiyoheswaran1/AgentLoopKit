# AgentLoop Guard

`agentloop guard` checks local drift, proof debt, and context-budget pressure while work is still in progress.

It builds on the Evidence Map. Guard does not replace verification or review. It gives you a fast local answer to whether the current workspace is still task-backed, freshly verified, and compact enough to hand to the next worker without resending broad context.

## Commands

```bash
agentloop guard
agentloop guard --strict
agentloop guard --json
agentloop guard --redact-paths

agentloop guard --watch
agentloop guard --watch --interval-ms 2000 --max-iterations 5

agentloop guard --write-report
agentloop guard --write-report --out .agentloop/reports/local-guard-report.md

agentloop guard --write-baseline .agentloop/guard/baseline.json
agentloop guard --baseline .agentloop/guard/baseline.json
```

## Statuses

- `pass`: task scope, changed-file evidence, and verification are reviewable.
- `warn`: work needs attention, usually because changed files are unexplained or forbidden by the task contract.
- `fail`: review evidence is blocked because task evidence is missing or verification is missing, failed, or stale.

Default Guard output is advisory. `--strict` exits non-zero for `warn` or `fail`, which makes it useful in local scripts, hooks, or CI evidence gates.

## Context Budget

Guard includes a Context Budget section. It estimates changed-file list tokens and compact resume-pack tokens with a simple character-count heuristic, then points to:

```bash
agentloop resume-pack --for codex --redact-paths
```

Those estimates are planning guidance, not provider token counts or billing claims. The goal is to make continuation and review cheaper by sending compact task-backed evidence instead of full chat history, long logs, or every local artifact. Context-budget pressure is advisory; by itself it does not fail `--strict`.

`agentloop resume-pack` and `agentloop review-context` also include the same context-budget signal, so token economy is visible in normal continuation and review flows without adding a proxy or wrapper.

## Baselines

Use a baseline when a task inherits existing dirty work:

```bash
agentloop guard --write-baseline .agentloop/guard/baseline.json
# work continues
agentloop guard --baseline .agentloop/guard/baseline.json
```

Baselines track changed non-evidence file paths and statuses. Later Guard runs show how many non-evidence files are new since the baseline, which helps separate inherited dirty state from current-session drift.

## Safety Boundary

`agentloop guard` is read-only by default.

It does not run verification, read changed file contents, read `.env` values, call an LLM, intercept prompts, proxy provider traffic, call GitHub APIs, post comments, publish packages, create tags, upload files, mutate task contracts, or change Git state.

The only writes are explicit:

- `--write-report` writes Markdown under `.agentloop/reports`.
- `--write-baseline <path>` writes JSON under `.agentloop/guard`.

Use `--redact-paths` before sharing output in public logs.
