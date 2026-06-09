# Product Backlog

Internal backlog generated from simulated product-panel cycles and dogfooding. Do not present this as real user feedback.

## Prioritisation Method

Score candidate improvements from 1 to 5:

- GitHub star potential
- Immediate usefulness
- Ease of explanation
- Agent compatibility
- Implementation simplicity
- Maintenance burden, reverse scored
- Safety/trust improvement
- Future monetisation optionality

Prefer high-value, low-complexity improvements. Safety and trust override the score.

## Candidate Scoring

| Item                            | Stars | Usefulness | Explain | Compatibility | Simplicity | Maintenance | Trust | Optionality | Total |
| ------------------------------- | ----: | ---------: | ------: | ------------: | ---------: | ----------: | ----: | ----------: | ----: |
| Generate `.agentloop/README.md` |     4 |          5 |       5 |             4 |          5 |           5 |     3 |           2 |    34 |
| README launch visuals           |     5 |          4 |       5 |             3 |          4 |           4 |     4 |           2 |    31 |
| `install-agent all`             |     4 |          4 |       5 |             5 |          5 |           5 |     3 |           2 |    34 |
| GitHub Actions publish workflow |     3 |          4 |       4 |             2 |          5 |           4 |     5 |           3 |    31 |
| Publish workflow retry path     |     3 |          4 |       5 |             2 |          5 |           5 |     5 |           3 |    32 |
| CI Node 24 runtime opt-in       |     2 |          4 |       5 |             2 |          5 |           5 |     4 |           2 |    29 |
| GitHub Actions v6 upgrade       |     2 |          4 |       5 |             2 |          4 |           4 |     4 |           2 |    27 |
| Good first contributor path     |     3 |          4 |       5 |             3 |          5 |           5 |     4 |           2 |    31 |
| npm publish recovery docs       |     2 |          5 |       5 |             2 |          5 |           5 |     5 |           3 |    32 |
| Prepare 0.2.1 release candidate |     3 |          5 |       5 |             3 |          5 |           5 |     5 |           3 |    34 |
| `agentloop status`              |     4 |          4 |       5 |             4 |          3 |           3 |     4 |           3 |    31 |
| Failed status next action       |     3 |          4 |       5 |             4 |          5 |           5 |     5 |           2 |    34 |
| Better failed-command excerpts  |     3 |          4 |       4 |             4 |          5 |           5 |     4 |           2 |    31 |
| Contributor template polish     |     3 |          4 |       5 |             4 |          5 |           5 |     4 |           2 |    32 |
| Static HTML report              |     3 |          3 |       3 |             3 |          2 |           2 |     3 |           4 |    23 |
| Cloud dashboard                 |     3 |          2 |       3 |             2 |          1 |           1 |     2 |           5 |    19 |

## Backlog Items

| Item                                | Source persona         | Problem                                                                          | Proposed solution                                                                             | Priority | Effort | Adoption impact | Risk   | Decision | Notes                                                     |
| ----------------------------------- | ---------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------- | ------ | --------------- | ------ | -------- | --------------------------------------------------------- |
| Generate `.agentloop/README.md`     | Nora, Lina             | New users see many generated directories without a local index.                  | Add a concise `.agentloop/README.md` with next commands and directory map.                    | P0       | S      | high            | low    | do now   | Cycle 1 implementation.                                   |
| README launch visuals               | Nora, Elias, Tom       | GitHub readers cannot see the workflow before installing.                        | Add Playwright screenshots and a VHS CLI GIF to the README with reproducible sources.         | P1       | S      | high            | low    | do now   | Cycle 4 implementation.                                   |
| Improve init next steps             | Indie Hacker, Nora     | First run needs a next command, not just success counts.                         | Include `create-task`, `verify`, and `summarize` guidance in generated README and CLI output. | P1       | S      | high            | low    | do now   | Partially implemented through generated README.           |
| Add `install-agent all`             | Lina, Cursor Developer | Multi-agent users must run several install commands.                             | Install all bundled agent instruction files with one command.                                 | P1       | S      | medium          | low    | do now   | Cycle 2 implementation.                                   |
| Add GitHub Actions publish workflow | Elias, Samir           | npm publish path needs provenance and repeatable checks.                         | Add release-triggered workflow using npm trusted publishing.                                  | P1       | S      | medium          | medium | do now   | Requires npm trusted publishing configuration before use. |
| Publish workflow retry path         | Elias, Samir           | The `v0.2.0` release workflow failed at npm publish after checks passed.         | Add manual workflow dispatch, explicit public publish access, and clearer publishing docs.     | P1       | S      | medium          | low    | do now   | Cycle 9 implementation. Requires npm-side trusted publisher setup. |
| CI Node 24 runtime opt-in           | Elias, Maya            | CI passes but GitHub warns that JavaScript actions run on deprecated Node 20.     | Set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` in CI.                                               | P1       | S      | low             | low    | do now   | Cycle 10 implementation.                                  |
| GitHub Actions v6 upgrade           | Elias, Maya            | CI still reports that pinned actions target Node 20 even with runtime opt-in.     | Upgrade checkout, setup-node, and pnpm setup actions to current v6 major lines.                | P1       | S      | low             | medium | do now   | Cycle 11 implementation.                                  |
| Add `agentloop status`              | Lina, Tom              | Users need a quick local summary of active task, latest report, and dirty files. | Add deterministic `status` command.                                                           | P1       | M      | high            | low    | do now   | Cycle 5 implementation.                                   |
| Failed status next action           | Lina, Tom, Samir       | `status` can suggest handoff even when the latest verification report failed.    | Make failed reports point back to `agentloop verify`.                                         | P1       | S      | medium          | low    | do now   | Cycle 7 implementation.                                   |
| Better failed-command excerpts      | Tom, Maya              | Verification reports can be verbose and first-only truncation can hide root errors. | Add clearer first/last output excerpts.                                                     | P1       | S      | medium          | low    | do now   | Cycle 6 implementation. Keep command output honest.       |
| Contributor template polish         | Dev, Elias, Tom        | Contributors need to know what AgentLoopKit evidence maintainers expect.         | Ask for task, status, verification, and handoff evidence in issue and PR templates.            | P1       | S      | medium          | low    | do now   | Cycle 8 implementation.                                   |
| npm publish recovery docs           | Elias, Samir, Maya     | GitHub `v0.2.0` is public but npm latest remains `0.1.1`.                         | Document exact trusted publisher settings, retry order, and verification commands.             | P1       | S      | medium          | low    | do now   | Cycle 13 implementation.                                  |
| Prepare 0.2.1 release candidate     | Maya, Elias, Samir     | Package behavior changed after the `v0.2.0` tag while npm publish remains blocked. | Bump to `0.2.1`, update release docs, and verify the tarball without publishing.               | P1       | S      | medium          | low    | do now   | Cycle 14 implementation.                                  |
| Good first contributor path         | Dev, Elias, Tom        | New contributors need safe entry points and maintainers need label guidance.      | Add a good-first issue template, label map, and first-contribution docs.                       | P2       | S      | medium          | low    | do now   | Cycle 12 implementation.                                  |
| Static HTML report                  | Rachel, Priya          | Managers may want a shareable local artifact.                                    | Generate local static HTML only, no cloud.                                                    | P3       | L      | medium          | medium | later    | Not needed for MVP.                                       |
| Cloud dashboard                     | Priya                  | Future commercial visibility.                                                    | Hosted dashboard for teams.                                                                   | P3       | L      | medium          | high   | reject   | Conflicts with MVP scope.                                 |
