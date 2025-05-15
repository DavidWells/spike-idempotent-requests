import { describe, it, expect, vi, beforeEach } from 'vitest'

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

// Mock the logger
vi.mock('@aws-lambda-powertools/logger', () => ({
  Logger: vi.fn().mockImplementation(() => ({
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }))
}))

describe('Idempotent Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should process requests with idempotency', async () => {
    const { handler } = await import('../../src/idempotent.js')
    const event = {
      headers: {
        'idempotency-key': 'test-key'
      },
      body: JSON.stringify({ test: true })
    }

    const response = await handler(event)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ 
      message: 'Processed',
      requestId: 'test-key'
    })
  })

  it('should handle missing idempotency key', async () => {
    const { handler } = await import('../../src/idempotent.js')
    const event = {
      headers: {},
      body: JSON.stringify({ test: true })
    }

    const response = await handler(event)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.body)).toEqual({
      error: 'Idempotency key is required'
    })
  })
}) 