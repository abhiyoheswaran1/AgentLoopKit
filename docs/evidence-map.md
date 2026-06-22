# Evidence Map And Resume Packs

AgentLoopKit can explain the current diff using local engineering evidence. The evidence map connects changed file paths to the active task contract, recent run ledger entries, verification freshness, risk-sensitive path categories, and the next local command to run.

This is intentionally deterministic and local. It does not read changed file contents, call an LLM, call GitHub, read tokens, upload files, publish packages, create tags, or run verification commands.

## Commands

```bash
agentloop explain-diff
agentloop explain-diff --json
agentloop explain-diff --redact-paths

agentloop resume-pack --for codex
agentloop resume-pack --for claude
agentloop resume-pack --for cursor
agentloop resume-pack --for generic
agentloop resume-pack --for human
agentloop resume-pack --json --redact-paths
```

Use `explain-diff` before review when you want to know whether the changed files are explained by the current task and fresh verification evidence. Use `resume-pack` when another agent or reviewer needs a compact continuation brief without opening every AgentLoop artifact.

Resume packs include a Context Budget section. It estimates changed-file list and resume-pack token pressure with a transparent character-count heuristic. These estimates are planning guidance, not provider token counts or billing claims.

For a clean steady-state evidence map, commit the generated AgentLoopKit harness after first `agentloop init` and before the first implementation task. If `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json` are still uncommitted, the evidence map will include those generated harness files as local work. That is accurate, but it can obscure the feature diff you are trying to review.

## What The Evidence Map Uses

- Git status paths and file statuses.
- The active task contract, or the latest valid task evidence from the run ledger.
- `Likely Files or Areas` and `Files or Areas Not to Touch` from the task contract.
- The latest verification report and whether it is fresh for the current task.
- Recent local run-ledger changed-file records for the same task.
- Path-based risk categories such as auth, security, billing, deployment, migrations, env files, and dependency lockfiles.

## What It Does Not Prove

The evidence map is path-based. It can show that a file is in the task scope, appears in recent local evidence, or needs attention. It cannot prove code correctness, security, product fit, or review approval.

If verification is missing, failed, or stale, the map blocks reviewability and points back to `agentloop verify --task-commands --progress`. If files are unexplained or match forbidden task scope, it points reviewers back to the task contract before handoff.

## Review Surface Reuse

`agentloop guard`, `agentloop review-context`, `agentloop ship`, and `agentloop prepare-pr` include compact evidence-map summaries so maintainers see the same local explanation in their normal review flow. `guard`, `review-context`, and `resume-pack` also surface context-budget guidance so continuation work can use compact evidence instead of broad chat history. These commands keep their existing safety boundaries: they do not post to GitHub, publish, tag, upload, intercept prompts, proxy provider traffic, or read secrets.

## Redaction

Use `--redact-paths` before sharing human or JSON output outside your machine:

```bash
agentloop explain-diff --redact-paths
agentloop resume-pack --for codex --redact-paths
```

Redaction changes displayed local roots only. It does not change where AgentLoopKit reads evidence or writes normal artifacts.
