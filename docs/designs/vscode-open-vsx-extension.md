# VS Code and Open VSX Extension Design

AgentLoopKit should not ship an editor extension until the CLI workflow shows a clear editor-specific gap. If we build one later, it should wrap the existing CLI instead of creating a second product surface.

## Decision

Defer implementation.

The right extension shape is a thin command-palette helper, not a dashboard, webview, chat panel, project manager, or LLM wrapper. npm/npx, GitHub Releases, GitHub Action, Docker/GHCR, and MCP remain the supported distribution surfaces.

## Target Workflows

If an extension becomes worth building, it should expose only these commands:

- `AgentLoopKit: Status`, which runs `agentloop status` and opens the output in a read-only editor tab.
- `AgentLoopKit: Next`, which runs `agentloop next`.
- `AgentLoopKit: Create Task`, which opens a terminal with a copyable `agentloop create-task` starter command.
- `AgentLoopKit: Verify`, which runs `agentloop verify` in the integrated terminal.
- `AgentLoopKit: Handoff`, which runs `agentloop handoff` after verification.
- `AgentLoopKit: Check Gates`, which runs `agentloop check-gates` or `agentloop check-gates --strict`.

The extension should not parse, rewrite, or own AgentLoopKit artifacts. Users should still inspect `.agentloop/`, `AGENTS.md`, `AGENTLOOP.md`, and `agentloop.config.json` as normal repo files.

## UX Rules

- Prefer command-palette actions and terminal commands.
- Do not add a sidebar, dashboard, custom webview, chat surface, task board, or background daemon in v1.
- Show exact commands before running anything that writes files or executes verification.
- Keep outputs in the editor's terminal or read-only Markdown tabs.
- Do not auto-run `init`, `verify`, `handoff`, or `check-gates`.
- Do not edit `.gitignore`, shell profiles, workspace settings, or extension settings without an explicit command.

## Safety Rules

The extension must preserve the CLI trust model:

- no telemetry
- no cloud backend
- no login
- no API keys
- no LLM calls
- no reading `.env` contents
- no hidden network calls beyond installing or invoking the npm package when the user chooses that path
- no workspace file writes without showing the command or file path first

For untrusted workspaces or pull request checkouts, the extension should default to read-only commands such as `status`, `next`, and `task list`.

## Implementation Shape

If this moves from design to build:

1. Create a separate extension package after the CLI release process stays stable.
2. Depend on the user's installed `agentloop` binary, or run `npx --yes agentloopkit@latest` only when the user chooses that mode.
3. Use VS Code's `child_process` or terminal APIs to run the same CLI commands users already run.
4. Keep extension tests focused on command registration, command construction, and refusal of unsafe dynamic input.
5. Prepare marketplace packaging only after the extension source package passes CI and the validation gates below.

## Maintenance Cost

The extension adds a second release workflow, marketplace metadata, icon assets, VS Code API compatibility checks, Open VSX publishing, and support questions from users who expect IDE behavior. That cost is not justified while the CLI, MCP, GitHub Action, and Docker paths still need release rhythm.

## Release Path

Build only after at least one of these signals appears:

- repeated issues asking for command-palette shortcuts;
- maintainers using AgentLoopKit mostly from VS Code terminals and requesting fewer copy/paste steps;
- a partner repo wants editor onboarding but rejects a CLI-only flow;
- contributors struggle to discover task, verify, and handoff commands from generated files.

When that signal exists, create a new task contract for the extension MVP. Until then, keep the roadmap entry as deferred.

## Validation Gates

Do not publish to the VS Code Marketplace or Open VSX until all gates pass:

- at least one real issue asks for command-palette access to existing CLI commands;
- the extension MVP uses the installed `agentloop` binary or explicit `npx --yes agentloopkit@<version>`;
- tests cover command construction and refusal of unsafe dynamic input;
- no command reads `.env` contents, tokens, or hidden workspace files;
- no command posts comments or uploads artifacts;
- CI verifies the extension package without weakening the CLI release gate.

The first validation build should stay private or unpublished. Use it to prove command-palette shortcuts help users before adding marketplace release work.

## Non-Goals

- No web dashboard.
- No IDE-native task board.
- No agent chat wrapper.
- No hosted service.
- No telemetry.
- No automatic code review.
- No policy editor.
