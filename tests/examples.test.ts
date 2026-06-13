import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

describe('examples documentation', () => {
  test('end-to-end walkthrough covers the local AgentLoopKit workflow', async () => {
    const readme = await readFile('examples/end-to-end/README.md', 'utf8');
    const rootReadme = await readFile('README.md', 'utf8');
    const cliReference = await readFile('docs/cli-reference.md', 'utf8');

    for (const command of [
      'agentloop init --dry-run',
      'agentloop init',
      'agentloop doctor',
      'agentloop create-task',
      'agentloop task set',
      'agentloop verify',
      'agentloop handoff',
      'agentloop check-gates',
      'agentloop artifacts',
      'agentloop release-check',
    ]) {
      expect(readme).toContain(command);
    }

    expect(readme).toContain('No cloud backend, telemetry, API key, or LLM call is involved.');
    expect(rootReadme).toContain('[End-to-end workflow](examples/end-to-end/README.md)');
    expect(cliReference).toContain('[End-to-end workflow](../examples/end-to-end/README.md)');
  });

  test('public examples cover bugfix and dependency-upgrade PR loops', async () => {
    const bugfix = await readFile('examples/bugfix-pr/README.md', 'utf8');
    const dependency = await readFile('examples/dependency-upgrade/README.md', 'utf8');
    const rootReadme = await readFile('README.md', 'utf8');

    for (const command of [
      'agentloop create-task',
      'agentloop verify',
      'agentloop ship',
      'agentloop prepare-pr',
    ]) {
      expect(bugfix).toContain(command);
      expect(dependency).toContain(command);
    }

    expect(rootReadme).toContain('[Bugfix PR](examples/bugfix-pr/README.md)');
    expect(rootReadme).toContain('[Dependency upgrade](examples/dependency-upgrade/README.md)');
  });

  test('existing-repo upgrade guide documents the safe latest-version path', async () => {
    const guide = await readFile('docs/upgrading-existing-repos.md', 'utf8');
    const rootReadme = await readFile('README.md', 'utf8');
    const gettingStarted = await readFile('docs/getting-started.md', 'utf8');

    for (const text of [
      'npx --yes agentloopkit@latest doctor --redact-paths',
      'npx --yes agentloopkit@latest upgrade-harness --details --redact-paths',
      'npx --yes agentloopkit@latest init --dry-run',
      'agentloop ship',
      'agentloop prepare-pr',
    ]) {
      expect(guide).toContain(text);
    }

    expect(rootReadme).toContain('[Upgrading existing repos](docs/upgrading-existing-repos.md)');
    expect(gettingStarted).toContain('upgrading-existing-repos.md');
  });
});
