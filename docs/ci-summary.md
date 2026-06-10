# CI Summaries

`agentloop ci-summary` summarizes CI provenance and local AgentLoop evidence without running checks.

Run:

```bash
agentloop ci-summary
agentloop ci-summary --json
agentloop ci-summary --write
agentloop ci-summary --write --out .agentloop/reports/ci-summary.md
```

The command reads:

- allowlisted CI metadata
- active or latest task contract
- latest `*-verification-report.md`
- latest `*-pr-summary.md`
- local gate status from `check-gates`

When GitHub Actions runs it, the summary can include workflow, event, ref, commit, run URL, and run attempt. When another CI system sets `CI=true`, the summary reports Generic CI.

## Output

Human output is Markdown:

```text
# AgentLoopKit CI Summary

- Provider: GitHub Actions
- Verification: pass - .agentloop/reports/2026-06-10-12-00-verification-report.md
- Gates: pass
```

JSON output includes the same CI context, evidence paths, gate statuses, next action, and optional `writtenPath`.

## Written Artifacts

`--write` creates:

```text
.agentloop/reports/YYYY-MM-DD-HH-mm-ci-summary.md
```

CI summaries are review artifacts. They do not replace verification reports. Commands that need verification evidence keep reading `*-verification-report.md`, so a newer `*-ci-summary.md` will not change `status`, `check-gates`, `report`, `badge`, or `handoff` verification lookup.

## Safety

`ci-summary` does not:

- call GitHub or another CI provider API
- read secrets or `.env` contents
- print arbitrary environment variables
- run tests or configured verification commands
- upload files
- mutate repo files unless `--write` is passed

Use it after `verify`, `handoff`, `report`, and `badge` when CI should upload a small Markdown summary for reviewers. Pair it with `agentloop release-notes --write` when a release workflow also needs local release-note evidence.
