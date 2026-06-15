# Release Proof

`agentloop release-proof` checks whether a completed release is visible across the public channels AgentLoopKit uses:

- npm
- GitHub Releases
- GHCR
- MCP Registry

Use it after the GitHub release workflows finish.

```bash
agentloop release-proof
agentloop release-proof --json
agentloop release-proof --strict
agentloop release-proof --redact-paths
```

The command compares each channel with the local `package.json` version. It also checks whether the local git tag `v<version>` exists.

If a repository does not publish an MCP server, `release-proof` still checks npm, GitHub Releases, and GHCR. The MCP Registry channel reports a warning instead of stopping the command. Use `--strict` when that warning should fail a release gate.

## Captured Proof

Use captured JSON when you want deterministic output in a release handoff or CI job:

```bash
npm view agentloopkit version versions --json > npm-view.json

agentloop release-proof \
  --npm-registry-json npm-view.json \
  --github-release-json github-release.json \
  --ghcr-tags-json ghcr-tags.json \
  --mcp-registry-json mcp-registry.json
```

Expected shapes:

```json
{
  "version": "<version>",
  "versions": ["<previous-version>", "<version>"]
}
```

```json
{
  "tag_name": "v<version>",
  "html_url": "https://github.com/owner/repo/releases/tag/v<version>",
  "draft": false,
  "assets": [{ "name": "agentloopkit-<version>.tgz" }]
}
```

```json
{
  "tags": ["latest", "<major>.<minor>", "<version>"]
}
```

```json
{
  "name": "io.github.abhiyoheswaran1/agentloopkit",
  "version": "<version>",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "agentloopkit",
      "version": "<version>"
    }
  ]
}
```

## Output

Human output includes:

- overall status
- package version
- local git tag status
- channel checks
- next action
- safety notes

JSON output includes the same fields plus source metadata for each proof channel.

For MCP Registry proof, AgentLoopKit looks for `package.json` `mcpName` or `server.json` `name`. Repositories without either field get an MCP warning while the other channels continue to report normally.

## Exit Codes

Default mode exits `0` for warnings so maintainers can inspect partial release proof while workflows are still finishing.

Use `--strict` when missing or mismatched proof should fail CI:

```bash
agentloop release-proof --strict
```

## Safety

`release-proof` does not publish packages, create tags, create GitHub releases, read npm tokens, read GitHub tokens, read `.env` files, upload files, post comments, or change package metadata.

In live mode it queries public metadata with a timeout. GHCR may return a registry challenge first; AgentLoopKit requests the anonymous public bearer token needed to read the public tag list. It does not read local Docker, GitHub, or npm credentials.

In captured mode it reads only the files passed with explicit flags. Captured paths that look like `.env` files are refused before the CLI reads them.
