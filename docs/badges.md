# Evidence Badges

`agentloop badge` writes local SVG badges from existing AgentLoopKit evidence.

Default verification badge:

```bash
agentloop badge
```

Gate badge:

```bash
agentloop badge --source gates
agentloop badge --source gates --strict
```

Custom output path:

```bash
agentloop badge --out .agentloop/reports/review-status.svg
```

JSON output:

```bash
agentloop badge --json
```

JSON output includes `outPath`, `source`, `status`, `label`, `message`, and `sourcePath` when a source report exists. It does not embed SVG contents.

## Sources

- `verification`: reads the latest timestamped verification report and writes `.agentloop/reports/agentloop-verification.svg`.
- `gates`: checks local task, verification, handoff, harness, policy, and git evidence, then writes `.agentloop/reports/agentloop-gates.svg`.

The command does not run project verification commands. It does not call a remote badge service, fetch assets, read `.env` contents, upload files, or collect telemetry.

Use badges as small status pointers. Keep the verification report, gate check, handoff, and HTML report as the review evidence.
