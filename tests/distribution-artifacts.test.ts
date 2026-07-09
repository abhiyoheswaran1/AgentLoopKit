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
    expect(workflow).toMatch(/workflows:\s+\[['"]Publish['"]\]/);
    expect(workflow).toContain('id-token: write');
    expect(workflow).toContain('mcp-publisher login github-oidc');
    expect(workflow).toContain('mcp-publisher publish');
    expect(workflow).toContain('npm view "$PACKAGE_NAME@$PACKAGE_VERSION" version');
    expect(workflow).toContain('MCP_PUBLISHER_VERSION: v1.7.9');
    expect(workflow).toContain('ab128162b0616090b47cf245afe0a23f3ef08936fdce19074f5ba0a4469281ac');
    expect(workflow).toContain('sha256sum --check');
    expect(workflow).not.toContain('releases/latest');
  });

  test('GitHub Action is a thin AgentLoopKit CLI wrapper', async () => {
    const action = await readFile('action.yml', 'utf8');
    const runner = await readFile('scripts/github-action-runner.mjs', 'utf8');

    expect(action).toContain("using: 'composite'");
    expect(action).toContain('agentloopkit-version');
    expect(action).toContain('install-mode');
    expect(action).toContain("default: 'latest'");
    expect(action).toContain("default: 'npm'");
    expect(action).toContain('AGENTLOOPKIT_COMMAND: ${{ inputs.command }}');
    expect(action).toContain('node "$GITHUB_ACTION_PATH/scripts/github-action-runner.mjs"');
    expect(action.match(/working-directory: \$\{\{ inputs\.working-directory \}\}/g)).toHaveLength(
      1,
    );
    expect(action).not.toMatch(/default: ['"]\d+\.\d+\.\d+['"]/);
    expect(action).not.toContain('npx --no-install agentloop ${{ inputs.command }}');
    expect(runner).toContain('spawnSync(command, args');
    expect(runner).toContain('shell: false');
    expect(runner).toContain("run('npx', ['--no-install', 'agentloop', ...plan.commandArgs])");
    expect(action).not.toContain('upload-artifact');
  });

  test('GitHub Action avoids direct shell interpolation for package version input', async () => {
    const action = await readFile('action.yml', 'utf8');
    const runner = await readFile('scripts/github-action-runner.mjs', 'utf8');

    expect(action).toContain('AGENTLOOPKIT_VERSION: ${{ inputs.agentloopkit-version }}');
    expect(action).toContain('AGENTLOOPKIT_INSTALL_MODE: ${{ inputs.install-mode }}');
    expect(runner).toContain(
      "run('npm', ['install', '--no-save', '--package-lock=false', plan.packageSpec])",
    );
    expect(runner).toContain('validateAgentLoopKitVersion');
    expect(action).not.toContain('agentloopkit@${{ inputs.agentloopkit-version }}');
  });

  test('GitHub Action docs explain install modes and keep local mode pinned-friendly', async () => {
    const docs = await readFile('docs/github-actions.md', 'utf8');
    const example = await readFile('examples/github-actions/README.md', 'utf8');

    expect(docs).toContain('install-mode: npm');
    expect(docs).toContain('install-mode: local');
    expect(docs).toContain(
      'Use `install-mode: local` only when the repo already installs AgentLoopKit as a dev dependency.',
    );
    expect(example).toContain('install-mode: npm');
    expect(example).toContain('install-mode: local');
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

  test('CLI smoke workflow builds before running the local smoke script on every OS', async () => {
    const workflow = await readFile('.github/workflows/smoke.yml', 'utf8');

    expect(workflow).toContain('ubuntu-latest');
    expect(workflow).toContain('macos-latest');
    expect(workflow).toContain('windows-latest');
    expect(workflow).toContain('pnpm/action-setup@v6');
    expect(workflow).toContain('version: 10.12.1');
    expect(workflow).toContain('actions/setup-node@v6');
    expect(workflow).toContain('pnpm install --frozen-lockfile');

    const buildStep = workflow.indexOf('pnpm build');
    const smokeStep = workflow.indexOf('node scripts/smoke-cli.mjs');

    expect(buildStep).toBeGreaterThan(-1);
    expect(smokeStep).toBeGreaterThan(buildStep);
    expect(workflow).not.toMatch(
      /npm publish|pnpm publish|gh release|mcp-publisher|upload-artifact/i,
    );
  });

  test('CLI smoke script covers setup errors and nested working directories', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('Missing config smoke passed.');
    expect(smokeScript).toContain('Nested cwd smoke passed.');
    expect(smokeScript).toContain("'status', '--json'");
    expect(smokeScript).toContain("'create-task'");
    expect(smokeScript).toContain("'verify'");
    expect(smokeScript).toContain("'--progress'");
    expect(smokeScript).toContain('Verify progress smoke passed.');
    expect(smokeScript).toContain('raw-child-output-hidden-from-progress');
    expect(smokeScript).toContain("'handoff'");
    expect(smokeScript).toContain("'check-gates', '--json'");
    expect(smokeScript).toContain("'runs', '--latest'");
    expect(smokeScript).toContain("'runs', '--limit', '2', '--json'");
    expect(smokeScript).toContain('Run ledger limit smoke passed.');
    expect(smokeScript).toContain("'policy', 'list', '--json'");
    expect(smokeScript).toContain("'install-agent', 'codex', '--json'");
  });

  test('CLI smoke script covers upgrade-harness redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['upgrade-harness', '--json', '--redact-paths']");
    expect(smokeScript).toContain('const redactedHarnessUpgrade = parseJson(');
    expect(smokeScript).toContain("redactedHarnessUpgrade.status === 'pass'");
    expect(smokeScript).toContain('redactedHarnessUpgrade.writesFiles === false');
    expect(smokeScript).toContain("redactedHarnessUpgrade.targetDirectory === '[git-root]'");
    expect(smokeScript).toContain('Harness upgrade smoke passed.');
  });

  test('CLI smoke script covers status and next redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['status', '--redact-paths']");
    expect(smokeScript).toContain("['status', '--json', '--redact-paths']");
    expect(smokeScript).toContain("['next', '--redact-paths']");
    expect(smokeScript).toContain("['next', '--json', '--redact-paths']");
    expect(smokeScript).toContain("redactedStatus.git?.root === '[git-root]'");
    expect(smokeScript).toContain('redactedStatus.latestRun?.id === statusWithRun.latestRun?.id');
    expect(smokeScript).toContain(
      'redactedNext.nextAction?.command === nextAction.nextAction?.command',
    );
    expect(smokeScript).toContain('!redactedStatusAndNextOutput.includes(smokeRepo)');
    expect(smokeScript).toContain('Status and next redaction smoke passed.');
  });

  test('CLI smoke script covers verify redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toMatch(/'verify'[\s\S]*?'--json'[\s\S]*?'--redact-paths'/);
    expect(smokeScript).toContain('const redactedVerification = parseJson(');
    expect(smokeScript).toContain(
      'redactedVerification.overallStatus === verification.overallStatus',
    );
    expect(smokeScript).toContain(
      'redactedVerification.commands?.length === verification.commands?.length',
    );
    expect(smokeScript).toContain(
      'redactedVerification.commands?.every((command) => command.passed === true)',
    );
    expect(smokeScript).toContain('const redactedVerificationReport = await readFile(');
    expect(smokeScript).toContain("redactedVerificationReport.includes('# Verification Report')");
    expect(smokeScript).toContain('!redactedVerificationReport.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedVerification).includes(smokeRepo)');
    expect(smokeScript).toContain('Verify redaction smoke passed.');
  });

  test('CLI smoke script covers handoff redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toMatch(/'handoff'[\s\S]*?'--json'[\s\S]*?'--redact-paths'/);
    expect(smokeScript).toContain('const redactedHandoff = parseJson(');
    expect(smokeScript).toContain('redactedHandoff.outPath');
    expect(smokeScript).toContain('redactedHandoff.run?.id');
    expect(smokeScript).toContain('const redactedHandoffSummary = await readFile(');
    expect(smokeScript).toContain("redactedHandoffSummary.includes('# PR Summary')");
    expect(smokeScript).toContain('!redactedHandoffSummary.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedHandoff).includes(smokeRepo)');
    expect(smokeScript).toContain('Handoff redaction smoke passed.');
  });

  test('CLI smoke script covers summarize redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toMatch(
      /'summarize'[\s\S]*?'--write'[\s\S]*?'--write-run'[\s\S]*?'--json'[\s\S]*?'--redact-paths'/,
    );
    expect(smokeScript).toContain('const redactedSummary = parseJson(');
    expect(smokeScript).toContain('redactedSummary.outPath');
    expect(smokeScript).toContain('redactedSummary.run?.id');
    expect(smokeScript).toContain('const redactedSummaryMarkdown = await readFile(');
    expect(smokeScript).toContain("redactedSummaryMarkdown.includes('# PR Summary')");
    expect(smokeScript).toContain('!redactedSummaryMarkdown.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedSummary).includes(smokeRepo)');
    expect(smokeScript).toContain('Summarize redaction smoke passed.');
  });

  test('CLI smoke script covers check-gates redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['check-gates']");
    expect(smokeScript).toContain("['check-gates', '--redact-paths']");
    expect(smokeScript).toContain("['check-gates', '--json']");
    expect(smokeScript).toContain("['check-gates', '--json', '--redact-paths']");
    expect(smokeScript).toContain("redactedGates.git?.root === '[git-root]'");
    expect(smokeScript).toContain('redactedGates.overallStatus === gates.overallStatus');
    expect(smokeScript).toContain(
      'JSON.stringify(redactedGates.gates) === JSON.stringify(gates.gates)',
    );
    expect(smokeScript).toContain('!redactedGatesHuman.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedGates).includes(smokeRepo)');
    expect(smokeScript).toContain('Check-gates redaction smoke passed.');
  });

  test('CLI smoke script covers review-context redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['review-context']");
    expect(smokeScript).toContain("['review-context', '--redact-paths']");
    expect(smokeScript).toContain("['review-context', '--json']");
    expect(smokeScript).toContain("['review-context', '--json', '--redact-paths']");
    expect(smokeScript).toContain(
      "reviewContextHuman.stdout.includes('# AgentLoopKit Review Context')",
    );
    expect(smokeScript).toContain(
      "redactedReviewContextHuman.stdout.includes('# AgentLoopKit Review Context')",
    );
    expect(smokeScript).toContain(
      'redactedReviewContext.latestShip?.score === reviewContext.latestShip?.score',
    );
    expect(smokeScript).toContain(
      'redactedReviewContext.gates?.overallStatus === reviewContext.gates?.overallStatus',
    );
    expect(smokeScript).toContain('!redactedReviewContextHuman.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedReviewContext).includes(smokeRepo)');
    expect(smokeScript).toContain('Review-context redaction smoke passed.');
  });

  test('CLI smoke script covers ship redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['ship', '--json', '--github-comment', '--redact-paths']");
    expect(smokeScript).toContain("['ship', '--github-comment', '--redact-paths']");
    expect(smokeScript).toContain("redactedShip.gates?.git?.root === '[git-root]'");
    expect(smokeScript).toContain('redactedShip.gates?.git?.targetIsRoot === true');
    expect(smokeScript).toContain('redactedShip.readiness?.totalScore >= 0');
    expect(smokeScript).toContain(
      "redactedShip.githubComment?.includes('AgentLoopKit Review Readiness')",
    );
    expect(smokeScript).toContain('redactedShipComment.stdout.includes');
    expect(smokeScript).toContain('!redactedShipComment.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedShip).includes(smokeRepo)');
    expect(smokeScript).toContain('Ship redaction smoke passed.');
  });

  test('CLI smoke script covers prepare-pr redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['prepare-pr', '--json', '--github-comment', '--redact-paths']");
    expect(smokeScript).toContain("['prepare-pr', '--github-comment', '--redact-paths']");
    expect(smokeScript).toContain(
      'redactedPreparedPr.titleSuggestion === preparedPr.titleSuggestion',
    );
    expect(smokeScript).toContain(
      "redactedPreparedPr.githubComment?.includes('AgentLoopKit Review Readiness')",
    );
    expect(smokeScript).toContain("redactedPreparedPr.body?.includes('## Verification Evidence')");
    expect(smokeScript).toContain(
      "['reused', 'refreshed'].includes(redactedPreparedPr.shipEvidence?.source)",
    );
    expect(smokeScript).toContain('redactedPreparePrComment.stdout.includes');
    expect(smokeScript).toContain('!redactedPreparePrComment.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedPreparedPr).includes(smokeRepo)');
    expect(smokeScript).toContain('Prepare-pr redaction smoke passed.');
  });

  test('CLI smoke script covers maintainer-check redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['maintainer-check']");
    expect(smokeScript).toContain("['maintainer-check', '--redact-paths']");
    expect(smokeScript).toContain("['maintainer-check', '--json']");
    expect(smokeScript).toContain("['maintainer-check', '--json', '--redact-paths']");
    expect(smokeScript).toContain(
      "maintainerHuman.stdout.includes('# AgentLoopKit Maintainer Check')",
    );
    expect(smokeScript).toContain(
      "redactedMaintainerHuman.stdout.includes('# AgentLoopKit Maintainer Check')",
    );
    expect(smokeScript).toContain('redactedMaintainer.status === maintainer.status');
    expect(smokeScript).toContain(
      'redactedMaintainer.checks?.length === maintainer.checks?.length',
    );
    expect(smokeScript).toContain('!redactedMaintainerHuman.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedMaintainer).includes(smokeRepo)');
    expect(smokeScript).toContain('Maintainer-check redaction smoke passed.');
  });

  test('CLI smoke script covers run ledger redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['runs', '--latest', '--redact-paths']");
    expect(smokeScript).toContain("['runs', '--latest', '--json']");
    expect(smokeScript).toContain("['runs', '--latest', '--json', '--redact-paths']");
    expect(smokeScript).toContain("['show-run', ship.run.id]");
    expect(smokeScript).toContain("['show-run', ship.run.id, '--redact-paths']");
    expect(smokeScript).toContain("['show-run', ship.run.id, '--json']");
    expect(smokeScript).toContain("['show-run', ship.run.id, '--json', '--redact-paths']");
    expect(smokeScript).toContain("['intent', taskPath]");
    expect(smokeScript).toContain("['intent', taskPath, '--redact-paths']");
    expect(smokeScript).toContain("['intent', taskPath, '--json']");
    expect(smokeScript).toContain("['intent', taskPath, '--json', '--redact-paths']");
    expect(smokeScript).toContain('latestRunsRedacted.stdout === latestRuns.stdout');
    expect(smokeScript).toContain(
      'JSON.stringify(latestRunsRedactedJson) === JSON.stringify(latestRunsJson)',
    );
    expect(smokeScript).toContain('shownRunRedacted.stdout === shownRun.stdout');
    expect(smokeScript).toContain(
      'JSON.stringify(shownRunRedactedJson) === JSON.stringify(shownRunJson)',
    );
    expect(smokeScript).toContain('intentRedacted.stdout === intent.stdout');
    expect(smokeScript).toContain(
      'JSON.stringify(intentRedactedJson) === JSON.stringify(intentJson)',
    );
    expect(smokeScript).toContain('!runLedgerRedactionOutput.includes(smokeRepo)');
    expect(smokeScript).toContain('Run ledger redaction smoke passed.');
  });

  test('CLI smoke script covers human artifacts run evidence split', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'artifacts', '--type', 'run', '--latest'");
    expect(smokeScript).toContain(
      'artifacts --type run --latest did not include the latest ship run.',
    );
    expect(smokeScript).toContain(
      'artifacts --type run --latest did not include changed-file scope.',
    );
    expect(smokeScript).toContain(
      'artifacts --type run --latest did not split AgentLoop evidence churn.',
    );
    expect(smokeScript).toContain('Artifact run split smoke passed.');
  });

  test('CLI smoke script covers latest ship report artifacts', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'artifacts', '--type', 'ship-report', '--latest'");
    expect(smokeScript).toContain('latestShipReportArtifact.stdout.includes(ship.shipReportPath)');
    expect(smokeScript).toContain(
      'artifacts --type ship-report --latest did not include the latest ship report.',
    );
    expect(smokeScript).toContain('Latest ship-report artifact smoke passed.');
  });

  test('CLI smoke script covers artifacts redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['artifacts', '--redact-paths']");
    expect(smokeScript).toContain("['artifacts', '--json']");
    expect(smokeScript).toContain("['artifacts', '--json', '--redact-paths']");
    expect(smokeScript).toContain(
      "redactedArtifactsHuman.stdout.includes('# AgentLoopKit Artifacts')",
    );
    expect(smokeScript).toContain('redactedArtifacts.tasks?.count === artifacts.tasks?.count');
    expect(smokeScript).toContain('redactedArtifacts.verificationReports?.latest?.path ===');
    expect(smokeScript).toContain('artifacts.verificationReports?.latest?.path');
    expect(smokeScript).toContain('!redactedArtifactsHuman.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedArtifacts).includes(smokeRepo)');
    expect(smokeScript).toContain('Artifacts redaction smoke passed.');
  });

  test('CLI smoke script covers stale artifact limit smoke', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'artifacts', '--stale', '--limit', '2', '--json'");
    expect(smokeScript).toContain("'artifacts', '--stale', '--limit', '2'");
    expect(smokeScript).toContain("'artifacts', '--limit', '2', '--json'");
    expect(smokeScript).toContain('boundedStaleArtifacts.stale?.candidateCount === 4');
    expect(smokeScript).toContain('boundedStaleArtifacts.stale?.shownCandidateCount === 2');
    expect(smokeScript).toContain('boundedStaleArtifacts.stale?.hiddenCandidateCount === 2');
    expect(smokeScript).toContain('boundedStaleArtifacts.stale?.limit === 2');
    expect(smokeScript).toContain(
      "limitWithoutStaleError.error?.code === 'LIMIT_REQUIRES_STALE_PREVIEW'",
    );
    expect(smokeScript).toContain("limitWithoutStaleError.error?.options?.includes('stale')");
    expect(smokeScript).toContain('Stale artifact limit smoke passed.');
  });

  test('CLI smoke script covers default stale preview cap', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('prepareDefaultStalePreviewSmokeRepo');
    expect(smokeScript).toContain('defaultStaleArtifacts.stale?.candidateCount === 51');
    expect(smokeScript).toContain('defaultStaleArtifacts.stale?.shownCandidateCount === 51');
    expect(smokeScript).toContain('defaultStaleArtifacts.stale?.hiddenCandidateCount === 0');
    expect(smokeScript).toContain('defaultStaleArtifacts.stale?.limit === null');
    expect(smokeScript).toContain(
      "defaultStaleArtifactsHuman.stdout.includes('- Showing `50` of `51` candidate(s).')",
    );
    expect(smokeScript).toContain(
      "defaultStaleArtifactsHuman.stdout.includes('- Hidden candidates: `1`.')",
    );
    expect(smokeScript).toContain(
      '!defaultStaleArtifactsHuman.stdout.includes(hiddenDefaultStaleVerificationPath)',
    );
    expect(smokeScript).toContain('Default stale artifact preview smoke passed.');
  });

  test('CLI smoke script covers forced home-directory init warning', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'init', '--dry-run', '--force'");
    expect(smokeScript).toContain('env: homeDirectoryEnv(forcedHome)');
    expect(smokeScript).toContain(
      'return { HOME: homeDirectory, USERPROFILE: homeDirectory };',
    );
    expect(smokeScript).toContain(
      'Warning: Target directory is your home directory. AgentLoopKit can write repository harness files there when --force is used.',
    );
    expect(smokeScript).toContain('No files written.');
    expect(smokeScript).toContain('for (const relativePath of [');
    expect(smokeScript).toContain("'agentloop.config.json'");
    expect(smokeScript).toContain("'AGENTS.md'");
    expect(smokeScript).toContain("'AGENTLOOP.md'");
    expect(smokeScript).toContain("'.agentloop'");
    expect(smokeScript).toContain('path.join(forcedHome, relativePath)');
    expect(smokeScript).toContain('forced home-directory dry-run wrote ${relativePath}.');
    expect(smokeScript).toContain('Forced home-directory dry-run warning smoke passed.');
  });

  test('CLI smoke script covers release-proof completion values', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'completion', 'bash'");
    expect(smokeScript).toContain('const releaseProofCompletionChannels = [');
    expect(smokeScript).toContain("'npm'");
    expect(smokeScript).toContain("'github-release'");
    expect(smokeScript).toContain("'github-marketplace'");
    expect(smokeScript).toContain("'ghcr'");
    expect(smokeScript).toContain("'mcp-registry'");
    expect(smokeScript).toContain('"$previous" == "--only"');
    expect(smokeScript).toContain('release-proof completion did not include channel ${channel}.');
    expect(smokeScript).toContain('Release-proof completion smoke passed.');
  });

  test('CLI smoke script covers release-proof HEAD tag clarity', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('prepareReleaseProofSmokeRepo');
    expect(smokeScript).toContain("'release-proof', '--only', 'npm', '--json'");
    expect(smokeScript).toContain("'--npm-registry-json'");
    expect(smokeScript).toContain("releaseProofHeadTag.overallStatus === 'pass'");
    expect(smokeScript).toContain('releaseProofHeadTag.git?.tagCommit');
    expect(smokeScript).toContain('releaseProofHeadTag.git?.headMatchesTag === false');
    expect(smokeScript).toContain(
      "releaseProofHeadTag.nextAction?.command === 'agentloop release-check'",
    );
    expect(smokeScript).toContain('!JSON.stringify(releaseProofHeadTag).includes(smokeRepo)');
    expect(smokeScript).toContain('Release-proof HEAD tag smoke passed.');
  });

  test('CLI smoke script covers release-check redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('prepareReleaseCheckSmokeRepo');
    expect(smokeScript).toContain("['release-check']");
    expect(smokeScript).toContain("['release-check', '--redact-paths']");
    expect(smokeScript).toContain("['release-check', '--json']");
    expect(smokeScript).toContain("['release-check', '--json', '--redact-paths']");
    expect(smokeScript).toContain('releaseCheckJson.git?.root === releaseCheckRepo');
    expect(smokeScript).toContain('releaseCheckJson.git?.changedFileCount === 2');
    expect(smokeScript).toContain('releaseCheckJson.git?.nonEvidenceChangedFileCount === 1');
    expect(smokeScript).toContain('releaseCheckJson.git?.agentLoopEvidenceChangedFileCount === 1');
    expect(smokeScript).toContain('releaseCheckHuman.stdout.includes(');
    expect(smokeScript).toContain(
      "'- Changed files: `2` (`1` non-evidence, `1` AgentLoop evidence)'",
    );
    expect(smokeScript).toContain("redactedReleaseCheck.git?.root === '[git-root]'");
    expect(smokeScript).toContain('!redactedReleaseCheckHuman.stdout.includes(releaseCheckRepo)');
    expect(smokeScript).toContain(
      '!JSON.stringify(redactedReleaseCheck).includes(releaseCheckRepo)',
    );
    expect(smokeScript).toContain('Release-check redaction smoke passed.');
  });

  test('CLI smoke script covers generated artifact filename ordering', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('prepareArtifactOrderingSmokeRepo');
    expect(smokeScript).toContain("'.agentloop/reports/2026-06-16-11-51-verification-report.md'");
    expect(smokeScript).toContain("'.agentloop/reports/2026-06-16-12-24-verification-report.md'");
    expect(smokeScript).toContain("'.agentloop/handoffs/2026-06-16-12-24-pr-summary.md'");
    expect(smokeScript).toContain("'.agentloop/reports/2026-06-16-12-24-ship-report.md'");
    expect(smokeScript).toContain("['status', '--json']");
    expect(smokeScript).toContain("['artifacts', '--json']");
    expect(smokeScript).toContain('artifactOrderingStatus.latestReport?.path ===');
    expect(smokeScript).toContain('artifactOrderingInventory.verificationReports.latest?.path ===');
    expect(smokeScript).toContain('artifactOrderingInventory.handoffs.latest?.path ===');
    expect(smokeScript).toContain('artifactOrderingInventory.shipReports.latest?.path ===');
    expect(smokeScript).toContain('Generated artifact filename ordering smoke passed.');
  });

  test('CLI smoke script covers fish task archive status completion', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'completion', 'fish'");
    expect(smokeScript).toContain(
      '__fish_seen_subcommand_from task; and __fish_seen_subcommand_from archive',
    );
    expect(smokeScript).toContain('const fishArchiveStatusValue = "-l status -a \'done\'";');
    expect(smokeScript).toContain('Fish task archive completion smoke passed.');
  });

  test('CLI smoke script covers template and completion commands', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['list-templates']");
    expect(smokeScript).toContain("['list-templates', '--json']");
    expect(smokeScript).toContain("listTemplates.templates?.agents?.includes('codex.md')");
    expect(smokeScript).toContain("listTemplates.templates?.root?.includes('AGENTLOOP.md')");
    expect(smokeScript).toContain("'completion', 'zsh'");
    expect(smokeScript).toContain("'completion', 'powershell'");
    expect(smokeScript).toContain("'completion', 'pwsh'");
    expect(smokeScript).toContain("'completion', 'nushell'");
    expect(smokeScript).toContain('unsupportedCompletion.exitCode !== 0');
    expect(smokeScript).toContain('powershellCompletion.stdout === pwshCompletion.stdout');
    expect(smokeScript).toContain("!powershellCompletion.stdout.includes('$PROFILE')");
    expect(smokeScript).toContain('Template and completion command smoke passed.');
  });

  test('CLI smoke script covers npm-status captured registry mode', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('const npmStatusRegistryJsonPath = path.join(');
    expect(smokeScript).toMatch(
      /'npm-status',\s+'--agentloopkit',\s+'--registry-json',\s+npmStatusRegistryJsonPath,\s+'--json'/,
    );
    expect(smokeScript).toMatch(
      /'npm-status',\s+'--agentloopkit',\s+'--registry-json',\s+npmStatusRegistryJsonPath,\s+'--expect-current'/,
    );
    expect(smokeScript).toContain("'npm-status', '--registry-json', npmStatusEnvPath, '--json'");
    expect(smokeScript).toContain("npmStatus.status === 'current'");
    expect(smokeScript).toContain("npmStatus.packageName === 'agentloopkit'");
    expect(smokeScript).toContain('npmStatus.localVersion === packageJson.version');
    expect(smokeScript).toContain("npmStatus.source?.command === 'captured npm view JSON'");
    expect(smokeScript).toContain("npmStatus.safety?.doesNot?.includes('read .env files')");
    expect(smokeScript).toContain(
      "npmStatusHuman.stdout.includes('npm latest matches local package version')",
    );
    expect(smokeScript).toContain(
      "npmStatusEnvError.error?.code === 'NPM_STATUS_REGISTRY_JSON_INVALID'",
    );
    expect(smokeScript).toContain("npmStatusEnvError.error?.reason === 'env-file'");
    expect(smokeScript).toContain("!npmStatusEnvRefusal.stdout.includes('do-not-print')");
    expect(smokeScript).toContain("!npmStatusEnvRefusal.stderr.includes('do-not-print')");
    expect(smokeScript).toContain('Npm-status captured registry smoke passed.');
  });

  test('CLI smoke script covers policy pack inventory', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'policy', 'packs', '--json'");
    expect(smokeScript).toContain('policyPacks.packs');
    expect(smokeScript).toContain("'agentloop-baseline'");
    expect(smokeScript).toContain("'maintainer-review'");
    expect(smokeScript).toContain('policy pack inventory missing ${packName}.');
    expect(smokeScript).toContain(
      'policy pack inventory reported an invalid count for ${packName}.',
    );
    expect(smokeScript).toContain('Policy pack inventory smoke passed.');
  });

  test('CLI smoke script covers policy command redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'policy', 'list', '--redact-paths'");
    expect(smokeScript).toContain("'policy', 'status', '--redact-paths'");
    expect(smokeScript).toContain("'policy', 'show', 'security', '--redact-paths'");
    expect(smokeScript).toContain("'policy', 'list', '--json', '--redact-paths'");
    expect(smokeScript).toContain("'policy', 'status', '--json', '--redact-paths'");
    expect(smokeScript).toContain('const redactedPolicyListHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const redactedPolicyStatusHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const redactedPolicyShowHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const redactedPolicyList = parseJson(');
    expect(smokeScript).toContain('const redactedPolicyStatus = parseJson(');
    expect(smokeScript).toContain(
      'JSON.stringify(redactedPolicyList) === JSON.stringify(nestedPolicies)',
    );
    expect(smokeScript).toContain(
      'JSON.stringify(redactedPolicyStatus) === JSON.stringify(policyStatus)',
    );
    expect(smokeScript).toContain('!redactedPolicyListHuman.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedPolicyStatus).includes(smokeRepo)');
    expect(smokeScript).toContain('Policy command redaction smoke passed.');
  });

  test('CLI smoke script covers policy pack redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'policy', 'packs', '--redact-paths'");
    expect(smokeScript).toContain("'policy', 'packs', '--json', '--redact-paths'");
    expect(smokeScript).toContain('const redactedPolicyPacksHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const redactedPolicyPacks = parseJson(');
    expect(smokeScript).toContain(
      'JSON.stringify(redactedPolicyPacks) === JSON.stringify(policyPacks)',
    );
    expect(smokeScript).toContain('!JSON.stringify(redactedPolicyPacks).includes(smokeRepo)');
    expect(smokeScript).toContain('Policy pack redaction smoke passed.');
  });

  test('CLI smoke script covers GitHub metadata import dry-run', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'github', 'import'");
    expect(smokeScript).toContain("'--issue-json'");
    expect(smokeScript).toContain("'github-issue.json'");
    expect(smokeScript).toContain("'--dry-run'");
    expect(smokeScript).toContain("'--json'");
    expect(smokeScript).toContain('githubImport.dryRun === true');
    expect(smokeScript).toContain('githubImport.writesFiles === false');
    expect(smokeScript).toContain('githubImport.issue?.number === 42');
    expect(smokeScript).toContain('githubImport.safety?.callsGithubApi === false');
    expect(smokeScript).toContain('githubImport.safety?.readsTokens === false');
    expect(smokeScript).toContain('githubImport.safety?.readsEnvFiles === false');
    expect(smokeScript).toContain("'.agentloop/github/context.json'");
    expect(smokeScript).toContain('GitHub metadata dry-run smoke passed.');
  });

  test('CLI smoke script covers GitHub metadata review surfaces', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'github-pr.json'");
    expect(smokeScript).toContain('githubWriteImport.writesFiles === true');
    expect(smokeScript).toContain(
      "githubWriteImport.outputPath === '.agentloop/github/context.json'",
    );
    expect(smokeScript).toContain('githubContext.pullRequest?.number === 77');
    expect(smokeScript).toContain('reviewContext.githubMetadata?.issue?.number === 42');
    expect(smokeScript).toContain('reviewContext.githubMetadata?.pullRequest?.number === 77');
    expect(smokeScript).toContain("preparedPr.body?.includes('## Imported GitHub Context')");
    expect(smokeScript).toContain("preparedPr.body?.includes('Smoke GitHub metadata PR')");
    expect(smokeScript).toContain("check.id === 'github-metadata'");
    expect(smokeScript).toContain('GitHub metadata review-surface smoke passed.');
  });

  test('CLI smoke script covers install-agent preservation', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('const preservedCodexGuide = await readFile(');
    expect(smokeScript).toContain('const rerunAgentInstall = parseJson(');
    expect(smokeScript).toContain("rerunAgentInstall.agent?.agentFileStatus === 'skipped'");
    expect(smokeScript).toContain('afterCodexGuide === preservedCodexGuide');
    expect(smokeScript).toContain("agentsMd.includes('.agentloop/agents/codex.md')");
    expect(smokeScript).toContain('Install-agent preservation smoke passed.');
  });

  test('CLI smoke script covers install-agent redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'install-agent', 'codex', '--json', '--redact-paths'");
    expect(smokeScript).toContain(
      "toPosixPath(redactedAgentInstall.agent?.agentFilePath ?? '') ===",
    );
    expect(smokeScript).toContain("'[git-root]/.agentloop/agents/codex.md'");
    expect(smokeScript).toContain('!JSON.stringify(redactedAgentInstall).includes(smokeRepo)');
    expect(smokeScript).toContain('Install-agent redaction smoke passed.');
  });

  test('CLI smoke script covers report and badge redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['report', '--out', redactedReportPath");
    expect(smokeScript).toContain("['badge', '--out', redactedBadgePath");
    expect(smokeScript).toContain('const expectedRedactedReportPath');
    expect(smokeScript).toContain('const expectedRedactedBadgePath');
    expect(smokeScript).toContain("'[git-root]/.agentloop/reports/redacted-smoke-report.html'");
    expect(smokeScript).toContain("'[git-root]/.agentloop/reports/redacted-smoke-badge.svg'");
    expect(smokeScript).toContain(
      "toPosixPath(redactedReport.outPath ?? '') === expectedRedactedReportPath",
    );
    expect(smokeScript).toContain(
      "toPosixPath(redactedBadge.outPath ?? '') === expectedRedactedBadgePath",
    );
    expect(smokeScript).toContain('!JSON.stringify(redactedReport).includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(redactedBadge).includes(smokeRepo)');
    expect(smokeScript).toContain('Report and badge redaction smoke passed.');
  });

  test('CLI smoke script covers CI summary redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('const redactedCiSummaryRelativePath');
    expect(smokeScript).toContain("['ci-summary', '--write', '--out', redactedCiSummaryPath");
    expect(smokeScript).toContain('const expectedRedactedCiSummaryPath');
    expect(smokeScript).toContain("'[git-root]/.agentloop/reports/redacted-smoke-ci-summary.md'");
    expect(smokeScript).toContain(
      "toPosixPath(redactedCiSummary.writtenPath ?? '') === expectedRedactedCiSummaryPath",
    );
    expect(smokeScript).toContain("redactedCiSummary.ci?.workflow === 'CI [git-root]'");
    expect(smokeScript).toContain('!JSON.stringify(redactedCiSummary).includes(smokeRepo)');
    expect(smokeScript).toContain('!redactedCiSummaryMarkdown.includes(smokeRepo)');
    expect(smokeScript).toContain('CI summary redaction smoke passed.');
  });

  test('CLI smoke script covers release-notes redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain('const releaseNotesRepo = await prepareReleaseNotesSmokeRepo');
    expect(smokeScript).toContain('const redactedReleaseNotesRelativePath');
    expect(smokeScript).toContain("'release-notes',");
    expect(smokeScript).toContain("'--write',");
    expect(smokeScript).toContain("'--out',");
    expect(smokeScript).toContain('redactedReleaseNotesPath,');
    expect(smokeScript).toContain("'--json',");
    expect(smokeScript).toContain("'--redact-paths',");
    expect(smokeScript).toContain('const expectedRedactedReleaseNotesPath');
    expect(smokeScript).toContain(
      "'[git-root]/.agentloop/handoffs/redacted-smoke-release-notes.md'",
    );
    expect(smokeScript).toContain(
      "toPosixPath(redactedReleaseNotes.writtenPath ?? '') === expectedRedactedReleaseNotesPath",
    );
    expect(smokeScript).toContain("redactedReleaseNotes.packageName === 'smoke-[git-root]'");
    expect(smokeScript).toContain(
      "redactedReleaseNotes.markdown?.includes('- Package: `smoke-[git-root]`')",
    );
    expect(smokeScript).toContain(
      '!JSON.stringify(redactedReleaseNotes).includes(releaseNotesRepo)',
    );
    expect(smokeScript).toContain('!redactedReleaseNotesMarkdown.includes(releaseNotesRepo)');
    expect(smokeScript).toContain('Release-notes redaction smoke passed.');
  });

  test('CLI smoke script covers doctor redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'doctor', '--redact-paths'");
    expect(smokeScript).toContain("'doctor', '--json', '--redact-paths'");
    expect(smokeScript).toContain('const doctorRedactedHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const doctorRedactedJson = parseJson(');
    expect(smokeScript).toContain("doctorRedactedJson.git?.root === '[git-root]'");
    expect(smokeScript).toContain('!JSON.stringify(doctorRedactedJson).includes(smokeRepo)');
    expect(smokeScript).toContain('Doctor redaction smoke passed.');
  });

  test('CLI smoke script covers task-list JSON groups', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task', 'list', '--json'");
    expect(smokeScript).toContain('const taskList = parseJson(');
    expect(smokeScript).toContain('taskList.taskContracts');
    expect(smokeScript).toContain('taskList.agentFlightPlaceholders');
    expect(smokeScript).toContain("'Smoke CLI flow'");
    expect(smokeScript).toContain("'Smoke AgentFlight placeholder'");
    expect(smokeScript).toContain("source === 'agentflight-placeholder'");
    expect(smokeScript).toContain('taskList.tasks.length ===');
    expect(smokeScript).toContain('Task-list JSON groups smoke passed.');
  });

  test('CLI smoke script covers task-list status filter', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task', 'list', '--status', 'deferred'");
    expect(smokeScript).toContain("'task', 'list', '--json', '--status', 'deferred'");
    expect(smokeScript).toContain('const deferredTaskList = parseJson(');
    expect(smokeScript).toContain('deferredTaskList.tasks.every(');
    expect(smokeScript).toContain('deferredTaskList.taskContracts.every(');
    expect(smokeScript).toContain('deferredTaskList.agentFlightPlaceholders.every(');
    expect(smokeScript).toContain('currentAfterTaskListStatus.activeTask?.path === taskPath');
    expect(smokeScript).toContain("'task', 'list', '--status', 'waiting', '--json'");
    expect(smokeScript).toContain("taskListStatusError.error?.code === 'UNSUPPORTED_TASK_STATUS'");
    expect(smokeScript).toContain('Task-list status filter smoke passed.');
  });

  test('CLI smoke script covers compact task-list JSON', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task', 'list', '--json', '--brief'");
    expect(smokeScript).toContain("'task', 'list', '--json', '--brief', '--status', 'deferred'");
    expect(smokeScript).toContain('const compactTaskList = parseJson(');
    expect(smokeScript).toContain('compactTaskList.tasks === undefined');
    expect(smokeScript).toContain('compactTaskList.totalCount === taskList.tasks.length');
    expect(smokeScript).toContain('compactTaskList.agentFlightPlaceholders?.preview?.length <= 3');
    expect(smokeScript).toContain('const compactDeferredTaskList = parseJson(');
    expect(smokeScript).toContain("compactDeferredTaskList.statusFilter === 'deferred'");
    expect(smokeScript).toContain(
      'compactDeferredTaskList.totalCount === deferredTaskList.tasks.length',
    );
  });

  test('CLI smoke script covers task-doctor redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task', 'doctor', '--redact-paths'");
    expect(smokeScript).toContain("'task', 'doctor', '--json', '--redact-paths'");
    expect(smokeScript).toContain('const taskDoctorRedactedHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const taskDoctorRedactedJson = parseJson(');
    expect(smokeScript).toContain("taskDoctorRedactedJson.taskDoctor?.overallStatus === 'pass'");
    expect(smokeScript).toContain('!JSON.stringify(taskDoctorRedactedJson).includes(smokeRepo)');
    expect(smokeScript).toContain('Task-doctor redaction smoke passed.');
  });

  test('CLI smoke script covers task show redaction', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task', 'show', taskPath, '--redact-paths'");
    expect(smokeScript).toContain("'task', 'show', taskPath, '--json', '--redact-paths'");
    expect(smokeScript).toContain('const taskShowRedactedHuman = await runAgentLoop(');
    expect(smokeScript).toContain('const taskShowRedactedJson = parseJson(');
    expect(smokeScript).toContain("taskShowRedactedJson.task?.content?.includes('[git-root]')");
    expect(smokeScript).toContain('!taskShowRedactedHuman.stdout.includes(smokeRepo)');
    expect(smokeScript).toContain('!JSON.stringify(taskShowRedactedJson).includes(smokeRepo)');
    expect(smokeScript).toContain('Task-show redaction smoke passed.');
  });

  test('CLI smoke script covers archived task doctor pass', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task', 'archive', taskPath, '--json'");
    expect(smokeScript).toContain('const archivedTaskDoctor = parseJson(');
    expect(smokeScript).toContain("archivedTaskDoctor.taskDoctor?.overallStatus === 'pass'");
    expect(smokeScript).toContain("diagnostic.id === 'recent-evidence-without-active-task'");
    expect(smokeScript).toContain('Task-doctor archived task evidence smoke passed.');
  });

  test('CLI smoke script covers artifacts archived task fallback', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['artifacts', '--type', 'task', '--latest']");
    expect(smokeScript).toContain('const archivedTaskArtifacts = parseJson(');
    expect(smokeScript).toContain('archivedTaskArtifacts.tasks?.latest?.archived === true');
    expect(smokeScript).toContain(
      "archivedTaskArtifacts.tasks?.latest?.path === '.agentloop/tasks/archive/smoke-cli-flow.md'",
    );
    expect(smokeScript).toContain(
      "'- Latest archived task evidence: `Smoke CLI flow` (`done`, `archived`) - `.agentloop/tasks/archive/smoke-cli-flow.md`'",
    );
    expect(smokeScript).toContain('Artifacts archived task fallback smoke passed.');
  });

  test('CLI smoke script covers stale task state recovery', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("activeTaskPath: '.agentloop/tasks/missing-smoke-task.md'");
    expect(smokeScript).toContain("'2026-06-16-20-30-verification-report.md'");
    expect(smokeScript).toContain("['status', '--json']");
    expect(smokeScript).toContain("['next', '--json']");
    expect(smokeScript).toContain("['task', 'doctor', '--json', '--redact-paths']");
    expect(smokeScript).toContain("staleStatus.nextAction?.command === 'agentloop task doctor'");
    expect(smokeScript).toContain("staleNext.nextAction?.command === 'agentloop task doctor'");
    expect(smokeScript).toContain('staleTaskDoctor.taskDoctor?.diagnostics?.some((diagnostic) =>');
    expect(smokeScript).toContain("'agentloop task clear'");
    expect(smokeScript).toContain("'agentloop task set <path>'");
    expect(smokeScript).toContain("'agentloop create-task'");
    expect(smokeScript).toContain('!JSON.stringify(staleTaskDoctor).includes(smokeRepo)');
    expect(smokeScript).toContain('Stale task state recovery smoke passed.');
  });

  test('CLI smoke script covers compact status JSON', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("['status', '--json', '--brief', '--redact-paths']");
    expect(smokeScript).toContain('compactStatus.workingTree?.changedFiles === undefined');
    expect(smokeScript).toContain('compactStatus.markdown === undefined');
    expect(smokeScript).toContain('compactStatus.agentFlightPlaceholderTasks?.count');
    expect(smokeScript).toContain('Compact status JSON smoke passed.');
  });

  test('CLI smoke script covers task-command post-verification gates', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'task-command-output.mjs'");
    expect(smokeScript).toContain("'post-gate-output.mjs'");
    expect(smokeScript).toContain("'--task-commands'");
    expect(smokeScript).toContain("'--only-task-commands'");
    expect(smokeScript).toContain("'--post-verification-gates'");
    expect(smokeScript).toContain('taskCommandVerification.taskCommands?.requested === true');
    expect(smokeScript).toContain('taskCommandVerification.taskCommands?.foundCount === 1');
    expect(smokeScript).toContain(
      'taskCommandVerification.postVerificationGates?.requested === true',
    );
    expect(smokeScript).toContain(
      'taskCommandVerification.postVerificationGates?.foundCount === 1',
    );
    expect(smokeScript).toContain(
      'taskCommandVerification.postVerificationGates?.results?.[0]?.passed === true',
    );
    expect(smokeScript).toContain('taskCommandVerification.run?.id');
    expect(smokeScript).toContain('Task-command post-verification smoke passed.');
  });

  test('CLI smoke script covers SchemaStore output', async () => {
    const smokeScript = await readFile('scripts/smoke-cli.mjs', 'utf8');

    expect(smokeScript).toContain("'schemastore', '--json'");
    expect(smokeScript).toContain("schemastore.entry?.name === 'AgentLoopKit Configuration'");
    expect(smokeScript).toContain(
      "schemastore.entry?.fileMatch?.includes('agentloop.config.json')",
    );
    expect(smokeScript).toContain('const schemaStoreSchemaUrl =');
    expect(smokeScript).toContain(
      "'https://raw.githubusercontent.com/abhiyoheswaran1/AgentLoopKit/main/schema/agentloop.config.schema.json'",
    );
    expect(smokeScript).toContain('schemastore.entry?.url === schemaStoreSchemaUrl');
    expect(smokeScript).toContain('schemastore.safety?.writesFiles === false');
    expect(smokeScript).toContain('schemastore.safety?.callsNetwork === false');
    expect(smokeScript).toContain('SchemaStore smoke passed.');
  });
});
