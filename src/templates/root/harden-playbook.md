# Contract Hardening Playbook

Before implementation starts, harden the task contract until it has no blocking soft spots.

## The loop

1. Run `agentloop harden` to list open soft spots.
2. For each blocking soft spot, interrogate the human — one question at a time. Do not accept vague answers; a resolution must be concrete enough to write into the contract and to check a diff against.
3. Record each answer: `agentloop harden --resolve <id> --answer "<concrete answer>"`.
4. Repeat until `agentloop harden` reports zero blocking soft spots.

## Stance

This is interrogation, not agreement. Push back. Advisory soft spots may remain unresolved, but record a reason.

## Why it pays off

Resolved scope (Files or Areas Not to Touch) is enforced later: `agentloop guard` flags a diff that touches forbidden scope. Hardening the contract now turns front-of-loop alignment into evidence the loop checks against.
