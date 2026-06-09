# GitHub Actions

Use GitHub Actions to check whether a pull request has AgentLoopKit evidence.

AgentLoopKit does not install workflows into user repositories. Copy a recipe into `.github/workflows/` only after you inspect it.

## npm Status

CI context, doctor risk details, and the real schema URL are in the `v0.15.1` GitHub release. npm still serves `agentloopkit@0.1.1` until publishing auth is repaired.

After npm catches up, use:

```bash
npx agentloopkit check-gates --strict
```

Until then, pin the GitHub release tarball in CI:

```bash
npm install --no-save https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.15.1/agentloopkit-0.15.1.tgz
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
        run: npm install --no-save https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.15.1/agentloopkit-0.15.1.tgz

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
        run: npm install --no-save https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.15.1/agentloopkit-0.15.1.tgz

      - name: Run AgentLoop verification
        run: npx --no-install agentloop verify

      - name: Write verification badge
        run: npx --no-install agentloop badge

      - name: Write reviewer handoff
        run: npx --no-install agentloop handoff

      - name: Write HTML evidence report
        run: npx --no-install agentloop report

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

This workflow does not commit generated files. It uploads reports, HTML reports, badges, and handoffs as CI artifacts.

The verification report includes a `CI Context` section when GitHub Actions creates it. Reviewers can see the workflow, event, ref, commit, run URL, and run attempt inside the Markdown artifact.

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
- `agentloop verify` does not dump arbitrary environment variables. It only records allowlisted CI provenance fields.
- Do not grant write permissions unless another workflow step needs them.
- Do not let CI commit generated reports unless maintainers explicitly want that behavior.
