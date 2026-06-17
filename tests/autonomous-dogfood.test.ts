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
    expect(config.changedFileFilters.ignore).toEqual(
      expect.arrayContaining([
        '.agentloop/handoffs/**',
        '.agentloop/reports/**',
        '.agentloop/runs/**',
        '.agentloop/tasks/archive/**',
      ]),
    );
    expect(config.changedFileFilters.ignore).not.toContain('.agentloop/**');
    expect(config.changedFileFilters.ignore).not.toContain('.agentloop/harness/**');
    expect(config.privacy).toEqual({ localOnly: true, telemetry: false });
  });

  test('keeps ProjScan focused on source while ignoring generated evidence', async () => {
    const config = await readJson<{ ignore: string[] }>('.projscanrc.json');

    expect(config.ignore).toEqual(
      expect.arrayContaining([
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/.projscan-cache/**',
        '**/.projscan-memory/**',
      ]),
    );
    expect(config.ignore).toEqual(
      expect.arrayContaining([
        '.agentloop/handoffs/**',
        '.agentloop/reports/**',
        '.agentloop/runs/**',
        '.agentloop/tasks/archive/**',
        '.agentflight/current/**',
        '.agentflight/evidence/**',
        '.agentflight/reports/**',
        '.agentflight/replays/**',
        '.agentflight/sessions/**',
      ]),
    );
    expect(config.ignore).not.toContain('.agentloop/**');
    expect(config.ignore).not.toContain('.agentloop/tasks/**');
    expect(config.ignore).not.toContain('.agentloop/harness/**');
    expect(config.ignore).not.toContain('.agentflight/**');
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
    expect(dogfoodGuide).toContain(
      'Build -> Test -> Review -> Simulated user feedback -> Product panel debate -> Decision -> Backlog update -> Iterate -> Verify -> Document',
    );
    expect(dogfoodGuide).toContain(
      'Synthetic feedback is internal decision support, not public evidence.',
    );
    expect(dogfoodGuide).toContain(
      'AgentFlight changed-file filters ignore generated AgentLoop evidence directories',
    );
    expect(dogfoodGuide).toContain(
      '.agentloop/handoffs/, .agentloop/reports/, .agentloop/runs/, and .agentloop/tasks/archive/',
    );
    expect(dogfoodGuide).toContain(
      'ProjScan ignores generated AgentLoop and AgentFlight evidence directories',
    );
    expect(dogfoodGuide).toContain('through `.projscanrc.json`');
    expect(dogfoodGuide).toContain('current `.agentloop/tasks/` contracts visible to ProjScan');
  });

  test('tells autonomous sessions to cross-check backlog rows before creating tasks', async () => {
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    expect(dogfoodGuide).toContain('Backlog rows are decision support');
    expect(dogfoodGuide).toContain('cross-check `.agentloop/tasks/archive/`');
    expect(dogfoodGuide).toContain('implementation evidence');
    expect(dogfoodGuide).toContain('do not create a duplicate task contract');
  });

  test('records stale task-state recovery implementation in dogfood log', async () => {
    const dogfoodLog = await readFile('.agentloop/dogfood-log.md', 'utf8');
    const sectionMatch = dogfoodLog.match(
      /## 2026-06-16: .*Stale Task-State Recovery[\s\S]*?(?=\n## 2026-06-16: Explicit Post-Verification Gates From Verify)/,
    );

    expect(sectionMatch?.[0]).toBeDefined();
    const section = sectionMatch?.[0] ?? '';

    expect(section).toContain('Implementation status: completed after maintainer approval');
    expect(section).toContain(
      '.agentloop/tasks/archive/2026-06-16-prevent-stale-agentloop-task-state.md',
    );
    expect(section).toContain('No release, version bump, or publishing behavior changed.');
    expect(section).not.toContain(
      'Keep this as deferred implementation work until explicitly approved.',
    );
    expect(section).not.toContain('Planned outcome:');
  });

  test('documents dogfood-start task setup preflight to avoid generic task races', async () => {
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    expect(dogfoodGuide).toContain(
      'Do not start AgentFlight and `agentloop create-task` in parallel.',
    );
    expect(dogfoodGuide).toContain('parks exact AgentFlight placeholder task contracts');
    expect(dogfoodGuide).toContain('does not touch custom task contracts');
    expect(dogfoodGuide).toContain('npm run dogfood:start');
    expect(dogfoodGuide).toContain('Supported task types:');
    expect(dogfoodGuide).toContain('`feature`, `bugfix`, `refactor`, `tests`');
    expect(dogfoodGuide).toContain('`--type test` is accepted as a local alias for `tests`');
    expect(dogfoodGuide).toContain('Unsupported task types fail before AgentFlight starts');
    expect(dogfoodGuide).toContain('--dry-run');
  });

  test('documents raw AgentFlight active-task recovery when the helper is not used', async () => {
    const agentloop = await readFile('AGENTLOOP.md', 'utf8');
    const templateAgentloop = await readFile('src/templates/root/AGENTLOOP.md', 'utf8');
    const agents = await readFile('AGENTS.md', 'utf8');
    const templateAgents = await readFile('src/templates/root/AGENTS.md', 'utf8');
    const harnessCommands = await readFile('.agentloop/harness/commands.md', 'utf8');
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    for (const content of [
      agentloop,
      templateAgentloop,
      agents,
      templateAgents,
      harnessCommands,
      dogfoodGuide,
    ]) {
      expect(content).toContain('npx --yes agentflight start --task "<task>" --yes');
      expect(content).toContain('agentloop status --redact-paths');
      expect(content).toContain('agentloop task set <path>');
      expect(content).toContain('AgentFlight placeholder');
    }
  });

  test('documents strict dogfood after fresh handoff or ship evidence exists', async () => {
    const dogfoodGuide = await readFile('.agentloop/harness/autonomous-dogfooding.md', 'utf8');

    expect(dogfoodGuide).toContain(
      'Run `npm run dogfood:strict` after fresh handoff or ship evidence exists',
    );
    expect(dogfoodGuide.indexOf('agentloop handoff --write-run')).toBeLessThan(
      dogfoodGuide.indexOf('npm run dogfood:strict'),
    );
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
    expect(maintenance).toContain(
      'GitHub Release -> GitHub Marketplace -> npm trusted publishing -> GHCR -> MCP Registry',
    );
    expect(maintenance).toContain('README/public docs');
    expect(maintenance).toContain('SchemaStore');
    expect(maintenance).toContain('policy packs');
    expect(maintenance).toContain('GitHub metadata');
    expect(packageJson.scripts['maintenance:check']).toBe('node scripts/maintenance-check.mjs');
    expect(maintenanceCommandText).toContain('npm run test:unit');
    expect(maintenanceCommandText).toContain('npm run check:public-docs');
    expect(maintenanceCommandText).toContain('npm run check:links');
    expect(maintenanceCommandText).toContain(
      'npx --no-install tsx src/cli/index.ts release-proof --only npm --redact-paths',
    );
    expect(maintenanceCommandText).not.toContain('release-proof --strict');
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
    expect(maintenance).toContain(
      'Run `npm run dogfood:strict` after fresh handoff or ship evidence exists',
    );
    expect(maintenance).toContain('Strict public release proof belongs in approved release gates');
  });

  test('uses concise human local-check output in normal dogfood logs', async () => {
    // @ts-expect-error TS7016: script helper has no declaration file.
    const dogfoodModule = await import('../scripts/dogfood.mjs');
    const steps = dogfoodModule.createDogfoodSteps() as Array<{
      name: string;
      args: string[];
    }>;

    const taskDoctorStep = steps.find((step) => step.name === 'task folder hygiene');
    const upgradeHarnessStep = steps.find((step) => step.name === 'harness upgrade audit');
    const artifactStep = steps.find((step) => step.name === 'artifact inventory');
    const maintainerStep = steps.find((step) => step.name === 'maintainer reviewability check');
    const reviewContextStep = steps.find((step) => step.name === 'agent review context');

    expect(taskDoctorStep?.args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'task',
      'doctor',
    ]);
    expect(taskDoctorStep?.args).not.toContain('--json');
    expect(upgradeHarnessStep?.args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'upgrade-harness',
      '--redact-paths',
    ]);
    expect(upgradeHarnessStep?.args).not.toContain('--json');
    expect(artifactStep?.args).toEqual(['--no-install', 'tsx', 'src/cli/index.ts', 'artifacts']);
    expect(artifactStep?.args).not.toContain('--json');
    expect(maintainerStep?.args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'maintainer-check',
      '--redact-paths',
    ]);
    expect(maintainerStep?.args).not.toContain('--json');
    expect(reviewContextStep?.args).toEqual([
      '--no-install',
      'tsx',
      'src/cli/index.ts',
      'review-context',
      '--redact-paths',
    ]);
    expect(reviewContextStep?.args).not.toContain('--json');
  });
});
