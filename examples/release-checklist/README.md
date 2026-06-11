# Release Checklist Example

This example shows how maintainers can document normal release readiness before publishing AgentLoopKit.

AgentLoopKit does not publish, tag, or create releases in this workflow. The artifacts help maintainers keep package metadata, verification evidence, and post-publish proof clear.

## Command Starter

```bash
agentloop npm-status --agentloopkit --expect-current
agentloop release-notes --release-version <version> --write
agentloop verify --task .agentloop/tasks/YYYY-MM-DD-prepare-agentloopkit-release.md
agentloop handoff --task .agentloop/tasks/YYYY-MM-DD-prepare-agentloopkit-release.md
```

## What To Record

- intended release version;
- package metadata and changelog status;
- verification report path;
- packed tarball name and SHA-256;
- GitHub release URL after publication;
- npm latest and version-list proof after publication;
- Docker, GHCR, MCP Registry, or other release-channel workflow URLs when they run;
- exact next maintainer action if any step remains incomplete.

## Example Artifacts

- `.agentloop/tasks/YYYY-MM-DD-prepare-agentloopkit-release.md`
- `.agentloop/reports/YYYY-MM-DD-HH-MM-verification-report.md`
- `.agentloop/handoffs/YYYY-MM-DD-HH-MM-release-handoff.md`

Replace version numbers, URLs, and tarball digests with current evidence from the release being documented.
