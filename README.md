# Spike Idempotent Requests

A demonstration project showcasing how to implement idempotent requests in AWS Lambda functions using the AWS Lambda Powertools library. This project includes both backend and frontend components to demonstrate the complete flow of idempotent request handling.

## Project Structure

```
.
├── backend/           # AWS Lambda functions and infrastructure
│   ├── src/          # Lambda function source code
│   ├── tests/        # Unit and integration tests
│   └── package.json  # Backend dependencies
└── frontend/         # React frontend application
    ├── src/          # React source code
    └── package.json  # Frontend dependencies
```

## Prerequisites

- Node.js (v18 or later)
- pnpm (v10.11.0 or later)
- AWS CLI configured with appropriate credentials
- AWS SAM CLI (for local development)

## Setup

1. Install dependencies:

In the root dir run:

```bash
# Install dependencies
npm run setup
```

2. Configure AWS credentials:
   - Ensure you have AWS credentials configured in `~/.aws/credentials`
   - The credentials should have permissions to create and manage DynamoDB tables and Lambda functions

3. Deploy the backend:

```bash
cd backend
pnpm run deploy
```

## Development

### Backend

The backend consists of AWS Lambda functions that demonstrate idempotent request handling using AWS Lambda Powertools. Key features:

- Idempotent request handling using DynamoDB
- Structured logging
- Unit and integration tests

To run tests:

```bash
cd backend
pnpm run test
```

### Frontend

The frontend is a React application that demonstrates how to interact with the idempotent API endpoints.

To start the development server:

```bash
cd frontend
pnpm run dev
```

## Key Features

- Idempotent request handling using AWS Lambda Powertools
- DynamoDB integration for idempotency state management
- Structured logging with AWS Lambda Powertools Logger
- React frontend for demonstration
- Comprehensive test suite

## Architecture

The project uses:
- AWS Lambda for serverless functions
- DynamoDB for idempotency state management
- `@aws-lambda-powertools/idempotency` for idempotency
- React for the frontend interface

## License

ISC 