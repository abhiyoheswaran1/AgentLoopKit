# Buildkite Example

These snippets show how a repository can use AgentLoopKit in a Buildkite pipeline. They are examples only. AgentLoopKit does not install or edit `pipeline.yml`.

AgentLoopKit records Buildkite provenance from allowlisted environment variables such as pipeline slug, source, branch, commit, and build URL. The commands produce local verification reports, handoffs, badges, reports, and CI summaries without calling Buildkite APIs.

## Evidence Gate

Use this when task contracts, verification reports, and handoff summaries are committed with the pull request.

```yaml
steps:
  - label: "AgentLoop evidence gate"
    commands:
      - npm install --no-save agentloopkit@latest
      - npx --no-install agentloop check-gates --strict
```

## Verification Artifacts

Use this when CI should create AgentLoopKit artifacts and expose them to reviewers without committing generated files.

```yaml
steps:
  - label: "AgentLoop verification"
    commands:
      - npm ci
      - npm install --no-save agentloopkit@latest
      - npx --no-install agentloop verify
      - npx --no-install agentloop badge
      - npx --no-install agentloop handoff
      - npx --no-install agentloop report
      - npx --no-install agentloop ci-summary --write
      - npx --no-install agentloop check-gates --strict
    artifact_paths:
      - ".agentloop/reports/*.md"
      - ".agentloop/reports/*.html"
      - ".agentloop/reports/*.svg"
      - ".agentloop/handoffs/*.md"
```

Security notes:

- Do not upload `.env` files.
- Do not print secret values.
- AgentLoopKit does not call Buildkite APIs or read Buildkite tokens.
- `ci-summary` reads allowlisted CI metadata only and does not run tests.

See [Buildkite build artifacts documentation](https://buildkite.com/docs/pipelines/configure/artifacts) for `artifact_paths`.
