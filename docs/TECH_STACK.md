# Idempotent Requests Demo Application Tech Stack

All code should be vanilla JavaScript and typed via JSDOC comments

## 1. Project Overview & Goals
This project is a demonstration application for implementing idempotent request handling patterns. The primary goals are:
- Demonstrate server-side idempotency using AWS Lambda Powertools
- Showcase client-side idempotency handling
- Provide a simple, maintainable codebase for learning purposes
- Focus on core idempotency patterns without complex business logic

## 2. Core Languages & Runtimes
### Backend
- Node.js 22
  - Chosen for AWS Lambda Powertools compatibility
  - Modern JavaScript features and performance improvements
  - Strong AWS ecosystem integration

### Frontend
- React 18+
  - Industry standard for UI development
  - Large ecosystem and community support
  - Simple component-based architecture
- Vite
  - Fast development server and build tool
  - Modern ESM-based development experience
  - Excellent developer experience

## 3. Frameworks & Libraries (Backend)
### Core Framework
- Serverless Framework using the `osls` fork `npm install osls`
  - Simplifies AWS Lambda deployment
  - Infrastructure as code capabilities
  - Easy local development and testing

### Key Libraries
- @aws-lambda-powertools/idempotency
  - Core idempotency implementation
  - DynamoDB persistence layer integration
  - Built-in expiration handling
- AWS SDK v3
  - Modern AWS service integration
  - TypeScript support
  - Modular architecture

## 4. Frameworks & Libraries (Frontend)
### UI Framework
- React
  - Core UI library
  - Functional components with hooks
  - Simple state management

### UI Components
- Mantine (Latest Version) - https://mantine.dev
  - Modern, accessible component library
  - Simple, clean design system
  - Built-in TypeScript support
  - No additional CSS framework required

## 5. Database & Data Storage
### Primary Database
- AWS DynamoDB
  - Serverless NoSQL database
  - Pay-per-request pricing
  - Built-in TTL support for idempotency records
  - Automatic scaling

### Data Storage Configuration
- Single-table design for idempotency tracking
- TTL enabled for automatic record cleanup
- Pay-per-request billing mode for cost efficiency

## 6. Infrastructure & Deployment
### Cloud Provider
- AWS
  - Lambda for serverless compute
  - DynamoDB for data storage
  - API Gateway for REST endpoints

### Deployment
- Serverless Framework
  - Infrastructure as code
  - Automated deployments
  - Environment management

## 7. APIs & Integrations
### API Style
- REST API
  - Idempotency key header support
  - JSON request/response format
  - Standard HTTP methods

### Third-Party Services
- AWS Lambda Powertools
  - Idempotency handling
  - Logging and monitoring
  - Tracing capabilities

## 8. Development Tools & Standards
### Version Control
- Git
- GitHub for repository hosting

### Code Quality
- ALL code should be written as javascript
- TypeScript via JSDOC for type safety

### Testing
- Uvu npm package for unit testing
- React Testing Library for component testing
- Manual testing for idempotency scenarios

## 9. Security Considerations
### Core Security
- AWS IAM roles and policies
- API Gateway security
- DynamoDB encryption at rest
- HTTPS for all API endpoints

### Development Security
- Environment variable management
- AWS credentials handling
- Input validation
- Error handling without sensitive data exposure

## 10. Rationale & Alternatives Considered
### Backend Choices
- AWS Lambda Powertools over custom implementation
  - Battle-tested solution
  - Built-in DynamoDB integration
  - Active maintenance and community support

### Frontend Choices
- Mantine from https://mantine.dev over other UI libraries
  - Simple, clean design
  - No additional CSS framework needed
  - Good TypeScript support
  - Active development and community

### Database Choices
- DynamoDB over other databases
  - Serverless architecture fit
  - Built-in TTL support
  - Automatic scaling
  - Cost-effective for demo application 