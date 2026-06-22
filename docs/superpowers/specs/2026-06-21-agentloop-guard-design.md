# AgentLoop Guard Design

## Purpose

AgentLoopKit already explains local work after the fact with Evidence Map and Resume Pack. Guard makes that evidence useful while work is still moving: it gives maintainers and software agents a local signal for scope drift, risky paths, stale verification, proof debt, and context-budget waste before review.

This feature stays local-first. It does not intercept provider traffic, rewrite prompts, upload code, publish artifacts, read secrets, or claim measured token savings without measuring them.

## User Problem

Long agent-assisted engineering sessions are expensive in two ways:

- Review risk: work can drift outside the task contract, touch forbidden/risky files, or keep stale verification evidence until the end.
- Context waste: continuation sessions often resend broad chat history, logs, and file lists instead of a small task-backed snapshot.

Headroom-style context compression validates the broad user pain: developers want fewer tokens and less context waste. AgentLoopKit should solve the same class of problem in a repo-aware way: select and summarize the right local evidence, show budget pressure, and point users to compact continuation commands instead of hiding source truth behind opaque compression.

## Product Shape

### Guard

Add `agentloop guard` as a read-only default command over the current Evidence Map.

It classifies the current workspace as:

- `pass`: local task, changed-file evidence, and verification are reviewable.
- `warn`: work has reviewable blockers such as unexplained or forbidden non-evidence files, or context-budget waste.
- `fail`: local evidence cannot support review because task evidence is missing or verification is missing, failed, or stale.

`--strict` turns `warn` and `fail` into a non-zero exit code for CI, hooks, scripts, and local automation. Advisory mode keeps exit code 0 unless the command itself fails.

### Watch Mode

Add `agentloop guard --watch` for repeated local snapshots. Watch mode is bounded in tests through `--max-iterations`; without a max, it keeps running until interrupted. Each snapshot is derived from the same evidence-map builder, so it avoids broad repository scans.

### Explicit Reports

Add `--write-report` and optional `--out <path>` for local Markdown reports. Writes must stay inside `.agentloop/reports` and use `.md`. No report is written unless requested.

### Explicit Baselines

Add `--write-baseline <path>` and `--baseline <path>`.

The baseline stores the current changed-file paths and statuses as JSON. A later Guard run can compare against that baseline and show which changed files are new since the baseline. This helps users separate inherited dirty work from current-session drift.

Baseline paths must stay inside `.agentloop/guard` and use `.json`.

### Context Budget Guard

Add estimated context-budget findings to Guard. This phase estimates token pressure with a transparent heuristic and reports:

- changed-file count and non-evidence count
- approximate file-list token cost
- approximate resume-pack token cost
- compact next actions such as `agentloop resume-pack --for codex --redact-paths`

The feature must say these are estimates. It must not claim billing savings, model-specific tokenization accuracy, or parity with provider token counters.

## Architecture

Create `src/core/guard.ts` as a composition layer over `buildEvidenceMap`.

Core responsibilities:

- Build one Guard snapshot from an Evidence Map.
- Convert Evidence Map reviewability and verification state into Guard findings.
- Load and write Guard baselines with repository-bounded paths.
- Render human Markdown and JSON-safe structures.
- Run bounded or unbounded watch loops with a callback.
- Write explicit Markdown reports with existing safe artifact path validation.

Create `src/cli/commands/guard.ts` as a small Commander wrapper.

CLI responsibilities:

- Parse and validate numeric options.
- Load workspace config through existing JSON-aware helpers.
- Call Guard core functions.
- Print human or JSON output.
- Set strict exit code after output is printed.
- Return JSON errors for invalid options or output paths.

Update `src/cli/index.ts` and `src/core/completions.ts` to expose the command.

## Safety

- Default `agentloop guard` is read-only.
- `--write-report` and `--write-baseline` are the only write paths.
- Report output is limited to `.agentloop/reports/*.md`.
- Baseline output is limited to `.agentloop/guard/*.json`.
- Baseline reads are limited to `.agentloop/guard/*.json`.
- Guard never reads changed file contents.
- Guard never reads `.env` values, secrets, or external services.
- Watch mode only repeats local evidence-map reads and sleeps between snapshots.

## Error Handling

- Invalid numeric options return `GUARD_OPTION_INVALID`.
- Invalid baseline shape returns `GUARD_BASELINE_INVALID`.
- Report and baseline path errors return existing output-path style JSON where possible.
- In human mode, errors use the normal CLI error path.

## Testing

Add `tests/guard.test.ts` with TDD coverage for:

- one-shot human output
- strict exit behavior for pass and warn/fail states
- JSON output
- bounded watch mode
- explicit report writing
- explicit baseline write/read
- invalid option JSON errors
- path-bounded baseline/report writes

Update docs drift and completion tests to include `agentloop guard`.

## Documentation

Add `docs/guard.md` and update README, CLI reference, ROADMAP, and DECISIONS.

Docs must position Guard as local drift/proof-debt/context-budget control. They must avoid "AI coding assistant" positioning and avoid fake user-research claims.

## Non-Goals

- No release, tag, version bump, npm publish, GitHub Release, GHCR, MCP Registry, or Marketplace change.
- No proxy, wrapper, MCP compression server, prompt rewriting, provider traffic interception, hidden telemetry, or hosted service.
- No exact provider token counting in this phase.
- No automatic verification execution.
- No mutation of task contracts or Git state.
