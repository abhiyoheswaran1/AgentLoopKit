# Security

AgentLoopKit should be boring and transparent.

## Supported Versions

Security fixes target the latest published version.

## Report A Vulnerability

Open a private security advisory on GitHub if available, or contact the maintainer through the repository.

Please include:

- affected version
- reproduction steps
- impact
- suggested fix if known

## Package Safety

AgentLoopKit must not:

- include postinstall scripts
- collect telemetry
- upload files
- require API keys
- read `.env` contents
- hide network calls
- access credentials
