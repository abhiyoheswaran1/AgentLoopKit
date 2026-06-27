# Decisions

## 2026-06-26: Baseframe Suite Uses Local Versioned JSON Boundaries

AgentLoopKit needs to participate in the Baseframe Suite workflow without merging product internals. The integration boundary is local JSON under `.baseframe/`: ProjScan writes `projscan-assessment.json`, AgentLoopKit writes `agentloopkit-task.json`, and AgentFlight writes `agentflight-result.json`.

`create-task --from-projscan` validates the ProjScan v1 artifact, creates or updates the native AgentLoopKit task through the existing task contract generator, derives the machine-readable task contract from the same normalized input, and updates only AgentLoopKit's workflow-manifest section plus timestamps. If humans have not supplied acceptance criteria, the contract remains draft with an explicit unknown criterion.

`check-gates --task <id> --from-agentflight <path>` is a read-side reconciliation path. It matches AgentFlight verification commands against AgentLoopKit gates, surfaces missing, failed, incomplete, proof-gap, and scope-drift evidence, and updates the JSON task contract without marking the native task complete. Standalone AgentLoopKit commands still work without ProjScan or AgentFlight, and no dependencies, versions, tags, publish flows, or external service calls changed.

## 2026-06-24: Harness Readiness Requires Start And Source Handles

Existing repos can keep generated guidance that mentions review-readiness commands but does not tell software agents how to start from the current repo truth. `upgrade-harness` should audit that gap instead of adding another setup command.

Harness guidance now has an `agent-start` topic. The topic is present only when a generated guidance file mentions both `agentloop start` and `agentloop context show`, so a repo does not look current when agents can run the preflight but cannot expand source truth. `doctor` reuses the same audit and names the missing category as agent-readiness guidance.

Generated templates move to template version 2. Existing repos still get a read-only path: run `agentloop upgrade-harness --details`, copy the relevant Start/Context snippet, and keep local edits under maintainer control.

## 2026-06-24: Start And Context Use Current-Work Task Evidence

`agentloop start` and `agentloop context` should brief the next agent session from current work, not from archived release or handoff evidence. Review surfaces can still use archived run task evidence, but the agent entry point needs a stricter task rule.

Start and Context now accept only active or open real task contracts for `task:active` handles. Archived, terminal, deferred, and AgentFlight placeholder tasks stay as previous evidence. If a repo has only previous evidence, Start reports `needs-task`, omits the `task:active` handle, and routes agents away from `agentloop ship`.

The boundary stays read-only and local: no verification commands run, no changed file contents are read, no `.env` contents are read, no provider traffic is intercepted, no external services are called, no task state is mutated, no releases are prepared, and no package versions or tags change.

## 2026-06-23: Start Preflight Gets Decisive States And Impact Summary

`agentloop start` should show the repo's current truth before a software agent reads broadly. The command now exposes a sharper preflight model with states such as `ready-to-continue`, `needs-task`, `needs-verification`, `scope-drift`, `review-ready`, `blocked-by-risk`, and `evidence-only`.

The output puts the active task and next safe command before read-first handles, then shows do-not-broad-scan guidance, risk summary, impact summary, source handles, and the safety boundary. JSON and MCP payloads add `preflight`, `riskSummary`, and `impact.summary` so agent clients can consume the same model without parsing prose.

The boundary stays local and deterministic: Start still does not run verification, read changed file contents, read `.env` contents, call an LLM, intercept prompts, proxy provider traffic, upload files, post comments, publish packages, create tags, change versions, or mutate task state. Context estimates remain transparent character-count planning estimates, not provider tokenizer output or billing claims.

## 2026-06-23: Start Briefings Become The Agent Entry Point

AgentLoopKit should give software agents one local command to run before broad repo reads. `agentloop start` now composes the existing Context Contract, Evidence Map, verification freshness, run ledger, and context-budget estimates into a compact briefing with read-first source handles, risk warnings, do-not-broad-scan guidance, an impact ledger, and the next command.

The Context Contract remains the lower-level evidence surface. `agentloop context pack` keeps the full receipt, omission list, and source-handle contract; `agentloop context show <handle>` expands source truth. `agentloop start` routes agents to the right handles for goals such as implement, review, debug, handoff, and research.

The boundary stays local and deterministic: `start` does not run verification, read changed file contents, read `.env` contents, call an LLM, intercept prompts, proxy provider traffic, upload files, post comments, publish packages, create tags, change versions, or mutate task state. Impact metrics use the existing transparent character-count heuristic. They are planning estimates, not provider tokenizer output or billing claims.

## 2026-06-21: Guard Adds Local Drift And Context-Budget Control

AgentLoopKit should help maintainers catch scope drift, stale verification, proof debt, and wasteful continuation context while work is still in progress. Token economy is part of the product value, but it should be implemented as transparent repo-aware context selection rather than hidden prompt rewriting or provider proxying.

`agentloop guard` now builds on the Evidence Map to report `pass`, `warn`, or `fail`, with `--strict` available for local scripts and CI gates. It supports bounded `--watch` snapshots, explicit Markdown reports under `.agentloop/reports`, and explicit JSON baselines under `.agentloop/guard` so inherited dirty work can be separated from new drift. Guard, Resume Pack, and Review Context share context-budget estimates and compact continuation guidance. Context-budget pressure remains advisory so token-economy guidance does not block otherwise reviewable work.

The boundary is explicit: context-budget values are character-count estimates for planning, not provider tokenizer output or billing claims. Guard is read-only by default and does not run verification, read changed file contents, read `.env` contents, call external APIs, intercept prompts, proxy provider traffic, post comments, publish packages, create tags, bump versions, or mutate task/Git state. No dependencies, release workflows, package metadata, tags, or publishing behavior changed.

## 2026-06-21: Evidence Map Explains Agent-Assisted Diffs

AgentLoopKit should make software-agent work explainable before review, not just create more artifacts. Maintainers need one local answer to: which changed files are explained by the task, which are unexplained or forbidden, whether verification is fresh, which paths are risk-sensitive, and what command should run next.

The new evidence-map core correlates Git status paths with task `Likely Files or Areas`, `Files or Areas Not to Touch`, fresh verification evidence, recent local run-ledger coverage, and path-based risk categories. `agentloop explain-diff` exposes the map directly, `review-context`, `ship`, and `prepare-pr` reuse compact summaries, and `agentloop resume-pack` creates local continuation briefs for Codex, Claude, Cursor, generic agents, and human reviewers.

The boundary is explicit: this is path-based local evidence, not semantic correctness, security certification, review approval, telemetry, hosted state, or an LLM workflow. It does not read changed file contents, read `.env` contents, call external APIs, post to GitHub, publish packages, create tags, bump versions, change dependencies, or alter release workflows.

## 2026-06-21: Status And Next Surface Active Loop Guidance

Typed task guidance should stay visible after task creation because agents often re-enter work through `agentloop status` or `agentloop next`, not the original `create-task` output.

`getAgentLoopStatus` now resolves optional loop guidance for the active task, or the latest open task when none is pinned, by reading that task's `Task type` line and checking only the implied repo-local `.agentloop/loops/<type>.md` file. Human `status` and `next` output print `Loop guidance` when the file exists, and JSON output adds an optional `loopGuidance` object with `taskType` and `path`. Next-action routing, task contract Markdown, command execution, loop enforcement, directory scans, missing-loop hints, dependencies, releases, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Create-Task Surfaces Matching Loop Guidance

Typed task contracts are more useful when the next loop guidance is visible immediately after creation. This matters more now that `research` has a local loop template: users should not need to remember that `.agentloop/loops/research.md` exists.

`create-task` now checks only the one repo-local file implied by the selected type, `.agentloop/loops/<type>.md`. When that file exists, human output prints `Loop guidance` and JSON output adds an optional `loopGuidance` object with `taskType` and `path`. Task contract Markdown, task state, warnings, command execution, loop enforcement, dependencies, releases, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Product Direction Uses Agent-Assisted Engineering Language

Product dogfooding found that internal product-panel and persona files still used narrow assistant-era language even after public docs and package metadata had moved to software-agent and agent-assisted engineering positioning.

Live internal product-direction files now use agent-assisted engineering and software-agent wording. A focused unit test scans `.agentloop/product-panel.md`, `.agentloop/user-personas.md`, and `.agentloop/backlog.md` for unsupported positioning phrases. The guard intentionally excludes archived task evidence and old research artifacts so historical records remain intact. CLI behavior, public-doc semantics, release behavior, dependencies, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Research Tasks Are Local Evidence Workflows

Product dogfooding and persona review showed AgentLoopKit had local simulated research notes, but no explicit task type for users who want to plan or summarize research work as reviewable evidence.

AgentLoopKit now supports a `research` task type, bundled research loop guidance, generated task README guidance, and public docs for research tasks. The feature frames research as local planning, findings, limits, and follow-up task evidence. It does not add interview automation, user panels, analytics ingestion, AI APIs, telemetry, external calls, claims of real user feedback, release behavior, dependencies, tags, publishing, or package version changes.

## 2026-06-21: Task Lifecycle Commands Accept Redacted Output

Dogfooding showed agents naturally append `--redact-paths` to task lifecycle commands when preparing shareable logs, but `task status` and related mutation commands rejected the flag even though they print task paths.

`task set`, `task status`, `task done`, `task archive`, and `task clear` now accept `--redact-paths`. The flag affects only displayed human and JSON path fields by redacting local roots through the existing redaction helper. Task state semantics, status updates, archive movement, task contract format, JSON field shape, release behavior, dependencies, tags, publishing, and package version stay unchanged.

## 2026-06-21: Ship Reports Show Inherited Dirty-Work Baselines

Dogfooding long autonomous sessions showed each small task can inherit a large dirty non-evidence baseline from earlier unreleased work. `create-task` already records that baseline in Risk Notes, but ship reports mostly surfaced the current total through scope warnings, so reviewers had to find the baseline later in the report.

Human ship reports now add an `Inherited Dirty Work` section when task Risk Notes include the generated pre-existing dirty non-evidence count. The section compares the recorded baseline with the current non-evidence changed-file count using the changed-file inventory already collected by `ship`. Readiness scores, ship JSON shape, create-task behavior, run-ledger schema, gate decisions, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Review Context Shows Gate Evidence Source

Dogfooding no-active and archived-task cleanup states showed `review-context` had the right next action and previous-verification label, but the gate summary still collapsed task evidence to `Gates: pass`. Agents consuming the one-shot snapshot should not need a separate `check-gates` call just to know whether task evidence is active, latest open, archived, or missing.

Human `review-context` output now appends a task-evidence source label to the gate summary when the task gate is present. The label is derived from the existing gate path plus status task context: active task evidence, latest open task evidence, archived task evidence, missing task evidence, or a generic task evidence fallback. Review-context JSON fields, gate ids, gate messages, gate status semantics, next-action routing, file reads, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Maintainer Check Labels Package Warnings Precisely

Dogfooding repeated maintainer-check output showed the message and checklist correctly distinguished package manifest-only changes, but the human row still rendered the compatibility check id `dependency-lockfiles`. In package-manifest-only cases that made the row look like a lockfile warning.

Human `maintainer-check` output now uses display labels for the package/dependency row: `package-manifest`, `dependency-lockfiles`, or `package-dependency-files` depending on the existing message. The JSON check id, status, message, checklist copy, warning/failure semantics, package content parsing behavior, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Check Gates Shows Dirty Create-Task Examples

Dogfooding no-active/no-open states showed `status` and `next` included bounded dirty non-evidence examples before recommending `agentloop create-task`, but `check-gates` still showed only the dirty counts. Agents that start from review gates need the same scope cue before opening the next task.

`check-gates` now appends up to five repo-relative dirty non-evidence examples to create-task next-action reasons when dirty non-evidence files exist. It uses the Git status paths already collected by check-gates and excludes AgentLoop evidence files. Gate decisions, strict-mode exit behavior, task evidence resolution, next-action command selection, file-content reads, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Check Gates Labels Archived Task Evidence

Dogfooding the no-active/no-open state showed `check-gates` correctly reused archived task evidence after normal cleanup, but the human gate row still said `Task contract`. That preserved the gate contract, but it could make previous task evidence look like an active or current task.

Human `check-gates` output now renders that row as `Archived task evidence` when the task gate path points under a task archive. JSON gate fields, gate pass/warn/fail decisions, strict-mode exit behavior, task evidence resolution, next-action command selection, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Review Context Labels Previous Verification

Dogfooding the no-active/no-open state showed `review-context` still printed `Latest verification: pass` after `status`, `next`, and `status --brief` had been tightened to mark retained reports as previous evidence. Since agents use `review-context` as a read-only snapshot, it should not imply archived-task verification is current-task proof.

Human `review-context` output now renders `Latest previous verification` when both `activeTask` and `latestTask` are absent. Active or newest-open task states keep `Latest verification`. Review-context JSON fields, review gates, task selection, next-action routing, verification discovery, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Status Brief Labels Previous Verification

Dogfooding after archived tasks showed the full `status` and `next` output had the previous-evidence label, but compact `status --brief` still printed `verification=pass` when no active or open task existed. That compact line is used in automation logs and agent prompts, so it should avoid implying current-task proof.

`status --brief` now renders `verification=previous:<status>` when a latest report exists but both `activeTask` and `latestTask` are absent. Active or newest-open task states keep `verification=<status>`. Structured status fields, next-action routing, verification discovery, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Dirty Create-Task Guidance Shows Examples

Dogfooding no-active/no-open states showed `status` and `next` warned about existing dirty non-evidence file counts before recommending `agentloop create-task`, but agents did not see any path examples until after creating the task. That made it harder to decide whether the dirty work belonged to the next task.

Create-task next-action reasons now append up to five repo-relative dirty non-evidence path examples from the already-collected Git status data. The warning remains advisory, AgentLoop evidence-only dirt stays excluded, file contents are not read, and task selection, command selection, verification selection, JSON shape, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Next Labels Previous Verification Evidence

Dogfooding the archived-task state showed `agentloop status` used `Latest previous verification`, but `agentloop next` still printed `Latest verification` for the same no-active/no-open state. That kept the lightweight next-action command slightly less precise than the full status view.

Human `next` output now uses `Latest previous verification` when both `activeTask` and `latestTask` are absent, matching `status`. Repos with an active task or newest open task keep the existing `Latest verification` label. JSON output, next-action routing, verification discovery, task selection, command execution, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Status Labels Previous Verification Evidence

Dogfooding after task archive showed human `agentloop status` could still show `Latest verification` with a passing report even when no active or open task existed. The next action was already correct, but the label could make previous-task evidence look like current-work evidence.

Human `status` output now uses `Latest previous verification` when both `activeTask` and `latestTask` are absent. Repos with an active task or newest open task keep the existing `Latest verification` label. JSON output, `latestReport` discovery, task selection, next-action ordering, command execution, release behavior, tags, publishing, and package versions stay unchanged.

## 2026-06-21: Verification Not Run Shows Configured Commands

Dogfooding task-only verification showed `Not Run` entries such as `test`, `lint`, and `build` flowing into PR handoffs without the configured command strings. The aliases are stable and useful for scripts, but human reviewers need enough context to understand what each skipped configured check represents.

Verification report Markdown now renders configured `Not Run` entries as `alias: command`, using Markdown-safe inline code for the configured command string. JSON `notRun` remains the existing alias list, and command selection, command execution, task-command parsing, duplicate handling, verification status semantics, release behavior, dependency behavior, tags, publishing, and package version stay unchanged.

## 2026-06-21: Prepare-pr Collapses Missing Optional Sections

Dogfooding the generated PR body showed that missing imported GitHub metadata left an empty visual gap between `Verification Evidence` and `Reviewer Checklist`. The output was technically valid, but reviewer-facing Markdown should look intentional even when optional local context is absent.

`prepare-pr` now trims the imported GitHub metadata section and inserts it only when present. Missing metadata still stays neutral, imported metadata still renders in the same section, and GitHub metadata parsing, command execution, verification parsing, JSON evidence shape, release behavior, dependency behavior, tags, publishing, and package version stay unchanged.

## 2026-06-21: PR Handoffs Name Report Not Run Entries Precisely

Dogfooding the direct `Not Run` handoff rendering showed that the heading could still overstate the evidence gap. The entries are copied from the verification report's structured `Not Run` section, not a full assessment of everything that was or was not verified.

`prepare-pr` and deterministic PR summaries now render the section as `Verification Report Not Run`. The parser source, fallback text, verification report generation, command execution, report JSON shape, release behavior, dependency behavior, tags, publishing, and package version stay unchanged.

## 2026-06-21: Not Run Omits Exact Covered Configured Commands

Dogfooding task-only verification showed PR handoffs could list `typecheck` under a broad unverified-work heading even when the task contract ran the exact same `npm run typecheck` command. The report was technically describing configured shortcuts skipped by `--only-task-commands`, but the reviewer-facing handoff overstated the gap.

Verification now computes `Not Run` after command execution and omits configured `test`, `lint`, `typecheck`, or `build` entries when the exact configured command string appears in executed results. This is exact string equality only: partial coverage such as `npm test -- tests/foo.test.ts` does not cover configured `npm test`. Command execution, exit handling, status semantics, task-command parsing, releases, and publishing stay unchanged.

## 2026-06-21: Ship Scope Warnings Include Review Areas

Dogfooding long autonomous sessions showed `agentloop ship` could warn that a non-evidence change set was broad without saying which review areas made it broad. `maintainer-check` already had compact area counts, but reviewers should not need to cross-reference another command to understand the ship score.

Readiness scoring now reuses a shared change-area count formatter from `change-areas.ts` and appends area counts only when the broad-scope threshold fires. The score weights, dimensions, changed-file inventory, gate decisions, run ledger data, release behavior, and publishing stay unchanged.

## 2026-06-21: Review Checks Reuse Shared URL-Safe Redaction

After URL-safe redaction was fixed for verification evidence, maintainer-check and release-check still had local split-based root-redaction helpers. Dogfooding the refactor exposed a related bug: a `/var/...` temp path embedded in maintainer-check task text was not redacted when the resolved root was `/private/var/...`.

Maintainer-check and release-check now call the shared `redactLocalRoots` helper for redacted check messages, paths, git root, and next-action text. The shared helper also trims inferred labeled AgentLoop artifact paths at the `.agentloop` boundary so `Report: /repo/.agentloop/...` keeps the artifact suffix instead of becoming only `[git-root]`. This does not change check ids, statuses, JSON shape, scoring, command execution, releases, or publishing.

## 2026-06-21: AgentFlight Verification Uses Argument Separator Syntax

Dogfooding created a failed AgentFlight verification record by passing the whole `npm test -- tests/artifacts.test.ts` command as one quoted argument. The later correctly invoked verification passed, but AgentFlight status continued to surface the original failed evidence, which made the handoff less clear.

Repo-local dogfood and maintenance guidance now shows `npx --yes agentflight verify -- npm test -- tests/example.test.ts` and warns not to pass the full command as one quoted string. This is documentation only: it does not change AgentFlight behavior, hide failed evidence, mutate session records, change AgentLoopKit command execution, release, or publish.

## 2026-06-21: Dogfood Surfaces AgentFlight Session Status

Dogfooding showed `npm run dogfood:strict` could pass AgentFlight doctor while `agentflight status` still reported the current session as blocked by an earlier failed verification. Doctor proves tool health, but it does not show whether the session evidence is ready.

The dogfood gate now runs `agentflight status` immediately after `agentflight doctor`, so session-readiness output is visible in normal and strict dogfood logs. The script still uses command exit codes as the gate contract and does not parse AgentFlight human output, rewrite AgentFlight evidence, clear failed records, change maintainer-check warning semantics, release, or publish.

## 2026-06-21: Path Redaction Preserves External URLs

Dogfooding `agentloop verify --redact-paths` with ProjScan output showed Markdown badge URLs being rewritten into malformed text such as `https:[git-root]`. The shared redaction helper inferred `https://...` as a labeled POSIX path because the URL contains a colon followed by slashes.

Local-root redaction now requires whitespace before inferring labeled paths, ignores inferred POSIX roots that start with `//`, and applies longer path variants before shorter ones. That preserves external `http` and `https` URLs while still redacting the configured git root, realpath aliases, and inferred local AgentLoop roots. This does not change verification command execution, release flow, publishing, or dependency behavior.

## 2026-06-21: Stale Artifact Previews Summarize Candidate Types

Long autonomous sessions can leave thousands of local verification reports, handoffs, ship reports, and run ledger entries. `agentloop artifacts --stale --limit 5` stayed safe and bounded, but the human preview could be dominated by the first candidate type, making the cleanup shape hard to understand without JSON or repeated `--type` runs.

Stale artifact previews now include a compact candidate summary grouped by artifact type before the bounded candidate list, and JSON output exposes the same deterministic summary data. Candidate ordering, filtering, kept-evidence protection, default limits, read-only safety, releases, and publishing stay unchanged.

## 2026-06-21: PR Handoffs Surface Not Run Verification Details

`prepare-pr` and deterministic PR summaries told reviewers to check the verification report for skipped commands even when the report had a structured `Not Run` section. That forced reviewers to open another artifact for basic evidence that could be rendered directly in the handoff.

PR handoffs now parse only the verification report's `Not Run` section through the shared Markdown section helper. Concrete skipped commands are rendered directly in `prepare-pr` and `handoff` output, while generated `Nothing skipped.` placeholders become `No skipped commands were recorded.` This does not change verification report generation, readiness scoring, verification command execution, releases, or publishing.

## 2026-06-21: Dogfood Strict Warnings Mean Review Gates

Strict dogfood passed while `maintainer-check` reported warnings during a long dirty implementation batch. That is correct behavior because `maintainer-check` warnings are reviewer guidance unless required evidence fails and the command exits non-zero, but some repo guidance could be read as if every warning from every dogfood step blocks progress.

Dogfood behavior stays unchanged. Strict mode continues to pass `--strict` to `check-gates`, so review-gate warnings fail the run. The script help, repo harness, README, CLI reference, and maintenance guidance now say maintainer-check warnings remain reviewer guidance unless the command exits non-zero. This does not parse human output, change maintainer-check exit codes, alter release flow, release, or publish.

## 2026-06-21: Maintainer Check Names Package Manifest Risk Precisely

Dogfooding showed that `maintainer-check` warned `Dependency or lockfile changes detected.` when only `package.json` changed. That was too broad for script-only package manifest edits and made reviewer guidance sound like an actual dependency update.

The `dependency-lockfiles` check id and warning status stay unchanged for compatibility, but its message now distinguishes package manifest changes, dependency lockfile changes, and combined manifest-plus-lockfile changes from path categories only. The maintainer checklist uses matching copy. This does not parse package contents, change JSON shape, weaken dependency review, alter gates, release, or publish.

## 2026-06-21: Unit Guard Covers Readiness Scoring

The final-section parser bug in readiness scoring was covered by focused tests, but `tests/readiness-score.test.ts` was not part of `npm run test:unit`. Because `maintenance:check` starts with `test:unit`, that meant the recurring guard would not exercise deterministic review-readiness scoring.

`test:unit` now includes `tests/readiness-score.test.ts`, and package-script coverage asserts that inclusion. This slightly increases unit-guard runtime while keeping the integration suite unchanged. It does not alter scoring behavior, maintenance-check step ordering, dependencies, releases, or publishing.

## 2026-06-21: Readiness Scoring Uses Shared Section Parsing

Dogfooding a shared task-section parser exposed that `readiness-score` still had a local regex with an invalid end-of-string pattern. That meant task sections at the end of a file could be missed, including final `Rollback Notes` or final `Risk Notes`.

Readiness scoring now uses the shared line-based section parser and keeps its existing `None recorded yet.` placeholder filtering for list items. This fixes final-section scoring without changing readiness dimensions, weights, public score labels, ship behavior, prepare-pr behavior, review-context behavior, releases, or publishing.

## 2026-06-21: Review Context Reports Risk-Note Count Only

`agentloop review-context` is the compact read-only snapshot agents use before choosing their next step. Dogfooding showed it did not reveal whether the active task had Risk Notes recorded, forcing agents to open the task file just to know whether reviewer risk context exists.

Review context now reads only the active task contract and reports a count-only `activeTaskRiskNotes` signal in JSON plus a concise human line when an active task exists. It does not print the Risk Notes prose, full task Markdown, or any artifact body. This keeps the existing safety boundary while making missing or present task risk context visible. The change does not alter gates, readiness scoring, ship, prepare-pr, broad task scans, releases, or publishing.

## 2026-06-21: Ship Reports Surface Task Risk Notes

Dogfooding showed that dirty-work baselines and other task-level risk notes were visible in `prepare-pr` output but not in the primary `agentloop ship` report. Reviewers could see the readiness score and changed files while missing the task's own risk context.

Ship reports now include a `Task Risk Notes` section sourced from the task contract already loaded for readiness scoring. The section uses the same Markdown prose escaping style as other reviewer-facing lists and falls back to `No task risk notes were recorded.` when the task has no list items. This does not change ship scoring, changed-file collection, run-ledger JSON, `prepare-pr` behavior, dirty-file scans, releases, or publishing.

## 2026-06-21: Maintenance Check Runs Typecheck Directly

Dogfooding found that `npm run maintenance:check` could pass even when `npm run typecheck` failed. That made the recurring near-term guard weaker than the release and handoff expectations it is meant to support.

`maintenance:check` now runs `npm run typecheck` immediately after unit tests, before docs, release-proof smoke, safety tests, AgentFlight, ProjScan, and dogfood. The step uses the existing secret-filtered child process environment and remains non-mutating: no dependency changes, token reads, `.env` reads, release prep, version bump, tag, publish, upload, or GitHub release behavior.

## 2026-06-21: Task Contracts Preserve Dirty-Work Baselines

Long autonomous sessions often create a new task while prior source, docs, tests, or local harness edits are still dirty. `create-task` already warns at creation time, but later ship and handoff evidence can lose the fact that some dirty files predated the task.

When `create-task` emits the dirty-work warning, the generated task contract now also records a Risk Notes bullet with the pre-existing dirty non-evidence count and bounded path examples. It reuses the same warning data, so it does not read file contents, expand scans, change warning codes, rename JSON fields, alter classification, clean files, stash files, release, or publish.

## 2026-06-21: Dirty-Work Guidance Uses Non-Evidence Terminology

Dogfooding showed that dirty-work guidance said `dirty non-AgentLoop files`, but the implementation actually counts dirty files that are not generated AgentLoop/AgentFlight evidence. Local product and harness files under `.agentloop/` can therefore appear in examples, making the old label misleading.

Dirty-work warnings and `status`/`next` create-task reasons now say `dirty non-evidence files`. The warning code, JSON field names, file counts, bounded examples, and classification logic stay unchanged. The change does not read dirty file contents, clean files, hide `.agentloop` product files, mutate task state, release, or publish.

## 2026-06-21: Artifact Inventory Labels Archived Fallback Evidence

`agentloop artifacts` intentionally keeps ordinary current task counts separate from preserved AgentFlight placeholders, while still surfacing the newest archived terminal task as fallback task evidence when no live task qualifies. Dogfooding showed the old human label, `Latest task`, made that fallback look like current work even though JSON already exposed `archived: true`.

Human `artifacts` output now labels that case as `Latest archived task evidence`, including filtered latest task output. Active or open task evidence keeps the existing `Latest task` label, and JSON output stays compatible through the existing task object shape and `archived: true` marker. This does not change task counting, archive behavior, placeholder handling, artifact cleanup, release channels, or publishing.

## 2026-06-21: Task Clear Reports Persisted Pointer Removal

Dogfooding direct AgentFlight recovery showed a confusing edge case: `task doctor` could recommend `agentloop task clear` for an ignored AgentFlight placeholder pointer, but `task clear` printed `No active task set.` because normal active-task selection intentionally ignores placeholders.

`task clear` now reports whether a persisted active-task state file was removed. Human output says `Cleared active task pointer.` and prints the stored path when one existed; JSON returns `activeTask: null`, `cleared`, and optional `activeTaskPath`. A no-state run still reports the existing no-op. This changes output only; it does not delete task Markdown, change placeholder filtering, mutate task contracts, add cleanup automation, release, or publish.

## 2026-06-21: Generated AgentFlight Recovery Guidance Uses The Bounded Path

Task doctor and status now preserve AgentFlight placeholder task files as session evidence and tell agents to clear placeholder active state before pinning or creating a real task. Several generated root, harness, and agent instruction templates still said to run only `agentloop status --redact-paths` and `agentloop task set <path>`, which skipped the diagnostic and preservation guidance.

Generated root guidance, harness commands, bundled agent instructions, and this repo's local harness now use the bounded sequence: run status plus task doctor, treat the placeholder as preserved session evidence, run `agentloop task clear`, then `agentloop task set <path>` or `agentloop create-task`. This does not change AgentFlight behavior, task-state logic, status/next routing, task-doctor diagnostics, placeholder detection, cleanup behavior, release channels, or publishing.

## 2026-06-21: Generated Task Guidance Mirrors Create-Task Warnings

Freshly initialized repos teach agents from `.agentloop/tasks/README.md`. After `create-task` gained dirty-work and placeholder-section warnings, that generated task guidance still described activation and JSON output without explaining the new warning cases.

The task README template now documents both warning paths as advisory, non-mutating guidance. The local AgentLoopKit harness copy is refreshed for dogfooding, and init coverage proves fresh harnesses contain the wording. This does not change `create-task` behavior, warning codes, task-doctor diagnostics, command execution, file cleanup, release channels, or publishing.

## 2026-06-20: Next Guidance Mentions Dirty Work Before Task Creation

After `create-task` gained dirty-work warnings, `status` and `next` could still recommend `agentloop create-task` in a dirty repo without explaining that the next task would inherit existing non-evidence changes.

Create-task recommendations now append a dirty-work reminder when no active/open task exists and the working tree includes non-evidence changes. The command selection stays the same, clean deferred-only states remain no-op, AgentLoop evidence-only dirt does not trigger the extra copy, and the change does not read file contents, mutate tasks, clean files, stash files, release, or publish.

## 2026-06-20: Create-Task Warns Before Mixing Dirty Work

Dogfooding long autonomous sessions showed that after a task is shipped and archived, agents can immediately create another task while source, test, or docs changes from earlier work remain dirty. That makes the next task's changed-file evidence harder to trust.

`create-task` now snapshots Git status before writing the new task and warns when dirty non-evidence files already exist. The warning is advisory, bounded to path examples, available in human and JSON output as `DIRTY_WORKTREE_BEFORE_TASK_CREATION`, and excludes generated AgentLoop/AgentFlight evidence churn. It does not block task creation, read dirty file contents, clean files, stash files, commit files, archive evidence, release, or publish.

## 2026-06-20: Untracked Diff Stat Markers Are Shared Evidence Rendering

After ship reports started showing untracked non-evidence files in Diff Stats, dogfooding found the same `git diff --stat` blind spot in deterministic summaries, handoffs, and HTML reports. A reviewer could see a new file in Changed Files while the adjacent Diff Stats section still omitted it.

Untracked-aware diff-stat rendering now lives in the Git core helper and is reused by ship, summarize/handoff, and HTML report generation. It appends compact `path | untracked` markers only from Git status entries, excludes AgentLoop evidence churn, and does not read untracked file contents, synthesize full diffs, change JSON changed-file arrays, alter run-ledger changed-file evidence, release, or publish.

## 2026-06-20: Ship Diff Stats Acknowledge Untracked Files

Dogfooding showed that `agentloop ship` listed untracked files in the Changed Files section while the Diff Stat block, sourced from `git diff --stat`, omitted them. That made new non-evidence files less visible in reviewer-facing evidence.

Ship reports now append compact `path | untracked` lines for untracked non-evidence files to the diff-stat text. The implementation does not read untracked file contents, synthesize full diffs, change JSON `changedFiles`, change run-ledger changed-file evidence, change AgentLoop evidence compaction, release, or publish.

## 2026-06-20: Create-Task Warns On Placeholder Contracts

Real-repo and dogfood loops showed that later surfaces can catch placeholder task contracts, but the highest-leverage moment is the first write. `agentloop create-task` should remain permissive for draft contracts, while immediately warning agents and maintainers when review-critical sections still contain generated placeholders.

`create-task` now reports `TASK_CONTRACT_PLACEHOLDER_SECTIONS` in JSON and a human warning when generated contracts still have placeholder problem, outcome, likely-file, acceptance, verification, or rollback sections. The detector is shared with `task doctor` through the task-contract core helper so generated defaults and diagnostics stay aligned. This does not make task creation fatal, mutate task content beyond the requested write, change `task doctor` semantics, execute commands, call external services, read tokens, release, or publish.

## 2026-06-20: Doctor Advisory Mode Preserves Setup Gates

Real-repo trial notes showed that `agentloop doctor` is useful before initialization but can stop copy-paste onboarding scripts because missing config is a serious failure. The default command should keep that non-zero exit for gates, while trial and onboarding docs need an explicit advisory preflight path.

`agentloop doctor --advisory` keeps the same diagnostics, next actions, and `overallStatus`, but exits `0` so users and agents can continue a first-run script after seeing the setup warnings. Human and JSON output expose advisory mode. This does not auto-run `init`, hide failures, call external services, read tokens, add telemetry, release, or publish.

## 2026-06-19: Status Routes Placeholder Task Contracts To Doctor

Local real-repo trials against temporary repository copies showed that active task contracts with placeholder acceptance, verification, rollback, or other review-critical sections could reach `agentloop status` and `agentloop next` with a handoff recommendation after verification passed.

`status` now reuses existing task-doctor diagnostics for the active task. When `placeholder-task-section` applies to the active task, the next action is `agentloop task doctor` before verification or handoff recommendations. The change is read-only and does not mutate task files, change `create-task` templates, change `ship` scoring, call GitHub APIs, read tokens, add telemetry, or affect release channels.

## 2026-06-19: Public Docs Hygiene Guards Trial Boundaries

Real-repo trial guidance is now the decision gate before adding more bundled policy packs or letting imported GitHub metadata affect `ship` scoring. Public docs hygiene should protect that checklist from drifting into adoption proof, compliance claims, credential-bearing automation, telemetry, remote services, or scoring changes.

The guard checks only `docs/real-repo-trials.md` when the file exists. It does not add a new command, require trial files, change policy-pack behavior, change GitHub metadata import behavior, call GitHub APIs, read tokens, post comments, publish packages, or affect release channels.

## 2026-06-19: Artifact Path Primitives Stay In A Leaf Module

Generated artifact filename patterns and output-path validation are shared infrastructure, not artifact inventory behavior. They live in `src/core/artifact-paths.ts` so `task-state`, `runs`, and `artifacts` can depend on a stable leaf module instead of importing through each other.

`src/core/artifacts.ts` still re-exports the existing internal names for compatibility with current callers. The change breaks the core circular import without adding a database, runtime registry, dependency, public API, release behavior, or artifact format change.

## 2026-06-19: Trial Guidance Comes Before Policy-Pack Or Metadata Expansion

Policy packs stay local Markdown guidance and imported GitHub metadata stays optional local review context. AgentLoopKit should collect maintainer trial notes in real repositories before adding more bundled packs or letting imported GitHub text affect `ship` scoring.

Trial guidance must not present internal simulated research as public evidence. It must not add remote policy packs, enforcement engines, hosted services, telemetry, GitHub API calls, automatic posting, token reads, compliance claims, releases, or publishing behavior.

## 2026-06-16: Maintenance Gate Tests Policy-Pack Safety Directly

The near-term roadmap says bundled policy packs should stay small, local, safe, and useful. `npm run maintenance:check` should verify that contract with focused `tests/policy-packs.test.ts` coverage, not only by listing policy-pack inventory.

The gate remains local and non-mutating beyond the tested CLI behavior. It does not add remote policy packs, enforcement engines, overwrite behavior, API calls, token reads, `.env` reads, releases, or publishing.

## 2026-06-16: Maintenance Gate Tests GitHub Metadata Safety Directly

The near-term roadmap says imported GitHub metadata must stay optional, local, read-only, token-free, and non-blocking when absent. `npm run maintenance:check` should verify that contract with focused `tests/github-metadata.test.ts` coverage, not only by checking that `agentloop github import --help` exists.

The gate remains local and non-mutating. It does not call GitHub APIs, run `gh`, read tokens, read `.env` files, post comments, publish packages, or make GitHub metadata mandatory.

## 2026-06-16: Release Proof Distinguishes Channel Proof From HEAD State

`agentloop release-proof` checks whether public release channels match the local package version. It should also report the version tag commit, current commit, and whether `HEAD` matches the version tag.

When public channels match but `HEAD` differs from the version tag, release-proof keeps channel proof passing and points maintainers to `agentloop release-check`. This keeps the recurring maintenance gate useful during unreleased development while avoiding the false impression that the current checkout has already shipped.

## 2026-06-16: Generated Evidence Order Comes From Filenames

Generated AgentLoopKit evidence files use timestamped names as their canonical order. `status`, `artifacts`, and shared evidence lookup should select generated verification reports, handoffs, ship reports, CI summaries, and release notes by filename timestamp and collision suffix, not filesystem mtime.

Git operations can rewrite mtimes and make an older generated report look newer. Manual, non-generated files keep the existing mtime and filename fallback because they do not carry AgentLoopKit's generated timestamp contract.

## 2026-06-16: Generated Evidence Paths Preserve Existing Files

Default generated AgentLoopKit evidence paths should not replace existing files when a command is rerun in the same minute. Generated task contracts, verification reports, ship reports, PR summaries, PR descriptions, static HTML reports, CI summaries, release notes, and run evidence use collision-safe numeric suffixes when the first timestamped path already exists.

Explicit user-requested output paths remain exact and keep the existing safety checks. AgentLoopKit does not add global state, a database, cleanup automation, network calls, publishing behavior, or hidden overwrite flags for this convention.

## 2026-06-14: Imported GitHub Metadata Feeds Review Evidence Only

`agentloop github import` remains the only path for GitHub issue and PR context. It reads explicit local JSON files and writes normalized context under `.agentloop/github/context.json`.

`review-context`, `prepare-pr`, and `maintainer-check` may read that local file to give agents and reviewers more context. Missing metadata is neutral. Invalid local metadata is a warning only where reviewers need to know the context cannot be trusted.

The CLI still does not call GitHub APIs, read GitHub tokens, read `.env` files, post comments, or execute commands from issue and PR text. PR-facing output treats imported prose as untrusted and escapes Markdown before rendering it.

## 2026-06-12: Prepare-pr Uses Archived Latest-Run Task Evidence

`agentloop prepare-pr` should reuse the same task-evidence model as `agentloop ship`. When a fresh ship run references a task that has since moved into `.agentloop/tasks/archive/`, `prepare-pr` may use that archived task as read-only PR context and may reuse the fresh ship run instead of writing duplicate ship evidence.

This keeps PR titles, acceptance criteria, risk notes, and rollback notes available after normal dogfood cleanup. It does not reactivate archived tasks, change task archive behavior, post to GitHub, run verification commands, or accept task paths outside the configured task directory.

## 2026-06-12: Ship Uses Archived Latest-Run Task Evidence

`agentloop ship`, `check-gates`, and `maintainer-check` should agree about task evidence after cleanup. When no active or open task exists, they may reuse the latest run's task reference if the corresponding Markdown file exists in `.agentloop/tasks/archive/`.

This keeps review-readiness scoring tied to the completed task after the task has been archived. It does not make archived tasks active again, change task archive behavior, run verification commands, or accept arbitrary paths outside the configured task directory.

## 2026-06-12: Post-Verification Gates Are Explicit Evidence

Task contracts can record `Post-Verification Gates` for commands that need a fresh AgentLoop verification report, such as `npm run dogfood:strict`, `agentloop ship`, or reviewer handoff checks. `agentloop create-task` accepts repeatable `--post-verification` flags for this section.

`agentloop verify --task-commands` still runs only reviewed commands under `Verification Commands`. It does not execute post-verification gates, because those commands depend on evidence that `verify` writes after subprocesses finish. This keeps command execution explicit and avoids report-dependent checks failing for the wrong reason.

`agentloop verify --post-verification-gates` is the explicit opt-in for running those gates. The command writes the normal verification report first, then runs commands from `Post-Verification Gates`, then updates the report with gate evidence. A failing gate fails the `verify` command. Normal `verify` and `verify --task-commands` behavior remains unchanged.

## 2026-06-12: Task-Only Verification Still Requires Explicit Task Commands

`agentloop verify --only-task-commands` is a convenience flag, not a new execution permission. It only works with both `--task <path>` and `--task-commands`, so task Markdown never becomes executable because a user asked for a report with task context.

The shortcut skips configured repo commands through the existing verification skip path and records `test`, `lint`, `typecheck`, and `build` as not run. This keeps focused dogfood runs clear while preserving default broad verification behavior.

## 2026-06-12: Run Ledger Paths Are Display Evidence

Run metadata should help humans, agents, and MCP clients review evidence without leaking local machine paths. New run records store display-safe paths: AgentLoopKit artifacts as `.agentloop/...`, repo files as repo-relative paths, and outside absolute paths as filenames. The reader also sanitizes older run records so existing ledgers keep working.

The run ledger is not an absolute-path database. Commands that need to read files should resolve current artifact locations through the existing artifact and config helpers instead of trusting stored run paths.

## 2026-06-09: Ship As A Boring npm CLI

AgentLoopKit ships as a TypeScript Node CLI distributed through npm and npx. The package has no postinstall script, telemetry, cloud backend, database, or API key requirement.

## 2026-06-09: Keep Summaries Deterministic

`agentloop summarize` uses git status, diff stats, task contracts, verification reports, and config. It does not call an LLM. Reviewers should be able to reproduce the summary from repo state.

## 2026-06-11: Handoff Path Labels Adapt To Repo Paths

`agentloop summarize` and `agentloop handoff` keep changed-file paths as git evidence, but Markdown path labels use inline-code delimiters longer than any backtick run in the path. This keeps reviewer handoffs readable when a repository path contains backticks without changing git parsing, file classification, or the path text.

## 2026-06-11: Release Note Path Labels Adapt To Repo Paths

`agentloop release-notes` keeps changed-file and working-tree paths as release evidence, but Markdown path labels use inline-code delimiters longer than any backtick run in the path. This keeps release drafts readable when a repository path contains backticks without changing git range selection, status parsing, or publishing behavior.

## 2026-06-11: Share Markdown Delimiter Logic

Verification reports, reviewer handoffs, and release notes use a shared Markdown formatting helper for inline code and code fences. This keeps delimiter behavior consistent across evidence artifacts without adding a Markdown parser, sanitizer dependency, or broad rendering refactor.

## 2026-06-11: npm Status Labels Use Shared Markdown Formatting

`agentloop npm-status` reports package and version labels as release evidence. Those labels now use the same Markdown inline-code formatter as verification, handoff, and release-note artifacts. This keeps captured registry data readable when a version string contains backticks without changing registry lookup, package-name validation, or version validation.

## 2026-06-11: CI Summary Evidence Uses Shared Markdown Formatting

`agentloop ci-summary` collects local task, verification, handoff, and gate evidence for CI logs. Human Markdown output now formats evidence titles, paths, statuses, gate details, timestamps, and next-action commands with the shared inline-code helper. JSON output keeps raw values so automation does not need to parse Markdown.

## 2026-06-11: Release Check Evidence Uses Shared Markdown Formatting

`agentloop release-check` reads local package, changelog, AgentLoop evidence, and git release state before a maintainer publishes. Human Markdown output now formats package labels, git metadata, check names, check messages, paths, statuses, changed-file counts, and next-action commands with the shared inline-code helper. JSON output keeps raw values for automation.

## 2026-06-11: Doctor Output Uses Shared Markdown Formatting

`agentloop doctor` reports local setup checks, project detection, risk-file paths, and next steps for humans and agents. Human Markdown output now formats check statuses, check names, messages, path-like values, overall status, strict mode, and next-action text with the shared inline-code helper. JSON output keeps raw values for scripts.

## 2026-06-09: Preserve Existing AGENTS.md

`init` appends a marked AgentLoopKit section when `AGENTS.md` already exists. It does not overwrite user instructions.

## 2026-06-09: Use Superpowers As Discipline, Not Branding

This repo used Superpowers-style discipline during implementation. AgentLoopKit does not copy Superpowers content, claim affiliation, or position itself as a replacement. It focuses on repo-level engineering loops, task contracts, verification evidence, and handoff artifacts.

## 2026-06-09: Dogfood projscan In This Repo

Implementation work in this repository runs `projscan` as a repo health check. AgentLoopKit does not require projscan for end users, and generated templates do not add that requirement to other repositories.

## 2026-06-09: Use README-Native Launch Visuals

Launch visuals live in `docs/assets/readme/` with source HTML and a VHS tape so maintainers can regenerate them locally. The README references raw GitHub asset URLs so npm can render images without adding screenshot files to the package tarball.

## 2026-06-09: Patch Release For README Polish

`agentloopkit@0.1.0` was published before README visuals landed. README image polish, release workflow safety, and launch docs ship as `0.1.1` instead of mutating the first npm release.

## 2026-06-09: Status Is Read-Only

`agentloop status` reads config, git status, latest task, and latest verification report. It does not execute configured commands, read environment file contents, call a model, or mutate files. The command exists to orient agents and reviewers, not to replace `verify`.

## 2026-06-09: Failed Verification Blocks Handoff Suggestions

`agentloop status` treats a failed latest verification report as a blocker for handoff suggestions. The next action remains `agentloop verify` until the user fixes failures and reruns verification.

## 2026-06-09: Verification Excerpts Preserve Failure Tails

`agentloop verify` keeps both the beginning and ending output when a command log is too long for a report. This preserves setup context and final error lines while keeping reports reviewable. The CLI does not summarize, redact, or reinterpret command output.

## 2026-06-11: Verification Report Fences Adapt To Output

`agentloop verify` keeps raw command output and exact command strings as local evidence, but generated Markdown delimiters adapt to that content. Code blocks use a fence longer than any backtick run in command output, and command labels use inline-code delimiters longer than any backtick run in the command string. This prevents logs or command labels from corrupting report structure without adding a sanitizer, parser, dependency, or output mutation.

## 2026-06-09: Handoff Writes, Summarize Previews

`agentloop handoff` is the clear command for writing reviewer handoff files. It reuses the deterministic summary core instead of introducing a second summary implementation. `agentloop summarize` remains read-only by default for preview use and existing scripts can keep using `agentloop summarize --write`.

## 2026-06-09: Active Task State Is Transparent

`agentloop task set` stores the active task pointer in `.agentloop/state.json`. The file contains only a version and a relative task path. Commands that need task context use that pointer when it references an existing Markdown task inside `.agentloop/tasks/`; commands such as handoffs, gates, and reports may use the newest open task contract as fallback context. This keeps task lifecycle local and auditable without adding a database, daemon, or hosted service.

## 2026-06-09: Verification Reports Use Allowlisted CI Context

`agentloop verify` may include CI provenance in generated reports, but only from a small allowlist of CI variables. GitHub Actions reports can include workflow, event, ref, commit, run URL, and run attempt. Generic CI reports only identify `Generic CI`. AgentLoopKit does not read `.env` files, print arbitrary environment variables, call CI APIs, or upload artifacts.

## 2026-06-09: Doctor Reports Risk Paths, Not Secrets

`agentloop doctor` reports potential risk files by category with capped path examples. It keeps these findings as warnings, not failures. The scanner does not read file contents, inspect credentials, score risk, or claim secret detection.

## 2026-06-09: Config Schema URL Uses GitHub Until A Domain Exists

Generated configs use the GitHub raw URL for `schema/agentloop.config.schema.json`. The package also ships the schema locally, and CLI validation uses local TypeScript/Zod rules. AgentLoopKit does not fetch the schema URL at runtime. A custom `agentloopkit.dev` schema URL can replace it after that domain serves the file.

## 2026-06-10: HTML Reports Are Local Static Evidence

`agentloop report` writes a static HTML file from existing local task, verification, handoff, git, and deterministic summary artifacts. It does not run project commands, call an LLM, fetch external assets, upload files, or read `.env` contents. The renderer escapes Markdown-derived and git-derived text and uses inline CSS instead of a Markdown parser or browser app.

## 2026-06-10: Evidence Badges Are Local SVG Files

`agentloop badge` writes SVG badges from existing local verification or gate evidence. It does not run project verification commands, call remote badge services, fetch assets, upload files, or read `.env` contents. Badges are status pointers for reports and CI artifacts; the Markdown and HTML evidence remains the source of truth.

## 2026-06-10: Use 0.16.0 For npm Catch-Up

GitHub already has public releases from `v0.2.0` through `v0.15.1`, and `main` now contains badge behavior that is not in `v0.15.1`. The next npm catch-up release must use a new version, `0.16.0`, so npm package contents, the GitHub tag, and release notes describe the same source. Do not backfill old npm versions with newer code, and do not keep creating higher versions only because npm authorization was previously blocked.

## 2026-06-10: Template Versioning Uses A Local Manifest

Generated harness provenance lives in `.agentloop/manifest.json`, not in `agentloop.config.json`. The manifest records the generated template version and generator name without changing config validation for existing users. `doctor` can warn about missing, invalid, old, or newer manifests, but AgentLoopKit does not automatically rewrite edited harness files.

## 2026-06-10: Policy Inspection Is Read-Only

`agentloop policy` lists and reads local Markdown files under `.agentloop/policies/`. It does not enforce policy, scan source code, fetch remote policy packs, mutate policy files, or claim compliance. The command exists so humans and agents can find repo guidance before risky edits while keeping policies as plain files.

## 2026-06-10: Policy Status Compares Templates, Not Compliance

`agentloop policy status` compares local `.agentloop/policies/*.md` files with bundled AgentLoopKit policy templates. It reports `current`, `modified`, `missing`, and `extra` so agents and maintainers can review local policy drift. It does not score compliance, scan source code, rewrite policies, fetch remote packs, or decide whether a local customization is correct.

## 2026-06-10: CI Summary Is Read-Only Evidence

`agentloop ci-summary` reads allowlisted CI provenance and local AgentLoop artifacts, then prints Markdown or JSON. It writes a Markdown file only when `--write` is passed. It does not call CI provider APIs, read secrets, print arbitrary environment variables, upload files, run verification commands, or replace `*-verification-report.md` as the verification source of truth.

## 2026-06-10: Release Notes Are Local Handoff Evidence

`agentloop release-notes` drafts release notes from local package metadata, changelog sections, git history, task contracts, verification reports, and CI summaries. It writes a Markdown file only when `--write` is passed. It does not create tags, publish packages, call GitHub or npm APIs, read tokens, upload files, rewrite changelogs, or infer semantic changes it cannot prove.

## 2026-06-10: npm Status Is A Read-Only Registry Check

`agentloop npm-status` compares local `package.json` metadata with `npm view <package> version versions --json`. It can read captured registry JSON with `--registry-json` for CI or handoff replay, and `--expect-current` can fail post-publish smoke checks when npm latest does not match the local version. The command does not publish packages, create tags, create GitHub releases, read npm tokens, read `.env` files, upload files, or change package metadata.

## 2026-06-10: Use 0.24.0 For npm-status Release

`main` contains `agentloop npm-status` after the public `v0.23.0` GitHub release. Current source must release as `0.24.0` so package metadata, changelog, tag, tarball, and release notes describe the same code. Do not publish `0.23.0` from current `main`; use the existing `v0.23.0` tag or tarball if that old line must be reproduced.

## 2026-06-10: npm Catch-Up Is A One-Time Alignment Step

npm still serves `agentloopkit@0.1.1` while public GitHub releases already exist through `v0.19.0`. The next npm publish should catch up to the current GitHub release line once, then AgentLoopKit should return to normal semver. Do not backfill old npm versions from newer source, and do not keep creating higher versions only because npm authorization remains blocked.

## 2026-06-10: Local-Only Harness Mode Is Explicit

`agentloop init --local-only` exists for developers who want AgentLoopKit files available to local agents without committing those files to the target repo. The command writes a marked block to the current clone's `.git/info/exclude` and adds a local-only notice to generated agent guidance. It refuses non-Git folders, does not change `.gitignore`, does not touch global Git config, and does not become the default because shared team harnesses should remain commit-friendly.

## 2026-06-10: Next Reuses Status Decisions

`agentloop next` wraps `getAgentLoopStatus` and prints the same `nextAction` that `agentloop status` computes. It should remain a read-only shortcut for humans, agents, and scripts, not a second planner. Keeping one decision source prevents `status` and `next` from disagreeing as the loop grows.

## 2026-06-10: Prepublish Fails With Unreleased Changelog Entries

Current `main` may contain work after the latest GitHub release tag. `prepublishOnly` should fail while `CHANGELOG.md` has real entries under `## Unreleased`, so npm cannot publish contents that do not match package metadata. Release prep must move those entries into a versioned section and reset `Unreleased` before publishing from `main`.

## 2026-06-10: Keep README User-Facing

The README is part of the npm package and should explain user value, install commands, CLI usage, examples, and safety. It must not include local npm auth state, publish failures, catch-up history, or trusted-publishing operations. Maintainer release process belongs in `docs/npm-publishing.md`, `docs/release-status.md`, `docs/launch-checklist.md`, and internal AgentLoop handoffs.

## 2026-06-10: Stage Distribution Channels After npm

npm/npx and GitHub Releases are the primary release channels. Homebrew, Docker/GHCR, GitHub Action, MCP Registry, VS Code/Open VSX, Scoop, and WinGet should be added as separate, verifiable tasks. MCP Registry is blocked until AgentLoopKit has a real MCP server; do not claim support from metadata alone.

## 2026-06-10: Project Detection Skips Unreadable Directories

Project detection may inspect file names when a repository has no package or Python metadata. If a directory cannot be read, AgentLoopKit skips it instead of failing the command. This prevents first-run crashes on macOS-protected paths such as `.Trash` while still avoiding file-content reads in protected directories.

## 2026-06-10: Bound Fallback Project Detection And Guard Home Init

Project detection uses direct metadata first: `package.json`, Python markers, and known config files. Only metadata-free directories fall back to a shallow capped file-name scan. The fallback is bounded to avoid recursively walking large directories such as a macOS home folder.

Non-dry `agentloop init` refuses to initialize the user's home directory unless `--force` is passed. `--dry-run` remains allowed so users can inspect planned files without writing them. This keeps the normal command safe when a user accidentally runs `npx agentloopkit init` from `~`.

## 2026-06-10: MCP Server Is Read-Only In v1

`agentloop mcp-server` exposes local AgentLoopKit state to MCP clients through stdio. The first version only reads status, next action, task contracts, active task content, policies, latest verification report, and handoff summaries. It does not run verification commands, edit files, create tasks, change task status, read `.env` contents, call external APIs, upload data, publish packages, or create releases.

## 2026-06-10: Distribution Channels Reuse The CLI

GitHub Action, Docker/GHCR, and MCP Registry support must wrap or expose the existing CLI package instead of creating separate product behavior. npm and GitHub Releases remain the source of truth for versioned package contents. Registry metadata and generated artifacts must point at a package version that exists, and channel docs must distinguish prepared repo artifacts from externally verified publication.

## 2026-06-10: Status Separates Pinned Active From Latest Open

`agentloop status` and `agentloop next` should reserve `activeTask` for the task pinned in `.agentloop/state.json`. When no task is pinned, they may show the newest open task contract as `latestTask`, but the next action must ask the user or agent to run `agentloop task set <path>` before continuing. This keeps `agentloop task current`, `status`, and `next` consistent while preserving useful context for repos with existing task contracts.

## 2026-06-10: Deferred Tasks Are Parked Work

`deferred` is a supported task status for known work that should remain visible in `agentloop task list` but should not drive `agentloop status` or `agentloop next` when no task is pinned. It is not a scheduler, priority system, or backlog manager. Deferred tasks are local Markdown contracts that a maintainer can later move back to `proposed`, `in-progress`, or another supported status.

## 2026-06-11: Config Paths Stay Repo-Relative

AgentLoopKit config paths are local repo paths, not arbitrary filesystem targets. The CLI rejects absolute paths, Windows drive-qualified paths, parent traversal segments, and null bytes in `paths.root`, `paths.agentloopDir`, `paths.tasksDir`, `paths.reportsDir`, and `paths.handoffsDir`. This keeps task contracts, verification reports, handoffs, and generated harness files inside the project boundary while preserving simple nested repo-relative customization such as `tools/agentloop/reports`.

## 2026-06-11: Artifact Roots Must Resolve Inside The Repo

Repo-relative config paths are not enough when a directory already exists as a symlink. Generated task, report, badge, CI-summary, release-note, and handoff outputs now resolve the configured artifact root before writing. If the root points outside the current repo, AgentLoopKit rejects the write instead of following the symlink. This keeps local AgentLoop evidence tied to the repository and avoids surprising filesystem writes.

## 2026-06-11: Agent Instruction Writes Stay Repo-Local

`agentloop install-agent` writes Markdown guidance for agents, so it follows the same repo-local rule as generated evidence. The command resolves `.agentloop/agents/*.md` and `AGENTS.md` before reading or writing. If either path points outside the repo through a symlink, AgentLoopKit rejects the command and leaves the outside target unchanged.

## 2026-06-11: Init Preflights Repo-Local Targets

`agentloop init` creates the repo harness, so it now preflights every generated target before writing `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, or `agentloop.config.json`. If an existing symlink would redirect one of those targets outside the current repo, init rejects the run before partial harness files are created.

## 2026-06-11: Task State Stays Repo-Local

`.agentloop/state.json` is a local active-task pointer, not a general state store. Task commands now resolve that state path before reading, writing, or clearing it. Unsafe read paths are treated as no active task, while unsafe writes and clears fail with `OUTPUT_PATH_INVALID` so a symlink cannot redirect task state outside the repo.

## 2026-06-11: Task Archives Stay In The Task Directory

`agentloop task archive` moves a task contract from the active task folder into `.agentloop/tasks/archive/`. The archive destination now resolves before the move. If the archive directory is a symlink outside the repo, AgentLoopKit rejects the archive and leaves the source task untouched.

## 2026-06-11: Read-Only Artifact Discovery Stays Repo-Local

Read-only commands are still part of the repo trust boundary. Task listing, status, gates, handoff fallback, HTML reports, badges, CI summaries, release notes, MCP tools, and policy inspection now ignore configured task, report, handoff, or policy roots when those roots resolve outside the current repo through symlinks. These paths behave like missing local artifacts instead of reading outside content, while explicit artifact paths and writes keep their stricter structured errors.

## 2026-06-11: Review Gates Require Repo-Local Files

`agentloop check-gates` should not let outside files satisfy repo harness or safety-policy evidence. Required root files, harness files, and policy files now count as present only when the resolved path stays inside the current repo. Unsafe symlinked files are reported as missing, preserving warning-only default gate behavior while keeping review evidence repo-local.

## 2026-06-11: Risk Notes Are First-Class Task Inputs

Task contracts already include a Risk Notes section, but non-interactive task creation could not fill it. `agentloop create-task` now accepts repeatable `--risk` and `--risk-note` flags that populate the existing section without changing task headings, adding risk scoring, or turning AgentLoopKit into a policy engine.

## 2026-06-11: Editor Extension Work Stays Deferred

AgentLoopKit should not build a VS Code or Open VSX extension until maintainers see a clear editor-specific workflow gap. If that changes, the extension should be a thin command-palette wrapper around the existing CLI, with no dashboard, chat surface, telemetry, background daemon, policy editor, or separate artifact format.

## 2026-06-11: Artifacts Inventory Is Read-Only

`agentloop artifacts` inventories local AgentLoop evidence so agents and reviewers can see what exists before handoff or release prep. It reads configured task, report, and handoff roots only when they resolve inside the current repo. It does not run verification commands, create files, delete files, upload data, inspect credentials, or read `.env` contents.

## 2026-06-11: Smoke CI Exercises The Built CLI

The cross-platform smoke workflow builds AgentLoopKit and then runs `scripts/smoke-cli.mjs` against the built `dist/cli/index.js` in a temporary repo. The smoke path checks first-run setup, task lifecycle, verification, handoff, and gates. It does not publish packages, create releases, upload artifacts, or call external service APIs.

## 2026-06-11: Release Readiness Stays Local And Read-Only

`agentloop release-check` is a pre-release evidence gate, not a release runner. It reads package metadata, changelog entries, release scripts, git state, local AgentLoop evidence, and package install-script safety. It does not call npm, create tags, publish packages, create GitHub releases, read credentials, read `.env` contents, upload files, or change package metadata. Registry truth stays in `agentloop npm-status`.

## 2026-06-11: Artifact Inventory Filters Stay Content-Free

`agentloop artifacts --type` and `--latest` filter the existing local evidence inventory but keep the same privacy boundary as the base command. They return counts, statuses, headings, and repo-relative paths only. They do not dump task, report, handoff, or env-file contents.

## 2026-06-11: GitHub Action Supports npm And Local Dependency Modes

The composite action should support two clear usage paths: install AgentLoopKit from npm, or use an already-installed local dev dependency. `install-mode` is explicit and validated. npm mode runs in the configured working directory and uses `--package-lock=false` to avoid CI lockfile churn. Local mode verifies the existing local binary before running the requested command.

## 2026-06-11: Current Verification Evidence Must Match Current Task

AgentLoopKit should not treat any passing verification report as current evidence when a newer active or open task exists. Status already used this rule; gates, handoffs, release notes, and release checks now use the same freshness check. A report that predates an `in-progress` task is stale and the next action points back to verification. Tasks in `review` or `done` keep their report because the status change normally happens after verification.

## 2026-06-11: Automation Wrappers Validate Before Spawning Commands

The GitHub Action should not interpolate user-provided command strings into shell. The composite action now delegates to a small Node wrapper that validates install mode, accepts only `latest` or exact semver package versions, rejects shell metacharacters in `command`, and spawns npm/npx with argument arrays. The README and CI docs still tell maintainers to keep action inputs static because static workflow values are easier to review.

## 2026-06-11: Release Helpers Stay Conservative

Release helpers are evidence checks, not release authority. `release-check` warns when `CHANGELOG.md` has pending `Unreleased` entries, `release-notes` rejects option-shaped Git refs, and `npm-status` validates package names before calling npm. The MCP Registry workflow pins and verifies `mcp-publisher` before OIDC authentication. These checks reduce accidental release claims without adding publishing side effects to local CLI commands.

## 2026-06-11: Doctor Scans Are Bounded

`agentloop doctor` should return promptly in large repositories. Risk-file detection now uses bounded traversal and reports when the scan stops early. The warning tells maintainers to run targeted checks instead of presenting a partial scan as complete coverage.

## 2026-06-11: Repo Commands Use The Nearest AgentLoop Root

`agentloop init` remains current-directory setup because users need explicit control over where the harness lands. After setup, non-init repo commands search upward for the nearest `agentloop.config.json` and use that folder as the command workspace. This lets agents work from nested source folders while keeping task contracts, verification reports, handoffs, policies, and release evidence tied to the initialized repo root.

## 2026-06-11: Missing Config Is A Setup Error

Commands that require AgentLoop setup should not leak raw filesystem errors when `agentloop.config.json` is missing. The config loader now reports missing configs as `CONFIG_ERROR` with an `agentloop init` hint. This gives humans and automation one predictable setup-failure shape without adding automatic initialization or global config lookup.

## 2026-06-11: CI Metadata In Markdown Uses Safe Inline Formatting

Verification reports and CI summaries include allowlisted CI fields such as workflow, event, ref, commit, run URL, and run attempt. Those values come from CI environment variables, so Markdown output now renders them with the shared inline-code formatter. Provider labels stay plain because they are fixed internal labels. The change does not expand environment access, call CI provider APIs, read secrets, or alter JSON output.

## 2026-06-11: Release Note Metadata Uses Safe Inline Formatting

Release notes combine package metadata, git range labels, branch names, commit IDs, and local AgentLoop evidence into reviewer-facing Markdown. Those values can contain punctuation from package files, refs, task titles, or artifact paths, so release-note metadata and evidence values now render with the shared inline-code formatter. This keeps Markdown evidence stable without changing git commands, JSON output, changelog parsing, publishing behavior, or external service access.

## 2026-06-11: Status And Next Markdown Use Safe Inline Formatting

`agentloop status` and `agentloop next` give agents and humans the current loop state. They now render local project, git, task, report, command, and working-tree values with the shared inline-code formatter. JSON and brief output stay unchanged, and verification status parsing still accepts the existing normalized status values.

## 2026-06-11: Artifact Inventory Markdown Uses Safe Inline Formatting

`agentloop artifacts` inventories local evidence for humans, agents, and CI logs. It now renders task statuses, task titles, artifact titles, artifact paths, and verification statuses with the shared inline-code formatter. JSON output and artifact discovery stay unchanged.

## 2026-06-11: Review Gate Markdown Uses Safe Inline Formatting

`agentloop check-gates` is reviewer-facing evidence. It now renders gate statuses, gate names, gate messages, evidence paths, git labels, changed-file counts, and next-action commands with the shared inline-code formatter. JSON output, gate decisions, strict-mode behavior, and exit codes stay unchanged.

## 2026-06-11: Task Command Human Output Uses Safe Inline Formatting

`agentloop task` prints local task titles, statuses, paths, and hygiene diagnostics that can come from repo files. Human output now renders those values with the shared inline-code formatter so backticks in task names, paths, status strings, messages, or recommendations cannot break Markdown structure. JSON output, task lifecycle behavior, task-doctor diagnostics, and supported status semantics stay unchanged.

## 2026-06-11: CLI Write Confirmations Use Safe Inline Formatting

Write confirmations are often pasted into handoffs, CI logs, and chat transcripts. Commands that create local artifacts now render generated paths, statuses, sources, messages, and counts with the shared inline-code formatter. This applies only to human output for task creation, verification, handoffs, HTML reports, badges, CI summaries, release notes, and agent installation. JSON payloads, output paths, artifact contents, write behavior, and exit codes stay unchanged.

## 2026-06-11: npm Status Errors Use Safe Markdown Presentation

`agentloop npm-status` can include npm registry stderr when the live registry check fails. That text is external command output, so Markdown reports now collapse whitespace and render the registry error as a safe inline-code value. The structured `source.error` value remains exact in JSON output so automation can inspect the original npm error without presentation changes.

## 2026-06-11: Verification Task Context Uses Safe Inline Formatting

Verification reports include task context from local task contracts and requested task paths. Those values can contain punctuation from filenames or task metadata, so task-context path, title, task type, and status values now render with the shared inline-code formatter. The change is presentation-only: task path safety, task metadata parsing, command execution, command results, and JSON output stay unchanged.

## 2026-06-11: Verification Report Metadata Preserves Status Parsing

Verification report headers include local repo and Git metadata that can contain Markdown-sensitive punctuation. Timestamp, repo, branch, commit, and working-tree values now render with the shared inline-code formatter. `Overall status` deliberately remains plain text because AgentLoopKit commands parse that line from existing reports; keeping it raw preserves compatibility while the value itself is an internal enum.

## 2026-06-11: PR Summary Task Context Uses Safe Inline Formatting

PR summaries and handoffs include the task title as reviewer-facing context. That title can come from a local task contract and may contain Markdown-sensitive punctuation, so the top-level `Task context` value now renders with the shared inline-code formatter. Verification status text remains plain because AgentLoopKit parses `Overall status: pass|fail|not-run` from existing reports and handoffs.

## 2026-06-11: PR Summary Diff Stats Use Safe Text Fences

PR summaries and handoffs include `git diff --stat` output as local review evidence. That output can contain repo paths with Markdown-sensitive punctuation, so non-empty diff stats now render inside an adaptive `text` code fence. The empty-state fallback remains plain text because it is fixed copy and reads better as prose.

## 2026-06-11: Release Note Commit Subjects Use Safe Inline Formatting

Release notes include commit subjects from local Git history. Commit subjects are evidence values, not trusted Markdown, so each rendered commit line now uses the shared inline-code formatter. The structured `commits` array remains raw for automation and release tooling.

## 2026-06-11: Release Note Missing Refs Use Safe Inline Formatting

Release notes include a fallback reason when a requested `--from` Git ref is missing. The requested ref is user-provided release input, so Markdown output formats only that ref with the shared inline-code helper while keeping the sentence readable. The structured `fallbackReason` stays raw for automation.

## 2026-06-11: Policy List And Status Use Safe Inline Formatting

`agentloop policy list/status` prints local policy titles, statuses, and paths. Titles come from repo-local Markdown headings and paths can include Markdown-sensitive punctuation, so human output renders those values with the shared inline-code formatter. JSON output remains raw for automation. `agentloop policy show` deliberately stays raw because that command is meant to display the policy Markdown document itself.

## 2026-06-11: Ship Is A Local Acceptance Layer

AgentLoopKit now treats review readiness as a local evidence problem. `agentloop ship` composes existing task, verification, gate, handoff, Git, and risk signals into a deterministic score and Markdown report. The score does not claim to measure code quality. It only states whether the work has enough local evidence for review.

The run ledger lives under `.agentloop/runs/` instead of a database or cloud service. `intent <file>` reads that local ledger to explain which previous ship runs touched a file. GitHub comment output is Markdown only; the CLI does not require tokens or post comments itself.

## 2026-06-12: Prepublish Checks Guard MCP Registry Metadata Drift

The `0.28.2` release gate failed late because `server.json` still carried the previous package version. Distribution artifact tests caught the issue, but only after a heavier release run.

`scripts/prepublish-check.mjs` now compares `package.json.version` with both `server.json.version` and the npm package entry in `server.json`. This keeps the release guard local, read-only, and fast. The guard does not rewrite metadata, call npm, create releases, or publish registry entries.

## 2026-06-12: Verification Progress Is Opt-In And Bounded

Long verification runs can look stuck even when commands are still executing. AgentLoopKit now supports `agentloop verify --progress`, which prints one start line and one finish line per command with elapsed time.

The default human output stays unchanged for scripts and existing users. JSON output remains parseable when `--json` and `--progress` are combined. Raw child-process output stays in the Markdown verification report instead of being streamed to the terminal.

## 2026-06-12: Roadmap Current-State Drift Is A Release-Smoke Failure

The roadmap is a public trust document. If it says an older version is the current public release after a newer version ships, users get conflicting release guidance.

Release smoke now checks only the `ROADMAP.md` `Current State` block against `package.json.version`. The guard is local and deterministic. It does not call npm, GitHub, GHCR, or MCP Registry, and it does not rewrite documentation automatically.

## 2026-06-14: Release Proof Is Evidence Collection, Not Publishing

`agentloop release-proof` is a post-release evidence command. It checks whether npm, GitHub Releases, GHCR, and MCP Registry proof match the local package version, and it reports missing proof without creating or repairing release channels.

The command can query public metadata with a timeout, or read captured JSON files passed with explicit flags. It refuses `.env` capture paths before reading them. It does not publish packages, create tags, create GitHub releases, upload files, post comments, read npm tokens, read GitHub tokens, or change package metadata.

Public-doc hygiene now skips `docs/superpowers/` because those files are internal implementation plans, not user-facing documentation. The guard still scans README, normal docs, examples, GitHub docs, `ROADMAP.md`, and the root handoff for unsupported public claims.

## 2026-06-16: install-agent Preserves Edited Agent Instructions

Agent-specific files under `.agentloop/agents/` are setup artifacts that maintainers may edit after installation. Re-running `agentloop install-agent` now skips existing agent instruction files instead of replacing them with bundled template text.

`AGENTS.md` remains append-only for missing AgentLoopKit marker blocks, so repos can still gain missing references without losing local agent-specific guidance. Human and JSON output report whether the agent instruction file was `created` or `skipped`, and whether `AGENTS.md` was `created`, `updated`, or already `current`.

This avoids a merge engine, force flag, external agent config discovery, or third-party setup writes. Users who want newer bundled template copy can inspect the package templates and update local files manually.

## 2026-06-16: Handoff Markdown Can Prove Bounded Dirty-File Coverage

`check-gates`, `status`, and `maintainer-check` use run-ledger metadata when it exists. During dogfooding, a plain `agentloop handoff` produced a reviewer summary but no run ledger entry, so strict gates kept asking for another handoff even though the latest handoff listed the changed files.

AgentLoopKit now treats the latest handoff Markdown as bounded local evidence when it lists the dirty files. The coverage check reads only that latest handoff file, adds the handoff artifact path itself, and does not scan arbitrary repo prose. Run-ledger evidence remains the stronger source when available.

## 2026-06-21: Product Language Emphasizes Agent-Assisted Engineering

AgentLoopKit should not market itself with cheap assistant-style automation language. Public surfaces now prefer software-agent and agent-assisted engineering wording, including package metadata, CLI descriptions, README copy, generated guidance, MCP descriptions, and reviewability docs.

Public-doc hygiene rejects unsupported positioning phrases before they reach README, docs, examples, or GitHub-facing files. The guard is local and deterministic. It does not change command behavior, schemas, scoring, release behavior, or historical evidence parsing.

## 2026-06-21: Package Metadata Uses The Same Positioning Guard

Package metadata is a public discovery surface, so `package.json` description and keywords follow the same positioning rules as README and docs. Tests now reuse the unsupported-positioning checker against serialized package metadata and assert the current software-agent and agent-assisted keywords.

This stays in test coverage rather than release automation. It does not change package versions, publishing behavior, prepublish checks, dependencies, command behavior, or runtime schemas.
