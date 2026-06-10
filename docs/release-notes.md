# Release Notes

`agentloop release-notes` drafts release notes from local repository evidence. Use it before a GitHub release or npm publish when you want the release page to match the task, verification, and CI artifacts already in the repo.

```bash
agentloop release-notes
agentloop release-notes --from v0.19.0 --to HEAD
agentloop release-notes --release-version 0.22.0
agentloop release-notes --json
agentloop release-notes --write
agentloop release-notes --write --out .agentloop/handoffs/release.md
```

## Inputs

The command reads local files and git metadata:

- `package.json` for package name and version
- `CHANGELOG.md` for the matching version section
- git branch and commit
- git commit subjects in the selected range
- changed file paths in the selected range
- working tree status from `git status --short`
- active task contract, or newest task contract when no active task is pinned
- latest `*-verification-report.md`
- latest `*-ci-summary.md`

If you do not pass `--from`, AgentLoopKit looks for the newest local version tag before the selected version. If it cannot find one, the output says that no previous version tag was found and uses the local evidence it can read.

## Output

Human output is Markdown. JSON output includes the same evidence paths and release metadata for scripts.

`--write` creates:

```text
.agentloop/handoffs/YYYY-MM-DD-HH-mm-release-notes.md
```

Without `--write`, the command prints the draft and does not create a file.

## Safety

`release-notes` does not:

- create tags
- publish packages
- call GitHub or npm APIs
- read npm tokens, GitHub tokens, or `.env` contents
- upload files
- rewrite `CHANGELOG.md`
- run verification commands

Run `agentloop verify` first when you need fresh verification evidence. `release-notes` reports the latest existing verification report; it does not prove the current diff passed checks.

If the working tree is dirty, commit or stash those changes before publishing. The command lists uncommitted paths so a release draft cannot silently omit local work.

## Version Catch-Up

If npm lags behind GitHub releases, publish the current prepared release rather than backfilling old versions from newer source. For AgentLoopKit, npm currently serves `0.1.1` while GitHub release candidates already exist through `v0.22.0`. The next npm publish should catch up once to the current line, then return to normal semver.

Record that catch-up in the release notes so users know the version jump was a recovery step, not the future release cadence.
