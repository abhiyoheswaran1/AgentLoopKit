# Changelog

## Unreleased

- Added `agentloop harden`: a front-of-loop pass that interrogates a task contract for unresolved "soft spots" (placeholder sections, untestable acceptance criteria, unbounded scope, unstated assumptions, and contradictions between acceptance criteria and Non-Goals) before implementation starts. Detection is LLM-free and deterministic; the agent conducts the interrogation and AgentLoopKit structures and captures it.
- Added `agentloop harden --resolve <id> --answer "<text>"` to write a resolution back into the correct contract section and record it in a `## Hardening Log`. Resolution converges for every soft-spot type (the offending line is replaced in place, not appended), and soft-spot ids are stable across resolutions so batched resolves are safe.
- Surfaced blocking soft spots as a `contract-hardening` gate in `agentloop check-gates` and `agentloop ready`, and `agentloop create-task` reports soft spots by default at task-creation time. The gate warns by default and, in `check-gates --strict`, fails — consistent with the existing advisory/strict duality.
- Generated `.agentloop/harden-playbook.md` on `init` with agent-facing guidance for the hardening loop, and added `harden` to the stable command surface (contract-locked `--help` and `--json` shape, README, and CLI reference).
- Steered the loop to harden: when the active task contract has blocking soft spots, `agentloop next`, `start`, `status`, and the MCP `nextAction` field now recommend `agentloop harden` as the next step — before verify/handoff/ship — so a thin contract is hardened before it flows downstream. This replaces the previous placeholder→`agentloop task doctor` recommendation in `next`/`status` (soft spots are a superset of review-critical placeholders, and `harden` is the purpose-built tool).
- Note: because an unfilled `Files or Areas Not to Touch` section is now a blocking soft spot, `agentloop check-gates --strict` will newly fail on contracts that never filled that section, and `next`/`start`/`status` will recommend `agentloop harden` first for such contracts. Default (non-strict) gate behavior is unchanged (warn only); run `agentloop harden` to resolve. See `docs/stability.md`.
- Made verification freshness content-addressed: `agentloop verify` now records a deterministic verified-state fingerprint (a local hash of the working-tree state, excluding AgentLoopKit's own generated evidence dirs) in the report, and `guard`/`explain-diff`/`check-gates`/`ready`/`next` compare it against the current tree. If the working tree changed after a passing `verify`, freshness is now correctly reported as **stale** instead of `fresh` — closing a gap where a reviewer could trust a passing verification for code that was edited afterward. Legacy reports without a fingerprint keep the prior mtime-based behavior (non-breaking).

## 1.0.0

- Made run-ledger coverage content-addressed: each run records a per-file git blob hash in its `changed-files.json`, and a changed file counts as "covered by a recent run" only if its current content hash matches what the run recorded. A file edited after the run that produced it is no longer treated as explained by that run's evidence — it correctly shows as unexplained in `guard`/`explain-diff` until re-covered. The hash stays local and internal (not exposed in any `--json` output); runs recorded before this release fall back to path-presence coverage (non-breaking).
- Made handoff coverage content-addressed: the `handoff-summary` gate (`check-gates`) and `status` guidance now treat a dirty file as covered by the latest handoff run only if its current content still matches what that run recorded. A file edited after its handoff run no longer counts as covered, so the gate flags that the handoff no longer describes the current diff. Coverage from AgentLoopKit evidence artifacts or handoff-prose paths stays path-based; runs recorded before this release fall back to path-presence (non-breaking).
- Verify reports now write the full untruncated command output to a sibling `*.full-output.log` (and link it from the report) whenever the in-report excerpt is truncated, so mid-log evidence a reviewer needs — a coverage summary, a skipped-test line — is available locally instead of requiring a re-run. When no output is truncated, no extra file is written and the report is unchanged.
- Added criteria-proof reconciliation to the reviewer packet (`prepare-pr`, `summarize`, `handoff`): each acceptance criterion is cross-referenced against the verification report and labeled **proven** (a linked verification command passed), **failing** (a linked command failed), **not run** (linked command absent or no report yet), or **unlinked** (no `(verified by: <keys>)` tag — no local proof, reviewer judges). This replaces the previous manual "acceptance criteria match" checkbox with deterministic, LLM-free evidence, and exposes a `criteriaCoverage` object in those commands' `--json` (additive). Link a criterion to the commands that prove it by ending the line with e.g. `(verified by: test, typecheck)`.
- The `prepare-pr` packet's Evidence Map section now lists the changed files not tied to intent (unexplained by task scope, or in the forbidden-file scope) with their explanations — the change-side of the reconciliation, next to the criteria coverage — instead of only a count. When every change is accounted for, it says so. Markdown-only; the underlying data was already in `--json`.
- The evidence map now distinguishes exact vs directory task-scope coverage in a changed file's explanation: a file the contract named exactly reads as "matches an exact task likely-file entry," while a file merely under a named directory reads as "under a task likely-file directory scope — the file itself is not named," so a reviewer sees the weaker guarantee. `coveredByTask` itself is unchanged; wording-only (no `--json` shape change).
- **Behavior change (1.1.0):** blocking contract soft spots now FAIL `agentloop check-gates` and block `agentloop ready` by DEFAULT (previously they only warned, failing under `--strict`). A task contract with unverifiable acceptance criteria or unbounded scope no longer scores review-readiness `pass` — run `agentloop harden` to resolve, or pass the new `--allow-soft-spots` flag to `check-gates`/`ready` to downgrade to a warning. Upgrading from 1.0 will make these commands newly red on un-hardened contracts (intended: stronger trust gate). AgentLoopKit's own `agentloop loop create` generated contract was hardened so it passes the stricter gate for any goal.
- Committed the entire shipped surface as a stable public contract across six axes: CLI commands and flags, `agentloop.config.json` config schema, MCP tool surface, `--json` output shapes, exit codes, and the generated harness format plus package API. See `docs/stability.md`.
- Added contract-lock tests enforced by a new `contract:check` script wired into `release-flow`: snapshot locks for every command's `--help`, the config JSON schema, the MCP tool definitions, and the `--json` output shape of 36 of 37 `--json`-capable stable commands (only `show-run` is deferred, as it needs a runtime run id).
- Ran a pre-freeze consistency audit (`docs/1.0-consistency-audit.md`) and fixed the surface before freezing: `github import --json` and `release-proof --json` now emit the standard JSON error envelope on failure; `init` and `create-task` gained `--redact-paths` and no longer leak absolute paths (including `init`'s created/updated/skipped path arrays); `upgrade-harness --redact-paths` now uses the shared `[git-root]` placeholder; `check-gates`'s Baseframe task flag was renamed from `--task` to `--baseframe-task-id` to end a flag collision; and the singular next-action JSON field was unified to `nextAction: { command, reason }` across `next`, `start`, `status`, `check-gates`, `ready`, and the `agentloop_next` MCP tool (`guard.nextActions[]` stays a distinct plural field).
- Published `docs/versioning.md`: the SemVer promise (no breaking change to any committed surface within 1.x), the deprecation policy (minimum one-minor window, `DEPRECATED` warnings to stderr, no removals before 2.0), and the experimental-tier convention that lets 1.x add new capabilities without freezing them until they are promoted.
- Documented the frozen JSON field conventions and exit-code semantics in `docs/stability.md`, including the deliberately-preserved `status`/`overallStatus` aggregate-verdict split (`overallStatus` is load-bearing across the persisted run/verification data model, so it is not renamed).
- Guaranteed the 0.x to 1.0 upgrade path with an `upgrade-harness` template-version matrix, and added a README stability section pointing to the contract and versioning guarantees.

## 0.47.1

- Fixed `agentloop ready` so an idle repo with no changed-file context reports a neutral context-budget receipt instead of warning that AgentLoopKit may cost more context than it saves.
- Clarified release-channel docs so GitHub Marketplace remains an owner-side listing proof step while the repository Action stays usable by version ref.

## 0.47.0

- Added `agentloop loop scorecard` for a read-only autonomous-loop pre-flight decision with `continue`, `ask-human`, `stop`, and `ready` outcomes, ranked reasons, token-budget signals, runner guardrails, context handles, readiness state, and scope evidence.
- Exported loop scorecard API types and helpers for package consumers.
- Fixed blocked loops so `agentloop loop tick` now refuses another iteration after human-review gates block the loop.
- Fixed scorecard decisions so passing readiness gates report `ready` before iteration exhaustion stops another pass.
- Fixed generic loop task default scope so root public docs and repo guidance files are covered during loop scorecard scope checks.
- Updated loop docs, CLI reference, README, generated harness guidance, and local repo guidance with the scorecard workflow.

## 0.46.0

- Added `agentloop loop run` for one guarded local runner iteration through an explicit loop `--runner-command`, with non-shell execution, blocked publish/destructive command families, bounded output, changed-file evidence, token receipts, and normal loop stop conditions.
- Updated README, loop-contract docs, CLI reference, generated harness guidance, and dogfood guidance with guarded runner loops and richer README visuals.

## 0.45.0

- Added `agentloop loop create`, `agentloop loop tick`, `agentloop loop status`, and `agentloop loop report` for local loop contracts that record goals, budgets, stop conditions, token receipts, iteration decisions, and native task links without executing a coding agent.
- Added `agentloop ready` for read-only review-readiness gates across task contracts, acceptance criteria, verification evidence, scope drift, forbidden files, and context-budget pressure.
- Added token receipts and digest-aware context handle reads so agents can see AgentLoopKit overhead, estimated net context reduction, and unchanged handle receipts without repeating local evidence content.
- Added package API exports for loop contracts, readiness evaluation, and token receipt helpers.
- Updated README, CLI reference, Context Contract docs, and new loop-contract docs with the local loop workflow and safety boundary.

## 0.44.0

- Added Baseframe Suite Integration v1 so `agentloopkit create-task --from-projscan` consumes local ProjScan assessment artifacts, validates schema and path safety, creates or updates the native AgentLoopKit task, emits `.baseframe/evidence/<task-id>/agentloopkit-task.json`, and updates `.baseframe/agent-workflow.json`.
- Added AgentFlight result reconciliation to `agentloopkit check-gates --task <task-id> --from-agentflight`, including verification command matching, missing or failed required-gate detection, incomplete verification surfacing, proof-gap notes, and scope-drift findings without auto-completing the task.
- Added exported Baseframe integration types and package API functions for ProjScan assessments, AgentLoopKit task contracts, AgentFlight results, task creation, and gate evaluation.
- Updated Baseframe integration docs, README positioning, CLI reference, task-contract docs, and check-gates docs with the local JSON handoff flow.
- Added fixtures and regression coverage for ProjScan import validation, native task and JSON contract consistency, manifest preservation, AgentFlight gate mapping, standalone compatibility, and path-traversal protection.

## 0.43.0

- Added `agentloop context handles` for a source-handle inventory with availability, reasons, and expansion commands.
- Added the Doctor Agent Readiness Matrix so `doctor` checks Start, context handles, broad-read avoidance, MCP guidance, and installed agent instructions.
- Added Start usefulness proof with impact-ledger values for estimated context avoided, broad files avoided, stale proof, scope drift, source handles, verification freshness, and the next safe command.
- Added compact Guard JSON with bounded finding path lists, compact evidence maps, watch support, and source-handle expansion guidance.
- Changed context budget, context pack, review-context, and MCP payloads to avoid broad changed-file detail by default and point agents to `evidence-map:current` for source truth.
- Changed MCP/status/context handle expansion to redact local roots when requested and use bounded safe Markdown reads for local evidence.
- Changed run-ledger latest and intent lookup to use bounded metadata reads with consistent metadata timestamp ordering.
- Changed Doctor risk scans to exclude AgentLoop and AgentFlight evidence/session files so monorepo and evidence churn reports stay actionable.
- Updated README, Context, CLI, MCP, generated agent, and harness docs with Start-first guidance, the context-economy workflow, and the refreshed demo GIF.
- Fixed JSON redaction for `agentloop start --json --redact-paths` and compact Guard JSON output.
- Fixed Markdown-safe ship GitHub comment handling for newline-leading list markers.

## 0.42.0

- Added `agent-start` guidance readiness checks to `upgrade-harness` so older generated harness files must mention both `agentloop start` and `agentloop context show`.
- Changed `doctor` harness warnings to describe current agent-readiness topics, including Start preflight and source-handle expansion.
- Updated generated harness templates to template version 2 with Start/Context readiness guidance in `AGENTS.md`, `AGENTLOOP.md`, `.agentloop/harness/commands.md`, and `.agentloop/README.md`.
- Changed `agentloop start` and `agentloop context` to use current-work task evidence so archived, terminal, deferred, and AgentFlight placeholder tasks stay as previous evidence.
- Changed Start and Context no-current-task routing so previous release or handoff evidence routes agents toward task setup without `task:active` handles or `agentloop ship` guidance.
- Added regression coverage for archived latest-run evidence and archived active-task pointers in Start and Context.
- Updated README, Context, CLI reference, and MCP docs with the Start current-work guarantee.

## 0.41.0

- Added `agentloop start` as the repo-native preflight for software agents, with active task, decisive preflight state, read-first source handles, risk summary, next safe command, and context-budget impact.
- Added Start preflight states for ready continuation, missing task, missing or stale verification, scope drift, review-ready work, blocked risk, and evidence-only sessions.
- Added `agentloop_start` to the read-only MCP surface so agent platforms can request the same briefing without broad repo scans.
- Added Start guidance to generated Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic agent instructions.
- Added Start-focused README, CLI reference, MCP, getting-started, and Context Contract docs plus a regenerated README demo GIF centered on the preflight flow.
- Added Start tests for JSON shape, Markdown output, goal-aware states, scope drift, risk blocking, MCP payloads, and docs drift.

## 0.40.0

- Added `agentloop context budget`, `agentloop context pack`, and `agentloop context show` as a unified Context Contract for software agents.
- Added auditable context-pack receipts that explain included evidence, omitted broad context, source handles, verification freshness, next actions, and context-budget estimates.
- Added read-only MCP tools for context budget, context pack, and context handle expansion so agent platforms can consume the same contract directly.
- Added generated agent guidance that tells Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic agents to request a context pack before broad repo reads.
- Added public Context Contract documentation, CLI reference coverage, README positioning, an ASCII workflow diagram, a context-budget visual, and a regenerated terminal demo GIF.
- Added tests for context-pack JSON and Markdown output, redacted handle expansion, MCP tool exposure, CLI docs drift, and public documentation hygiene.

## 0.39.0

- Added `agentloop guard` for local drift, proof-debt, stale-verification, baseline, watch-mode, report-writing, and context-budget checks.
- Added deterministic evidence maps through `agentloop explain-diff`, with changed-file coverage against active task scope, recent run evidence, verification freshness, and risk-sensitive areas.
- Added `agentloop resume-pack` for compact continuation briefs tailored to Codex, Claude, Cursor, generic agents, and human reviewers.
- Added context-budget estimates to Guard, resume packs, and review context so agents can choose compact local evidence instead of pasting broad chat history or changed-file lists.
- Added Guard and evidence-map summaries into `review-context`, `ship`, and `prepare-pr` so normal review surfaces explain scope coverage and next actions.
- Added public Guard and evidence-map docs plus README visuals for the context-budget workflow and regenerated terminal demo.
- Changed `doctor` monorepo detection to catch nested package manifests such as `apps/*/package.json`, `functions/package.json`, and test package layouts when the root package does not declare workspaces.
- Changed AgentLoop evidence classification so `.agentloop/state.json` and repo-local task contracts are treated as local evidence instead of unexplained product work.
- Fixed real-repo trial friction around generated harness baselines by documenting when to commit the initialized AgentLoop files before feature work.

## 0.38.0

- Added additive `status` and `next` loop guidance so agents re-entering a task see the matching `.agentloop/loops/<type>.md` file when it exists.
- Added additive `create-task` loop guidance so typed tasks point to the matching `.agentloop/loops/<type>.md` file when it exists.
- Added a focused product-positioning test for internal product-direction files and aligned persona/panel wording with agent-assisted engineering language.
- Added a `research` task type and local research loop guidance for reviewable research plans, findings, limits, and follow-up tasks.
- Added `--redact-paths` support to task lifecycle commands so `task set`, `task status`, `task done`, `task archive`, and `task clear` can be used in shareable command logs.
- Changed `create-task` help and generated AGENTLOOP guidance to use agentic engineering-session wording.
- Added package metadata tests for unsupported positioning so npm description and keywords stay aligned with software-agent and agent-assisted engineering language.
- Changed public product wording and package metadata to use software-agent and agent-assisted engineering language, and added public-doc hygiene guards against cheap assistant-style positioning.
- Added `create-task` warnings for review-critical placeholder sections so draft task contracts stay permissive but agents see missing problem, outcome, scope, acceptance, verification, or rollback content immediately in human and JSON output.
- Added `create-task` warnings when a new task starts over existing dirty non-evidence files, with bounded human and JSON examples so agents can review scope before implementation.
- Updated generated task-contract guidance so freshly initialized repos explain dirty-work and placeholder-section `create-task` warnings without changing runtime behavior.
- Updated generated AgentFlight placeholder recovery guidance so root, harness, and agent instruction templates tell agents to run status plus task doctor, preserve placeholder evidence, clear placeholder active state, then pin or create a real task.
- Changed `task clear` output to distinguish cleared persisted active-task pointers from no-op runs, including ignored AgentFlight placeholder pointers, without deleting task files.
- Changed human-readable `artifacts` output to label archived task fallbacks as `Latest archived task evidence` while keeping JSON compatibility through `archived: true`.
- Changed human-readable `check-gates` output to label archived task fallbacks as `Archived task evidence` while keeping JSON gate fields stable.
- Changed `check-gates` create-task next-action guidance to include bounded dirty non-evidence file examples while keeping gate decisions unchanged.
- Changed human-readable `review-context` gate summaries to label task evidence as active, latest open, archived, or missing while keeping JSON gate fields stable.
- Changed human-readable `ship` reports to show an inherited dirty-work baseline section when task Risk Notes include the generated pre-existing dirty non-evidence count, while preserving readiness scoring and JSON output.
- Changed `status` and `next` create-task recommendations to mention existing dirty non-evidence files before agents start the next task.
- Changed dirty-work warning terminology from `non-AgentLoop` to `non-evidence` so local `.agentloop` product or harness files are described accurately when they are not generated evidence.
- Changed `create-task` so dirty-work warnings also persist a bounded Risk Notes bullet with the pre-existing dirty non-evidence count and examples.
- Added `npm run typecheck` to `npm run maintenance:check` so the recurring guard catches TypeScript regressions before later docs, safety, and dogfood checks pass.
- Changed `agentloop ship` reports to render task Risk Notes with Markdown-safe single-line prose and a clear fallback when no risk notes were recorded.
- Changed `agentloop review-context` to report the active task Risk Notes count without printing the task risk-note prose.
- Fixed readiness scoring so final task Markdown sections, including final `Rollback Notes` or `Risk Notes`, are parsed correctly while placeholder risk-note text remains ignored.
- Added `tests/readiness-score.test.ts` to `npm run test:unit` so the recurring maintenance guard exercises deterministic review-readiness scoring coverage.
- Changed dogfood gates to print AgentFlight session status after AgentFlight doctor so blocked session readiness is visible without parsing human output.
- Documented the safe AgentFlight verification syntax, `agentflight verify -- <command> <args>`, so agents do not pass full shell commands as one quoted argument.
- Changed human-readable `maintainer-check` output to label package-manifest-only and combined package/dependency warnings precisely while preserving the existing JSON check id.
- Changed `agentloop maintainer-check` to distinguish package manifest changes from dependency lockfile changes while preserving the existing warning check id.
- Clarified `npm run dogfood:strict` guidance so strict review-gate warnings are distinguished from maintainer-check reviewer guidance warnings.
- Changed `prepare-pr` and deterministic PR summaries to surface verification report `Not Run` entries directly, with a clear fallback when no commands were skipped.
- Changed the PR handoff and deterministic summary heading for those entries to `Verification Report Not Run` so reviewers see that the list comes from report evidence rather than a broad coverage claim.
- Changed `prepare-pr` PR bodies to collapse the optional imported GitHub metadata section cleanly when no metadata exists, avoiding an extra blank gap before the reviewer checklist.
- Changed verification report Markdown to show configured command strings beside `Not Run` aliases while preserving existing JSON `notRun` alias values.
- Changed verification reports to omit configured `Not Run` entries when an exact same command string ran from task verification.
- Changed dirty `create-task` next-action guidance to include bounded dirty non-evidence file examples while keeping the recommended command unchanged.
- Changed compact `status --brief` output to show `verification=previous:<status>` when no active or open task exists.
- Changed human `review-context` output to label retained latest verification as previous evidence when no active or open task exists.
- Changed human `next` output to label the latest verification as previous evidence when no active or open task exists, matching `status` while keeping JSON output unchanged.
- Changed human `status` output to label the latest verification as previous evidence when no active or open task exists, while keeping JSON `latestReport` unchanged.
- Changed `agentloop artifacts --stale` to show candidate counts grouped by artifact type before the bounded human preview, with deterministic JSON summary data.
- Fixed path redaction so external Markdown URLs are preserved while local root variants still redact fully in verification evidence.
- Changed maintainer-check and release-check path redaction to reuse the shared URL-safe local-root helper, including `/var` and `/private/var` path variants.
- Changed ship readiness scope warnings to include compact non-evidence review-area counts when a change set is broad.
- Changed ship report diff stats to include compact untracked non-evidence file markers while preserving Git's tracked-file stats and the full JSON changed-file inventory.
- Changed deterministic summaries, handoffs, and HTML reports to use the same untracked-aware diff-stat rendering as ship reports.

## 0.37.0

- Added `agentloop doctor --advisory` for onboarding and real-repo trial preflight checks that should show failing diagnostics without failing the shell.
- Changed `agentloop status` and `agentloop next` to route active task contracts with review-critical placeholder sections to `agentloop task doctor` before verification or handoff.

## 0.36.2

- Broke the `artifacts`/`runs`/`task-state` core import cycle by moving generated artifact patterns and output-path validation into a leaf module.
- Clarified direct AgentFlight placeholder recovery so task doctor tells agents to preserve placeholder files as session evidence while clearing or re-pinning real task state.
- Added a compact first-use loop to the README and getting-started docs.
- Documented why the intentional `prepublishOnly` release guard remains acceptable while other lifecycle scripts still require review.
- Added a real-repo trial checklist for policy packs and imported GitHub metadata before expanding bundled packs or scoring behavior.
- Added public-doc hygiene coverage that keeps real-repo trial guidance local-first, non-marketing, and scoring-neutral.

## 0.36.1

- Fixed Windows smoke fixtures and release-status report path normalization so cross-platform release checks compare stable, relative evidence paths.
- Fixed `doctor --redact-paths` coverage for Windows drive variants, current-directory variants, inferred AgentLoop artifact roots, and labeled local path roots.
- Clarified `agentloop status --brief --json` help copy so compact JSON output is described as machine-readable.
- Mirrored raw AgentFlight recovery guidance into generated agent instruction templates so direct AgentFlight sessions can re-pin detailed AgentLoop task contracts.

## 0.36.0

- Added stale task-state recovery across `agentloop status`, `agentloop next`, and `agentloop task doctor` so missing or stale `.agentloop/state.json` pointers are reported with bounded recovery guidance instead of broad scans or mutation.
- Added `agentloop artifacts` fallback support for the latest archived terminal task, including JSON metadata and human output that identify archived task evidence when no live task is available.
- Hardened release and review evidence surfaces by separating AgentLoop-generated evidence churn from source changes across status, next, check-gates, review-context, artifacts, runs, ship, maintainer-check, and release-check output.
- Improved AgentFlight placeholder handling so placeholder tasks are grouped, parked, and excluded from latest-task evidence where real task contracts should take precedence.
- Expanded built CLI smoke coverage for release-check evidence splitting, stale task-state recovery, archived task fallback, redaction, generated artifact ordering, policy packs, npm-status, and review surfaces.
- Added maintenance coverage for npm-status, SchemaStore, GitHub metadata, policy packs, public docs, links, ProjScan, AgentFlight, and strict dogfood checks.
- Tightened Markdown-safe and redacted CLI output across task, policy, install-agent, verify, handoff, report, badge, ci-summary, release-notes, release-proof, schemastore, run-ledger, status, next, check-gates, ship, prepare-pr, maintainer-check, and artifact commands.

## 0.35.2

- Added explicit `author` metadata to the root composite GitHub Action and aligned the Action metadata quoting with the Marketplace-published ProjScan Action.
- Prepared a Marketplace-focused patch release so GitHub evaluates the released Action metadata again.

## 0.35.1

- Added GitHub Marketplace proof to `agentloop release-proof`, including `--only github-marketplace` and captured `--github-marketplace-json` support.
- Added Marketplace-facing metadata to the root composite GitHub Action so the published Action has a badge, clearer description, and explicit trusted-input copy.
- Updated release docs and checklists so maintainers must publish the Action through the GitHub release UI Marketplace checkbox and verify the Marketplace listing before claiming cross-channel release proof.

## 0.35.0

- Added `agentloop verify --post-verification-gates` so reviewed task post-verification gates can run after the verification report exists while default `verify` behavior stays unchanged.
- Added focused GitHub metadata safety tests to `npm run maintenance:check` so the optional/read-only metadata contract is checked directly.
- Added focused policy-pack safety tests to `npm run maintenance:check` so local/no-overwrite policy-pack behavior is checked directly.
- Added release-proof HEAD/tag clarity so maintainers can see when public channels match the package version but the current checkout contains unreleased commits.
- Fixed generated artifact ordering so timestamped verification, handoff, and ship evidence stays ordered by filename even when Git operations rewrite filesystem mtimes.
- Added a dedicated `scripts/maintenance-check.mjs` gate behind `npm run maintenance:check` that exercises near-term roadmap health checks for release proof, public docs, SchemaStore, policy packs, read-only GitHub metadata, AgentFlight, ProjScan, and non-strict dogfood.
- Changed the dogfood ProjScan command to use the documented global `--format` flag position.

## 0.34.1

- Added release-delta diagnostics to `agentloop release-check` so maintainers can see whether commits after the current version tag affect package release contents or only repo-local evidence/docs.

## 0.34.0

- Changed `agentloop install-agent` to preserve existing agent instruction files by default and report created/skipped status in human and JSON output.
- Changed default generated `agentloop report` HTML report paths to preserve same-minute reruns by adding a numeric suffix.
- Changed default generated `prepare-pr --write` PR description paths to preserve same-minute reruns by adding a numeric suffix.
- Changed default generated `verify`, `ci-summary --write`, and `release-notes --write` artifact paths to preserve same-minute reruns by adding a numeric suffix.
- Changed default `create-task` path allocation to preserve existing same-day, same-title task contracts by adding a numeric suffix.
- Made human-readable `review-context` output render dynamic snapshot values on one Markdown line while preserving raw JSON values.
- Made human-readable `ship` write-confirmation output render written report paths on one Markdown line while preserving raw JSON values.
- Made human-readable `schemastore` output render catalog names, file matches, and schema URLs on one Markdown line while preserving raw JSON values.
- Made human-readable `report` output render written report paths, task titles, verification statuses, and changed-file counts on one Markdown line while preserving raw JSON values.
- Made human-readable `badge` output render written badge paths, sources, statuses, and messages on one Markdown line while preserving raw JSON values.
- Made human-readable `verify` output render progress commands, written report paths, run paths, and status values on one Markdown line while preserving raw JSON values.
- Made human-readable `summarize` and `handoff` output render written summary and run paths on one Markdown line while preserving raw JSON values.
- Made human-readable `install-agent` output render generated agent-instruction paths on one Markdown line while preserving raw JSON values.
- Made human-readable `github import` output render dynamic imported metadata values on one Markdown line while preserving raw JSON values.
- Made human-readable `upgrade-harness` output render dynamic harness audit values on one Markdown line while preserving raw JSON values.
- Made human-readable `policy` output render dynamic policy and policy-pack values on one Markdown line while preserving raw JSON values.
- Made human-readable `create-task` output render generated paths and warning command values on one Markdown line while preserving raw JSON values.
- Made human-readable run-ledger output render dynamic run and file-intent values on one Markdown line while preserving raw JSON values.
- Made human-readable task lifecycle output render dynamic task values and diagnostics on one Markdown line while preserving raw JSON values.
- Made human-readable `maintainer-check` output render dynamic check values and evidence paths on one Markdown line while preserving raw JSON values.
- Made `agentloop prepare-pr` PR bodies, GitHub comments, and write confirmations render dynamic values on one Markdown line while preserving raw JSON values.
- Made human-readable `ship` output render dynamic values as single-line inline code or prose while preserving raw JSON values.
- Made human-readable `release-proof` output render dynamic values as single-line inline code while preserving raw JSON values.
- Made human-readable `release-notes` output render dynamic values as single-line inline code while preserving raw JSON values and authored changelog prose.
- Made human-readable `ci-summary` output render dynamic values as single-line inline code while preserving raw JSON values.
- Made human-readable `release-check` output render dynamic values as single-line inline code while preserving raw JSON values.
- Made human-readable `artifacts` output render dynamic values as single-line inline code while preserving raw JSON values.
- Made human-readable `status` and `next` output render dynamic values as single-line inline code while preserving raw JSON values.
- Made human-readable `check-gates` output render dynamic values as single-line inline code while preserving raw JSON values.
- Added a `Package name` doctor check and made human-readable doctor output render dynamic values as single-line inline code while preserving raw JSON values.
- Added shell completion values for artifact types, badge sources, `summarize` and `handoff` formats, and the `task archive --status done` value.
- Added shell completion values for `agentloop release-proof --only` channels.
- Added `agentloop release-proof --only <channel>` for targeted npm, GitHub Release, GHCR, or MCP Registry proof checks.
- Changed imported GitHub metadata normalization to bound long titles, states, URLs, authors, labels, branch names, and body excerpts before storage or rendering.
- Fixed local policy-pack reading so symlinked policy files must resolve inside the pack's `policies/` directory and the repository.
- Hardened public-doc hygiene checks against unsupported channel claims, fake adoption copy, testimonial language, and premature Pro/SaaS upgrade copy.
- Added `agentloop task doctor` warnings for open task contracts that still contain AgentLoopKit placeholder text in review-critical sections.
- Added `--redact-paths` to `agentloop verify` so verification reports and run-ledger copies can be shared without exposing local absolute roots from command output.
- Added `--redact-paths` to `agentloop summarize` and `agentloop handoff` so reviewer Markdown can be shared without exposing local absolute roots.
- Changed `agentloop verify --task-commands` to accept verification commands written as Markdown inline-code list items.
- Added a repo-local autonomous dogfood guide for AgentLoopKit, ProjScan, AgentFlight, product-panel review, and simulated research cycles.
- Added AgentFlight health to the project dogfood gate while keeping the script read-only and release-safe.
- Added `npm run maintenance:check` for the recurring near-term guard covering unit checks, public-doc hygiene, link checks, and strict dogfood.
- Added maintainer guard documentation for release proof, SchemaStore freshness, small policy packs, and read-only GitHub metadata.

## 0.33.0

- Added `agentloop release-proof` to check post-release npm, GitHub Release, GHCR, and MCP Registry evidence without publishing, tagging, uploading, or reading tokens.
- Added release-proof documentation and generated harness guidance for post-release evidence collection.
- Changed public-doc hygiene to block fake adoption language, premature Pro/SaaS upgrade copy, and internal planning docs from public-doc scans.
- Added local GitHub metadata summaries to `review-context`, `prepare-pr`, and `maintainer-check` from `.agentloop/github/context.json`.
- Added organization policy-pack workflow examples for repo-local team review rules.
- Fixed imported GitHub metadata reading so normalized `bodyExcerpt` fields survive the import-to-review round trip.

## 0.32.1

- Changed release-status documentation to record verified `0.32.1` npm, GitHub release, GHCR, and MCP Registry proof.
- Added AgentLoop dogfood evidence for the `0.32.1` release gate and archived the completed release task.

## 0.32.0

- Added `agentloop schemastore` and `agentloop schemastore --json` for a ready-to-submit SchemaStore catalog entry without calling GitHub APIs or writing files.
- Added optional local policy-pack config plus `agentloop policy packs`, `agentloop policy pack show`, and `agentloop policy pack apply` for safe bundled and repo-local policy guidance.
- Added bundled `agentloop-baseline` and `maintainer-review` policy packs that copy missing policy files without overwriting existing repo policies.
- Added `agentloop github import` for explicit local issue and pull request JSON import into `.agentloop/github/context.json` without tokens, API calls, or env-file reads.
- Added docs for SchemaStore support, local GitHub metadata import, Windows package-manager design, and editor-extension validation gates.
- Changed `test:unit` to include the fast SchemaStore, policy-pack, GitHub metadata, roadmap-channel, and CLI docs drift checks.

## 0.31.0

- Added `agentloop upgrade-harness --details` and `--suggestions` for copyable current-loop guidance in older repos.
- Changed `agentloop doctor` to recommend `agentloop upgrade-harness --details` when generated guidance misses current review-readiness topics.
- Added `test:unit`, `test:integration`, `test:release`, and `release-flow` scripts so maintainers can use a faster dev loop while keeping the full release gate intact.
- Added `docs/upgrading-existing-repos.md` for safe older-repo upgrades.
- Expanded MCP client setup docs for Claude Code, Cursor, Gemini CLI, OpenCode, and Codex.
- Added a bugfix PR example and expanded the dependency-upgrade example around `create-task`, `verify`, `ship`, and `prepare-pr`.

## 0.30.0

- Added `agentloop upgrade-harness`, a read-only existing-repo upgrade audit with `--redact-paths` for stale generated guidance around `ship`, `prepare-pr`, run ledger, file intent, `review-context`, and maintainer checks.
- Added a faster `test:quick` maintainer script for focused local sanity checks while keeping the full Vitest suite as the release gate.
- Added the harness upgrade audit to the project self-check gate so stale generated guidance is caught before release prep.
- Changed getting-started, template migration, MCP, contributor, generated harness, and README guidance to promote the current `verify` -> `ship` -> `prepare-pr` -> `maintainer-check` review-readiness loop.
- Added dependency audit to the project self-check gate so dependency advisories are caught before release prep.

## 0.29.0

- Added run ledger entries to `agentloop artifacts`, including `--type run` and `--latest` support, so agents can discover local run evidence from the same inventory command.
- Added `agentloop release-check --redact-paths` so release-readiness output can be pasted into public issues, PRs, or CI logs without exposing the local Git root.
- Added `agentloop maintainer-check --redact-paths` so reviewer-readiness output uses the same public-log safety flag as doctor, status, gates, ship, and PR preparation.
- Added `agentloop doctor --redact-paths` for safe public sharing of setup, Git-root, and risk-file output while keeping default doctor JSON unchanged for scripts.
- Changed pnpm dependency resolution to use patched `esbuild@0.28.1` for release tooling and test/build dependencies.
- Changed `agentloop ship` report and GitHub-comment readiness lists to escape Markdown control characters in warning, blocker, and next-action prose.
- Changed `agentloop prepare-pr` to escape Markdown control characters in task-derived PR list prose and readiness comment lists.
- Changed dogfood JSON summaries to redact the current workspace root from step arguments, command text, and child-process error messages.
- Changed the dogfood gate to run `agentloop review-context --json --redact-paths`, matching the public-log safety behavior used by status and gates.
- Added public-docs hygiene coverage that keeps README `--redact-paths` guidance aligned with supported shareable CLI commands.
- Changed `agentloop review-context` to accept `--redact-paths`, matching the shareable-output behavior of status and gate snapshots.
- Changed `agentloop next` to accept `--redact-paths` in human and JSON output, matching the shareable-output behavior of `status`.
- Added public-docs hygiene coverage for stale root `FINAL_HANDOFF.md` current-release and install guidance, and refreshed the current handoff copy.
- Changed `agentloop verify --task-commands` to use the active task when `--task` is omitted, and to exit before running commands when no explicit or active task exists.
- Fixed generated handoff and ship report writes so repeated same-minute runs allocate suffixed Markdown artifact paths instead of overwriting earlier evidence.
- Changed git status collection to request individual untracked files, so new folders appear as file-level evidence in status, ship, handoff, run-ledger, and maintainer outputs.
- Fixed `agentloop status` and `agentloop next` next-action copy so covered handoff evidence uses correct grammar.
- Changed `agentloop status` and `agentloop next` so active tasks with passing verification and fresh handoff coverage recommend `agentloop task done` instead of asking for another handoff.
- Changed `agentloop maintainer-check` to warn when dirty files are not covered by the latest handoff or ship run, instead of accepting any older PR summary as current evidence.
- Fixed `agentloop ship` so its report and JSON output score the post-ship review-evidence state instead of showing a stale-handoff warning for evidence generated by the same command.
- Fixed `agentloop check-gates` so `agentloop ship` remains fresh handoff evidence when its run covers the current dirty files.
- Changed `agentloop check-gates` to warn when dirty files are not covered by the latest handoff run.
- Added JSON dogfood summaries through `npm run dogfood:json` and `npm run dogfood:strict:json` for agents and CI logs.
- Hardened post-verification gate detection so AgentLoop command words inside another shell command do not trigger noisy warnings.
- Broadened post-verification gate detection so `create-task` and `task doctor` warn when common AgentLoop review-readiness commands are listed as verification commands.
- Added `agentloop task doctor` diagnostics for task contracts that put likely post-verification gates under `Verification Commands`.
- Fixed `agentloop check-gates` so clean passing evidence reports no required next command instead of asking for another handoff.
- Added a human-readable `task done` next step that points users to handoff evidence before archival.
- Added the same handoff next-step guidance to successful human-readable bulk task archive output.
- Added a human-readable `task archive` next step that points maintainers to `agentloop handoff --write-run`.
- Fixed `agentloop handoff` so it can preserve archived completed task context from recent run evidence when no active task exists.
- Fixed `agentloop check-gates` next-action guidance so fresh handoff evidence no longer conflicts with `agentloop status`.
- Fixed `agentloop status` so a fresh handoff run does not keep recommending another handoff only because its own run folder is dirty.
- Added a read-only public docs hygiene check to `npm run dogfood` and `npm run dogfood:strict`, with a direct `npm run check:public-docs` script.
- Added `create-task` warnings when verification commands look like post-verification gates such as `dogfood:strict`, `check-gates --strict`, or `release-check --strict`.

## 0.28.7

- Added `agentloop release-notes --public` for concise release-page Markdown that omits local changed-file and AgentLoop evidence inventories.

## 0.28.6

- Changed `agentloop release-check` to warn when the latest generated release notes do not mention the local package version.

## 0.28.5

- Changed `agentloop release-check` next-action guidance to route maintainers through `agentloop npm-status` before publishing instead of recommending a direct npm publish command.
- Changed `agentloop check-gates --strict` so a clean Git tree with current task, verification, and handoff evidence passes instead of failing on the informational `No changed files detected` message.

## 0.28.4

- Added `agentloop verify --progress` for opt-in, bounded per-command progress output during long verification runs while keeping JSON output parseable.
- Added release-smoke coverage that catches stale `ROADMAP.md` current-release state before packing a release.
- Added built-CLI smoke coverage for `agentloop verify --progress`.
- Added `agentloop runs --latest` and `agentloop runs --limit <count>` for bounded local run-ledger navigation.
- Added built-CLI smoke coverage for bounded `agentloop runs` output.
- Added `agentloop create-task --include-config-commands` to copy configured `test`, `lint`, `typecheck`, and `build` commands into new task contracts without running them during creation.
- Added duplicate-command reporting to verification Markdown and JSON output when exact command strings are selected more than once.
- Changed verification command selection to run exact duplicate command strings once when configured commands and task contract commands overlap.
- Changed Vitest's bounded per-test timeout to 90 seconds so full release gates can run subprocess-heavy CLI integration tests reliably.
- Fixed run ledger summaries so archived task contracts hydrate latest-run task title, status, and path while stored run metadata remains unchanged on disk.
- Fixed `agentloop status` next-action guidance after archived task evidence so dirty shipped work points back to handoff/review instead of starting a new task.

## 0.28.3

- Fixed `agentloop ship` so archived latest-run task contracts still count as task evidence after normal task cleanup.
- Fixed `agentloop prepare-pr` so it keeps the archived task title, acceptance criteria, risk notes, and rollback notes after cleanup, and reuses fresh ship evidence instead of writing duplicate ship runs.

## 0.28.2

- Added `agentloop verify --task <path> --task-commands --only-task-commands` for focused task-contract verification without configured repo commands.
- Changed the README quickstart and verification docs to show explicit task paths when running task contract commands.

## 0.28.1

- Added `npm run dogfood` and `npm run dogfood:strict` as repeatable local self-check gates for AgentLoopKit development.
- Added official AgentLoopKit logo assets under `docs/logo/` and refreshed README launch screenshots to use the official mark.
- Changed README, contributor guidance, and agent guidance to document the dogfood gate without adding publish, tag, token, or verification side effects.
- Changed release status and release hygiene docs to keep public package state clear after `0.28.0`.
- Archived shipped internal task contracts and added release-smoke coverage that blocks stale planned-release guidance in public-facing harness docs.

## 0.28.0

- Added `agentloop ship`, a local review-readiness flow that writes a ship report, records a run ledger entry, and scores task clarity, scope control, verification evidence, evidence freshness, gates, handoff readiness, and risk flags without claiming to measure code quality.
- Added `agentloop ship --github-comment` to print compact review-readiness Markdown for CI-managed pull request comments without GitHub token handling inside the CLI.
- Added `agentloop prepare-pr` to generate PR title/body text and GitHub-comment Markdown from local AgentLoopKit evidence without reading GitHub tokens or posting comments.
- Added `.agentloop/runs/`, `agentloop runs`, `agentloop show-run`, and `agentloop intent <file>` for local run evidence and file-intent lookup.
- Added `agentloop verify --write-run`, `agentloop summarize --write-run`, and `agentloop handoff --write-run` so narrower evidence flows can opt into local run ledger records.
- Added `agentloop maintainer-check`, a read-only maintainer reviewability check for agent-assisted PRs.
- Added read-only MCP tools for the latest ship report and recent run ledger entries.
- Added read-only MCP `agentloop_show_run` for fetching one local run ledger entry by id.
- Added read-only MCP `agentloop_file_intent` for local run-ledger intent lookup by file path.
- Added read-only MCP `agentloop_maintainer_check` for local maintainer reviewability checks.
- Added read-only MCP `agentloop_policy_status` for local policy template status.
- Added read-only MCP `agentloop_check_gates` for local review gate status.
- Added read-only MCP `agentloop_artifacts` for local artifact inventory metadata.
- Added read-only MCP `agentloop_review_context` for one local reviewability snapshot that combines status, gates, policies, artifacts, recent runs, and latest ship evidence without artifact bodies.
- Added `agentloop review-context` and `agentloop review-context --json` for non-MCP agents that need the same read-only local reviewability snapshot.
- Changed README launch visuals and terminal demo to show the current review-readiness loop with task-aware verification, `ship`, `prepare-pr`, `review-context`, run history, and file intent lookup.
- Changed public JSON and human output for verification, handoff, ship, prepare-pr, and run paths to report repo-relative `.agentloop/...` paths instead of absolute local filesystem paths.
- Added `--redact-paths` to `agentloop status` and `agentloop check-gates` so public logs can hide the absolute Git root while default JSON remains script-compatible.
- Added `--redact-paths` to `agentloop ship` and `agentloop prepare-pr` so acceptance-layer output can hide the absolute Git root inside embedded gate evidence.
- Changed `agentloop status` Markdown, JSON, and brief output to include the newest local run ledger entry when `.agentloop/runs/` exists.
- Changed `agentloop prepare-pr` to reuse a matching fresh ship run instead of writing a duplicate run ledger entry.
- Added `shipEvidence.source` and `shipEvidence.runId` to `agentloop prepare-pr --json` output.
- Added `agentloop task done` as a shortcut for marking the active task, or an explicit task path, as `done`.
- Changed `agentloop prepare-pr` PR bodies to group changed files by review area.
- Changed `agentloop ship` reports/comments and `agentloop prepare-pr` PR-facing Markdown to render AgentLoop artifact paths repo-relative while keeping JSON path fields script-friendly and repo-relative.
- Changed `agentloop create-task` to set the newly created contract as the active task and include `activeTask` in JSON output.
- Changed `agentloop status` and `agentloop next` to recommend marking clean, verified `review` tasks as `done` before starting unrelated work.
- Changed `agentloop policy list/status` human output to render policy titles, statuses, and paths with Markdown-safe inline-code delimiters while keeping JSON output and raw `policy show` content unchanged.
- Changed run ledger reads and writes to reject run-id directories that resolve outside `.agentloop/runs/` through symlinks.
- Changed run ledger writes to keep same-minute same-command records by appending collision-safe numeric suffixes instead of overwriting the existing run.
- Changed run ledger reads and writes to return safe display paths for task, artifact, and changed-file metadata, collapsing AgentLoop artifacts to `.agentloop/...` and outside absolute paths to basenames. MCP run tools and `review-context` now inherit that behavior from the ledger reader.
- Fixed `agentloop prepare-pr` so PR bodies include every acceptance-criteria bullet from the task contract instead of only the first line.
- Changed release-note missing-ref fallback copy to render requested Git refs with Markdown-safe inline-code delimiters while preserving raw fallback reason data.
- Changed release notes to render commit subjects with Markdown-safe inline-code delimiters while preserving raw commit subjects in JSON output.
- Changed PR summaries and handoffs to render non-empty diff stats inside Markdown-safe text fences while keeping the no-diff fallback readable.
- Changed PR summaries and handoffs to render the top-level task context title with Markdown-safe inline-code delimiters while keeping verification status text parseable.
- Changed verification report top-level timestamp, repo, git branch, git commit, and working-tree values to render with Markdown-safe inline-code delimiters while keeping overall status parseable.
- Changed verification report task-context path, title, task type, and status values to render with Markdown-safe inline-code delimiters.
- Changed `agentloop npm-status` Markdown output to render registry error text as a single Markdown-safe inline-code value while preserving exact structured error data in JSON output.
- Changed CLI write-confirmation output for task creation, verification, handoffs, reports, badges, CI summaries, release notes, and agent installation to render generated paths, statuses, sources, messages, and counts with Markdown-safe inline-code delimiters.
- Changed `agentloop task` human output to render task titles, statuses, paths, lifecycle messages, and task-doctor diagnostics with Markdown-safe inline-code delimiters.
- Changed task-state CLI regression coverage to give aggregate subprocess-loop tests an explicit timeout budget, reducing false failures under full verification load.
- Changed `agentloop doctor` Markdown output to render check statuses, names, messages, path-like values, overall status, strict mode, and next-action text with Markdown-safe inline-code delimiters.
- Changed `agentloop release-check` Markdown output to render package labels, git metadata, check details, paths, status values, changed-file counts, and next-action commands with Markdown-safe inline-code delimiters.
- Changed `agentloop ci-summary` Markdown output to render generated timestamps, evidence titles, evidence paths, gate details, status values, and next-action commands with Markdown-safe inline-code delimiters.
- Changed `agentloop check-gates` Markdown output to render gate, git, path, status, and next-action command values with Markdown-safe inline-code delimiters.
- Changed `agentloop artifacts` Markdown output to render task, verification, handoff, HTML report, badge, CI summary, and release-note inventory values with Markdown-safe inline-code delimiters.
- Changed `agentloop status` and `agentloop next` Markdown output to render project, git, task, report, command, and working-tree values with Markdown-safe inline-code delimiters.
- Changed release notes to render package, version, range, branch, commit, and AgentLoop evidence values with Markdown-safe inline-code delimiters.
- Changed verification reports and CI summaries to render allowlisted CI metadata values with Markdown-safe inline-code delimiters.
- Refactored Markdown inline-code and code-fence formatting into a shared tested helper used by verification reports, PR summaries, and release notes.
- Changed npm status reports to render package and version labels with Markdown-safe inline-code delimiters when captured registry data contains backticks.
- Changed CLI subprocess regression tests to use a shared timeout budget so full-suite load does not create false timeout failures.
- Changed release notes to render changed-file and working-tree path labels with Markdown-safe inline-code delimiters when paths contain backticks.
- Changed PR summaries and handoffs to render changed-file paths with Markdown-safe inline-code delimiters when paths contain backticks.
- Changed verification report command labels to use Markdown-safe inline-code delimiters when command strings contain backticks.
- Changed verification reports to wrap command output in Markdown fences that are longer than any backtick run in the output, so logs containing ``` cannot break report structure.
- Added built-CLI smoke coverage for missing setup errors and nested working-directory flows across `status`, `create-task`, `verify`, `handoff`, `check-gates`, `policy`, and `install-agent`.
- Changed packed-release smoke checks to run child commands with an allowlisted environment instead of inheriting token-like variables from the parent shell.
- Changed `agentloop npm-status --registry-json` to reject `.env` and `.env.*` paths before reading captured registry output.
- Changed commands that require AgentLoop setup so missing `agentloop.config.json` is reported as a clear `CONFIG_ERROR` with an `agentloop init` hint instead of a raw filesystem error.
- Changed non-init repo commands to search upward for the nearest `agentloop.config.json` and run against that initialized root, so `status`, `create-task`, `verify`, `handoff`, and related commands work from nested source folders without writing nested `.agentloop/` directories.
- Added `agentloop doctor --strict` so CI or team setup gates can treat doctor warnings as failures.
- Added `agentloop status --brief` for compact task, verification, working-tree, and next-action output.
- Added `agentloop verify --timeout-ms <ms>` so stuck or watcher-style commands fail with clear timeout evidence instead of hanging indefinitely.
- Changed `agentloop init --local-only` to ask Git for the real metadata directory before writing `info/exclude`, so a fake or symlinked `.git` directory cannot redirect the local-only exclude write.
- Changed review gates, handoffs, release notes, and release checks to ignore stale verification reports that predate the active or newest open task unless the task is already in `review` or `done`.
- Changed `agentloop release-check` to warn when `CHANGELOG.md` still has pending `Unreleased` entries before recommending publish steps.
- Changed `agentloop npm-status` to validate package names before running npm and to clarify that npm may use normal npm configuration during live registry checks.
- Changed `agentloop release-notes` to reject option-shaped Git refs and pass selected refs after Git's `--end-of-options`.
- Changed the composite GitHub Action to run through a Node wrapper that validates inputs and uses argument arrays instead of shell interpolation for the AgentLoop command.
- Changed the MCP Registry publish workflow to download a pinned `mcp-publisher` release and verify its SHA-256 before OIDC authentication.
- Changed `agentloop doctor` risk-file scanning to use bounded traversal and report when large-repo scanning is truncated.
- Added `agentloop release-check`, a read-only local release readiness check for package metadata, changelog entries, release scripts, git state, verification evidence, handoff evidence, generated release notes, and npm package-safety basics.
- Added `agentloop artifacts --type <type>` and `agentloop artifacts --latest` for filtered local evidence inventories without reading artifact file contents.
- Added actionable `doctor` next steps in human and JSON output for stale harness metadata, missing verification commands, Git context issues, monorepo warnings, dirty working trees, and risk-file categories.
- Added a CLI docs drift test so the public command surface stays aligned across CLI help, README, CLI reference, and shell completions.
- Changed the composite GitHub Action to support `install-mode: npm` and `install-mode: local`, install in the configured working directory, and avoid package-lock rewrites in npm mode.
- Added an end-to-end workflow example that walks through init, doctor, task creation, verification, handoff, gates, artifact inventory, and release readiness.
- Added `agentloop artifacts` and `agentloop artifacts --json`, a read-only local evidence inventory for task counts, latest verification report, latest handoff, HTML reports, badges, CI summaries, and release notes.
- Added a cross-platform CLI smoke workflow for Ubuntu, macOS, and Windows that builds the package and exercises the built CLI in a temporary repository.
- Simplified the npm-facing README and moved detailed command behavior into `docs/cli-reference.md`.
- Improved generated first-run guidance with a risk-aware task contract example, task-linked verification command, and read-only artifact inventory hints.
- Added a VS Code/Open VSX extension design that defers implementation until a thin CLI-wrapper extension has clear demand.
- Added repeatable `agentloop create-task --risk` and `--risk-note` flags for non-interactive Risk Notes.
- Changed `agentloop check-gates` so required root, harness, and policy files only satisfy review gates when their resolved path stays inside the current repo; unsafe symlinked files are treated as missing.
- Changed read-only artifact discovery so task lists, status, gates, handoff fallbacks, HTML reports, badges, CI summaries, release notes, MCP tools, and policy reads ignore configured task, report, handoff, or policy roots that resolve outside the current repo through symlinks.
- Simplified public release and launch docs around the current trusted-publishing flow, and added packed-release smoke coverage that rejects unsupported install-channel claims or maintainer-only release chatter in normal public docs.
- Added packed-release smoke coverage for symlinked init harness targets and symlinked task archive destinations.
- Changed `agentloop task archive` so the archive destination must resolve inside the configured task directory. With `--json`, unsafe symlinked archive directories return `OUTPUT_PATH_INVALID` before moving the task file.
- Changed `.agentloop/state.json` handling so task active-state reads ignore unsafe symlinked state paths, while `task set --json` and `task clear --json` return `OUTPUT_PATH_INVALID` before writing or removing state outside the current repo.
- Changed `agentloop init` so generated harness targets must resolve inside the current repo before any init files are written. With `--json`, unsafe symlinked `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, or config targets return `OUTPUT_PATH_INVALID`.
- Changed `agentloop install-agent` so `.agentloop/agents/*.md` and `AGENTS.md` must resolve inside the current repo before the command reads or writes them. With `--json`, unsafe symlinked targets now return `OUTPUT_PATH_INVALID` and no agent files are written.
- Changed generated artifact writes so configured task, report, and handoff roots must resolve inside the current repo even when those directories already exist as symlinks. `verify --json`, `handoff --json`, `report --json`, `badge --json`, `ci-summary --json --write`, and `release-notes --json --write` now return `OUTPUT_PATH_INVALID` before writing outside the repo.
- Changed `agentloop.config.json` validation so configured AgentLoopKit paths must be non-empty repo-relative paths, rejecting absolute paths, Windows drive-qualified paths, parent traversal, and null bytes before artifact commands read or write configured locations.
- Changed task artifact path validation to resolve existing symlinked ancestors before writing or reading task files, so `agentloop create-task --out <path>` and explicit task paths such as `agentloop verify --task <path>` cannot be redirected outside the configured task directory.
- Changed task lifecycle path validation to resolve existing symlinked ancestors before reading, pinning, updating, or archiving task contracts, so `agentloop task show`, `set`, `status`, and `archive` cannot operate on files outside the configured task directory through symlinked task paths.
- Changed `agentloop check-gates` so task-hygiene warnings recommend `agentloop task doctor` after required task, verification, and handoff evidence exists.
- Added a `task-hygiene` warning gate to `agentloop check-gates` so review gates surface `agentloop task doctor` diagnostics without mutating task files.
- Added CLI regression coverage for invalid explicit artifact output extensions on `agentloop report`, `agentloop badge`, `agentloop ci-summary --write`, and `agentloop release-notes --write`.
- Changed explicit output paths for `agentloop report`, `agentloop badge`, `agentloop ci-summary --write`, and `agentloop release-notes --write` so generated artifacts must stay inside their configured AgentLoop artifact directories, with `OUTPUT_PATH_INVALID` JSON errors for invalid paths.
- Changed `agentloop ci-summary --out <path>` and `agentloop release-notes --out <path>` to fail fast unless `--write` is also passed, with `OUT_REQUIRES_WRITE` JSON errors for automation.
- Added Baseframe Labs author metadata to the npm package and README.
- Changed `agentloop status` and `agentloop next` so unpinned open task contracts appear as `latestTask`, not `activeTask`, and the next action asks users to pin the task with `agentloop task set <path>`.
- Added `deferred` as a supported task status for parked work that stays visible in `task list`, `status`, and `next`, while staying out of fallback task selection.
- Added `deferredTasks` to `agentloop status --json` and `agentloop next --json`, plus Markdown output that shows parked deferred tasks separately from active work.
- Added `agentloop npm-status --agentloopkit` so maintainers can check the published AgentLoopKit package from release smoke directories without reading the current folder package name.
- Updated release-smoke helper tests so static analysis can see the helper usage and `projscan doctor` reports a clean health check.
- Added target directory, detected project, and configured command context to `agentloop init` and `agentloop init --dry-run --json`.
- Added non-blocking Git detection to `agentloop init` human and JSON output.
- Added Git root and target-is-root context to `agentloop init` human and JSON output.
- Added a human warning when `agentloop init` targets a Git repository subdirectory.
- Added JSON error output for `agentloop init --local-only --json` setup failures when the target is not a Git repository.
- Added Git root and target-is-root context to `agentloop doctor` human and JSON output.
- Added Git root and target-is-root context to `agentloop status` human and JSON output.
- Added Git root and target-is-root context to `agentloop check-gates` human and JSON output.
- Added `test-generation` as a supported `create-task --type` value and documented the supported task type list.
- Changed `create-task --type <value>` to fail fast on unsupported types instead of entering the interactive picker.
- Added supported task type values to `agentloop create-task --help`.
- Added JSON error output for unsupported `agentloop create-task --type` values when `--json` is requested.
- Added `create-task --type` values to generated bash, zsh, fish, and PowerShell completion scripts.
- Added `agentloop list-templates --json` for machine-readable bundled template discovery.
- Added `agentloop version --json` for machine-readable version checks.
- Added `agentloop install-agent <agent> --json` and `agentloop install-agent all --json` for machine-readable agent setup results.
- Added JSON error output for unsupported `agentloop install-agent <agent>` values when `--json` is requested.
- Added JSON error output for unsupported `agentloop task status <path> <status>` values when `--json` is requested.
- Added JSON error output for unsupported `agentloop badge --source <source>` values when `--json` is requested.
- Added JSON error output for missing `agentloop policy show <policy>` names when `--json` is requested.
- Added JSON error output for missing `.agentloop/policies/` directories on `agentloop policy` subcommands when `--json` is requested.
- Added JSON error output for invalid task paths on `agentloop task show`, `set`, `status`, and `archive` when `--json` is requested.
- Added JSON error output for invalid `agentloop create-task --out <path>` values when `--json` is requested.
- Added JSON error output for invalid explicit artifact paths on `agentloop summarize`, `handoff`, and `report` when `--json` is requested.
- Added JSON error output for missing or malformed `agentloop npm-status --registry-json` files when `--json` is requested.
- Added JSON error output for invalid `agentloop npm-status --timeout-ms` values when `--json` is requested.
- Added JSON error output for invalid `agentloop verify --task` paths when `--json` is requested.
- Added JSON error output for invalid config on `agentloop status`, `next`, and `check-gates` when `--json` is requested.
- Added JSON error output for invalid config on `agentloop verify`, `summarize`, `handoff`, `report`, `badge`, `ci-summary`, and `release-notes` when `--json` is requested.
- Added JSON error output for invalid config on `agentloop create-task`, `task`, and `policy` commands when `--json` is requested.
- Changed malformed `agentloop.config.json` parsing failures to return `CONFIG_ERROR`, matching schema-invalid config behavior.
- Added unsupported-format validation for `agentloop summarize` and `agentloop handoff`, with JSON errors when `--json` is requested.
- Added `--verification <path>` as an alias for `--report <path>` on `agentloop summarize` and `agentloop handoff`.
- Added `--verification <path>` as an alias for `--report <path>` on `agentloop report`.
- Changed the composite GitHub Action default `agentloopkit-version` to `latest`; workflows can still pin `<version>` for reproducibility.
- Added GitHub Action guidance warning maintainers not to pass untrusted pull request or user input to the composite action `command`.
- Changed the composite GitHub Action install step to pass `agentloopkit-version` through an environment variable instead of direct shell interpolation.
- Documented the maintainer rule to accumulate active development for the planned `0.28.0` batch instead of cutting a release for every small improvement.
- Changed `npm run smoke:release` so the packed README may stay unpinned while stale exact version pins are still rejected.
- Added `agentloop verify --task-commands` to explicitly run commands listed in a task contract's `Verification Commands` section.
- Added a verification report note when `--task-commands` is requested but no runnable task commands are found.
- Added `taskCommands.requested` and `taskCommands.foundCount` to `agentloop verify --json`.
- Added `taskCommands.commands` to `agentloop verify --task-commands --json` so automation can inspect selected task-defined commands without parsing Markdown.
- Added Vitest coverage that rejects hardcoded AgentLoopKit version pins in normal public docs and examples while allowing release-history evidence files.
- Replaced stale current-version pins in user-facing README, MCP, distribution, CI docs, and examples with `@latest` or `<version>` placeholders.
- Added regression coverage for missing Git executable behavior in local Git helpers and `agentloop init`.
- Removed internal product-panel notes from the public distribution-channel guide, archived completed trusted-publishing evidence, and cleared stale proposed task contracts from the active task folder.
- Archived the remaining completed and legacy AgentLoopKit task contracts so `agentloop task doctor` reports a clean active task folder.

## 0.27.0

Minor release for task-folder hygiene diagnostics:

- Added `agentloop task doctor`, a read-only task folder hygiene check for missing, legacy, unsupported, and terminal task statuses.
- Added `task doctor` to shell completions, README usage, task docs, generated harness guidance, and bundled agent instructions.

## 0.26.5

Patch release for terminal task fallback cleanup:

- Fixed fallback task selection so `status`, `next`, gates, handoffs, HTML reports, CI summaries, and release notes ignore unpinned terminal tasks marked `done`, `completed`, or `verified`.
- Kept explicitly pinned `done` tasks visible so `status` and `next` recommend `agentloop task archive <path>`.

## 0.26.4

Patch release for SchemaStore editor discovery:

- Registered `agentloop.config.json` in SchemaStore for editor auto-discovery: <https://github.com/SchemaStore/schemastore/pull/5783>.
- Added the SchemaStore note to the npm-facing README and release-channel docs.

## 0.26.3

Patch release for status cleanup guidance:

- Updated `agentloop status` and `agentloop next` to recommend `agentloop task archive <path>` when the pinned active task is already `done`.

## 0.26.2

Patch release for release-channel cleanup and agent guidance:

- Added a specialist agent roster to generated `AGENTS.md` and this repository's own `AGENTS.md`, with roles for product, CLI, templates, verification, security, release, docs, compatibility, MCP, and repo stewardship.
- Documented the generated roster in the README and added init coverage so future template changes keep it in place.
- Removed the temporary Homebrew tap/formula channel from release docs and distribution tests. npm/npx remains the primary install path.

## 0.26.1

Patch release for MCP Registry metadata validation:

- Shortened the MCP Registry server description to satisfy the registry's 100-character limit
- Updated 0.26.x docs and install examples to point at `agentloopkit@0.26.1`
- Kept `agentloop mcp-server` read-only with no command execution, file mutation, telemetry, external API calls, or `.env` content reads

## 0.26.0

Minor release for MCP and distribution channels:

- Added `agentloop mcp-server`, a read-only MCP stdio server for local AgentLoopKit status, tasks, policies, verification reports, and handoffs
- Added MCP Registry metadata through `server.json` and `package.json` `mcpName`
- Added a post-npm MCP Registry publish workflow that uses GitHub OIDC and verifies the npm package version before publishing metadata
- Added a root GitHub Action wrapper for running AgentLoopKit commands in CI
- Added a Dockerfile and GHCR release workflow for a minimal `agentloop` container image
- Added a Homebrew formula template under `packaging/homebrew/`
- Added docs for MCP usage, distribution channels, GitHub Action usage, Docker/GHCR, and Homebrew publishing
- Added Vitest coverage for MCP tool behavior, MCP stdio startup, and distribution artifacts

## 0.25.0

Minor release for local-only AgentLoopKit harnesses:

- Added `agentloop init --local-only` for developers who want AgentLoopKit guidance in a repo without committing generated harness files
- Local-only mode writes a marked block to this clone's `.git/info/exclude` for `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json`
- Generated `AGENTS.md` and `AGENTLOOP.md` include a local-only notice so agents know not to commit the local harness
- Added dry-run, idempotence, non-Git folder, and packed-package smoke coverage for local-only initialization
- Documented local-only setup in README and getting-started docs

## 0.24.5

Patch release for release safety and README demo polish:

- Added `npm run smoke:release` for local packed-package release checks
- The release smoke script builds, packs, runs the packed binary, checks safety guards, and verifies packaged README pins without publishing
- Refreshed the README VHS terminal demo around the first-run loop, verification evidence, handoff, gates, local report, and badge output

## 0.24.4

Patch release for npm README pin freshness:

- Updated README pinned-version examples from `0.24.2` to the current package line
- Kept this release docs-only with no CLI behavior changes

## 0.24.3

Patch release for task-path safety:

- Restricted `agentloop verify --task` to Markdown task contracts inside the configured task directory
- Restricted `agentloop create-task --out` to Markdown files inside the configured task directory
- Refused `agentloop init --dry-run` in the user's home directory unless `--force` is passed, preventing accidental home-directory project detection
- Added regression coverage for task path reads, task output writes, and home-directory dry-run safety

## 0.24.2

Patch release for safer first-run initialization:

- Bounded fallback project detection so `agentloop init --dry-run` returns quickly in large metadata-free directories such as a home folder
- Added a home-directory guard so `agentloop init` refuses to write AgentLoopKit files into the user's home directory unless `--force` is passed
- Added `agentloop init --force` for the rare case where a user intentionally wants to initialize the current home directory
- Added regression coverage for bounded fallback detection and home-directory init safety
- Clarified README and getting-started docs to run `init` from the target repository root

## 0.24.1

Patch release for first-run project detection:

- Fixed `agentloop init` crashing when project detection encounters unreadable directories such as macOS `.Trash`
- Changed recursive project file discovery to skip directories it cannot read instead of aborting the command
- Added regression coverage for unreadable directories during project detection

## 0.24.0

npm-status release. This is the normal next minor release after `v0.23.0`; npm later caught up to the current release line after maintainer authentication and trusted publishing were configured:

- Added `agentloop npm-status` for read-only npm registry catch-up checks
- Added `agentloop npm-status --json` for release scripts and handoff evidence
- Added `agentloop npm-status --expect-current` for post-publish smoke checks that fail until npm latest matches local package metadata
- Added `agentloop npm-status --registry-json <path>` so CI and release handoffs can replay captured `npm view` output without a network call
- Compared local `package.json` metadata with `npm view <package> version versions --json` output
- Documented npm-status usage across README, publishing docs, release-status docs, release notes, generated harness guidance, and AgentLoopKit's own repo harness
- Kept the command read-only: no package publishing, tag creation, GitHub release creation, token reads, `.env` reads, uploads, or package metadata mutation

## 0.23.0

PowerShell completion release candidate. npm still serves `0.1.1` until account authentication or trusted publishing is repaired. This is the normal next minor release after `v0.22.0`; after npm catches up to the current release line, future releases should use ordinary sequential semver:

- Added `agentloop completion powershell` to print a static PowerShell `Register-ArgumentCompleter` script
- Added `agentloop completion pwsh` as an alias for PowerShell users
- Included top-level commands, task subcommands, policy subcommands, task statuses, agent names, and shell names in PowerShell completion output
- Kept completion generation stdout-only with no shell profile mutation, telemetry, network calls, or runtime dependency
- Updated README and getting-started docs so shell-completion guidance includes PowerShell

## 0.22.0

Task-linked verification and README evidence release candidate. npm still serves `0.1.1` until account authentication or trusted publishing is repaired. This is the normal next minor release after `v0.21.0`; after npm catches up to the current release line, future releases should use ordinary sequential semver:

- Added a `Failure Summary` section to failed verification reports with failed command, exit code, and final useful output lines
- Kept full command output excerpts in verification reports; the new summary does not diagnose root cause or parse tool-specific logs
- Added task context to verification reports generated with `agentloop verify --task <path>`
- Guarded `agentloop verify --task` so `.env`-style paths are reported as unavailable instead of read as task contracts
- Refreshed README Playwright screenshots and VHS terminal demo around task-linked verification evidence

## 0.21.0

Next-action and release-safety release candidate. npm still serves `0.1.1` until account authentication or trusted publishing is repaired. This is the normal next minor release after `v0.20.0`; after npm catches up to the current release line, future releases should use ordinary sequential semver:

- Added `agentloop next` for a read-only next-action view backed by the existing status engine
- Added `agentloop next --json` for agents and scripts that need the next command, reason, active task, latest verification report, and dirty-state context
- Updated status and next-action logic so a verification report older than an active in-progress task no longer counts as current task evidence
- Added a prepublish metadata guard that fails while `CHANGELOG.md` has unreleased entries
- Added `agentloop release-notes --release-version <version>` so release drafts can override package metadata without colliding with the CLI's global `--version` flag
- Documented that `next` does not run verification commands, mutate task state, call an LLM, make network requests, or read `.env` contents

## 0.20.0

Release-note handoff release candidate. npm still serves `0.1.1` until account authentication or trusted publishing is repaired. Because GitHub releases already exist from `v0.2.0` through `v0.19.0`, npm should catch up to this current release line once and then return to normal sequential semver:

- Added `agentloop release-notes` for deterministic local release-note drafts
- Added `agentloop release-notes --json` for scripts and CI logs
- Added `agentloop release-notes --write` to write `.agentloop/handoffs/YYYY-MM-DD-HH-mm-release-notes.md`
- Included package metadata, git range, changelog section, commits, changed files, working tree status, active task, latest verification report, and latest CI summary when available
- Kept release-note generation local and read-only unless `--write` is passed: no tag creation, package publishing, provider API calls, token reads, uploads, or changelog rewrites
- Documented the npm catch-up policy so the version jump from `0.1.1` to the current GitHub line is a one-time recovery path, not the ongoing release strategy
- Recorded the release-triggered `v0.20.0` Publish workflow failure at npm authorization

## 0.19.0

CI summary and contributor-onboarding GitHub release. npm publish is pending account authentication or trusted-publishing repair. npm may jump from `0.1.1` to this current release because the intermediate versions were GitHub/source release candidates while npm publishing was blocked:

- Added `docs/contributor-playbook.md` with copyable good-first issue examples and contributor verification expectations
- Linked contributor playbook guidance from README and `CONTRIBUTING.md`
- Added `agentloop ci-summary` for local CI provenance and AgentLoop evidence summaries
- Added `agentloop ci-summary --json` for scripts and CI logs
- Added `agentloop ci-summary --write` to write `.agentloop/reports/YYYY-MM-DD-HH-mm-ci-summary.md`
- Kept CI summaries read-only unless `--write` is passed: no provider API calls, secret reads, telemetry, uploads, or verification command execution
- Updated verification-report lookup so status, summaries, gates, reports, and badges ignore newer CI summary artifacts
- Recorded the release-triggered `v0.19.0` Publish workflow failure at npm authorization

## 0.18.1

Policy customization guidance patch release candidate. GitHub release `v0.18.1` is public; npm publish is pending account authentication or trusted-publishing repair:

- Added policy customization workflow docs and generated harness guidance for `policy status` results
- Added status-specific maintainer actions for `current`, `modified`, `missing`, and `extra` policy files
- Clarified that local policy files are repo guidance and bundled templates are comparison material
- Updated generated AGENTS, AGENTLOOP, workspace README, harness commands, and review checklist guidance

## 0.18.0

Policy template status release candidate. GitHub release `v0.18.0` is public; npm publish is pending account authentication or trusted-publishing repair:

- Added `agentloop policy status` for read-only local policy template comparison
- Added `agentloop policy status --json` with deterministic `current`, `modified`, `missing`, and `extra` entries
- Added shell completion coverage for the new policy subcommand
- Documented policy status as template drift visibility, not compliance enforcement
- Recorded the release-triggered `v0.18.0` Publish workflow failure at npm authorization
- Recorded the local exact-tarball `0.18.0` npm publish attempt that failed with authorization `E404`

## 0.17.0

Policy inspection and template-provenance release candidate. npm publish is pending browser/OTP authentication or trusted-publishing repair:

- Added `.agentloop/manifest.json` during init to record generated template provenance
- Added `agentloop doctor` template manifest checks for current, missing, stale, invalid, and newer generated harness metadata
- Added manual template migration guidance without changing config validation or overwriting edited harness files
- Added `agentloop policy list` and `agentloop policy show <policy>` for read-only local safety policy inspection
- Added JSON output for policy listing and policy reads

## 0.16.0

Local evidence badge and reviewer-artifact release. This is the npm catch-up release after GitHub-only release candidates from `0.2.0` through `0.15.1`:

- Added deterministic PR summary change-area classification for source, tests, docs, CI, config, AgentLoop, risk-sensitive, and uncategorized paths
- Added path-based review-focus hints to PR summaries without LLM calls or file-content inspection
- Added `agentloop report` for local static HTML evidence reports built from task, verification, handoff, git, and deterministic summary artifacts
- Kept `agentloop report --json` compact by returning the output path, metadata, and source paths without embedding the full HTML body
- Made `agentloop report` ignore bundled handoff templates when looking for the latest generated handoff
- Added `agentloop badge` for local SVG evidence badges built from verification or gate status

## 0.15.1

Trust-polish GitHub patch release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added category-level `agentloop doctor` risk-file warnings with capped path examples
- Kept risk-file findings warning-only and path-only
- Reduced noisy risk-file false positives from Markdown docs and templates
- Replaced the unproven custom config schema URL with the GitHub raw schema URL
- Clarified that CLI config validation is local and does not fetch the schema URL at runtime
- Updated README, configuration docs, product-panel records, and release handoff notes

## 0.15.0

CI-context GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added allowlisted GitHub Actions context to `agentloop verify` reports
- Added a generic `CI=true` fallback for verification reports outside GitHub Actions
- Kept local verification reports quiet when CI is not detected
- Added tests for GitHub Actions metadata, generic CI metadata, local omission, and CI-env test isolation
- Updated README, verification docs, GitHub Actions docs, examples, generated harness guidance, product-panel records, and release handoff notes

## 0.14.0

check-gates strict-mode GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop check-gates --strict` so CI can treat warning gates as failures
- Kept default `agentloop check-gates` warning behavior unchanged for local use
- Added `strict` to `check-gates --json` output
- Added strict-mode text to generated gate-check reports
- Added Vitest coverage for default warning behavior and strict warning failure
- Updated README, getting-started docs, gate-check docs, generated harness guidance, and README visual sources

## 0.13.0

check-gates GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop check-gates` to check review-evidence readiness without running tests
- Added `agentloop check-gates --json` for deterministic agent and CI usage
- Checks task contract, verification report, handoff summary, repo harness, safety policies, and git context
- Added Vitest coverage for ready and missing-evidence paths
- Updated README, getting-started docs, gate-check docs, generated harness guidance, shell completions, agent templates, and README visual assets

## 0.12.0

create-task JSON output GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop create-task --json` for machine-readable task creation
- JSON output includes the created task path and Markdown content
- Default human-readable `create-task` output remains unchanged
- Added Vitest coverage for JSON task creation output
- Updated README, getting-started docs, task-contract docs, generated task guidance, and README visual assets for the current task lifecycle

## 0.11.0

Task archive GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task archive <path>` to move one named task contract into `.agentloop/tasks/archive/`
- Archive refuses to overwrite an existing archived task file
- Archiving the active task clears the active task pointer
- Normal `agentloop task list` output excludes archived task contracts
- Updated README, getting-started docs, task docs, generated harness guidance, shell completions, and README visual assets for the archive workflow

## 0.10.0

Shell completions GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop completion <bash|zsh|fish>` to print shell completion scripts
- Added static bash, zsh, and fish completion output with no shell profile mutation
- Completion scripts cover top-level commands, task subcommands, task status values, install-agent names, and supported shell names
- Added Vitest coverage for completion rendering and unsupported shell errors
- Updated README, getting-started docs, and README visual assets for the shell-completion workflow

## 0.9.0

Task status transitions GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task status <path> <status>` to update a task contract's `- Status:` line
- Added JSON output for status updates
- Added a fixed status set: `proposed`, `in-progress`, `blocked`, `review`, and `done`
- Updated generated AGENTS, AGENTLOOP, harness, task, and agent templates with task-status guidance
- Refreshed README screenshots and VHS terminal demo to show the task lifecycle command

## 0.8.0

Launch-quality monorepo guidance and docs trust GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added generated monorepo verification guidance to `.agentloop/harness/commands.md`, `.agentloop/README.md`, and `.agentloop/tasks/README.md`
- Updated docs to explain root checks versus package-level checks without claiming workspace orchestration support
- Updated the `doctor` monorepo warning with package-specific verification command examples
- Added a local Markdown link checker with tests, `pnpm check:links`, and CI coverage

## 0.7.0

Monorepo doctor awareness GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added monorepo marker detection to `agentloop doctor` for package workspaces, `pnpm-workspace.yaml`, Turbo, Nx, Lerna, and Rush config files
- `doctor` now reports detected workspace markers as warnings without changing project type or failing setup

## 0.6.0

Task reading GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task show <path>` and `agentloop task show <path> --json` to read a selected task contract without changing active state
- Updated docs and generated agent templates to use the `task list`, `task show`, `task set` sequence

## 0.5.0

Task discovery GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task list` and `agentloop task list --json` to inspect task contracts before pinning one
- Updated agent and harness templates to guide agents toward task discovery before active-task selection

## 0.4.0

Active task lifecycle GitHub release candidate. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop task set <path>` to pin the active task contract
- Added `agentloop task current` and `agentloop task clear`
- Added `.agentloop/state.json` as a transparent repo-local active task pointer
- Updated `agentloop status` and deterministic handoffs to prefer the pinned active task before falling back to newest task file

## 0.3.0

Handoff command GitHub release. npm publish is pending trusted-publishing or local-auth repair:

- Added `agentloop handoff` as the clearer command for writing reviewer handoffs
- Kept `agentloop summarize` read-only unless `--write` is passed
- Updated `agentloop status` to suggest `agentloop handoff` when task and verification evidence exist
- Fixed repeated non-interactive `create-task` flags so all values are preserved
- Added `create-task --likely-file` and `--forbidden-file` for non-interactive task scoping
- Added `create-task` aliases for full task-contract fields: `--problem-statement`, `--desired-outcome`, `--assumption`, `--verification`, and `--rollback`
- Updated latest task/report detection to prefer newest modified Markdown files instead of filename order
- Updated first-run docs, generated workspace README guidance, and PR summary docs

## 0.2.1

Review-safety GitHub release. npm publish is pending trusted-publishing or local-auth repair:

- Verification reports now preserve the beginning and ending output when a command log is truncated
- Truncated command output includes a clear marker with the original output length
- `agentloop status` now points back to `agentloop verify` when the latest verification report failed
- Added release recovery docs for the `v0.2.0` GitHub/npm split
- Added GitHub contributor labels and good-first-issue guidance

## 0.2.0

Status command:

- Added `agentloop status` for active task, latest verification report, dirty files, configured commands, and next action
- Added `agentloop status --json` for machine-readable automation
- Fixed `agentloop version` and `agentloop --version` to read from `package.json`
- Added Vitest coverage for status and version behavior

## 0.1.1

README and release polish:

- Added README hero and verification screenshots rendered with Playwright
- Added a VHS terminal demo for the published npm CLI
- Updated README publishing status now that `agentloopkit` is live on npm
- Added a publish workflow guard that skips npm publish when the package version already exists
- Updated launch checklist and final handoff status

## 0.1.0

Initial MVP:

- TypeScript Node CLI
- `init`, `doctor`, `create-task`, `verify`, `summarize`, `install-agent`, `list-templates`, and `version`
- AgentLoopKit templates for loops, gates, policies, handoffs, agents, tasks, and harness files
- Deterministic verification reports and PR summaries
- Vitest coverage for core behavior
- GitHub Actions CI

Follow-up launch polish:

- Added `agentloop init --dry-run`
- Added `schema/agentloop.config.schema.json`
- Included the schema in npm package contents
- Added GitHub Actions workflow for npm trusted publishing
- Added generated `.agentloop/README.md`
- Added `agentloop install-agent all`
- Added internal product panel, personas, simulated review cycles, backlog, dogfood log, and final handoff
- Added launch checklist
