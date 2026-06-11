import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('distribution artifacts', () => {
  test('MCP Registry metadata matches the npm package marker', async () => {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
    const serverJson = JSON.parse(await readFile('server.json', 'utf8'));

    expect(packageJson.mcpName).toBe('io.github.abhiyoheswaran1/agentloopkit');
    expect(serverJson.name).toBe(packageJson.mcpName);
    expect(serverJson.packages).toEqual([
      {
        registryType: 'npm',
        identifier: 'agentloopkit',
        version: packageJson.version,
        transport: {
          type: 'stdio',
        },
      },
    ]);
  });

  test('MCP Registry workflow waits for npm publish before registry publish', async () => {
    const workflow = await readFile('.github/workflows/publish-mcp.yml', 'utf8');

    expect(workflow).toContain('workflow_run:');
    expect(workflow).toContain('workflows: ["Publish"]');
    expect(workflow).toContain('id-token: write');
    expect(workflow).toContain('mcp-publisher login github-oidc');
    expect(workflow).toContain('mcp-publisher publish');
    expect(workflow).toContain('npm view "$PACKAGE_NAME@$PACKAGE_VERSION" version');
  });

  test('GitHub Action is a thin AgentLoopKit CLI wrapper', async () => {
    const action = await readFile('action.yml', 'utf8');

    expect(action).toContain('using: composite');
    expect(action).toContain('agentloopkit-version');
    expect(action).toContain("default: 'latest'");
    expect(action).not.toMatch(/default: ['"]\d+\.\d+\.\d+['"]/);
    expect(action).toContain('npx --no-install agentloop ${{ inputs.command }}');
    expect(action).not.toContain('upload-artifact');
  });

  test('GitHub Action avoids direct shell interpolation for package version input', async () => {
    const action = await readFile('action.yml', 'utf8');

    expect(action).toContain('AGENTLOOPKIT_VERSION: ${{ inputs.agentloopkit-version }}');
    expect(action).toContain('npm install --no-save "agentloopkit@${AGENTLOOPKIT_VERSION}"');
    expect(action).not.toContain('agentloopkit@${{ inputs.agentloopkit-version }}');
  });

  test('GitHub Action docs warn against untrusted command input', async () => {
    const action = await readFile('action.yml', 'utf8');
    const docs = await readFile('docs/github-actions.md', 'utf8');
    const example = await readFile('examples/github-actions/README.md', 'utf8');
    const requiredWarning = 'Do not pass untrusted pull request or user input to command.';

    expect(action).toContain(requiredWarning);
    expect(docs).toContain(requiredWarning);
    expect(example).toContain(requiredWarning);
  });

  test('GitHub Action docs warn against untrusted package version input', async () => {
    const action = await readFile('action.yml', 'utf8');
    const docs = await readFile('docs/github-actions.md', 'utf8');
    const example = await readFile('examples/github-actions/README.md', 'utf8');
    const requiredWarning =
      'Do not pass untrusted pull request or user input to agentloopkit-version.';

    expect(action).toContain(requiredWarning);
    expect(docs).toContain(requiredWarning);
    expect(example).toContain(requiredWarning);
  });

  test('Docker image builds from the local package and defaults to agentloop version', async () => {
    const dockerfile = await readFile('Dockerfile', 'utf8');
    const workflow = await readFile('.github/workflows/docker.yml', 'utf8');

    expect(dockerfile).toContain('FROM node:24-alpine AS build');
    expect(dockerfile).toContain('npm pack --pack-destination /tmp');
    expect(dockerfile).toContain('ENTRYPOINT ["agentloop"]');
    expect(dockerfile).toContain('CMD ["version"]');
    expect(workflow).toContain('ghcr.io/${{ github.repository_owner }}/agentloopkit');
    expect(workflow).toContain('docker/build-push-action');
    expect(workflow).toContain('push: true');
  });
});
