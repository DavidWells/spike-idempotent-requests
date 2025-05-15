# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Idempotent Form Implementation

This project demonstrates the implementation of an idempotent form using React and Mantine UI components. The form prevents duplicate submissions by using idempotency keys and client-side caching.

## Features

- Form validation for name and email fields
- Idempotent request handling with unique keys
- Client-side caching of successful responses
- Visual feedback for form states (loading, success, error)
- Cache management with size display and clear functionality

## Installation

```bash
pnpm install
```

## Usage

### Basic Usage

```jsx
import { MantineProvider } from '@mantine/core'
import IdempotentForm from './components/IdempotentForm'

function App() {
  return (
    <MantineProvider>
      <IdempotentForm />
    </MantineProvider>
  )
}
```

### Form Validation

The form includes built-in validation for:
- Name: Must be at least 2 characters long
- Email: Must be a valid email format

### Idempotent Requests

The form automatically handles idempotent requests by:
1. Generating a unique idempotency key for each submission
2. Checking for cached responses before making a new request
3. Caching successful responses for future use

### Cache Management

The form provides cache management features:
- Display of current cache size
- Button to clear the cache
- Automatic cache expiration after 24 hours

## API Endpoint

The form submits data to:
```
POST https://i53k6s6fk6.execute-api.us-west-1.amazonaws.com/prod/api/idempotent
```

Request body format:
```json
{
  "name": "string",
  "email": "string"
}
```

## Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Dependencies

- React
- Mantine UI
- UUID (for idempotency key generation)
- Testing Library (for component testing)
