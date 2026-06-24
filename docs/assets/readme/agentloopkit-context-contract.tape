Output docs/assets/readme/agentloopkit-context-contract.gif

Require npx
Require git
Require npm

Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 16
Set Width 1200
Set Height 720
Set Padding 26
Set Margin 16
Set MarginFill "#11111b"
Set BorderRadius 16
Set WindowBar Colorful
Set TypingSpeed 22ms
Set PlaybackSpeed 1.08
Set LoopOffset 0%
Set Theme "Catppuccin Mocha"

Hide
Type@1ms "npm pack --pack-destination /tmp --silent >/tmp/agentloopkit-context-pack.txt && rm -rf /tmp/agentloopkit-context-demo && mkdir /tmp/agentloopkit-context-demo && cd /tmp/agentloopkit-context-demo && git init -q && git config user.email demo@example.invalid && git config user.name 'AgentLoopKit Demo' && npm init -y >/dev/null && npm pkg set scripts.test='echo test suite passed' scripts.typecheck='echo typecheck passed' scripts.build='echo build passed' >/dev/null && npm install -D --ignore-scripts --no-audit --no-fund /tmp/$(tail -n 1 /tmp/agentloopkit-context-pack.txt) >/dev/null && echo node_modules/ > .gitignore && echo node_modules/ >> .git/info/exclude && git add package.json package-lock.json .gitignore && git commit -m baseline >/dev/null && clear"
Enter
Wait
Show

Type "npx agentloopkit init"
Enter
Wait
Sleep 1.2s

Hide
Type@1ms "git add AGENTS.md AGENTLOOP.md agentloop.config.json .agentloop && git commit -m 'add agentloop harness' >/dev/null && clear"
Enter
Wait
Show

Type "npx agentloop create-task --type bugfix --title 'Fix checkout retry' --problem 'Retry loses checkout state' --outcome 'Retry keeps checkout state' --likely-file src/checkout --acceptance 'Retry keeps checkout state' --rollback 'Revert checkout retry files' --include-config-commands"
Enter
Wait
Sleep 1.2s

Hide
Type@1ms "task_path=$(ls .agentloop/tasks/*.md | head -n 1) && npx agentloop task status $task_path in-progress >/dev/null && clear"
Enter
Wait
Show

Hide
Type@1ms "mkdir -p src/checkout && for i in $(seq 1 24); do echo 'export const retry = true;' > src/checkout/retry-$i.ts; done && clear"
Enter
Wait
Show

Type "npx agentloop start --for codex --goal implement --redact-paths"
Enter
Wait
Sleep 2.4s

Type "npx agentloop context show task:active --redact-paths"
Enter
Wait
Sleep 1.8s

Type "npx agentloop verify --task-commands --progress --redact-paths"
Enter
Sleep 28s
