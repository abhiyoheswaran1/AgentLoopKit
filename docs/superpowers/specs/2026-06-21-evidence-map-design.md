# Evidence Map Design

## Goal

AgentLoopKit should make agent-assisted engineering work explainable before review. The product should answer: what changed, which local evidence explains it, what is stale, what is risky, what is missing, and what exact command should run next.

## Product Decision

Build a deterministic local evidence map, then expose it through:

- `agentloop explain-diff` for humans and scripts that need a focused diff explanation.
- Existing review surfaces, starting with `review-context`, `ship`, and `prepare-pr`, so the same evidence language appears where reviewers already work.
- `agentloop resume-pack` for compact continuation briefs that another software agent or human can use without relying on stale chat history.

The feature does not call an LLM, read credentials, post to GitHub, publish artifacts, or claim code correctness. It correlates local repo evidence that AgentLoopKit already owns.

## Evidence Sources

The first version uses only local deterministic sources:

- Git status paths and status codes.
- Active or latest task contract metadata and selected task sections.
- Latest verification report freshness from existing evidence resolution.
- Review gates from `check-gates`.
- Run ledger metadata and changed-file records.
- Change-area classification.
- Existing AgentLoop evidence-file classification.

It should not read arbitrary changed-file contents to infer intent. Path matching is enough for the first useful slice and keeps the security boundary simple.

## Core Model

The core module should return a JSON-safe object with:

- `summary`: overall state, counts, and reviewability label.
- `task`: current task identity and source.
- `verification`: status, freshness, report path, and stale reason when present.
- `files`: one record per changed file.
- `coverage`: covered and unexplained file counts.
- `risk`: risk-sensitive file count and examples.
- `nextActions`: deterministic commands and reasons.
- `claims`: boundaries that explain what the map does and does not prove.

Each changed file receives:

- `path`
- `status`
- `area`
- `agentLoopEvidence`
- `coveredByTask`
- `coveredByRun`
- `riskSensitive`
- `explanation`

Coverage means "has local AgentLoopKit evidence tying this path to the current task or prior run." It does not mean semantic correctness.

## Coverage Rules

Task coverage is path based:

- A file is covered by task intent when it appears exactly under `Likely Files or Areas`, or is under a listed directory prefix.
- Files listed under `Files or Areas Not to Touch` are flagged even if they also appear elsewhere.
- AgentLoop evidence files are grouped separately and do not count as unexplained implementation files.

Run coverage is path based:

- If the latest local run for the current task includes a changed-file record for the path, the file is covered by run evidence.
- Earlier runs may be surfaced as prior intent, but should not override current stale verification warnings.

Verification freshness stays task-level in this slice:

- Passing fresh verification is a strength.
- Missing, failed, or stale verification should create a next action.
- The map should not claim per-file test coverage.

## CLI Behavior

`agentloop explain-diff` should be read-only.

Human output should be compact:

- Reviewability label.
- Changed-file counts.
- Covered and unexplained file counts.
- Verification status and freshness.
- Risk-sensitive files.
- Bounded examples of unexplained files.
- Exact next commands.
- Score/evidence boundary claim.

JSON output should include the full evidence map and remain display-safe for repo-relative paths. `--redact-paths` should be accepted for consistency and should redact local roots if any appear.

## Resume Packs

`agentloop resume-pack` should produce a local continuation brief from the same evidence map.

Supported formats:

- `--for codex`
- `--for claude`
- `--for cursor`
- `--for generic`
- `--for human`

The first version can keep the same data across targets with small wording differences. It should avoid tool-specific claims that are not implemented. The pack should include the active task, changed-file evidence map summary, verification state, risk notes by count or bounded examples, and next commands.

## Review Surface Reuse

The evidence map should be reusable by:

- `review-context`: include a compact `evidenceMap` object in JSON and a human line with covered/unexplained/stale/risk counts.
- `ship`: include a short `Evidence Map` section in Markdown and JSON without changing score weights.
- `prepare-pr`: include a compact `Evidence Map` section in the PR body so reviewers see unexplained/stale/risky scope before the checklist.

## Safety

The implementation must:

- Use `execa`/existing helpers only through current Git helpers.
- Avoid shell interpolation.
- Keep paths repo-relative in output where possible.
- Avoid reading `.env` contents or changed source file bodies.
- Avoid hidden network calls, token reads, publishing, tagging, or package version changes.
- Escape Markdown prose and inline values.

## Performance

The evidence map should be cheap enough to run in normal status/review flows:

- One Git status read.
- One current task read.
- One latest verification evidence resolution.
- One check-gates call only when requested by a review surface that already needs gates, or by `explain-diff`.
- Bounded run-ledger reads, defaulting to recent runs only.
- No broad source scans.

## Phases

1. Core evidence-map module with focused unit tests.
2. `explain-diff` command with human and JSON output tests.
3. Review-surface integration in `review-context`, `ship`, and `prepare-pr`.
4. `resume-pack` command with target formatting tests.
5. Docs, CLI reference, README, decisions, and verification evidence.

## Non-Goals

- No hosted dashboard.
- No semantic code review.
- No per-file test coverage claims.
- No cloud service.
- No LLM wrapper.
- No release prep without maintainer approval.
