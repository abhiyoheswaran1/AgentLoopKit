# GitHub Actions

Use GitHub Actions to check whether a pull request has AgentLoopKit evidence.

AgentLoopKit does not install workflows into user repositories. Copy a recipe into `.github/workflows/` only after you inspect it.

For non-GitHub CI, see [GitLab CI](../examples/gitlab-ci/README.md) and [Buildkite](../examples/buildkite/README.md). Those examples run the same AgentLoopKit commands and report provider-specific provenance from allowlisted environment variables.

## npm Status

The current npm release is `agentloopkit@0.24.0`. Pin a version in CI when you need reproducible evidence checks.

Install from npm:

```bash
npm install --no-save agentloopkit@0.24.0
npx --no-install agentloop check-gates --strict
```

## Recipe 1: Committed Evidence Gate

Use this when contributors commit the task contract, verification report, and handoff summary with the pull request.

```yaml
name: AgentLoop Evidence

on:
  pull_request:

jobs:
  evidence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: 24

      - name: Install AgentLoopKit
        run: npm install --no-save agentloopkit@0.24.0

      - name: Check AgentLoop evidence
        run: npx --no-install agentloop check-gates --strict
```

This job does not run tests. It checks local evidence: task contract, verification report, handoff summary, harness files, safety policies, and git context.

## Recipe 2: CI-Generated Evidence Artifacts

Use this when CI should run verification, generate a handoff, and upload those files as build artifacts. This mode helps reviewers inspect evidence without committing generated reports back to the branch.

```yaml
name: AgentLoop Verification

on:
  pull_request:

jobs:
  agentloop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: 24

      - name: Install project dependencies
        run: npm ci

      - name: Install AgentLoopKit
        run: npm install --no-save agentloopkit@0.24.0

      - name: Run AgentLoop verification
        run: npx --no-install agentloop verify

      - name: Write verification badge
        run: npx --no-install agentloop badge

      - name: Write reviewer handoff
        run: npx --no-install agentloop handoff

      - name: Write HTML evidence report
        run: npx --no-install agentloop report

      - name: Write CI summary
        run: npx --no-install agentloop ci-summary --write

      - name: Write release notes
        run: npx --no-install agentloop release-notes --write

      - name: Check AgentLoop gates
        run: npx --no-install agentloop check-gates --strict

      - name: Upload AgentLoop reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: agentloop-evidence
          path: |
            .agentloop/reports/*.md
            .agentloop/reports/*.html
            .agentloop/reports/*.svg
            .agentloop/handoffs/*.md
```

This workflow does not commit generated files. It uploads reports, HTML reports, badges, CI summaries, and handoffs as CI artifacts.

The verification report includes a `CI Context` section when GitHub Actions, GitLab CI, or Buildkite creates it. Reviewers can see provider, workflow or pipeline, event, ref, commit, and run URL inside the Markdown artifact. GitHub Actions also includes run attempt when available.

`agentloop ci-summary --write` adds a small Markdown summary with the same allowlisted CI provenance plus current AgentLoop evidence and gate status. It does not call GitHub APIs, read secrets, run verification commands, or replace the verification report.

## Required Repository Files

Both recipes expect the repository to contain:

- `AGENTS.md`
- `AGENTLOOP.md`
- `agentloop.config.json`
- `.agentloop/`
- at least one task contract in `.agentloop/tasks/`

Run `agentloop init` and `agentloop create-task` before relying on CI gates.

## Failure Semantics

- `agentloop verify` exits non-zero when a configured command fails.
- `agentloop badge` writes a local SVG badge from existing evidence.
- `agentloop handoff` writes a deterministic reviewer summary.
- `agentloop report` writes a static HTML evidence artifact from local files.
- `agentloop ci-summary` summarizes CI context and AgentLoop evidence without running checks.
- `agentloop release-notes` drafts release notes from local package, changelog, git, task, verification, and CI-summary evidence.
- `agentloop check-gates` exits non-zero when a required gate fails.
- `agentloop check-gates --strict` also exits non-zero when any gate warns.

`check-gates` checks evidence. It does not prove the code is correct and does not replace review.

## Package Manager Variants

If the project uses pnpm:

```yaml
- uses: pnpm/action-setup@v6
- uses: actions/setup-node@v6
  with:
    node-version: 24
    cache: pnpm
- run: pnpm install --frozen-lockfile
- run: pnpm exec agentloop verify
```

If the project pins AgentLoopKit as a dev dependency, prefer the package manager's local binary runner:

```bash
pnpm exec agentloop check-gates --strict
npx --no-install agentloop check-gates --strict
```

## Security Notes

- Do not upload `.env` files.
- Do not print secret values.
- `agentloop verify` and `agentloop ci-summary` do not dump arbitrary environment variables. They only record allowlisted CI provenance fields.
- Do not grant write permissions unless another workflow step needs them.
- Do not let CI commit generated reports unless maintainers explicitly want that behavior.
