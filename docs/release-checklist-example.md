# Release Checklist Example

Use this workflow only if a future GitHub release is current while npm still serves an older package.

AgentLoopKit does not create tags, create GitHub releases, publish npm packages, read tokens, or call package registries for you. This checklist keeps release evidence in the repo so maintainers can decide the next safe manual step.

## When to use it

Use this workflow when:

- GitHub has the current release tarball;
- npm publish failed or is still blocked by authentication;
- maintainers need a temporary GitHub tarball command for a documented incident;
- maintainers need proof of verification before retrying npm publish.

Do not use current `main` to backfill stale npm versions. If you need an older version, use the matching GitHub tag or release tarball for that version.

## Task contract

```bash
agentloop create-task --type release --title "Document current release state" \
  --problem-statement "GitHub release is current but npm still serves an older package" \
  --desired-outcome "Maintainers can see verification, tarball, npm state, and next publish step" \
  --likely-file docs/release-status.md \
  --likely-file docs/npm-publishing.md \
  --likely-file FINAL_HANDOFF.md \
  --forbidden-file README.md \
  --forbidden-file package.json \
  --forbidden-file CHANGELOG.md \
  --acceptance "Current GitHub release and npm latest are documented" \
  --acceptance "Docs say not to backfill stale npm versions from current main" \
  --verification "npm view agentloopkit version versions --json" \
  --verification "npx pnpm@10.12.1 check:links" \
  --verification "npx projscan doctor --format markdown" \
  --rollback "Revert release-status documentation changes"
```

## Evidence to collect

- current package version in `package.json`
- current GitHub release tag and asset name
- tarball SHA-256 if available
- `npm view agentloopkit version versions --json`
- `agentloop npm-status` or `agentloop npm-status --registry-json <captured-json>`
- package checks run
- packed-tarball smoke result if a tarball exists
- publish workflow URL and failure reason, if npm publish failed
- next human action: trusted publishing setup or manual browser/OTP publish

## Temporary install guidance

When npm lags behind GitHub, docs may include a temporary tarball command:

```bash
npx --yes --package https://github.com/OWNER/REPO/releases/download/vX.Y.Z/agentloopkit-X.Y.Z.tgz agentloop version
```

Remove that fallback after `npm view agentloopkit version` reports the current release or a newer one.

## Handoff checklist

Before stopping, write a handoff that states:

- release tag;
- npm latest;
- npm versions listed by the registry;
- verification commands and results;
- `agentloop npm-status` result;
- whether npm publish was attempted;
- why any publish failed;
- exact next maintainer action;
- rollback or correction path for stale docs.

Do not claim npm availability until the registry proves it.

## Example

See [`../examples/release-checklist/README.md`](../examples/release-checklist/README.md) for a sample release task, verification report, and maintainer handoff.
