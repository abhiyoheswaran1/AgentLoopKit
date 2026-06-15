import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, readdir, readFile, symlink, utimes, writeFile } from 'node:fs/promises';
import { execa } from 'execa';
import { afterEach, describe, expect, test } from 'vitest';
import { createDefaultConfig } from '../src/core/config.js';
import { makeTempDir, removeTempDir, writeJson } from './helpers.js';

const cliPath = path.resolve('src/cli/index.ts');
const tsxPath = path.resolve('node_modules/.bin/tsx');

let tempDirs: string[] = [];

type TreeSnapshotEntry = {
  path: string;
  type: 'dir' | 'file' | 'symlink';
  content?: string;
};

async function writeConfig(dir: string) {
  await writeJson(
    path.join(dir, 'agentloop.config.json'),
    createDefaultConfig({ name: 'demo', type: 'typescript-package', packageManager: 'pnpm' }),
  );
}

async function writeEvidenceFile(
  dir: string,
  relativePath: string,
  content: string,
  modifiedAt: string,
) {
  const filePath = path.join(dir, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  const timestamp = new Date(modifiedAt);
  await utimes(filePath, timestamp, timestamp);
}

async function writeRunMetadata(
  dir: string,
  runId: string,
  metadata: Record<string, unknown>,
  modifiedAt: string,
) {
  const runDir = path.join(dir, '.agentloop/runs', runId);
  await mkdir(runDir, { recursive: true });
  await writeFile(path.join(runDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  const timestamp = new Date(modifiedAt);
  await utimes(runDir, timestamp, timestamp);
  await utimes(path.join(runDir, 'metadata.json'), timestamp, timestamp);
}

async function createRepoWithArtifacts() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeConfig(dir);
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/2026-06-10-old-task.md',
    '# Old task\n\n- Status: proposed\n',
    '2026-06-10T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/2026-06-11-new-task.md',
    '# New task\n\n- Status: in-progress\n',
    '2026-06-11T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/README.md',
    '# Tasks\n',
    '2026-06-11T10:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-09-00-verification-report.md',
    '# Old Verification\n\nOverall status: fail\n',
    '2026-06-10T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-00-verification-report.md',
    '# Latest Verification\n\nOverall status: pass\n',
    '2026-06-10T10:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
    '# Latest Handoff\n',
    '2026-06-10T10:05:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-07-ship-report.md',
    '# Old Ship Report\n',
    '2026-06-10T10:07:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-10-agentloop-report.html',
    '<!doctype html><title>AgentLoopKit Report</title>',
    '2026-06-10T10:10:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/agentloop-verification.svg',
    '<svg role="img"></svg>',
    '2026-06-10T10:15:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-20-ci-summary.md',
    '# AgentLoopKit CI Summary\n',
    '2026-06-10T10:20:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-10-10-25-release-notes.md',
    '# Release Notes\n',
    '2026-06-10T10:25:00.000Z',
  );
  await writeRunMetadata(
    dir,
    '2026-06-10-10-30-verify',
    {
      id: '2026-06-10-10-30-verify',
      command: 'verify',
      createdAt: '2026-06-10-10-30',
      overallStatus: 'pass',
      changedFileCount: 2,
      verificationReportPath: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
    },
    '2026-06-10T10:30:00.000Z',
  );
  await writeRunMetadata(
    dir,
    '2026-06-10-10-35-ship',
    {
      id: '2026-06-10-10-35-ship',
      command: 'ship',
      createdAt: '2026-06-10-10-35',
      score: 96,
      changedFileCount: 3,
      shipReportPath: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
    },
    '2026-06-10T10:35:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-35-ship-report.md',
    '# Latest Ship Report\n',
    '2026-06-10T10:35:00.000Z',
  );
  await writeFile(path.join(dir, '.env'), 'AGENTLOOP_SECRET=do-not-print-this-fixture\n');
  return dir;
}

async function createRepoWithMarkdownEdgeArtifacts() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeConfig(dir);
  await writeEvidenceFile(
    dir,
    '.agentloop/tasks/2026-06-11-active`task.md',
    '# Active `task`\n\n- Status: review`ready\n',
    '2026-06-11T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-11-10-00-verification-report.md',
    '# Verification `report`\n\nOverall status: pass`ok\n',
    '2026-06-11T10:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-11-10-05-pr-summary.md',
    '# Handoff `summary`\n',
    '2026-06-11T10:05:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-11-10-07-ship-report.md',
    '# Ship `report`\n',
    '2026-06-11T10:07:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/agentloop`report.html',
    '<!doctype html><title>AgentLoopKit Report</title>',
    '2026-06-11T10:10:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/agentloop`verification.svg',
    '<svg role="img"></svg>',
    '2026-06-11T10:15:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-11-10-20-ci-summary.md',
    '# CI `summary`\n',
    '2026-06-11T10:20:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-11-10-25-release-notes.md',
    '# Release `notes`\n',
    '2026-06-11T10:25:00.000Z',
  );
  return dir;
}

async function createRepoWithStaleEvidence() {
  const dir = await makeTempDir();
  tempDirs.push(dir);
  await writeConfig(dir);
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-09-00-verification-report.md',
    '# Old Verification\n\nOverall status: fail\n',
    '2026-06-10T09:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-00-verification-report.md',
    '# Latest Verification\n\nOverall status: pass\n',
    '2026-06-10T10:00:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-10-09-05-pr-summary.md',
    '# Old Handoff\n',
    '2026-06-10T09:05:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
    '# Latest Handoff\n',
    '2026-06-10T10:05:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-09-10-ship-report.md',
    '# Old Ship Report\n',
    '2026-06-10T09:10:00.000Z',
  );
  await writeEvidenceFile(
    dir,
    '.agentloop/reports/2026-06-10-10-10-ship-report.md',
    '# Latest Ship Report\n',
    '2026-06-10T10:10:00.000Z',
  );
  await writeRunMetadata(
    dir,
    '2026-06-10-09-30-verify',
    {
      id: '2026-06-10-09-30-verify',
      command: 'verify',
      createdAt: '2026-06-10-09-30',
      overallStatus: 'fail',
      changedFileCount: 2,
      verificationReportPath: '.agentloop/reports/2026-06-10-09-00-verification-report.md',
    },
    '2026-06-10T09:30:00.000Z',
  );
  await writeRunMetadata(
    dir,
    '2026-06-10-10-30-ship',
    {
      id: '2026-06-10-10-30-ship',
      command: 'ship',
      createdAt: '2026-06-10-10-30',
      score: 96,
      changedFileCount: 3,
      verificationReportPath: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
      handoffPath: '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
      shipReportPath: '.agentloop/reports/2026-06-10-10-10-ship-report.md',
    },
    '2026-06-10T10:30:00.000Z',
  );
  return dir;
}

async function createRepoWithManyStaleEvidenceCandidates() {
  const dir = await createRepoWithStaleEvidence();

  for (let index = 0; index < 55; index += 1) {
    const minute = String(index).padStart(2, '0');
    await writeEvidenceFile(
      dir,
      `.agentloop/reports/2026-06-10-08-${minute}-verification-report.md`,
      `# Old Verification ${minute}\n\nOverall status: fail\n`,
      `2026-06-10T08:${minute}:00.000Z`,
    );
  }

  return dir;
}

async function snapshotTree(root: string): Promise<TreeSnapshotEntry[]> {
  if (!existsSync(root)) return [];
  const entries: TreeSnapshotEntry[] = [];

  async function walk(current: string) {
    const dirents = await readdir(current, { withFileTypes: true });
    for (const dirent of dirents) {
      const absolutePath = path.join(current, dirent.name);
      const relativePath = path.relative(root, absolutePath).split(path.sep).join('/');
      if (dirent.isDirectory()) {
        entries.push({ path: relativePath, type: 'dir' });
        await walk(absolutePath);
      } else if (dirent.isFile()) {
        entries.push({
          path: relativePath,
          type: 'file',
          content: await readFile(absolutePath, 'utf8'),
        });
      } else if (dirent.isSymbolicLink()) {
        entries.push({ path: relativePath, type: 'symlink' });
      }
    }
  }

  await walk(root);
  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

describe('artifacts command', () => {
  afterEach(async () => {
    await Promise.all(tempDirs.map(removeTempDir));
    tempDirs = [];
  });

  test('prints stable JSON counts and repo-relative latest artifact paths', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      tasks: {
        count: 2,
        byStatus: {
          'in-progress': 1,
          proposed: 1,
        },
        latest: {
          path: '.agentloop/tasks/2026-06-11-new-task.md',
          title: 'New task',
          status: 'in-progress',
        },
      },
      verificationReports: {
        count: 2,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
          title: 'Latest Verification',
          overallStatus: 'pass',
        },
      },
      handoffs: {
        count: 1,
        latest: {
          path: '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
          title: 'Latest Handoff',
        },
      },
      shipReports: {
        count: 2,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
          title: 'Latest Ship Report',
        },
      },
      htmlReports: {
        count: 1,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-10-agentloop-report.html',
        },
      },
      badges: {
        count: 1,
        latest: {
          path: '.agentloop/reports/agentloop-verification.svg',
        },
      },
      ciSummaries: {
        count: 1,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-20-ci-summary.md',
          title: 'AgentLoopKit CI Summary',
        },
      },
      releaseNotes: {
        count: 1,
        latest: {
          path: '.agentloop/handoffs/2026-06-10-10-25-release-notes.md',
          title: 'Release Notes',
        },
      },
      runs: {
        count: 2,
        latest: {
          id: '2026-06-10-10-35-ship',
          command: 'ship',
          createdAt: '2026-06-10-10-35',
          score: 96,
          changedFileCount: 3,
          shipReportPath: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
        },
      },
    });
  });

  test('prints a concise markdown evidence inventory', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('# AgentLoopKit Artifacts');
    expect(result.stdout).toContain('- Tasks: 2 total (`in-progress`: 1, `proposed`: 1)');
    expect(result.stdout).toContain(
      '- Latest task: `New task` (`in-progress`) - `.agentloop/tasks/2026-06-11-new-task.md`',
    );
    expect(result.stdout).toContain('- Verification reports: 2');
    expect(result.stdout).toContain(
      '- Latest verification: `pass` - `.agentloop/reports/2026-06-10-10-00-verification-report.md`',
    );
    expect(result.stdout).toContain(
      '- Latest handoff: `Latest Handoff` - `.agentloop/handoffs/2026-06-10-10-05-pr-summary.md`',
    );
    expect(result.stdout).toContain('- Ship reports: 2');
    expect(result.stdout).toContain(
      '- Latest ship report: `Latest Ship Report` - `.agentloop/reports/2026-06-10-10-35-ship-report.md`',
    );
    expect(result.stdout).toContain(
      '- Latest HTML report: `.agentloop/reports/2026-06-10-10-10-agentloop-report.html`',
    );
    expect(result.stdout).toContain(
      '- Latest badge: `.agentloop/reports/agentloop-verification.svg`',
    );
    expect(result.stdout).toContain(
      '- Latest CI summary: `AgentLoopKit CI Summary` - `.agentloop/reports/2026-06-10-10-20-ci-summary.md`',
    );
    expect(result.stdout).toContain(
      '- Latest release notes: `Release Notes` - `.agentloop/handoffs/2026-06-10-10-25-release-notes.md`',
    );
    expect(result.stdout).toContain('- Runs: 2');
    expect(result.stdout).toContain(
      '- Latest run: `2026-06-10-10-35-ship` `ship` score `96`/100 - `.agentloop/reports/2026-06-10-10-35-ship-report.md`',
    );
    expect(result.stdout).not.toContain('do-not-print-this-fixture');
  });

  test('renders markdown inventory values with safe inline code when artifact metadata contains backticks', async () => {
    const dir = await createRepoWithMarkdownEdgeArtifacts();

    const fullResult = await execa(tsxPath, [cliPath, 'artifacts'], {
      cwd: dir,
      reject: false,
    });
    const latestTaskResult = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--type', 'task', '--latest'],
      {
        cwd: dir,
        reject: false,
      },
    );
    const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(fullResult.exitCode).toBe(0);
    expect(fullResult.stderr).toBe('');
    expect(fullResult.stdout).toContain('- Tasks: 1 total (``review`ready``: 1)');
    expect(fullResult.stdout).toContain(
      '- Latest task: `` Active `task` `` (``review`ready``) - ``.agentloop/tasks/2026-06-11-active`task.md``',
    );
    expect(fullResult.stdout).toContain(
      '- Latest verification: `pass` - `.agentloop/reports/2026-06-11-10-00-verification-report.md`',
    );
    expect(fullResult.stdout).toContain(
      '- Latest handoff: `` Handoff `summary` `` - `.agentloop/handoffs/2026-06-11-10-05-pr-summary.md`',
    );
    expect(fullResult.stdout).toContain(
      '- Latest ship report: `` Ship `report` `` - `.agentloop/reports/2026-06-11-10-07-ship-report.md`',
    );
    expect(fullResult.stdout).toContain(
      '- Latest HTML report: ``.agentloop/reports/agentloop`report.html``',
    );
    expect(fullResult.stdout).toContain(
      '- Latest badge: ``.agentloop/reports/agentloop`verification.svg``',
    );
    expect(fullResult.stdout).toContain(
      '- Latest CI summary: `` CI `summary` `` - `.agentloop/reports/2026-06-11-10-20-ci-summary.md`',
    );
    expect(fullResult.stdout).toContain(
      '- Latest release notes: `` Release `notes` `` - `.agentloop/handoffs/2026-06-11-10-25-release-notes.md`',
    );
    expect(latestTaskResult.exitCode).toBe(0);
    expect(latestTaskResult.stdout).toContain('# AgentLoopKit Artifacts');
    expect(latestTaskResult.stdout).toContain(
      '- Latest task: `` Active `task` `` (``review`ready``) - ``.agentloop/tasks/2026-06-11-active`task.md``',
    );
    const inventory = JSON.parse(jsonResult.stdout);
    expect(inventory.tasks.latest).toMatchObject({
      path: '.agentloop/tasks/2026-06-11-active`task.md',
      title: 'Active `task`',
      status: 'review`ready',
    });
    expect(inventory.verificationReports.latest).toMatchObject({
      title: 'Verification `report`',
      overallStatus: 'pass',
    });
    expect(inventory.shipReports.latest).toMatchObject({
      title: 'Ship `report`',
    });
  });

  test('filters JSON inventory by artifact type', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--json', '--type', 'verification'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      verificationReports: {
        count: 2,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
          title: 'Latest Verification',
          overallStatus: 'pass',
        },
      },
    });
  });

  test('filters JSON inventory by ship report artifact type', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json', '--type', 'ship-report'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      shipReports: {
        count: 2,
        latest: {
          path: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
          title: 'Latest Ship Report',
        },
      },
    });
  });

  test('prints only latest artifacts as deterministic JSON', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json', '--latest'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      latest: [
        {
          type: 'task',
          path: '.agentloop/tasks/2026-06-11-new-task.md',
          title: 'New task',
          status: 'in-progress',
        },
        {
          type: 'verification',
          path: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
          title: 'Latest Verification',
          overallStatus: 'pass',
        },
        {
          type: 'handoff',
          path: '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
          title: 'Latest Handoff',
        },
        {
          type: 'ship-report',
          path: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
          title: 'Latest Ship Report',
        },
        {
          type: 'html-report',
          path: '.agentloop/reports/2026-06-10-10-10-agentloop-report.html',
        },
        {
          type: 'badge',
          path: '.agentloop/reports/agentloop-verification.svg',
        },
        {
          type: 'ci-summary',
          path: '.agentloop/reports/2026-06-10-10-20-ci-summary.md',
          title: 'AgentLoopKit CI Summary',
        },
        {
          type: 'release-notes',
          path: '.agentloop/handoffs/2026-06-10-10-25-release-notes.md',
          title: 'Release Notes',
        },
        {
          type: 'run',
          id: '2026-06-10-10-35-ship',
          command: 'ship',
          createdAt: '2026-06-10-10-35',
          score: 96,
          changedFileCount: 3,
          shipReportPath: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
        },
      ],
    });
  });

  test('filters JSON inventory by run artifact type', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json', '--type', 'run'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      runs: {
        count: 2,
        latest: {
          id: '2026-06-10-10-35-ship',
          command: 'ship',
          createdAt: '2026-06-10-10-35',
          score: 96,
          changedFileCount: 3,
          shipReportPath: '.agentloop/reports/2026-06-10-10-35-ship-report.md',
        },
      },
    });
  });

  test('prints only latest matching JSON artifacts when type and latest are combined', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--json', '--type', 'ci-summary', '--latest'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      latest: [
        {
          type: 'ci-summary',
          path: '.agentloop/reports/2026-06-10-10-20-ci-summary.md',
          title: 'AgentLoopKit CI Summary',
        },
      ],
    });
  });

  test('prints only latest matching run artifacts when type and latest are combined', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--type', 'run', '--latest'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`# AgentLoopKit Artifacts

- Latest run: \`2026-06-10-10-35-ship\` \`ship\` score \`96\`/100 - \`.agentloop/reports/2026-06-10-10-35-ship-report.md\`
`);
  });

  test('prints only latest matching markdown artifacts when type and latest are combined', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--type', 'verification', '--latest'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`# AgentLoopKit Artifacts

- Latest verification: \`pass\` - \`.agentloop/reports/2026-06-10-10-00-verification-report.md\`
`);
  });

  test('prints only latest matching ship report artifact in markdown', async () => {
    const dir = await createRepoWithArtifacts();

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--type', 'ship-report', '--latest'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`# AgentLoopKit Artifacts

- Latest ship report: \`Latest Ship Report\` - \`.agentloop/reports/2026-06-10-10-35-ship-report.md\`
`);
  });

  test('previews stale evidence candidates without mutating files', async () => {
    const dir = await createRepoWithStaleEvidence();
    const before = await snapshotTree(path.join(dir, '.agentloop'));

    const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--stale', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'artifacts', '--stale'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(jsonResult.stderr).toBe('');
    expect(JSON.parse(jsonResult.stdout)).toEqual({
      stale: {
        mode: 'preview',
        writesFiles: false,
        deletesFiles: false,
        candidateCount: 4,
        keptCount: 4,
        shownCandidateCount: 4,
        hiddenCandidateCount: 0,
        limit: null,
        candidates: [
          {
            type: 'verification',
            path: '.agentloop/reports/2026-06-10-09-00-verification-report.md',
            reason: 'Older verification report; latest verification evidence is kept.',
          },
          {
            type: 'handoff',
            path: '.agentloop/handoffs/2026-06-10-09-05-pr-summary.md',
            reason: 'Older handoff summary; latest handoff evidence is kept.',
          },
          {
            type: 'ship-report',
            path: '.agentloop/reports/2026-06-10-09-10-ship-report.md',
            reason: 'Older ship report; latest ship evidence is kept.',
          },
          {
            type: 'run',
            path: '.agentloop/runs/2026-06-10-09-30-verify',
            reason: 'Older run ledger entry; latest run evidence is kept.',
          },
        ],
        kept: [
          {
            type: 'verification',
            path: '.agentloop/reports/2026-06-10-10-00-verification-report.md',
            reason: 'Latest verification report.',
          },
          {
            type: 'handoff',
            path: '.agentloop/handoffs/2026-06-10-10-05-pr-summary.md',
            reason: 'Latest handoff summary.',
          },
          {
            type: 'ship-report',
            path: '.agentloop/reports/2026-06-10-10-10-ship-report.md',
            reason: 'Latest ship report.',
          },
          {
            type: 'run',
            path: '.agentloop/runs/2026-06-10-10-30-ship',
            reason: 'Latest run ledger entry.',
          },
        ],
        safety: {
          readOnly: true,
          deletesFiles: false,
          writesFiles: false,
          readsEnvFiles: false,
          followsSymlinkedArtifactRoots: false,
        },
        nextSteps: [
          'Review candidates before deleting anything manually.',
          'Keep evidence referenced by the latest verification, handoff, ship, and run records.',
        ],
      },
    });
    expect(markdownResult.exitCode).toBe(0);
    expect(markdownResult.stderr).toBe('');
    expect(markdownResult.stdout).toContain('# AgentLoopKit Stale Evidence Preview');
    expect(markdownResult.stdout).toContain('This is a read-only preview. No files were deleted.');
    expect(markdownResult.stdout).toContain(
      '- `verification` `.agentloop/reports/2026-06-10-09-00-verification-report.md` - Older verification report; latest verification evidence is kept.',
    );
    expect(markdownResult.stdout).toContain(
      '- `run` `.agentloop/runs/2026-06-10-09-30-verify` - Older run ledger entry; latest run evidence is kept.',
    );
    expect(markdownResult.stdout).toContain('- Showing `4` of `4` candidate(s).');
    expect(await snapshotTree(path.join(dir, '.agentloop'))).toEqual(before);
  });

  test('filters stale evidence preview to ship report candidates', async () => {
    const dir = await createRepoWithStaleEvidence();
    const before = await snapshotTree(path.join(dir, '.agentloop'));

    const jsonResult = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--stale', '--type', 'ship-report', '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );
    const markdownResult = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--stale', '--type', 'ship-report'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(jsonResult.exitCode).toBe(0);
    expect(jsonResult.stderr).toBe('');
    expect(JSON.parse(jsonResult.stdout)).toMatchObject({
      stale: {
        candidateCount: 1,
        keptCount: 1,
        shownCandidateCount: 1,
        hiddenCandidateCount: 0,
        limit: null,
        candidates: [
          {
            type: 'ship-report',
            path: '.agentloop/reports/2026-06-10-09-10-ship-report.md',
            reason: 'Older ship report; latest ship evidence is kept.',
          },
        ],
        kept: [
          {
            type: 'ship-report',
            path: '.agentloop/reports/2026-06-10-10-10-ship-report.md',
            reason: 'Latest ship report.',
          },
        ],
      },
    });

    expect(markdownResult.exitCode).toBe(0);
    expect(markdownResult.stderr).toBe('');
    expect(markdownResult.stdout).toContain(
      '- `ship-report` `.agentloop/reports/2026-06-10-09-10-ship-report.md` - Older ship report; latest ship evidence is kept.',
    );
    expect(markdownResult.stdout).toContain('- Showing `1` of `1` candidate(s).');
    expect(markdownResult.stdout).not.toContain('verification-report.md');
    expect(markdownResult.stdout).not.toContain('pr-summary.md');
    expect(markdownResult.stdout).not.toContain('.agentloop/runs/');
    expect(await snapshotTree(path.join(dir, '.agentloop'))).toEqual(before);
  });

  test('caps markdown stale evidence preview by default while JSON remains complete', async () => {
    const dir = await createRepoWithManyStaleEvidenceCandidates();

    const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--stale', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'artifacts', '--stale'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(jsonResult.stderr).toBe('');
    const json = JSON.parse(jsonResult.stdout);
    expect(json.stale.candidateCount).toBe(59);
    expect(json.stale.shownCandidateCount).toBe(59);
    expect(json.stale.hiddenCandidateCount).toBe(0);
    expect(json.stale.limit).toBeNull();
    expect(json.stale.candidates).toHaveLength(59);

    expect(markdownResult.exitCode).toBe(0);
    expect(markdownResult.stderr).toBe('');
    expect(markdownResult.stdout).toContain('- Showing `50` of `59` candidate(s).');
    expect(markdownResult.stdout).toContain('- Hidden candidates: `9`.');
    expect(markdownResult.stdout).toContain(
      'Run `agentloop artifacts --stale --json` for full candidate data.',
    );
    expect(markdownResult.stdout).toContain(
      '.agentloop/reports/2026-06-10-08-00-verification-report.md',
    );
    expect(markdownResult.stdout).not.toContain(
      '.agentloop/reports/2026-06-10-08-54-verification-report.md',
    );
  });

  test('limits stale evidence preview output and reports hidden candidates', async () => {
    const dir = await createRepoWithStaleEvidence();

    const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--stale', '--limit', '2', '--json'], {
      cwd: dir,
      reject: false,
    });
    const markdownResult = await execa(tsxPath, [cliPath, 'artifacts', '--stale', '--limit', '2'], {
      cwd: dir,
      reject: false,
    });

    expect(jsonResult.exitCode).toBe(0);
    expect(jsonResult.stderr).toBe('');
    const json = JSON.parse(jsonResult.stdout);
    expect(json.stale.candidateCount).toBe(4);
    expect(json.stale.shownCandidateCount).toBe(2);
    expect(json.stale.hiddenCandidateCount).toBe(2);
    expect(json.stale.limit).toBe(2);
    expect(json.stale.candidates).toHaveLength(2);
    expect(json.stale.candidates.map((candidate: { path: string }) => candidate.path)).toEqual([
      '.agentloop/reports/2026-06-10-09-00-verification-report.md',
      '.agentloop/handoffs/2026-06-10-09-05-pr-summary.md',
    ]);

    expect(markdownResult.exitCode).toBe(0);
    expect(markdownResult.stderr).toBe('');
    expect(markdownResult.stdout).toContain('- Showing `2` of `4` candidate(s).');
    expect(markdownResult.stdout).toContain('- Hidden candidates: `2`.');
    expect(markdownResult.stdout).toContain('Run `agentloop artifacts --stale --json` for full candidate data.');
    expect(markdownResult.stdout).not.toContain('.agentloop/reports/2026-06-10-09-10-ship-report.md');
  });

  test('prints a next step when filtered markdown finds no artifacts', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--type', 'html-report', '--latest'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`# AgentLoopKit Artifacts

No HTML report artifacts found.

Next step: run \`agentloop report\` to create a local HTML report.
`);
  });

  test('prints the correct handoff next step when no handoff artifacts exist', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--type', 'handoff', '--latest'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`# AgentLoopKit Artifacts

No handoff artifacts found.

Next step: run \`agentloop handoff\` to create a handoff summary.
`);
  });

  test('returns zero counts when AgentLoop artifact directories are missing', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      tasks: { count: 0, byStatus: {}, latest: null },
      verificationReports: { count: 0, latest: null },
      handoffs: { count: 0, latest: null },
      shipReports: { count: 0, latest: null },
      htmlReports: { count: 0, latest: null },
      badges: { count: 0, latest: null },
      ciSummaries: { count: 0, latest: null },
      releaseNotes: { count: 0, latest: null },
      runs: { count: 0, latest: null },
    });
    expect(existsSync(path.join(dir, '.agentloop'))).toBe(false);
  });

  test('prints unsupported artifact type errors as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json', '--type', 'unknown'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'UNSUPPORTED_ARTIFACT_TYPE',
        message: 'Unsupported artifact type: unknown',
        artifactType: 'unknown',
        supportedTypes: [
          'task',
          'verification',
          'handoff',
          'ship-report',
          'html-report',
          'badge',
          'ci-summary',
          'release-notes',
          'run',
        ],
      },
    });
  });

  test('rejects contradictory stale and latest flags as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--stale', '--latest', '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'CONFLICTING_ARTIFACT_OPTIONS',
        message: 'Cannot combine --stale and --latest.',
        options: ['stale', 'latest'],
      },
    });
  });

  test('rejects invalid stale preview limits as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(
      tsxPath,
      [cliPath, 'artifacts', '--stale', '--limit', '0', '--json'],
      {
        cwd: dir,
        reject: false,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'INVALID_ARTIFACT_LIMIT',
        message: 'Artifact limit must be a positive integer.',
        value: '0',
      },
    });
  });

  test('rejects limit without stale preview as JSON', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeConfig(dir);

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--limit', '2', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({
      error: {
        code: 'LIMIT_REQUIRES_STALE_PREVIEW',
        message: 'Use --limit with --stale.',
        options: ['limit', 'stale'],
      },
    });
  });

  test('does not create, delete, or mutate artifact files', async () => {
    const dir = await createRepoWithArtifacts();
    const before = await snapshotTree(path.join(dir, '.agentloop'));

    const textResult = await execa(tsxPath, [cliPath, 'artifacts'], {
      cwd: dir,
      reject: false,
    });
    const jsonResult = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(textResult.exitCode).toBe(0);
    expect(jsonResult.exitCode).toBe(0);
    expect(await snapshotTree(path.join(dir, '.agentloop'))).toEqual(before);
  });

  test('does not inspect artifact roots that resolve outside the repository', async () => {
    const dir = await makeTempDir();
    const outsideReports = await makeTempDir();
    tempDirs.push(dir, outsideReports);
    await writeConfig(dir);
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await writeEvidenceFile(
      outsideReports,
      '2026-06-10-10-00-verification-report.md',
      '# Outside Verification\n\nOverall status: pass\n\noutside-secret-content\n',
      '2026-06-10T10:00:00.000Z',
    );
    await symlink(outsideReports, path.join(dir, '.agentloop/reports'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('outside-secret-content');
    expect(JSON.parse(result.stdout)).toMatchObject({
      verificationReports: { count: 0, latest: null },
      htmlReports: { count: 0, latest: null },
      badges: { count: 0, latest: null },
      ciSummaries: { count: 0, latest: null },
    });
  });

  test('does not inspect run ledger roots that resolve outside the repository', async () => {
    const dir = await makeTempDir();
    const outsideRuns = await makeTempDir();
    tempDirs.push(dir, outsideRuns);
    await writeConfig(dir);
    await mkdir(path.join(dir, '.agentloop'), { recursive: true });
    await writeRunMetadata(
      outsideRuns,
      '2026-06-10-10-30-ship',
      {
        id: '2026-06-10-10-30-ship',
        command: 'ship',
        createdAt: '2026-06-10-10-30',
        changedFileCount: 1,
        shipReportPath: 'outside-secret-report.md',
      },
      '2026-06-10T10:30:00.000Z',
    );
    await symlink(outsideRuns, path.join(dir, '.agentloop/runs'), 'dir');

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).not.toContain('outside-secret-report');
    expect(JSON.parse(result.stdout)).toMatchObject({
      runs: { count: 0, latest: null },
    });
  });

  test('prints invalid config errors as JSON without writing artifacts', async () => {
    const dir = await makeTempDir();
    tempDirs.push(dir);
    await writeFile(path.join(dir, 'agentloop.config.json'), '{"version":2}');

    const result = await execa(tsxPath, [cliPath, 'artifacts', '--json'], {
      cwd: dir,
      reject: false,
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toMatchObject({
      error: {
        code: 'CONFIG_ERROR',
        message: expect.stringContaining('Invalid AgentLoopKit config'),
      },
    });
    expect(existsSync(path.join(dir, '.agentloop'))).toBe(false);
  });
});
