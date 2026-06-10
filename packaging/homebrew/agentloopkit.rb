class Agentloopkit < Formula
  desc "Drop-in engineering loop for coding agents"
  homepage "https://github.com/abhiyoheswaran1/AgentLoopKit"
  url "https://github.com/abhiyoheswaran1/AgentLoopKit/releases/download/v0.26.1/agentloopkit-0.26.1.tgz"
  sha256 "cf836155a2cdfaf8eff818202aa651fc32b3b39a49256f25d0925ffbadad5cc6"
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
