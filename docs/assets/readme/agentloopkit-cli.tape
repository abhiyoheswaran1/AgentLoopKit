Output docs/assets/readme/agentloopkit-cli.gif

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
Set TypingSpeed 24ms
Set PlaybackSpeed 1.05
Set LoopOffset 0%
Set Theme "Catppuccin Mocha"

Hide
Type@1ms "npm pack --pack-destination /tmp --silent >/tmp/agentloopkit-vhs-pack.txt && rm -rf /tmp/agentloopkit-vhs-demo && mkdir /tmp/agentloopkit-vhs-demo && cd /tmp/agentloopkit-vhs-demo && git init -q && npm init -y >/dev/null && npm pkg set scripts.test='echo test suite passed' scripts.typecheck='echo typecheck passed' scripts.build='echo build passed' >/dev/null && npm install -D /tmp/$(tail -n 1 /tmp/agentloopkit-vhs-pack.txt) >/dev/null && clear"
Enter
Wait
Show

Type "npx agentloopkit init"
Enter
Sleep 1.6s

Type "npx agentloop doctor"
Enter
Sleep 2.2s

Type "npx agentloop create-task --title settings --type feature --out .agentloop/tasks/settings.md"
Enter
Sleep 2.2s

Type "npx agentloop task set .agentloop/tasks/settings.md"
Enter
Sleep 1.6s

Type "npx agentloop task status .agentloop/tasks/settings.md in-progress"
Enter
Sleep 1.6s

Type "npx agentloop status"
Enter
Sleep 1.8s

Type "npx agentloop verify --task .agentloop/tasks/settings.md --no-lint"
Enter
Sleep 4s

Type "npx agentloop next"
Enter
Sleep 1.2s

Type "npx agentloop handoff"
Enter
Sleep 1.5s

Type "npx agentloop check-gates --strict"
Enter
Sleep 1.5s

Type "npx agentloop report"
Enter
Sleep 1.2s

Type "npx agentloop badge"
Enter
Sleep 2s
