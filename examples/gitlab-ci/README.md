# GitLab CI Example

These snippets show how a repository can use AgentLoopKit in GitLab CI. They are examples only. AgentLoopKit does not install or edit `.gitlab-ci.yml`.

AgentLoopKit records GitLab CI provenance from allowlisted environment variables such as project path, pipeline source, ref, commit, and pipeline URL. The commands produce local verification reports, handoffs, badges, reports, and CI summaries without calling GitLab APIs.

## Evidence Gate

Use this when task contracts, verification reports, and handoff summaries are committed with the merge request.

```yaml
agentloop-evidence:
  image: node:24
  stage: test
  before_script:
    - npm install --no-save agentloopkit@latest
  script:
    - npx --no-install agentloop check-gates --strict
```

## Verification Artifacts

Use this when CI should create AgentLoopKit artifacts and expose them to reviewers without committing generated files.

```yaml
agentloop-verification:
  image: node:24
  stage: test
  before_script:
    - npm ci
    - npm install --no-save agentloopkit@latest
  script:
    - npx --no-install agentloop verify
    - npx --no-install agentloop badge
    - npx --no-install agentloop handoff
    - npx --no-install agentloop report
    - npx --no-install agentloop ci-summary --write
    - npx --no-install agentloop check-gates --strict
  artifacts:
    when: always
    paths:
      - .agentloop/reports/
      - .agentloop/handoffs/
```

Security notes:

- Do not upload `.env` files.
- Do not print secret values.
- AgentLoopKit does not call GitLab APIs or read GitLab tokens.
- `ci-summary` reads allowlisted CI metadata only and does not run tests.

See [GitLab job artifacts documentation](https://docs.gitlab.com/ci/jobs/job_artifacts/) for `artifacts: paths` and `artifacts: when`.
