# Project Structure

This document outlines the file structure for the Idempotent Requests Demo Application.

## Root Directory Structure

```
.
├── .cursor/                    # Cursor IDE configuration
│   └── rules/                 # Project-specific rules
├── .netlify/                  # Netlify configuration
├── docs/                      # Documentation
│   ├── diagrams/             # System diagrams
│   └── api/                  # API documentation
├── scripts/                   # Build and utility scripts
├── src/                      # Source code
│   ├── backend/             # Backend application
│   │   ├── handlers/       # Lambda function handlers
│   │   ├── lib/           # Shared utilities
│   │   └── middleware/    # Custom middleware
│   └── frontend/          # Frontend application
│       ├── components/    # React components
│       ├── hooks/        # Custom React hooks
│       ├── lib/         # Shared utilities
│       └── pages/       # Page components
├── .gitignore              # Git ignore rules
├── NOTES.md               # Development notes
├── README.md             # Project overview and setup instructions
└── package.json         # Project dependencies and scripts
```

## Backend Structure Details

### `/src/backend/handlers/`
- `index.js` - Main Lambda handler
- `idempotent.js` - Idempotency handler implementation
- `errors.js` - Error handling utilities

### `/src/backend/lib/`
- `dynamodb.js` - DynamoDB client and utilities
- `idempotency.js` - Idempotency key generation and validation
- `logger.js` - Logging utilities

### `/src/backend/middleware/`
- `idempotency.js` - Idempotency middleware
- `error-handler.js` - Error handling middleware

## Frontend Structure Details

### `/src/frontend/components/`
- `IdempotentForm/` - Form component for idempotent requests
- `RequestHistory/` - Component to display request history
- `CacheStatus/` - Component to show cache status

### `/src/frontend/hooks/`
- `useIdempotentRequest.js` - Hook for making idempotent requests
- `useRequestCache.js` - Hook for managing request cache
- `useIdempotencyKey.js` - Hook for generating idempotency keys

### `/src/frontend/lib/`
- `api.js` - API client utilities
- `cache.js` - Local storage cache utilities
- `hash.js` - Request hash generation utilities

### `/src/frontend/pages/`
- `Home.js` - Main demo page
- `Documentation.js` - Usage documentation
- `Examples.js` - Example implementations

## Documentation Structure

### `/docs/diagrams/`
- `backend-flow.md` - Backend request flow diagram
- `frontend-flow.md` - Frontend request flow diagram

### `/docs/api/`
- `openapi.yaml` - OpenAPI specification
- `examples/` - API usage examples

## Key Files

### Root Level
- `README.md` - Project overview and setup instructions
- `NOTES.md` - Development notes and documentation
- `.gitignore` - Git ignore rules
- `package.json` - Project dependencies and scripts

## Best Practices

1. **File Naming**
   - Use kebab-case for file names
   - Use PascalCase for React components
   - Use camelCase for utility functions

2. **Code Organization**
   - Keep related files close together
   - Use index files for clean exports
   - Maintain clear separation of concerns

3. **Testing**
   - Co-locate test files with source files
   - Use descriptive test names
   - Include both unit and integration tests

4. **Documentation**
   - Keep documentation up to date
   - Include JSDoc comments for functions
   - Document complex business logic

5. **Configuration**
   - Use environment variables for configuration
   - Provide example configuration files
   - Document all configuration options 