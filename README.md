# Spike Idempotent Requests

A demonstration project showcasing how to implement idempotent requests in AWS Lambda functions using the AWS Lambda Powertools library. This project includes both backend and frontend components to demonstrate the complete flow of idempotent request handling.

<!-- doc-gen {TOC} collapse=false -->
<details>
<summary>Table of Contents</summary>

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Development](#development)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [License](#license)

</details>
<!-- end-doc-gen -->

## Project Structure

```
.
├── src/              # Source code for both frontend and backend
│   ├── backend/      # AWS Lambda functions and infrastructure
│   └── frontend/     # React frontend application
├── scripts/          # Utility scripts
└── docs/             # Project documentation
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
cd src/backend
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
cd src/backend
pnpm run test
```

### Frontend

The frontend is a React application that demonstrates how to interact with the idempotent API endpoints.

To start the development server:

```bash
cd src/frontend
pnpm run dev
```

Make sure to deploy the backend first to setup the API endpoint.

Pull in the api endpoint automatically with

```bash
cd src/frontend
npm run sync
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
- React + vite for the frontend interface

## License

ISC 