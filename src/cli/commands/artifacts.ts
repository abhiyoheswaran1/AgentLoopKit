import { Command } from 'commander';
import {
  artifactInventoryTypes,
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

function validateArtifactOptions(options: ArtifactsCommandOptions) {
  if (!options.stale || !options.latest) return true;

  const error = new CliOptionError('Cannot combine --stale and --latest.', 'CONFLICTING_ARTIFACT_OPTIONS', {
    options: ['stale', 'latest'],
  });

  if (options.json) {
    printAgentLoopJsonError(error);
    return false;
  }

  throw error;
}

export function artifactsCommand() {
  return new Command('artifacts')
    .description('Show local AgentLoop evidence artifacts without writing files')
    .option('--type <type>', `filter by artifact type (${artifactInventoryTypes.join(', ')})`)
    .option('--latest', 'print only the latest matching artifact(s)')
    .option('--stale', 'preview stale evidence candidates without deleting files')
    .option('--json', 'print machine-readable output')
    .action(async (options: ArtifactsCommandOptions) => {
      if (!validateArtifactType(options)) return;
      if (!validateArtifactOptions(options)) return;

      const workspace = await loadWorkspaceForJsonCommand(process.cwd(), options.json);
      if (!workspace) return;
      const renderOptions = {
        type: options.type && isArtifactInventoryType(options.type) ? options.type : undefined,
        latest: options.latest,
      };

      if (options.stale) {
        const preview = await getStaleArtifactPreview({
          cwd: workspace.cwd,
          config: workspace.config,
          type: renderOptions.type,
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
