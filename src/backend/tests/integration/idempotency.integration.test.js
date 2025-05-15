import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Mock AWS SDK
vi.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({})
  }))
}))

vi.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: vi.fn().mockImplementation(() => ({
      send: vi.fn().mockResolvedValue({})
    }))
  }
}))

// Mock the logger
vi.mock('@aws-lambda-powertools/logger', () => ({
  Logger: vi.fn().mockImplementation(() => ({
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }))
}))

// Mock the idempotency module
vi.mock('@aws-lambda-powertools/idempotency', () => {
  return {
    makeIdempotent: vi.fn().mockImplementation((handler) => handler),
    IdempotencyConfig: vi.fn().mockImplementation(() => ({
      eventKeyJmesPath: 'headers."idempotency-key"',
      expiresAfterSeconds: 24 * 60 * 60
    })),
    IdempotencyHandler: vi.fn().mockImplementation(() => ({
      process: vi.fn().mockImplementation(async (handler) => {
        return handler()
      })
    }))
  }
})

describe('Idempotency Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.IDEMPOTENCY_TABLE = 'test-table'
  })

  it('should handle duplicate requests with same idempotency key', async () => {
    const { handler } = await import('../../src/idempotent.js')
    const event = {
      headers: {
        'idempotency-key': 'test-key'
      },
      body: JSON.stringify({ test: true })
    }

    // First request
    const response1 = await handler(event)
    expect(response1.statusCode).toBe(200)
    expect(JSON.parse(response1.body)).toEqual({ 
      message: 'Processed',
      requestId: 'test-key'
    })

    // Second request with same key
    const response2 = await handler(event)
    expect(response2.statusCode).toBe(200)
    expect(JSON.parse(response2.body)).toEqual({ 
      message: 'Processed',
      requestId: 'test-key'
    })
  })

  it('should handle different requests with different idempotency keys', async () => {
    const { handler } = await import('../../src/idempotent.js')
    
    // First request
    const response1 = await handler({
      headers: {
        'idempotency-key': 'key-1'
      },
      body: JSON.stringify({ test: true })
    })
    expect(response1.statusCode).toBe(200)
    expect(JSON.parse(response1.body)).toEqual({ 
      message: 'Processed',
      requestId: 'key-1'
    })

    // Second request with different key
    const response2 = await handler({
      headers: {
        'idempotency-key': 'key-2'
      },
      body: JSON.stringify({ test: true })
    })
    expect(response2.statusCode).toBe(200)
    expect(JSON.parse(response2.body)).toEqual({ 
      message: 'Processed',
      requestId: 'key-2'
    })
  })
}) 