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
});
