import { Command } from 'commander';
import {
  artifactInventoryTypes,
  defaultStaleArtifactMarkdownLimit,
  getArtifactInventory,
  getStaleArtifactPreview,
  isArtifactInventoryType,
  renderArtifactInventoryJson,
  renderArtifactInventoryMarkdown,
  renderStaleArtifactPreviewJson,
  renderStaleArtifactPreviewMarkdown,
} from '../../core/artifacts.js';
import {
  CliOptionError,
  loadWorkspaceForJsonCommand,
  printAgentLoopJsonError,
} from '../json-errors.js';

type ArtifactsCommandOptions = {
  json?: boolean;
  type?: string;
  latest?: boolean;
  stale?: boolean;
  limit?: string;
};

function validateArtifactType(options: ArtifactsCommandOptions) {
  if (!options.type || isArtifactInventoryType(options.type)) return true;

  const error = new CliOptionError(
    `Unsupported artifact type: ${options.type}`,
    'UNSUPPORTED_ARTIFACT_TYPE',
    {
      artifactType: options.type,
      supportedTypes: [...artifactInventoryTypes],
    },
  );

  if (options.json) {
    printAgentLoopJsonError(error);
    return false;
  }

  throw error;
}

function failArtifactOption(error: CliOptionError, json?: boolean): false {
  if (json) {
    printAgentLoopJsonError(error);
    return false;
  }

  throw error;
}

function parseArtifactLimit(options: ArtifactsCommandOptions): number | false | undefined {
  if (!options.limit) return undefined;

  if (!options.stale) {
    return failArtifactOption(
      new CliOptionError('Use --limit with --stale.', 'LIMIT_REQUIRES_STALE_PREVIEW', {
        options: ['limit', 'stale'],
      }),
      options.json,
    );
  }

  if (!/^[1-9]\d*$/.test(options.limit)) {
    return failArtifactOption(
      new CliOptionError('Artifact limit must be a positive integer.', 'INVALID_ARTIFACT_LIMIT', {
        value: options.limit,
      }),
      options.json,
    );
  }

  return Number(options.limit);
}

function validateArtifactOptions(options: ArtifactsCommandOptions): number | false | undefined {
  if (options.stale && options.latest) {
    return failArtifactOption(
      new CliOptionError('Cannot combine --stale and --latest.', 'CONFLICTING_ARTIFACT_OPTIONS', {
        options: ['stale', 'latest'],
      }),
      options.json,
    );
  }

  return parseArtifactLimit(options);
}

export function artifactsCommand() {
  return new Command('artifacts')
    .description('Show local AgentLoop evidence artifacts without writing files')
    .option('--type <type>', `filter by artifact type (${artifactInventoryTypes.join(', ')})`)
    .option('--latest', 'print only the latest matching artifact(s)')
    .option('--stale', 'preview stale evidence candidates without deleting files')
    .option('--limit <count>', 'limit stale preview candidate output')
    .option('--json', 'print machine-readable output')
    .action(async (options: ArtifactsCommandOptions) => {
      if (!validateArtifactType(options)) return;
      const limit = validateArtifactOptions(options);
      if (limit === false) return;

      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const renderOptions = {
        type: options.type && isArtifactInventoryType(options.type) ? options.type : undefined,
        latest: options.latest,
      };

      if (options.stale) {
        const staleLimit = limit ?? (options.json ? undefined : defaultStaleArtifactMarkdownLimit);
        const preview = await getStaleArtifactPreview({
          cwd: workspace.cwd,
          config: workspace.config,
          type: renderOptions.type,
          limit: staleLimit,
        });
        if (options.json) {
          console.log(JSON.stringify(renderStaleArtifactPreviewJson(preview), null, 2));
        } else {
          console.log(renderStaleArtifactPreviewMarkdown(preview));
        }
        return;
      }

      const inventory = await getArtifactInventory({
        cwd: workspace.cwd,
        config: workspace.config,
      });

      if (options.json) {
        console.log(JSON.stringify(renderArtifactInventoryJson(inventory, renderOptions), null, 2));
      } else {
        console.log(renderArtifactInventoryMarkdown(inventory, renderOptions));
      }
    });
}
