# Task: Frontend Basic Structure

Frontend should be vanilla JS and use JSdocs for types.

## Commit 1: feat: Initialize React application with Vite ✅ 80d796a
**Description:**
- Create `/frontend` directory and initialize Vite project with React template
- Configure Vite for development and production builds
- Set up Mantine UI library and its dependencies
- Add basic project structure following `/frontend/src` organization
- Configure environment variables for API endpoint

**Verification:**
1. **Unit Test:**
   - Run `pnpm test` in frontend directory
   - Expected: Basic test setup passes
2. **Log Check:**
   - Run `pnpm dev` and check console for successful startup
   - Expected: No errors, Vite dev server running

---

## Commit 2: feat: Implement core UI components
**Description:**
- Create `/frontend/src/components/IdempotentForm/` with form component
- Create `/frontend/src/components/RequestHistory/` for displaying request history
- Create `/frontend/src/components/CacheStatus/` for showing cache state
- Add basic styling using Mantine components
- Add unit tests for each component

**Verification:**
1. **Unit Test:**
   - Run `pnpm test` for each component
   - Expected: All component tests pass
2. **Log Check:**
   - Run `pnpm dev` and check browser console
   - Expected: No React warnings or errors

---

## Commit 3: feat: Add custom hooks for idempotent requests
**Description:**
- Create `/frontend/src/hooks/useIdempotentRequest.js` for making API calls
- Create `/frontend/src/hooks/useRequestCache.js` for managing localStorage cache
- Create `/frontend/src/hooks/useIdempotencyKey.js` for key generation
- Add unit tests for each hook
- Add debug logging for request lifecycle

**Verification:**
1. **Unit Test:**
   - Run `pnpm test` for each hook
   - Expected: All hook tests pass
2. **Log Check:**
   - Run `pnpm dev` and check browser console
   - Expected: Debug logs show request lifecycle

---

## Commit 4: feat: Implement main demo page
**Description:**
- Create `/frontend/src/pages/Home.js` as main demo page
- Integrate all components and hooks
- Add error handling and loading states
- Add unit tests for page integration
- Add debug logging for user interactions

**Verification:**
1. **Unit Test:**
   - Run `pnpm test` for page integration
   - Expected: All integration tests pass
2. **Log Check:**
   - Run `pnpm dev` and check browser console
   - Expected: Debug logs show user interactions

---

## Commit 5: test: Add end-to-end tests
**Description:**
- Create `/frontend/tests/e2e/` directory
- Add end-to-end tests for main user flows
- Test idempotency behavior with duplicate requests
- Test offline functionality with cached responses
- Add debug logging for test scenarios

**Verification:**
1. **Integration Test:**
   - Run `pnpm test:e2e`
   - Expected: All e2e tests pass
2. **Log Check:**
   - Run tests with debug logging enabled
   - Expected: Debug logs show test scenarios 