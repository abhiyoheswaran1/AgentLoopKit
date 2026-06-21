# AgentLoopKit

AgentLoopKit gives software agents a repeatable engineering loop inside this repo.

## Loop

1. Specify: turn the request into a task contract with outcome, constraints, non-goals, likely files, and files not to touch.
2. Constrain: define safety rules, dependency rules, verification commands, and rollback notes.
3. Plan: inspect relevant files, identify risks, and write a short implementation plan.
4. Implement: make focused changes and avoid unrelated formatting churn.
5. Verify: run configured checks and capture pass or fail results.
6. Review: inspect the diff against the task contract and identify risks.
7. Handoff: summarize changed files, verification, risks, rollback notes, and reviewer checklist.

## Repo Layout

- .agentloop/loops/: workflow templates for different task types.
- .agentloop/gates/: checklists for implementation, tests, review, regression, docs, security, and dependencies.
- .agentloop/policies/: practical safety policies for agents.
- .agentloop/tasks/: task contracts for agentic engineering sessions.
- .agentloop/reports/: verification reports, ship reports, HTML evidence reports, and local badges.
- .agentloop/handoffs/: PR summaries and reviewer handoffs.
- .agentloop/harness/: repo-specific working agreement, commands, and checklists.
- .agentloop/runs/: local run ledger entries for ship, verify, and handoff evidence.
- .agentloop/state.json: active task pointer created by `agentloop task set`.

## Commands Detected During Init

- Package manager: pnpm
- Project type: typescript-package
- Test: npx pnpm@10.12.1 test
- Lint: npx pnpm@10.12.1 lint
- Typecheck: npx pnpm@10.12.1 typecheck
- Build: npx pnpm@10.12.1 build
- Format: npx pnpm@10.12.1 format

Use `agentloop task list` to inspect available task contracts. Use `agentloop task show <path>` to read one without changing active state. Use `agentloop task set <path>` to pin the active task when a repo has multiple contracts. Use `agentloop task status <path> <status>` to update the task contract state. Use `agentloop task done` after verification and handoff or ship evidence to mark the active task done. Use `agentloop task archive <path>` to move one finished contract into `.agentloop/tasks/archive/` without deleting it. Use `agentloop task archive --status done --dry-run` before batch cleanup, then `agentloop task archive --status done` to archive finished contracts. Use `agentloop task doctor` to find missing, legacy, unsupported, terminal, or misplaced post-verification gate task issues without mutating task files. Use `agentloop verify --post-verification-gates` only after reviewing the active task's post-verification gates and deciding they should run after the report exists. Use `agentloop status` to inspect the pinned active task, latest open task, parked deferred tasks, latest verification report, working tree state, and next suggested command. Use `agentloop next` when an agent or script only needs the next recommended loop command. Use `agentloop review-context` when agents need one read-only snapshot of task, gate, policy, artifact, run, and next-action state. Use `agentloop artifacts` when reviewers or agents need a read-only inventory of local task, report, handoff, badge, CI summary, release-note, and run evidence. Use `agentloop upgrade-harness` after updating AgentLoopKit to inspect older generated guidance without overwriting local edits. Use `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` to inspect local safety guidance and template drift before risky edits. Use `agentloop ship` before review to score evidence readiness, write a ship report, and record a run under `.agentloop/runs/`. Use `agentloop prepare-pr` after `ship` when reviewers need a PR title, grouped body, risks, rollback notes, and checklist. Use `agentloop maintainer-check` when evaluating whether an agent-assisted PR has enough evidence to review. Use `agentloop runs`, `agentloop show-run <id>`, and `agentloop intent <file>` to inspect local run history and file intent. Use `agentloop check-gates` when you need a quick evidence gate without the full ship report. Use `agentloop report` after verification and handoff or ship evidence when reviewers need one local HTML evidence artifact. Use `agentloop badge` when reviewers or CI need a local SVG status badge. Use `agentloop ci-summary --write` in CI when reviewers need a compact provenance and evidence summary. Use `agentloop release-notes --write` before a release when reviewers need local release-note evidence. Use `agentloop npm-status` before claiming npm availability in release notes or docs. Use `agentloop release-proof` after public release workflows finish before claiming cross-channel release proof.

If the active task looks stale or mismatched with recent reports, run `agentloop task doctor` before using long devlogs or changelogs as task context.

Local files under `.agentloop/policies/` are the repo's policy source of truth. Bundled templates are comparison material. Treat `modified` policy status as a prompt to read the local rule, not as a reason to overwrite it.

## Autonomous Work

Agents may work autonomously inside the task contract. They should stop and ask before changing protected areas, adding dependencies, introducing breaking public APIs, or taking destructive actions.

For meaningful work in this repo, follow `.agentloop/harness/autonomous-dogfooding.md`. Use AgentLoopKit for task contracts, verification, ship reports, handoffs, run history, and gates. Use ProjScan for local repo-health and risk context. Use AgentFlight for local session recording and handoff proof.

If you start AgentFlight directly with `npx --yes agentflight start --task "<task>" --yes`, run `agentloop status --redact-paths` and `agentloop task doctor --redact-paths` afterward. If an AgentFlight placeholder becomes the active task, treat it as preserved session evidence: run `agentloop task clear`, then `agentloop task set <path>` for the detailed AgentLoop task contract or `agentloop create-task` for new scoped work. Do not edit or delete the placeholder as default recovery.

Before making product-direction decisions, read `.agentloop/product-panel.md`, `.agentloop/user-personas.md`, `.agentloop/backlog.md`, and the latest files under `.agentloop/research/`. Treat those research files as simulated internal decision support, not public user evidence.

No agent should claim completion without verification evidence or a clear statement of what was not verified.

## Release Cadence

Do not bump package versions, create tags, publish npm, publish GitHub Releases, publish GHCR, or publish MCP Registry entries during active implementation. Prepare releases only when the maintainer explicitly asks for release prep. Before claiming a release is available, verify the relevant registry, GitHub release, GHCR image, or MCP Registry entry from current output.
