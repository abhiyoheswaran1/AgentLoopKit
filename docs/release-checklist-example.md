# Release Checklist Example

Use this workflow when maintainers are preparing a normal AgentLoopKit release and need a concise evidence trail before publishing.

AgentLoopKit does not create tags, create GitHub releases, publish npm packages, read tokens, or call package registries for you. This checklist keeps release evidence in the repo so maintainers can decide the next safe step.

## When to use it

Use this workflow when:

- `package.json` and `CHANGELOG.md` are ready for the intended version;
- maintainers need proof that npm currently has the previous release;
- maintainers need a repeatable local release gate;
- maintainers need post-publish verification before updating docs.

Do not use current `main` to publish old versions. If you need an older version, use the matching GitHub tag or release tarball for that version.

## Task Contract

```bash
agentloop create-task --type release --title "Prepare AgentLoopKit release" \
  --problem-statement "Maintainers need package, verification, and registry evidence before publishing" \
  --desired-outcome "The release has matching metadata, local verification, npm proof, and clear next steps" \
  --likely-file CHANGELOG.md \
  --likely-file package.json \
  --likely-file docs/release-status.md \
  --likely-file docs/npm-publishing.md \
  --likely-file FINAL_HANDOFF.md \
  --forbidden-file README.md \
  --acceptance "package.json and CHANGELOG.md agree on the intended version" \
  --acceptance "The full local release gate passes" \
  --acceptance "Post-publish npm proof is recorded before claiming availability" \
  --acceptance "Post-publish release proof matches npm, GitHub Releases, GHCR, and MCP Registry" \
  --verification "agentloop npm-status --agentloopkit --expect-current" \
  --verification "npm run smoke:release" \
  --verification "npx pnpm@10.12.1 check:links" \
  --verification "npx projscan doctor --format markdown" \
  --rollback "Revert release metadata changes before publishing, or publish a corrective patch after a completed release"
```

## Evidence To Collect

- current package version in `package.json`;
- intended release version;
- `CHANGELOG.md` section for the intended version;
- `agentloop npm-status --agentloopkit --expect-current` before the version bump;
- lint, typecheck, test, build, and packed-release smoke results;
- packed tarball name and SHA-256;
- GitHub release URL after publication;
- npm version proof after publication;
- Docker, GHCR, MCP Registry, or other channel workflow URLs when those workflows run.
- `agentloop release-proof` output after public channel workflows finish.

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
