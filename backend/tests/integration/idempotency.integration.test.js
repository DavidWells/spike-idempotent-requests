import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handler } from '../../src/handlers/idempotent.js'
import { Logger } from '@aws-lambda-powertools/logger'

vi.mock('@aws-lambda-powertools/logger', () => ({
  Logger: vi.fn().mockImplementation(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }))
}))

vi.mock('@aws-lambda-powertools/idempotency', () => ({
  makeIdempotent: vi.fn((handler) => handler)
}))

vi.mock('@aws-lambda-powertools/idempotency/dynamodb', () => ({
  DynamoDBPersistenceLayer: vi.fn().mockImplementation(() => ({}))
}))

describe('Lambda Idempotency Integration', () => {
  const key = '123e4567-e89b-42d3-a456-426614174000'
  const event = { headers: { 'Idempotency-Key': key } }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should process request and return response', async () => {
    const res = await handler(event)
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).message).toBe('Processed')
    expect(JSON.parse(res.body).requestId).toBe(key)
  })
}) 