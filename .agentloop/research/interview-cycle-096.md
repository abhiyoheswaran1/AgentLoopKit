# Interview Cycle 96

## Context

GitLab CI and Buildkite examples now exist, but AgentLoopKit still labels those providers as Generic CI in verification reports and CI summaries. This cycle is simulated internal product-panel feedback, not real user research.

## Personas interviewed

- Platform Engineer
- Startup CTO
- Security Reviewer
- AI-Skeptical Senior Engineer
- Power User / Agentic Engineer

## Feedback summary

The strongest signal is trustworthy provenance. Provider examples become more useful when reports name the CI system that created them, but the implementation must stay local, allowlisted, and free of provider API calls.

## Raw simulated feedback

### Platform Engineer

- What they liked: GitLab CI and Buildkite examples reuse the same local commands.
- What confused them: Reports still say Generic CI even in provider-specific pipelines.
- What they would need before using it: Provider name, ref, commit, and run URL in the evidence artifact.
- What would make them recommend/star it: Useful provenance without central service integration.
- What would make them abandon it: A broad environment dump.

### Startup CTO

- What they liked: CI evidence helps teams review agent-generated work.
- What confused them: Generic CI makes artifacts harder to trace.
- What they would need before using it: A direct link from report to pipeline/build.
- What would make them recommend/star it: The same workflow works across common CI providers.
- What would make them abandon it: Required cloud dashboard or token setup.

### Security Reviewer

- What they liked: The current GitHub implementation reads an allowlist.
- What confused them: Adding providers can tempt token and URL leakage.
- What they would need before using it: Explicit allowlists and tests proving unrelated values do not print.
- What would make them recommend/star it: No API calls, no token reads, no `.env` reads.
- What would make them abandon it: Reading arbitrary environment variables.

### AI-Skeptical Senior Engineer

- What they liked: The output is deterministic and inspectable.
- What confused them: Whether provider detection changes verification behavior.
- What they would need before using it: Proof that commands and exit codes stay unchanged.
- What would make them recommend/star it: Reports become easier to audit without adding magic.
- What would make them abandon it: Hidden network behavior.

### Power User / Agentic Engineer

- What they liked: Agents can hand reviewers one report.
- What confused them: Generic CI misses useful context in long autonomous sessions.
- What they would need before using it: Provider-specific links in `verify` and `ci-summary`.
- What would make them recommend/star it: Better reviewer handoffs across teams.
- What would make them abandon it: Provider-specific setup steps.

## Product council debate

- Abhi: This strengthens the local-first team story without becoming a SaaS.
- Maya: Keep one shared `detectCiContext` path and add tests before code.
- Elias: Update docs so GitLab and Buildkite no longer say Generic CI.
- Nora: Use the same labels in reports, summaries, and docs.
- Samir: Block token-like env values and arbitrary dumps.
- Lina: This improves long-session handoffs.
- Tom: Make the output boring: provider, pipeline, event, ref, commit, URL.
- Rachel: Teams can use this in mixed CI environments.

## Decision

Add GitLab CI and Buildkite provider detection to the existing local CI context helper using documented non-secret environment variables only.

## Non-decisions

- Do not call provider APIs.
- Do not add workflow installation.
- Do not add dashboard or storage.
- Do not read tokens, credentials, `.env` files, or arbitrary environment variables.

## Resulting tasks

- Add red tests for GitLab CI and Buildkite verification reports.
- Add red tests for GitLab CI and Buildkite `ci-summary --json --write`.
- Extend provider type and detection helper.
- Update docs and examples to describe provider-specific provenance.
- Verify with focused tests, full tests, link checks, projscan, and AgentLoop verification.

## Success criteria

- Focused tests fail before implementation and pass after.
- Verification reports identify GitLab CI and Buildkite with allowlisted fields.
- CI summaries identify GitLab CI and Buildkite with allowlisted fields.
- Docs describe provider-specific support honestly.
