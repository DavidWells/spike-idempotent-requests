import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handler } from '../../src/handlers/idempotent.js'
import * as dynamodb from '../../src/lib/dynamodb.js'
import * as idempotency from '../../src/lib/idempotency.js'
import { logger } from '../../src/lib/logger.js'

describe('Lambda Idempotency Integration', () => {
  const key = '123e4567-e89b-42d3-a456-426614174000'
  const event = { headers: { 'Idempotency-Key': key } }

  beforeEach(() => {
    vi.spyOn(logger, 'info').mockImplementation(() => {})
    vi.spyOn(logger, 'warn').mockImplementation(() => {})
    vi.spyOn(logger, 'debug').mockImplementation(() => {})
    vi.spyOn(idempotency, 'validateIdempotencyKey').mockReturnValue(true)
    vi.spyOn(dynamodb, 'getIdempotencyRecord').mockReset()
    vi.spyOn(dynamodb, 'storeIdempotencyRecord').mockReset()
  })

  it('should store result on first request and return cached on duplicate', async () => {
    // First request: no cache
    dynamodb.getIdempotencyRecord.mockResolvedValueOnce(undefined)
    dynamodb.storeIdempotencyRecord.mockResolvedValueOnce()
    const firstRes = await handler(event)
    expect(firstRes.statusCode).toBe(200)
    expect(JSON.parse(firstRes.body).message).toBe('Processed')
    expect(dynamodb.storeIdempotencyRecord).toHaveBeenCalledWith(key, expect.any(Object), 24 * 60 * 60)
    expect(logger.info).toHaveBeenCalledWith('Processing new request', { idempotencyKey: key })
    expect(logger.info).toHaveBeenCalledWith('Stored idempotency record', { idempotencyKey: key })

    // Second request: cache hit
    dynamodb.getIdempotencyRecord.mockResolvedValueOnce({ response: firstRes.body })
    const secondRes = await handler(event)
    expect(secondRes.statusCode).toBe(200)
    expect(JSON.parse(secondRes.body).message).toBe('Processed')
    expect(logger.info).toHaveBeenCalledWith('Returning cached response', { idempotencyKey: key })
  })
}) 