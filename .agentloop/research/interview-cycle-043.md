# Interview Cycle 43

Internal simulated feedback. Do not present this as real user research.

## Context

AgentLoopKit now has `agentloop task archive <path>` on `main`. The latest GitHub release, `v0.10.0`, documents shell completions and is npm-pending. The README visuals already use committed Playwright HTML and a VHS tape, but they still show the `0.10.0` tarball and do not demonstrate task archiving.

## Personas interviewed

- Indie Hacker Using Codex
- Claude Code Power User
- Open Source Maintainer
- Developer Experience Designer
- Security Reviewer

## Feedback summary

The strongest signal is release coherence. A user who reads the README should see the current task lifecycle, including archive, and the release should not imply npm availability until the registry proves it.

## Raw simulated feedback

### Indie Hacker Using Codex

- What they liked: The workflow now covers task creation through handoff.
- What confused them: The demo stops after handoff and leaves the task in the active list.
- What they would need before using it: A simple archive command in the demo.
- What would make them recommend/star it: One README path that shows init, task, verify, handoff, archive.
- What would make them abandon it: A release page that points to a version they cannot install from npm.

### Claude Code Power User

- What they liked: Agent instructions and harness files are tool-agnostic.
- What confused them: Whether archived tasks remain available to agents.
- What they would need before using it: Docs that say archived Markdown stays in `.agentloop/tasks/archive/`.
- What would make them recommend/star it: Screenshots that show the loop as an audit trail, not a task manager.
- What would make them abandon it: Claims that archiving equals verification.

### Open Source Maintainer

- What they liked: The feature is small, auditable, and local.
- What confused them: The release ladder has several npm-pending versions.
- What they would need before using it: Changelog and final handoff that separate GitHub release readiness from npm registry status.
- What would make them recommend/star it: A tarball-backed GitHub release with clear notes.
- What would make them abandon it: Public docs that overstate adoption or publishing status.

### Developer Experience Designer

- What they liked: The visual assets make the workflow easier to understand.
- What confused them: The terminal demo omits the cleanup step after handoff.
- What they would need before using it: README copy with a crisp archive explanation.
- What would make them recommend/star it: The demo command order matches how agents should work.
- What would make them abandon it: A noisy README that adds methodology text without commands.

### Security Reviewer

- What they liked: The archive command moves one named file and refuses overwrites.
- What confused them: Whether the release process will try to publish automatically.
- What they would need before using it: Local verification, pack/dry-run, and GitHub release notes that say npm remains blocked if publishing fails.
- What would make them recommend/star it: No postinstall, no telemetry, no hidden network calls.
- What would make them abandon it: Any attempt to bypass npm authorization or fabricate registry availability.

## Product council debate

- Abhi: Ship a coherent `0.11.0` release candidate; task archive is a visible workflow improvement.
- Maya: Keep the release scoped to metadata, docs, visual assets, and pack verification.
- Elias: Use the README images to show the current CLI, but keep the npm note honest.
- Nora: Add archive to the VHS demo after handoff so the loop ends cleanly.
- Samir: Do not publish automatically. Verify pack contents and registry state.
- Lina: Agents will benefit from seeing archive as the cleanup step after verification and handoff.
- Tom: Do not add more methodology copy. Show commands and evidence.
- Rachel: This makes the open-source workflow more credible for teams without adding a platform feature.

## Decision

Prepare a `0.11.0` release candidate for task archiving. Update package metadata, changelog, release docs, README copy, Playwright screenshots, and the VHS terminal demo. Pack and dry-run locally, push to GitHub, create a GitHub release with a tarball asset, then verify npm registry state without claiming publish success.

## Non-decisions

- Do not attempt a cloud dashboard.
- Do not add task restore, bulk archive, or archive search in this release.
- Do not change npm trusted publishing settings from the CLI.
- Do not publish to npm unless npm authentication is available and the registry confirms the new version.

## Resulting tasks

- Bump package metadata to `0.11.0`.
- Add a `0.11.0` changelog entry.
- Update README and docs to reflect the archive lifecycle.
- Refresh Playwright screenshots and VHS demo assets.
- Run local verification, pack, dry-run, and packed CLI smoke tests.
- Update dogfood log, final handoff, launch checklist, and npm publishing notes.
- Commit, push, watch CI, tag, and create a GitHub release with notes and tarball.

## Success criteria

- README visuals and text show the current task lifecycle.
- The packed CLI reports `0.11.0`.
- Local verification, pack, dry-run, and smoke tests pass.
- GitHub CI passes after push.
- GitHub release notes state the actual npm status.
