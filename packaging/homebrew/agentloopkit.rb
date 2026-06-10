class Agentloopkit < Formula
  desc "Drop-in engineering loop for coding agents"
  homepage "https://github.com/abhiyoheswaran1/AgentLoopKit"
  url "https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.26.0/agentloopkit-0.26.0.tgz"
  sha256 "a289ea89ee037ab4099e79102efbf21d3563b7e65961f1b1bd54a4a735cfba65"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_install_args(libexec)
    bin.install_symlink libexec/"bin/agentloop"
    bin.install_symlink libexec/"bin/agentloopkit"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/agentloop version")
  end
end
