#!/usr/bin/env node
/* global console, process */
import { runPublicDocsHygiene } from './smoke-packed-release.mjs';

runPublicDocsHygiene()
  .then((result) => {
    console.log('# AgentLoopKit Public Docs Hygiene');
    console.log(`Version: ${result.version}`);
    console.log(`Public docs checked: ${result.publicDocCount}`);
    console.log(`Repo harness files checked: ${result.repoHarnessCount}`);
    console.log('Public docs hygiene passed.');
  })
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Public docs hygiene failed: ${message}`);
    process.exitCode = 1;
  });
