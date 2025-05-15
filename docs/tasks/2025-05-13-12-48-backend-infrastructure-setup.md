# Task: Backend Infrastructure Setup

Use the `osls` fork of the serverless framework https://github.com/oss-serverless/serverless

## Commit 1: feat: Initialize Serverless Framework config for backend
**Description:**
- Create `/backend/serverless.yml` with service name, provider (AWS, Node.js 22), and region.
- Define initial Lambda function resource (placeholder handler).
- Add DynamoDB table resource for idempotency (with TTL, PAY_PER_REQUEST, and `id` as primary key).
- Add environment variables for table name and log level.
- Reference logging best practices from project docs (ensure log level is toggleable via env var).

**Verification:**
1. **Unit / Integration Test:**
   - Run `pnpm exec serverless info` to verify stack config and resource presence.
   - Expected: Output lists Lambda and DynamoDB resources.
2. **Log Check:**
   - Confirm log level env var is present in config (`LOG_LEVEL`).

---

## Commit 2: feat: Implement DynamoDB utility and logger in backend
**Description:**
- Create `/backend/src/lib/dynamodb.js` for DynamoDB client and table access.
- Create `/backend/src/lib/logger.js` for structured logging (toggleable via `LOG_LEVEL`).
- Use JSON output for logs, following project logging guidelines.
- Add unit tests for DynamoDB utility and logger in `/backend/tests/unit/`.

**Verification:**
1. **Unit Test:**
   - Run `pnpm test backend/tests/unit/dynamodb.test.js` and `pnpm test backend/tests/unit/logger.test.js`.
   - Expected: All tests pass, logger outputs correct log level and format.
2. **Log Check:**
   - Run backend with `LOG_LEVEL=debug` and confirm debug logs appear.

---

## Commit 3: feat: Add idempotency key generation and validation utilities
**Description:**
- Implement `/backend/src/lib/idempotency.js` for key generation and validation logic.
- Add unit tests for idempotency utilities in `/backend/tests/unit/idempotency.test.js`.
- Ensure all key operations are logged at debug level.

**Verification:**
1. **Unit Test:**
   - Run `pnpm test backend/tests/unit/idempotency.test.js`.
   - Expected: All tests pass, logs show key generation/validation steps.
2. **Log Check:**
   - Inspect logs for key generation/validation events.

---

## Commit 4: feat: Implement basic Lambda handler with idempotency middleware
**Description:**
- Create `/backend/src/idempotent.js` as the main Lambda handler.
- Integrate DynamoDB utility, logger, and idempotency utilities.
- Add idempotency middleware logic (check key, store result, return cached response if duplicate).
- Log all request/response events and idempotency checks.
- Add unit test for handler logic in `/backend/tests/unit/idempotent.test.js`.

**Verification:**
1. **Unit Test:**
   - Run `pnpm test backend/tests/unit/idempotent.test.js`.
   - Expected: All tests pass, logs show idempotency flow.
2. **Log Check:**
   - Run handler locally, inspect logs for request, idempotency, and response events.

---

## Commit 5: test: Integration test for Lambda idempotency with DynamoDB
**Description:**
- Add integration test in `/backend/tests/integration/idempotency.integration.test.js`.
- Test Lambda handler end-to-end: first request stores result, duplicate returns cached response.
- Use test DynamoDB table (local or test environment).
- Assert logs for each step (request, key check, response).

**Verification:**
1. **Integration Test:**
   - Run `pnpm test backend/tests/integration/idempotency.integration.test.js`.
   - Expected: Test passes, logs confirm correct idempotency behavior.
2. **Log Check:**
   - Inspect logs for full idempotency lifecycle during test run. 