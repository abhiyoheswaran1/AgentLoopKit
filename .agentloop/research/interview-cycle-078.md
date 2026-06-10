# Interview Cycle 78

## Context

AgentLoopKit can create task contracts, verification reports, PR handoffs, HTML reports, evidence badges, gate checks, and CI summaries. GitHub `v0.19.0` is public, but npm is still blocked by account/trusted-publishing authorization. Maintainers still write release notes manually from changelog, git state, and AgentLoop evidence.

## Personas interviewed

- Open Source Maintainer
- Startup CTO
- Power User / Agentic Engineer
- Skeptical Senior Developer
- Security Reviewer

## Feedback summary

The strongest signal is release handoff quality. Users can already verify and summarize work, but release notes still require hand assembly from several local artifacts. A deterministic release-notes command would help maintainers ship GitHub releases, npm catch-up notes, and reviewer-facing release evidence without adding a release bot or external API dependency.

## Raw simulated feedback

### Open Source Maintainer

- What they liked: Existing handoffs and release docs are honest about npm status.
- What confused them: Release notes still require manually combining changelog, git range, verification, and package status.
- What they would need before using it: A Markdown release note draft they can review before publishing.
- What would make them recommend/star it: A local command that reduces release work without publishing anything.
- What would make them abandon it: Automation that creates tags, releases, or npm publishes without explicit action.

### Startup CTO

- What they liked: The release process creates audit evidence.
- What confused them: Teams need a consistent release summary after long agent sessions.
- What they would need before using it: JSON and Markdown output for internal release workflows.
- What would make them recommend/star it: A repeatable release handoff with risks, verification, and rollback notes.
- What would make them abandon it: A heavyweight release-management system.

### Power User / Agentic Engineer

- What they liked: `handoff`, `ci-summary`, and `check-gates` already work well together.
- What confused them: It is not obvious which command to run when packaging a release.
- What they would need before using it: A command that reads active task, latest verification, package version, changelog, and local git range.
- What would make them recommend/star it: Release notes that agents can draft without LLM calls.
- What would make them abandon it: Network calls or brittle assumptions about GitHub release conventions.

### Skeptical Senior Developer

- What they liked: Deterministic output is easier to trust than AI-written release copy.
- What confused them: A release note command could become vague marketing copy.
- What they would need before using it: Plain facts: version, range, changed files, verification status, known limitations, next steps.
- What would make them recommend/star it: Notes that make review easier.
- What would make them abandon it: Claims that the tool inferred semantic changes it cannot prove.

### Security Reviewer

- What they liked: Existing release docs keep npm auth failures transparent.
- What confused them: Release tooling often drifts into token handling.
- What they would need before using it: No GitHub API, npm API, token reads, tag mutation, publishing, or hidden uploads.
- What would make them recommend/star it: Safe local release evidence.
- What would make them abandon it: Anything that reads credentials or silently mutates release state.

## Product council debate

- Abhi: This improves launch discipline while keeping the wedge local and npm-based.
- Maya: Use small git helpers and plain parsing. Do not build semantic-release.
- Elias: Good release notes help GitHub adoption and maintainer trust.
- Nora: Make Markdown the default and give one clear next step.
- Samir: The command must be read-only unless `--write` is passed.
- Lina: Include active task, latest verification, latest CI summary if available, and changed files.
- Tom: Avoid “AI summary” language. This is a deterministic draft.
- Rachel: This is team-useful without pulling the product toward SaaS.

## Decision

Add `agentloop release-notes` with Markdown output, `--json`, and `--write`. It reads local package metadata, changelog context, git range, changed files, active/latest task, verification evidence, and CI summary evidence. It does not create tags, publish npm packages, call GitHub, call npm, read tokens, or upload anything.

## Non-decisions

- No release publishing.
- No GitHub release creation.
- No npm publish retry.
- No semantic version inference.
- No changelog rewriting.
- No hosted release dashboard.

## Resulting tasks

- Add release-notes core generation and CLI command.
- Add tests for Markdown, JSON, write behavior, git-range fallback, and safety boundaries.
- Add command completion entry.
- Update README, release docs, generated harness guidance, changelog, roadmap, backlog, dogfood log, and final handoff.
- Bump package metadata for the new command once implementation is verified.

## Success criteria

- `agentloop release-notes` prints reviewer-ready local release notes.
- `agentloop release-notes --json --write` writes `.agentloop/handoffs/YYYY-MM-DD-HH-mm-release-notes.md`.
- The command handles missing git tags honestly.
- The command is local-only and read-only unless writing the requested handoff artifact.
- Vitest, typecheck, build, link checks, projscan, package dry-run, tarball smoke, and CI pass.
