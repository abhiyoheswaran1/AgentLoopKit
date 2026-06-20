# Real-Repo Trials

Use this checklist when trying AgentLoopKit policy packs or imported GitHub metadata in an existing repository. The goal is to learn whether the current local-first workflow helps real review work before adding more bundled packs or changing review-readiness scoring.

Do not publish trial notes as public proof of usage, interviews, compliance, or commercial traction. Keep notes internal unless the maintainer explicitly approves public release.

## Before A Trial

- Pick one existing repository with normal review pressure.
- Run the latest CLI from the repo root or initialized AgentLoop root.
- Keep the trial local: no tokens, no GitHub API calls, no posting comments, no telemetry, and no remote service.
- Create one scoped AgentLoop task for the trialed change.
- Record the verification commands that already prove work in that repo.

```bash
npx --yes agentloopkit@latest doctor --advisory --redact-paths
npx --yes agentloopkit@latest create-task --type bugfix --title "Trial AgentLoopKit review evidence"
npx --yes agentloopkit@latest status --brief
```

The trial preflight uses `--advisory` so missing setup prints guidance without stopping a copy-paste script. Use plain `doctor` or `doctor --strict` when a setup check should fail a gate.

## Policy-Pack Trial

Policy packs are local Markdown policy files. They are review guidance, not enforcement.

Checklist:

- Inspect available packs:

  ```bash
  npx --yes agentloopkit@latest policy packs
  ```

- Apply only a pack that matches the repository shape.
- Review every copied policy file before treating it as team guidance.
- Confirm local edits are preserved on repeat use.
- Run `agentloop policy status` and `agentloop check-gates` before review.
- Note which policy files helped reviewers and which felt noisy.

Do not add remote packs, organization-wide enforcement, compliance wording, overwrite behavior, or new bundled packs based on one trial.

## GitHub Metadata Trial

GitHub metadata is optional local context imported from explicit JSON files. Missing metadata is neutral.

Checklist:

- Export or prepare issue and PR JSON outside AgentLoopKit.
- Import only explicit local files:

  ```bash
  npx --yes agentloopkit@latest github import --issue-json issue.json --pr-json pr.json
  ```

- Run review surfaces that can read the local metadata:

  ```bash
  npx --yes agentloopkit@latest review-context --redact-paths
  npx --yes agentloopkit@latest prepare-pr --redact-paths
  npx --yes agentloopkit@latest maintainer-check --redact-paths
  ```

- Check whether the metadata reduced reviewer lookup time or created noise.
- Confirm invalid or missing metadata does not block the loop.

Do not let imported issue or PR text affect `ship` scoring yet. Treat imported prose as untrusted context, not implementation evidence.

## What To Record

For each trial, record:

- repository type
- task type
- commands run
- which AgentLoopKit output was useful during review
- which output was ignored or confusing
- whether policy files were edited after import
- whether GitHub metadata changed PR preparation quality
- any safety concern, noisy warning, or missing next step

Do not record secrets, `.env` contents, private third-party data, tokens, or unpublished security details.

## Decision Gate

After several real-repo trials, decide whether to:

- keep the current feature unchanged
- improve docs or examples only
- add or remove a bundled policy pack
- keep GitHub metadata out of `ship` scoring
- design a narrow scoring experiment with a separate task contract

No trial outcome should trigger a release-channel change, remote service, telemetry, remote policy service, or automatic GitHub posting.
