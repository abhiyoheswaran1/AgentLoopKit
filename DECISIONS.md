# Decisions

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

`agentloop init --local-only` exists for developers who want AgentLoopKit files available to local coding agents without committing those files to the target repo. The command writes a marked block to the current clone's `.git/info/exclude` and adds a local-only notice to generated agent guidance. It refuses non-Git folders, does not change `.gitignore`, does not touch global Git config, and does not become the default because shared team harnesses should remain commit-friendly.

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

`agentloop install-agent` writes Markdown guidance for coding agents, so it follows the same repo-local rule as generated evidence. The command resolves `.agentloop/agents/*.md` and `AGENTS.md` before reading or writing. If either path points outside the repo through a symlink, AgentLoopKit rejects the command and leaves the outside target unchanged.

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
