import { readFile } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

describe('AgentLoopKit autonomous dogfood harness', () => {
  test('keeps AgentFlight configured as a local-first companion tool', async () => {
    const config = await readJson<{
      projectName: string;
      engines: {
        projscan?: { enabled?: boolean; mode?: string };
        agentloopkit?: { enabled?: boolean; mode?: string };
      };
      verification: { commands: string[] };
      changedFileFilters: { ignore: string[] };
      privacy: { localOnly: boolean; telemetry: boolean };
    }>('.agentflight/config.json');

    expect(config.projectName).toBe('AgentLoopKit');
    expect(config.engines.projscan).toEqual({ enabled: true, mode: 'npx' });
    expect(config.engines.agentloopkit).toEqual({ enabled: true, mode: 'npx' });
    expect(config.verification.commands).toEqual([
      'npm run typecheck',
      'npm run lint',
      'npm test',
      'npm run build',
    ]);
    expect(config.changedFileFilters.ignore).toEqual(
      expect.arrayContaining(['.projscan-memory/**', '.projscan-cache/**']),
    );
    expect(config.privacy).toEqual({ localOnly: true, telemetry: false });
  });

  test('tells future Codex sessions to use AgentLoopKit, ProjScan, AgentFlight, personas, and research cycles', async () => {
    const agents = await readFile('AGENTS.md', 'utf8');
    const agentloop = await readFile('AGENTLOOP.md', 'utf8');
    const autonomousRules = await readFile('.agentloop/harness/autonomous-work-rules.md', 'utf8');
    const commands = await readFile('.agentloop/harness/commands.md', 'utf8');
    const repoMap = await readFile('.agentloop/harness/repo-map.md', 'utf8');
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    for (const content of [agents, agentloop, autonomousRules, commands, repoMap, dogfoodGuide]) {
      expect(content).toContain('AgentLoopKit');
      expect(content).toContain('ProjScan');
      expect(content).toContain('AgentFlight');
    }

    expect(agents).toContain('.agentloop/product-panel.md');
    expect(agents).toContain('.agentloop/user-personas.md');
    expect(agents).toContain('.agentloop/research/');
    expect(agentloop).toContain('.agentloop/harness/autonomous-dogfooding.md');
    expect(repoMap).toContain('.agentloop/product-panel.md');
    expect(dogfoodGuide).toContain('Build -> Test -> Review -> Simulated user feedback -> Product panel debate -> Decision -> Backlog update -> Iterate -> Verify -> Document');
    expect(dogfoodGuide).toContain('Synthetic feedback is internal decision support, not public evidence.');
  });

  test('keeps AgentFlight and AgentLoop task setup sequential to avoid generic task races', async () => {
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    expect(dogfoodGuide).toContain('Do not start AgentFlight and `agentloop create-task` in parallel.');
    expect(dogfoodGuide).toContain('npm run dogfood:start');
    expect(dogfoodGuide).toContain('--dry-run');
  });

  test('documents that dogfood start uses the source CLI before a build exists', async () => {
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    expect(dogfoodGuide).toContain('source CLI');
    expect(dogfoodGuide).toContain('npx --no-install tsx src/cli/index.ts');
    expect(dogfoodGuide).toContain('before `dist/` exists');
  });

  test('keeps near-term maintenance duties tied to explicit guardrails', async () => {
    const roadmap = await readFile('ROADMAP.md', 'utf8');
    const distribution = await readFile('docs/distribution-channels.md', 'utf8');
    const maintenance = await readFile('docs/maintenance-guards.md', 'utf8');
    // @ts-expect-error TS7016: script helper has no declaration file.
    const maintenanceModule = await import('../scripts/maintenance-check.mjs');
    const maintenanceSteps = maintenanceModule.createMaintenanceCheckSteps() as Array<{
      command: string;
      args: string[];
    }>;
    const maintenanceCommandText = maintenanceSteps
      .map((step) => [step.command, ...step.args].join(' '))
      .join('\n');
    const packageJson = await readJson<{ scripts: Record<string, string> }>('package.json');

    expect(roadmap).toContain('Keep the GitHub release to npm trusted-publishing flow healthy');
    expect(roadmap).toContain('Keep bundled policy packs small, safe, and useful');
    expect(distribution).toContain('agentloop release-proof');
    expect(maintenance).toContain('GitHub Release -> npm trusted publishing -> GHCR -> MCP Registry');
    expect(maintenance).toContain('README/public docs');
    expect(maintenance).toContain('SchemaStore');
    expect(maintenance).toContain('policy packs');
    expect(maintenance).toContain('GitHub metadata');
    expect(packageJson.scripts['maintenance:check']).toBe('node scripts/maintenance-check.mjs');
    expect(maintenanceCommandText).toContain('npm run test:unit');
    expect(maintenanceCommandText).toContain('npm run check:public-docs');
    expect(maintenanceCommandText).toContain('npm run check:links');
    expect(maintenanceCommandText).toContain(
      'npx --no-install tsx src/cli/index.ts release-proof --strict --redact-paths',
    );
    expect(maintenanceCommandText).toContain(
      'npx --no-install tsx src/cli/index.ts schemastore --json',
    );
    expect(maintenanceCommandText).toContain(
      'npx --no-install tsx src/cli/index.ts policy packs --json',
    );
    expect(maintenanceCommandText).toContain('npm test -- tests/policy-packs.test.ts');
    expect(maintenanceCommandText).toContain(
      'npx --no-install tsx src/cli/index.ts github import --help',
    );
    expect(maintenanceCommandText).toContain('npm test -- tests/github-metadata.test.ts');
    expect(maintenanceCommandText).toContain('npx --yes agentflight@latest --version');
    expect(maintenanceCommandText).toContain('npx --yes projscan --format json doctor');
    expect(maintenanceCommandText).toContain('npm run dogfood');
    expect(maintenance).toContain('Run `npm run dogfood:strict` after fresh verification');
  });
});
