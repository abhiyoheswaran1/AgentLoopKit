# Commands

Detected during AgentLoopKit init:

- Test: {{ testCommand }}
- Lint: {{ lintCommand }}
- Typecheck: {{ typecheckCommand }}
- Build: {{ buildCommand }}
- Format: {{ formatCommand }}

Rules:

- Use `agentloop task list` to inspect task contracts before pinning one.
- Use `agentloop task show <path>` to read a task contract without changing active state.
- Use `agentloop task set <path>` when the active task is ambiguous.
- Use `agentloop task status <path> <status>` to update task state without hand-editing Markdown.
- Use `agentloop task archive <path>` only after verification and handoff are complete.
- Use `agentloop status` to inspect active task, latest report, dirty files, and next action.
- Use `agentloop next` when you only need the next recommended loop command.
- Use `agentloop policy list`, `agentloop policy show <policy>`, and `agentloop policy status` to inspect local safety guidance and template drift before risky edits.
- Follow local `.agentloop/policies/*.md` files as repo policy. Treat `modified` as a reviewed local rule, not an error.
- Use `agentloop check-gates` to check task, verification, handoff, harness, policy, and git evidence before review.
- Use `agentloop check-gates --strict` in CI when warning gates should fail.
- Use `agentloop report` after verification and handoff when reviewers need one local HTML evidence artifact.
- Use `agentloop badge` when reviewers or CI need a local SVG evidence badge.
- Use `agentloop ci-summary --write` in CI when reviewers need a compact provenance and evidence summary.
- Use `agentloop release-notes --write` before a release when reviewers need local release-note evidence.
- Use `agentloop npm-status` after release attempts to check whether npm latest matches local package metadata.
- Use `agentloop npm-status --expect-current` as a post-publish smoke check. It never publishes or reads credentials.
- Run targeted checks while developing.
- Run configured verification before claiming completion.
- If a command fails, report the failure and fix it when reasonable.
- If a command is not configured, say so in the handoff.

## CI Usage

Use `agentloop check-gates --strict` in CI after task, verification, and handoff evidence exists. If CI generates reports and handoffs, upload `.agentloop/reports/*.md`, `.agentloop/reports/*.html`, `.agentloop/reports/*.svg`, and `.agentloop/handoffs/*.md` as build artifacts instead of committing them automatically.

When `agentloop verify` runs in GitHub Actions, the verification report records allowlisted CI provenance fields such as workflow, event, ref, commit, run URL, and run attempt. It does not dump arbitrary environment variables.

Use `agentloop ci-summary --write` after verification and handoff when CI should upload one compact Markdown summary of CI provenance, AgentLoop evidence, and gate status. It does not run checks or replace the verification report.

Use `agentloop release-notes --write` after verification when a release workflow needs a local release-note draft from changelog, git, task, verification, and CI-summary evidence. It does not create tags, publish packages, call provider APIs, or read tokens.

Use `agentloop npm-status` when release docs mention npm availability. It runs `npm view` only when invoked, or reads captured registry JSON with `--registry-json`. It does not publish packages, read tokens, read `.env` files, or change package metadata.

`check-gates` checks evidence. It does not prove the code is correct and does not replace review.

## Monorepos

If `agentloop doctor` reports workspace or monorepo markers, treat root commands as coverage clues, not proof that every package was checked.

- Add package-specific verification commands to the task contract when a change is scoped to one package.
- Prefer the repo's existing command style, such as `pnpm --filter <package> test`, `npm --workspace <package> test`, or a package-local command.
- Run root checks when they cover the touched area.
- In the handoff, separate root checks, package-level checks, and checks that were not run.
- Do not claim full monorepo verification from a root-only command unless the repo documentation says that command covers all affected packages.
