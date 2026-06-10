# Publish MCP Registry entry

- Created date: 2026-06-10
- Task type: release
- Status: done

## Problem Statement
MCP clients cannot discover AgentLoopKit through registry tooling, but registry publication is only valid after a real MCP server exists.

## Desired Outcome
AgentLoopKit publishes MCP Registry metadata for the verified MCP server and documents install commands.

## Constraints
- Complete the MCP server prerequisite first.
- Use official MCP Registry documentation at implementation time.
- Keep registry metadata truthful and minimal.

## Non-Goals
- Do not publish registry metadata for a CLI-only package.
- Do not add remote services or telemetry.

## Likely Files or Areas
- server.json
- package.json
- docs/mcp.md
- docs/distribution-channels.md

## Acceptance Criteria
- Registry metadata validates.
- MCP server install command works from npm.
- Docs distinguish CLI usage from MCP usage.
- GitHub MCP publish workflow succeeds after the matching npm package is available.

## Verification Commands
- npm test
- npm run build
- mcp-publisher publish --dry-run

## Rollback Notes
Withdraw or correct registry metadata if it points to unsupported commands or a broken package.
