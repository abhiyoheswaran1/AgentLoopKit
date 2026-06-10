# README Assets

These files generate the screenshots and terminal animation used in the root README.

Regenerate the terminal GIF:

```bash
npx pnpm@10.12.1 build
vhs docs/assets/readme/agentloopkit-cli.tape
```

Run VHS from the repository root. The tape packs the local build to `/tmp`, installs it into a clean temp repository, hides the setup work with `Hide`/`Wait`/`Show`, then records the visible AgentLoopKit loop.

The current GIF uses a 1200x720 Catppuccin Mocha terminal and shows `init`, `doctor`, task creation, task status, verification, handoff, gate checks, HTML report generation, and badge generation.

Regenerate the Playwright screenshots:

```bash
npx playwright screenshot --viewport-size=1440,960 "file://$(pwd | sed 's/ /%20/g')/docs/assets/readme/showcase.html" docs/assets/readme/agentloopkit-showcase.png
npx playwright screenshot --viewport-size=1440,960 "file://$(pwd | sed 's/ /%20/g')/docs/assets/readme/verification.html" docs/assets/readme/agentloopkit-verification.png
```

Do not edit the generated PNG or GIF files by hand.
