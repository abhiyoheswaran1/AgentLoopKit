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

Type "npx agentloop create-task --title login-redirect --type bugfix --acceptance redirect-returns-to-requested-page --verification true"
Enter
Sleep 2.2s

Hide
Type@1ms "mkdir -p src && echo fixed > src/login.js && git add package.json package-lock.json 2>/dev/null || true"
Enter
Wait
Show

Type "npx agentloop status --brief"
Enter
Sleep 1.4s

Type "npx agentloop verify --task-commands"
Enter
Sleep 3.6s

Type "npx agentloop ship --github-comment"
Enter
Sleep 2.6s

Type "npx agentloop prepare-pr --github-comment"
Enter
Sleep 2.4s

Type "npx agentloop review-context"
Enter
Sleep 2s

Type "npx agentloop runs"
Enter
Sleep 1.6s

Type "npx agentloop intent src/login.js"
Enter
Sleep 1.5s
