Output docs/assets/readme/agentloopkit-cli.gif

Require npx
Require git
Require npm

Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 20
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

Type@1ms "rm -rf /tmp/agentloopkit-vhs-demo && mkdir /tmp/agentloopkit-vhs-demo && cd /tmp/agentloopkit-vhs-demo && git init -q && npm init -y >/dev/null && clear"
Enter
Sleep 250ms

Type "npx --yes agentloopkit init"
Enter
Sleep 2s

Type "npx --yes agentloopkit doctor"
Enter
Sleep 2s

Type "npx --yes agentloopkit create-task --title add-settings-page --type feature --out .agentloop/tasks/add-settings-page.md"
Enter
Sleep 1.5s

Type "npx --yes agentloopkit summarize"
Enter
Sleep 4s
