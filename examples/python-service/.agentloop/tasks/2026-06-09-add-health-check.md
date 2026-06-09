# Add health check

- Created date: 2026-06-09
- Task type: feature
- Status: proposed

## Problem Statement

The service has no lightweight health endpoint.

## Desired Outcome

Expose `/healthz` with a simple OK response.

## Constraints

- Do not require database access.

## Acceptance Criteria

- Endpoint returns 200.
- Test covers response body.

## Verification Commands

- pytest

## Rollback Notes

Remove endpoint and test.
