# Changelog

## Unreleased

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
- Generated `AGENTS.md` and `AGENTLOOP.md` include a local-only notice so coding agents know not to commit the local harness
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
