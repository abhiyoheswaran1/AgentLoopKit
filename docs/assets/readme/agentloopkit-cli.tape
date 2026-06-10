Output docs/assets/readme/agentloopkit-cli.gif

Require npx
Require git
Require npm

Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 18
Set Width 1280
Set Height 760
Set Padding 28
Set Margin 18
Set MarginFill "#eef1ec"
Set BorderRadius 14
Set WindowBar Colorful
Set TypingSpeed 28ms
Set PlaybackSpeed 1.08
Set LoopOffset 13%
Set Theme "Catppuccin Latte"

Type@1ms "npm pack --pack-destination /tmp --silent >/tmp/agentloopkit-vhs-pack.txt && rm -rf /tmp/agentloopkit-vhs-demo && mkdir /tmp/agentloopkit-vhs-demo && cd /tmp/agentloopkit-vhs-demo && git init -q && npm init -y >/dev/null && npm pkg set scripts.test='echo demo tests pass' scripts.typecheck='echo types pass' scripts.build='echo build pass' >/dev/null && npm install -D /tmp/$(tail -n 1 /tmp/agentloopkit-vhs-pack.txt) >/dev/null && clear"
Enter
Sleep 250ms

Type "npx agentloop init"
Enter
Sleep 2s

Type "npx agentloop create-task --title settings --type feature --out .agentloop/tasks/settings.md --json"
Enter
Sleep 2s

Type "npx agentloop task list"
Enter
Sleep 1s

Type "npx agentloop task show .agentloop/tasks/settings.md"
Enter
Sleep 1.5s

Type "npx agentloop task set .agentloop/tasks/settings.md"
Enter
Sleep 1s

Type "npx agentloop task status .agentloop/tasks/settings.md in-progress"
Enter
Sleep 1s

Type "npx agentloop status"
Enter
Sleep 1.5s

Type "npx agentloop next"
Enter
Sleep 1s

Type "npx agentloop policy list"
Enter
Sleep 1s

Type "npx agentloop policy show security"
Enter
Sleep 1.5s

Type "npx agentloop policy status"
Enter
Sleep 1s

Type "npx agentloop completion zsh"
Enter
Sleep 1.5s

Type "npx agentloop verify --task .agentloop/tasks/settings.md --no-lint"
Enter
Sleep 2s

Type "npx agentloop handoff"
Enter
Sleep 2s

Type "npx agentloop report"
Enter
Sleep 1.5s

Type "npx agentloop badge"
Enter
Sleep 1s

Type "npx agentloop ci-summary"
Enter
Sleep 1.5s

Type "npx agentloop release-notes"
Enter
Sleep 1.5s

Type "npx agentloop task status .agentloop/tasks/settings.md done"
Enter
Sleep 1s

Type "npx agentloop check-gates --strict"
Enter
Sleep 1.5s

Type "npx agentloop task archive .agentloop/tasks/settings.md"
Enter
Sleep 3s
