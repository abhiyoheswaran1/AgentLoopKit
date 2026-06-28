# AGENTS

<!-- agentloopkit:start -->

This repository uses AgentLoopKit.

Before changing code:

- Read AGENTLOOP.md.
- Check `.agentloop/state.json` for a pinned active task, then inspect `.agentloop/tasks/` for open task contracts.
- Use `agentloop task list` to inspect available task contracts before choosing one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop task done` after verification and handoff or ship evidence when the active task is ready to close.
- Use `agentloop task archive <path>` only after verification and review evidence are complete.
- For cleanup batches, run `agentloop task archive --status done --dry-run` before `agentloop task archive --status done`.
- Use `agentloop task doctor` when old task files or misplaced post-verification gates need a read-only cleanup checklist.
- Run `agentloop status` when you need the pinned active task, latest open task, parked deferred tasks, verification, dirty-file, and next-action state.
- Run `agentloop next` when you only need the next recommended loop command.
- Run `agentloop doctor --redact-paths` before Start when you need to confirm agent-readiness guidance is current.
- Run `agentloop start --for generic --goal implement --redact-paths` before broad repo reads when a software agent needs a compact task, evidence, risk, context-budget, and source-handle briefing, and avoid broad repo reads.
- Run `agentloop ready --redact-paths` when you need a read-only readiness gate across task, acceptance, verification, scope, forbidden files, and context budget.
- Use `agentloop loop create`, `agentloop loop tick`, `agentloop loop status`, and `agentloop loop report` to record local loop contracts without executing a coding agent.
- Run `agentloop context handles` after Start when the agent needs the available source-handle list, then `agentloop context show <handle>` to expand exact local source truth.
- If MCP tools are already configured, call `agentloop_start` before broad reads. To configure a client, use `agentloop mcp-server` as that client's stdio command.
- Run `agentloop review-context` when an agent needs one read-only snapshot of task, gate, policy, artifact, run, and next-action state.
- Run `agentloop artifacts` when you need a read-only inventory of local task, report, handoff, badge, CI summary, release-note, and run evidence.
- Run `agentloop upgrade-harness` after updating AgentLoopKit to see whether older generated guidance should be reviewed manually.
- Run `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` before touching security, dependency, database, git, public API, or secret-handling areas.
- Treat local `.agentloop/policies/*.md` files as the repo's safety guidance. A `modified` policy is a local decision to review, not a failure.
- Run `agentloop ship` before review to score evidence readiness, write a ship report, and record a run under `.agentloop/runs/`.
- Run `agentloop prepare-pr` after `ship` when reviewers need a PR title, grouped body, risks, rollback notes, and checklist.
- Run `agentloop maintainer-check` when evaluating whether an agent-assisted PR has enough evidence to review.
- Run `agentloop runs`, `agentloop show-run <id>`, and `agentloop intent <file>` to inspect local run history and file intent.
- Run `agentloop check-gates` when you need a quick evidence gate without the full ship report.
- Run `agentloop report` after verification and handoff or ship evidence when a local HTML evidence artifact helps review.
- Run `agentloop badge` when a local SVG evidence badge helps review or CI artifact uploads.
- Run `agentloop ci-summary --write` in CI when reviewers need a compact provenance and evidence summary.
- Run `agentloop release-notes --write` before a release when reviewers need local release-note evidence.
- Run `agentloop npm-status` before claiming npm availability in release notes or docs.
- Run `agentloop release-proof` after public release workflows finish before claiming cross-channel release proof.
- Do not bump package versions, create tags, publish npm, publish GitHub Releases, publish GHCR, or publish MCP Registry entries during active implementation. Prepare releases only when the maintainer explicitly asks for release prep.
- Follow the Specify, Constrain, Plan, Implement, Verify, Review, Handoff loop.
- Keep changes small and tied to the task contract.
- Do not run destructive git or filesystem commands unless the user asks for them.
- Do not read or print secrets. If env files exist, mention only their paths.
- Run the configured verification commands before claiming completion.
- Run `npm run dogfood` during meaningful AgentLoopKit changes to exercise the local self-check path, including dependency audit. Use `npm run dogfood:strict` before final handoff or release prep when review-gate warnings should block progress; maintainer-check warnings remain reviewer guidance unless the command exits non-zero.
- Run `npm run maintenance:check` for the near-term maintenance guard covering unit checks, public-doc hygiene, link checks, and strict dogfood.
- Use AgentFlight for meaningful autonomous sessions: `npx --yes agentflight start --task "<task>" --yes`, `npx --yes agentflight status`, `npx --yes agentflight doctor`, and `npx --yes agentflight report`.
- After raw `agentflight start`, run `agentloop status --redact-paths` and `agentloop task doctor --redact-paths`. If an AgentFlight placeholder becomes active, treat it as preserved session evidence: run `agentloop task clear`, then `agentloop task set <path>` for a detailed task or `agentloop create-task` for new scoped work. Do not edit or delete the placeholder as default recovery.
- Use ProjScan during implementation: `npx --yes projscan doctor --format markdown`, `npx --yes projscan start`, or a more specific ProjScan command when repo-risk context is needed.
- Before making product-direction decisions, review `.agentloop/product-panel.md`, `.agentloop/user-personas.md`, `.agentloop/backlog.md`, and the latest files under `.agentloop/research/`.
- Treat `.agentloop/research/` and product-panel output as simulated internal decision support. Do not present it as real user feedback, adoption, testimonials, or interviews in public docs.
- Follow `.agentloop/harness/autonomous-dogfooding.md` for the full AgentLoopKit + ProjScan + AgentFlight dogfood loop.
- Generate review evidence with changed files, tests run, risks, rollback notes, and reviewer checklist.

Agent roster:

Use these roles as routing hints when an agent session needs focused expertise. One session may cover multiple roles, but the handoff should name which roles mattered.

- Product Maintainer: Use for scope, positioning, roadmap, backlog, and release-channel decisions. Owns README claims, ROADMAP.md, DECISIONS.md, and public tradeoffs.
- CLI Engineer: Use for command behavior, flags, JSON output, exit codes, path handling, and package-manager detection. Owns `src/cli/`, `src/core/`, and command tests.
- Template and Harness Engineer: Use for `init`, generated files, `.agentloop/` structure, task templates, policies, gates, and agent instructions. Owns `src/templates/`, template tests, and migration notes.
- Verification Engineer: Use for Vitest coverage, smoke scripts, CI workflows, release gates, and reproducible evidence. Owns `tests/`, `scripts/`, `.github/workflows/`, and verification reports.
- Security Reviewer: Use for file writes, command execution, env-file handling, dependency changes, publishing, and registry metadata. Blocks unsafe defaults and requires transparent user-facing behavior.
- Release Engineer: Use for npm, GitHub Releases, GitHub Marketplace, GHCR, MCP Registry, changelog entries, version bumps, tarballs, checksums, and post-release proof.
- Docs and DX Writer: Use for README, getting-started docs, examples, CLI copy, error messages, and install instructions. Keeps public docs user-facing and removes maintainer-only notes.
- Agent Compatibility Engineer: Use for Codex, Claude Code, Cursor, OpenCode, Gemini CLI, GitHub Copilot CLI, and generic-agent guidance. Keeps instructions tool-agnostic unless behavior is implemented.
- MCP and Automation Engineer: Use for read-only MCP server behavior, GitHub Action usage, CI summaries, and automation docs. Keeps automation local-first and reviewable.
- Repo Steward: Use for cleanup, file organization, small diffs, issue templates, contribution paths, and preserving unrelated user work.
- Dogfood Steward: Use for AgentLoopKit, ProjScan, and AgentFlight evidence. Owns `.agentloop/dogfood-log.md`, `.agentloop/harness/autonomous-dogfooding.md`, AgentFlight reports, ProjScan health signals, and proof that this repo follows its own loop.

When splitting work across agents:

- Keep the active task contract as the source of truth.
- Give each agent a disjoint file scope when possible.
- Do not let background work bypass verification, review, or handoff.
- Merge outputs through one final reviewer before claiming completion.

Safety rules:

- Treat migrations, auth, billing, deployment, lockfiles, public APIs, and security code as high-risk.
- Do not change dependencies without a clear reason and verification plan.
- Preserve existing user work. Do not revert unrelated changes.
- Update DECISIONS.md when architecture or public behavior changes.
<!-- agentloopkit:end -->
