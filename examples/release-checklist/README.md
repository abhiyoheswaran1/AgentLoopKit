# Release Checklist Example

This example shows how maintainers can document release readiness if a future GitHub release is current but npm still serves an older package.

AgentLoopKit does not publish, tag, or create releases in this workflow. The artifacts help maintainers keep the incident state clear before they retry npm publishing or update maintainer docs.

## Command starter

```bash
agentloop release-notes --release-version <version> --write
agentloop verify --task .agentloop/tasks/2026-06-10-document-current-release-state.md
agentloop handoff --task .agentloop/tasks/2026-06-10-document-current-release-state.md
```

## What to record

- GitHub release tag and URL
- attached tarball name
- tarball SHA-256 when available
- npm latest and full version list
- verification report path
- publish workflow URL and failure reason
- temporary tarball command, if maintainers approve one for the incident
- next maintainer action

## Example artifacts

- `.agentloop/tasks/2026-06-10-document-current-release-state.md`
- `.agentloop/reports/2026-06-10-12-00-verification-report.md`
- `.agentloop/handoffs/2026-06-10-12-05-release-handoff.md`

Replace version numbers, URLs, and tarball digests with current evidence from the release being documented.
