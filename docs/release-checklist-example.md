# Release Checklist Example

Use this workflow when maintainers are preparing a normal AgentLoopKit release and need a concise evidence trail before publishing.

AgentLoopKit does not create tags, create GitHub releases, publish npm packages, read tokens, or call package registries for you. This checklist keeps release evidence in the repo so maintainers can decide the next safe step.

## When to use it

Use this workflow when:

- maintainers are about to prepare `package.json` and `CHANGELOG.md` for the intended version;
- maintainers need proof that npm currently matches local package metadata before a version bump, or an explicit note that metadata has already moved ahead of npm;
- maintainers need a repeatable local release gate;
- maintainers need post-publish verification before updating docs.

Do not use current `main` to publish old versions. If you need an older version, use the matching GitHub tag or release tarball for that version.

## Task Contract

```bash
agentloop create-task --type release --title "Prepare AgentLoopKit release" \
  --problem-statement "Maintainers need package, verification, and registry evidence before publishing" \
  --desired-outcome "The release has phased pre-bump evidence, local verification, post-publish proof, and clear next steps" \
  --likely-file CHANGELOG.md \
  --likely-file package.json \
  --likely-file docs/release-status.md \
  --likely-file docs/npm-publishing.md \
  --likely-file FINAL_HANDOFF.md \
  --forbidden-file README.md \
  --acceptance "Pre-bump npm proof is recorded before package metadata changes, or the version gap is explained" \
  --acceptance "package.json and CHANGELOG.md agree on the intended version before release-flow runs" \
  --acceptance "The full local release gate passes" \
  --acceptance "Post-publish npm and release-proof results are recorded before availability claims" \
  --verification "npm run release-flow" \
  --verification "npx projscan doctor --format markdown" \
  --rollback "Revert release metadata changes before publishing, or publish a corrective patch after a completed release"
```

## Pre-Bump Evidence

Collect this before package metadata changes when possible:

- current package version in `package.json`;
- `agentloop npm-status --agentloopkit --expect-current` while local package metadata still matches npm latest;
- if package metadata has already moved ahead of npm, record that version gap explicitly instead of treating the npm-status failure as a release-flow failure.

## Local Release Verification

Collect this after release metadata is ready and before publishing:

- intended release version;
- `CHANGELOG.md` section for the intended version;
- `npm run release-flow` result;
- lint, typecheck, test, build, link-check, non-strict dogfood, and packed-release smoke results from `release-flow`;
- strict dogfood and release-check results after fresh verification and handoff or ship evidence exists;
- packed tarball name and SHA-256;

## Post-Publish Proof

Collect this only after the GitHub Release and public channel workflows finish:

- `agentloop npm-status --agentloopkit --expect-current`;
- `agentloop release-proof`;
- GitHub release URL after publication;
- npm version proof after publication;
- Docker, GHCR, MCP Registry, or other channel workflow URLs when those workflows run.

## Handoff Checklist

Before stopping, write a handoff that states:

- intended release version;
- local verification commands and results;
- package tarball path and digest;
- whether the GitHub release was created;
- whether npm published through trusted publishing;
- post-publish `agentloop npm-status --agentloopkit --expect-current` result;
- post-publish `agentloop release-proof` result;
- exact next maintainer action if any step is incomplete;
- rollback or corrective-release path.

Do not claim npm availability until the registry proves it.

## Example

See [`../examples/release-checklist/README.md`](../examples/release-checklist/README.md) for a sample release task, verification report, and maintainer handoff.
