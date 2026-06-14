# GitHub Metadata Import

`agentloop github import` stores issue and pull request context from local JSON files:

```bash
agentloop github import --issue-json issue.json
agentloop github import --pr-json pr.json
agentloop github import --issue-json issue.json --pr-json pr.json
agentloop github import --issue-json issue.json --dry-run
agentloop github import --issue-json issue.json --json
```

The command accepts JSON shaped like `gh issue view --json ...`, `gh pr view --json ...`, or compatible GitHub API output. It writes normalized metadata to:

```text
.agentloop/github/context.json
```

If you pass `--output`, the path must stay under `.agentloop/github/`. AgentLoopKit refuses `.env` and `.env.*` outputs and refuses paths outside the repo.

Supported fields include:

- number
- title
- state
- URL
- author login
- labels
- issue or PR body excerpt
- PR base/head branch
- PR changed file, addition, and deletion counts

Safety rules:

- You choose the JSON files explicitly.
- Paths must stay inside the repo.
- `.env` and `.env.*` inputs are refused.
- Outputs must stay under `.agentloop/github/`.
- The command does not run `gh`.
- The command does not call GitHub APIs.
- The command does not read GitHub tokens.
- The command does not post comments.
- The command does not execute commands from issue or pull request text.

Example:

```bash
gh issue view 42 --json number,title,state,url,author,labels,body > issue.json
gh pr view 77 --json number,title,state,url,author,labels,isDraft,baseRefName,headRefName,changedFiles,additions,deletions,body > pr.json
agentloop github import --issue-json issue.json --pr-json pr.json
```

Review the JSON before importing when it comes from an untrusted pull request.
