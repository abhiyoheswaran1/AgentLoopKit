# Interview Cycle 102

## Context

AgentLoopKit documents the GitHub-current/npm-lag state and now has a release-checklist example. Maintainers still need a safe command that turns `npm view` evidence into a clear local status without publishing or touching credentials. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Open Source Maintainer
- Security Reviewer
- AI-Skeptical Senior Engineer
- Developer Experience Designer
- Founder / Product Lead

## Feedback summary

The strongest signal is a small trust command. Maintainers should not have to interpret npm registry JSON by hand after each release attempt. The command must stay read-only, name exactly what it checked, and avoid any publish automation.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Release docs now explain why npm may jump to the current source line.
- What confused them: The exact registry check still lives as a command users must remember.
- What they would need before using it: One command that says whether npm latest matches local package metadata.
- What would make them recommend/star it: A safe post-publish smoke check for README and release notes.
- What would make them abandon it: A command that publishes, tags, or hides registry failures.

### Security Reviewer

- What they liked: The proposed scope uses `npm view`, not `npm publish`.
- What confused them: Whether the command reads npm auth tokens or environment files.
- What they would need before using it: A visible safety section in human output.
- What would make them recommend/star it: Captured-JSON mode for CI or evidence replay.
- What would make them abandon it: Credential access or implicit network calls outside explicit command execution.

### AI-Skeptical Senior Engineer

- What they liked: Deterministic registry comparison beats release optimism.
- What confused them: Whether "behind" means semver ordering or simple latest mismatch.
- What they would need before using it: Plain wording: npm latest differs from local version.
- What would make them recommend/star it: Non-zero mode only when explicitly requested.
- What would make them abandon it: A command that treats a failed network call as success.

### Developer Experience Designer

- What they liked: `agentloop npm-status` is easy to remember.
- What confused them: Users may not know what action to take after a mismatch.
- What they would need before using it: A next-step recommendation that says not to backfill stale versions from current `main`.
- What would make them recommend/star it: JSON output for automation and clear terminal copy for humans.
- What would make them abandon it: Too much release history in the command output.

### Founder / Product Lead

- What they liked: This protects launch credibility while npm catches up.
- What confused them: The command should not grow into release management.
- What they would need before using it: A focused npm catch-up smoke check.
- What would make them recommend/star it: Safer public launch messaging after publish.
- What would make them abandon it: Premature SaaS, dashboards, or release automation.

## Product council debate

- Abhi: Build the trust check. Keep it tiny.
- Maya: Separate registry parsing from CLI output and test it without network.
- Elias: Add the command to README and publishing docs.
- Nora: Human output needs a clear status and next step.
- Samir: State what the command does not do. No token reads, no publish, no env inspection.
- Lina: Agents can use this after release tasks to avoid bad npm claims.
- Tom: Do not say "behind" unless the command also prints the exact latest and local versions.
- Rachel: `--expect-current` helps teams wire a post-publish CI smoke check later.

## Decision

Add `agentloop npm-status` as a read-only npm registry catch-up check.

## Non-decisions

- Do not automate npm publishing.
- Do not create tags or GitHub releases.
- Do not add a release dashboard.
- Do not read credentials, npm tokens, or `.env` files.
- Do not change package metadata in this cycle.

## Resulting tasks

- Add a core npm-status module with package metadata reading, registry JSON parsing, status classification, Markdown rendering, and JSON output.
- Add a CLI command with `--json`, `--expect-current`, `--registry-json`, `--package-name`, and `--local-version`.
- Add shell completion entries.
- Add Vitest coverage for parsing, mismatch detection, strict failure, and completions.
- Update README, npm publishing docs, release-status docs, backlog, dogfood log, and final handoff.

## Success criteria

- `agentloop npm-status` explains whether npm latest matches local package metadata.
- The command never publishes or reads credentials.
- Tests can run without network through captured registry JSON.
- `--expect-current` exits non-zero when npm latest does not match local version.
- Docs show the command as a release smoke check, not a release automation system.
