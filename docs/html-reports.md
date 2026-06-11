# HTML Reports

`agentloop report` writes one local static HTML evidence page.

Run it after verification and handoff:

```bash
agentloop verify
agentloop handoff
agentloop report
```

The report uses local inputs:

- active task contract from `agentloop task set`, or the newest open task when no task is pinned
- latest verification report
- latest handoff summary
- git status
- git diff stats
- deterministic PR summary output

It writes:

```text
.agentloop/reports/YYYY-MM-DD-HH-mm-agentloop-report.html
```

Use JSON output in scripts:

```bash
agentloop report --json
agentloop report --out .agentloop/reports/review.html --json
agentloop report --verification .agentloop/reports/2026-06-10-12-00-verification-report.md --json
```

JSON output includes the written `outPath`, report metadata, and source paths. It does not embed the full HTML body.

The command does not run verification commands. It does not call an LLM, fetch remote assets, read `.env` contents, upload files, or collect telemetry. It escapes Markdown-derived and git-derived text before writing HTML.

Use HTML reports when a reviewer wants one browser-readable artifact. Keep the Markdown task contract, verification report, and handoff summary as the source evidence.
