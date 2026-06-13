import path from 'node:path';
import {
  AGENTLOOP_DIR,
  AGENTLOOP_FILE,
  AGENTLOOP_MANIFEST_FILE,
  AGENTS_FILE,
  CURRENT_TEMPLATE_VERSION,
} from './constants.js';
import { pathExists, readTextIfExists } from './file-system.js';

export type HarnessTopicId =
  | 'ship'
  | 'prepare-pr'
  | 'run-ledger'
  | 'maintainer-check'
  | 'review-context'
  | 'upgrade-safety';

export type HarnessFileStatus = 'current' | 'review' | 'missing';
export type HarnessUpgradeStatus = 'pass' | 'warn';

export type HarnessUpgradeFile = {
  path: string;
  exists: boolean;
  status: HarnessFileStatus;
  presentTopics: HarnessTopicId[];
  missingTopics: HarnessTopicId[];
};

export type HarnessManifestStatus = {
  path: string;
  exists: boolean;
  status: 'current' | 'missing' | 'older' | 'newer' | 'invalid';
  templateVersion?: number;
  currentTemplateVersion: number;
};

export type HarnessUpgradeReport = {
  status: HarnessUpgradeStatus;
  dryRun: boolean;
  writesFiles: false;
  targetDirectory: string;
  manifest: HarnessManifestStatus;
  files: HarnessUpgradeFile[];
  nextSteps: string[];
};

type TopicDefinition = {
  id: HarnessTopicId;
  needles: string[];
};

const TOPICS: TopicDefinition[] = [
  { id: 'ship', needles: ['agentloop ship'] },
  { id: 'prepare-pr', needles: ['agentloop prepare-pr'] },
  { id: 'run-ledger', needles: ['.agentloop/runs', 'agentloop runs', 'agentloop intent'] },
  { id: 'maintainer-check', needles: ['agentloop maintainer-check'] },
  { id: 'review-context', needles: ['agentloop review-context'] },
  { id: 'upgrade-safety', needles: ['agentloop upgrade-harness', 'upgrade-harness'] },
];

const HARNESS_FILES = [
  AGENTS_FILE,
  AGENTLOOP_FILE,
  path.posix.join(AGENTLOOP_DIR, 'harness', 'commands.md'),
  path.posix.join(AGENTLOOP_DIR, 'README.md'),
] as const;

function repoPath(cwd: string, relativePath: string) {
  return path.join(cwd, ...relativePath.split('/'));
}

function detectPresentTopics(content: string) {
  const normalized = content.toLowerCase();
  return TOPICS.filter((topic) =>
    topic.needles.some((needle) => normalized.includes(needle.toLowerCase())),
  ).map((topic) => topic.id);
}

async function inspectHarnessFile(cwd: string, relativePath: string): Promise<HarnessUpgradeFile> {
  const exists = await pathExists(repoPath(cwd, relativePath));
  if (!exists) {
    return {
      path: relativePath,
      exists: false,
      status: 'missing',
      presentTopics: [],
      missingTopics: TOPICS.map((topic) => topic.id),
    };
  }

  const presentTopics = detectPresentTopics(await readTextIfExists(repoPath(cwd, relativePath)));
  const presentSet = new Set(presentTopics);
  const missingTopics = TOPICS.map((topic) => topic.id).filter((topic) => !presentSet.has(topic));

  return {
    path: relativePath,
    exists,
    status: missingTopics.length ? 'review' : 'current',
    presentTopics,
    missingTopics,
  };
}

async function inspectManifest(cwd: string): Promise<HarnessManifestStatus> {
  const manifestPath = AGENTLOOP_MANIFEST_FILE;
  const absolutePath = repoPath(cwd, manifestPath);
  if (!(await pathExists(absolutePath))) {
    return {
      path: manifestPath,
      exists: false,
      status: 'missing',
      currentTemplateVersion: CURRENT_TEMPLATE_VERSION,
    };
  }

  try {
    const manifest = JSON.parse(await readTextIfExists(absolutePath)) as {
      templateVersion?: unknown;
    };
    const templateVersion =
      typeof manifest.templateVersion === 'number' ? manifest.templateVersion : undefined;
    if (templateVersion === undefined) {
      return {
        path: manifestPath,
        exists: true,
        status: 'invalid',
        currentTemplateVersion: CURRENT_TEMPLATE_VERSION,
      };
    }

    return {
      path: manifestPath,
      exists: true,
      status:
        templateVersion === CURRENT_TEMPLATE_VERSION
          ? 'current'
          : templateVersion < CURRENT_TEMPLATE_VERSION
            ? 'older'
            : 'newer',
      templateVersion,
      currentTemplateVersion: CURRENT_TEMPLATE_VERSION,
    };
  } catch {
    return {
      path: manifestPath,
      exists: true,
      status: 'invalid',
      currentTemplateVersion: CURRENT_TEMPLATE_VERSION,
    };
  }
}

function buildNextSteps(report: Pick<HarnessUpgradeReport, 'manifest' | 'files'>) {
  const nextSteps = [
    'Run `agentloop upgrade-harness` after updating the CLI to inspect existing harness guidance.',
  ];

  if (report.manifest.status !== 'current') {
    nextSteps.push('Run `agentloop init --dry-run` to see missing generated files before writing.');
  }

  if (report.files.some((file) => file.status !== 'current')) {
    nextSteps.push(
      'Manually copy the relevant guidance into AGENTS.md, AGENTLOOP.md, or .agentloop/harness/*; AgentLoopKit will not overwrite local edits.',
    );
    nextSteps.push(
      'Use the current loop for new work now: `agentloop create-task`, `agentloop verify`, `agentloop ship`, `agentloop prepare-pr`, `agentloop maintainer-check`.',
    );
  } else {
    nextSteps.push('Harness guidance already mentions the current review-readiness loop.');
  }

  return nextSteps;
}

export async function inspectHarnessUpgrade(options: {
  cwd: string;
  dryRun?: boolean;
}): Promise<HarnessUpgradeReport> {
  const cwd = path.resolve(options.cwd);
  const manifest = await inspectManifest(cwd);
  const files = await Promise.all(HARNESS_FILES.map((file) => inspectHarnessFile(cwd, file)));
  const status: HarnessUpgradeStatus =
    manifest.status === 'current' && files.every((file) => file.status === 'current')
      ? 'pass'
      : 'warn';

  const base = {
    status,
    dryRun: Boolean(options.dryRun),
    writesFiles: false as const,
    targetDirectory: cwd,
    manifest,
    files,
  };

  return {
    ...base,
    nextSteps: buildNextSteps(base),
  };
}
