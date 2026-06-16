# Release Notes

`agentloop release-notes` drafts release notes from local repository evidence. Use it before a GitHub release or npm publish when you want the release page to match the task, verification, and CI artifacts already in the repo.

```bash
agentloop release-notes
agentloop release-notes --from v0.19.0 --to HEAD
agentloop release-notes --release-version <version>
agentloop release-notes --public
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
- active task contract, or newest open task contract when no active task is pinned
- current `*-verification-report.md`
- latest `*-ci-summary.md`

If you do not pass `--from`, AgentLoopKit looks for the newest local version tag before the selected version. If it cannot find one, the output says that no previous version tag was found and uses the local evidence it can read.

`--from` and `--to` accept ordinary Git refs such as `v1.2.3` and `HEAD`. AgentLoopKit rejects option-shaped refs before running Git commands.

## Output

Human output is Markdown. JSON output includes the same evidence paths and release metadata for scripts.

Human Markdown keeps dynamic metadata, refs, paths, and evidence values on one line. JSON keeps raw values. AgentLoopKit does not rewrite the changelog prose that appears under `## What changed` or `## Changelog`.

Use `--public` when you need concise Markdown for a GitHub release page or announcement. Public mode keeps the version, changelog items, verification status, selected git range, and install command, but leaves out the changed-file inventory, working-tree path list, and local AgentLoop evidence paths. The default output remains the detailed local evidence format.

`--write` creates:

```text
.agentloop/handoffs/YYYY-MM-DD-HH-mm-release-notes.md
```

If release notes already exist for the same generated minute, AgentLoopKit keeps them and writes the next default draft with a numeric suffix, such as `YYYY-MM-DD-HH-mm-release-notes-2.md`.

Without `--write`, the command prints the draft and does not create a file.
Use `--out` only with `--write`. If `--out` is passed without `--write`, AgentLoopKit exits before reading config or writing a file. With `--json`, it returns `OUT_REQUIRES_WRITE`.
When `--write` is used, output paths must stay inside `.agentloop/handoffs/`, end in `.md`, and resolve inside the current repo. With `--json`, invalid output paths return `OUTPUT_PATH_INVALID` with `requestedPath`, `expectedDir`, `expectedExtension`, and `reason`.
With `--json`, invalid `agentloop.config.json` files return a `CONFIG_ERROR` object and AgentLoopKit writes no release-notes file.

## Safety

`release-notes` does not:

- create tags
- publish packages
- call GitHub or npm APIs
- read npm tokens, GitHub tokens, or `.env` contents
- upload files
- rewrite `CHANGELOG.md`
- run verification commands

Run `agentloop verify` first when you need fresh verification evidence. `release-notes` ignores a verification report that predates the active or newest open task, unless the task is already in `review` or `done`.

If the working tree is dirty, commit or stash those changes before publishing. The command lists uncommitted paths so a release draft cannot silently omit local work.

Changed-file and working-tree paths use Markdown inline-code delimiters long enough to contain paths that include backticks. Dynamic path labels also render line breaks as `\n`, so copied release notes keep list items intact.

## npm Status

Run `agentloop npm-status` before claiming npm availability. After an AgentLoopKit publish, use `agentloop npm-status --agentloopkit --expect-current` and wait for it to pass before updating public docs, especially from temp release-smoke folders or CI workspaces.

If npm ever lags behind GitHub releases again, publish the current prepared release rather than backfilling old versions from newer source. Record the reason in maintainer docs and release notes, not in the user-facing README.
