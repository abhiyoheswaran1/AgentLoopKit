# GitHub Actions

Use GitHub Actions to check whether a pull request has AgentLoopKit evidence.

AgentLoopKit does not install workflows into user repositories. Copy a recipe into `.github/workflows/` only after you inspect it.

For non-GitHub CI, see [GitLab CI](../examples/gitlab-ci/README.md) and [Buildkite](../examples/buildkite/README.md). Those examples run the same AgentLoopKit commands and report provider-specific provenance from allowlisted environment variables.

## GitHub Marketplace Action

AgentLoopKit includes a composite GitHub Action for teams that want a short CI step instead of writing the npm install command by hand.

Use it for static, trusted commands such as `check-gates --strict`, `ship --github-comment`, `prepare-pr --github-comment`, or `maintainer-check --redact-paths`. Keep the `command`, `agentloopkit-version`, and `install-mode` values under maintainer control. Do not build those inputs from pull request titles, issue text, branch names, comments, or other user-controlled strings.

The Action installs AgentLoopKit from npm by default, then runs the command through a Node wrapper that uses argument arrays instead of shell interpolation. The wrapper rejects shell metacharacters and only accepts `latest` or exact semver package versions.

AgentLoopKit does not post comments, read GitHub tokens, upload artifacts, publish packages, or change repository settings. If a workflow needs to post the Markdown from `ship --github-comment` or `prepare-pr --github-comment`, use a separate GitHub Actions step with explicit `pull-requests: write` permission.

## npm Install

Use `@latest` while evaluating the workflow. Pin a vetted version in team CI when you need reproducible evidence checks.

Install from npm:

```bash
npm install --no-save agentloopkit@latest
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
        run: npm install --no-save agentloopkit@latest

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
        run: npm install --no-save agentloopkit@latest

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

## Recipe 3: PR Readiness Comment

Use this when CI should post AgentLoopKit review-readiness Markdown on a pull request. AgentLoopKit generates the comment body. GitHub Actions posts it with the workflow token.

```yaml
name: AgentLoop PR Readiness

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  readiness:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - uses: actions/setup-node@v6
        with:
          node-version: 24

      - name: Install project dependencies
        run: npm ci

      - name: Install AgentLoopKit
        run: npm install --no-save agentloopkit@latest

      - name: Run AgentLoop verification
        run: npx --no-install agentloop verify

      - name: Generate AgentLoop readiness comment
        run: npx --no-install agentloop ship --github-comment > agentloop-pr-comment.md

      - name: Post AgentLoop PR comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const body = fs.readFileSync('agentloop-pr-comment.md', 'utf8');
            const marker = '<!-- agentloopkit-review-readiness -->';
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            const previous = comments.data.find((comment) => comment.body?.includes(marker));
            const nextBody = `${marker}\n${body}`;
            if (previous) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: previous.id,
                body: nextBody,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: nextBody,
              });
            }
```

This recipe uses `pull-requests: write` only for the comment step. AgentLoopKit writes local evidence and prints Markdown. It does not read GitHub tokens, call GitHub APIs, or post comments itself.

## Recipe 4: Composite Action Wrapper

Use the Marketplace Action when you want a shorter workflow step around the same npm package:

The action defaults to npm `latest`. Set `agentloopkit-version` when you want CI to use a reviewed package version.

Keep `command` static and trusted. Do not pass untrusted pull request or user input to command.
Keep `agentloopkit-version` static and trusted. Do not pass untrusted pull request or user input to agentloopkit-version.
Keep `install-mode` static and trusted. Use `install-mode: npm` to install from npm. Use `install-mode: local` only when the repo already installs AgentLoopKit as a dev dependency.

```yaml
name: AgentLoop Action

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

      - uses: abhiyoheswaran1/AgentLoopKit@v<version>
        with:
          command: check-gates --strict
          agentloopkit-version: <version>
          install-mode: npm
```

The action installs `agentloopkit` with npm and runs the command you provide through a small Node wrapper that uses argument arrays instead of shell interpolation. The wrapper accepts `latest` or exact semver package versions, rejects shell metacharacters in `command`, and keeps `install-mode` to `npm` or `local`.

In npm mode it uses `--package-lock=false` so the CI step does not rewrite package lockfiles. It does not upload artifacts, comment on pull requests, read secrets, or replace the direct npm recipes above.

Use local mode only after the workflow has installed the project dependencies:

```yaml
- run: npm ci
- uses: abhiyoheswaran1/AgentLoopKit@v<version>
  with:
    command: check-gates --strict
    install-mode: local
```

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
- `agentloop ship` writes a review-readiness ship report, local run ledger entry, and optional GitHub-comment Markdown.
- `agentloop prepare-pr` generates PR copy and optional GitHub-comment Markdown.
- `agentloop maintainer-check` exits non-zero only when required review evidence fails.
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
- Do not pass untrusted pull request or user input to command.
- Do not pass untrusted pull request or user input to agentloopkit-version.
- The composite action validates those inputs, but static workflow values remain easier to review.
- Do not grant write permissions unless another workflow step needs them.
- Do not let CI commit generated reports unless maintainers explicitly want that behavior.
