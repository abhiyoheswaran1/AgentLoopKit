# Commands

Detected during AgentLoopKit init:

- Test: npx pnpm@10.12.1 test
- Lint: npx pnpm@10.12.1 lint
- Typecheck: npx pnpm@10.12.1 typecheck
- Build: npx pnpm@10.12.1 build
- Format: npx pnpm@10.12.1 format
- Repo health: npx projscan doctor --format markdown
- AgentFlight health: npx agentflight doctor
- Maintenance guard: npm run maintenance:check

Rules:

- Use `agentloop task list` to inspect task contracts before pinning one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop task done` after verification and handoff or ship evidence when the active task is ready to close.
- Use `agentloop task archive <path>` only after verification and review evidence are complete.
- Use `agentloop task archive --status done --dry-run` before any bulk cleanup, then `agentloop task archive --status done`.
- Use `agentloop task doctor` to find missing, legacy, unsupported, terminal, or misplaced post-verification gate task issues without mutating task files.
- Use `agentloop status` to inspect pinned active task, latest open task, parked deferred tasks, latest report, dirty files, and next action.
- Use `agentloop next` when you only need the next recommended loop command.
- Use `agentloop review-context` when an agent needs one read-only snapshot of task, gate, policy, artifact, run, and next-action state.
- Use `agentloop artifacts` when you need a read-only inventory of local task, report, handoff, badge, CI summary, release-note, and run evidence.
- Use `agentloop upgrade-harness` after updating AgentLoopKit to inspect older generated guidance without overwriting local edits.
- Use `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` to inspect local safety guidance and template drift before risky edits.
- Follow local `.agentloop/policies/*.md` files as repo policy. Treat `modified` as a reviewed local rule, not an error.
- Use `agentloop ship` before review to score evidence readiness, write a ship report, and record a run under `.agentloop/runs/`.
- Use `agentloop prepare-pr` after `ship` when reviewers need a PR title, grouped body, risks, rollback notes, and checklist.
- Use `agentloop maintainer-check` when evaluating whether an AI-assisted PR has enough evidence to review.
- Use `agentloop runs`, `agentloop show-run <id>`, and `agentloop intent <file>` to inspect local run history and file intent.
- Use `agentloop check-gates` when you need a quick evidence gate without the full ship report.
- Use `agentloop report` after verification and handoff or ship evidence when reviewers need one local HTML evidence artifact.
- Use `agentloop badge` when reviewers or CI need a local SVG evidence badge.
- Use `agentloop ci-summary --write` in CI when reviewers need a compact provenance and evidence summary.
- Use `agentloop release-notes --write` before a release when reviewers need local release-note evidence.
- Use `agentloop npm-status` after release attempts to check whether npm latest matches local package metadata.
- Use `agentloop npm-status --agentloopkit --expect-current` as an AgentLoopKit post-publish smoke check from any directory. It never publishes or reads credentials.
- Use `agentloop release-proof` after public release workflows finish to check npm, GitHub Releases, GitHub Marketplace, GHCR, and MCP Registry proof against local package metadata.
- Run targeted checks while developing.
- Run configured verification before claiming completion.
- Dogfood dependency audit, AgentFlight, and ProjScan during implementation work in this repository.
- Use `npx --yes agentflight start --task "<task>" --yes` at the beginning of meaningful autonomous work.
- Use `npx --yes agentflight status`, `npx --yes agentflight doctor`, and `npx --yes agentflight report` before final handoff when a session record helps review.
- Use `.agentloop/product-panel.md`, `.agentloop/user-personas.md`, `.agentloop/backlog.md`, and `.agentloop/research/` to guide product decisions. Treat those files as internal decision support, not public evidence.
- Use `.agentloop/harness/autonomous-dogfooding.md` for the full self-dogfood workflow.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.

## CI Usage

Use `agentloop ci-summary --write` after verification and handoff when CI should upload one compact Markdown summary of CI provenance, AgentLoop evidence, and gate status. It does not run checks or replace the verification report.

Use `agentloop release-notes --write` after verification when a release workflow needs a local release-note draft from changelog, git, task, verification, and CI-summary evidence. It does not create tags, publish packages, call provider APIs, or read tokens.

Use `agentloop npm-status` when release docs mention npm availability. Use `--agentloopkit` when checking AgentLoopKit itself from a temp release-smoke folder or CI workspace. The command runs `npm view` only when invoked, or reads captured registry JSON with `--registry-json`. It does not publish packages, read tokens, read `.env` files, or change package metadata.

Use `agentloop release-proof` after release workflows finish when maintainers need one post-release evidence report. It checks npm, GitHub Releases, GitHub Marketplace, GHCR, and MCP Registry proof. It does not publish, tag, upload, post comments, or read tokens.

Use `agentloop verify --task <path> --task-commands` only for reviewed commands listed under `Verification Commands`. Commands under `Post-Verification Gates` are not run by `verify`; run them after the verification report exists.
