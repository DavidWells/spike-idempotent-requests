import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handler } from '../../src/handlers/idempotent.js'
import * as dynamodb from '../../src/lib/dynamodb.js'
import * as idempotency from '../../src/lib/idempotency.js'
import { logger } from '../../src/lib/logger.js'

describe('Idempotent Lambda Handler', () => {
  beforeEach(() => {
    vi.spyOn(logger, 'info').mockImplementation(() => {})
    vi.spyOn(logger, 'warn').mockImplementation(() => {})
    vi.spyOn(logger, 'debug').mockImplementation(() => {})
    vi.spyOn(dynamodb, 'getIdempotencyRecord').mockReset()
    vi.spyOn(dynamodb, 'storeIdempotencyRecord').mockReset()
    vi.spyOn(idempotency, 'validateIdempotencyKey').mockReset()
  })

  it('should return 400 if idempotency key is missing', async () => {
    const event = { headers: {} }
    idempotency.validateIdempotencyKey.mockReturnValue(false)
    const res = await handler(event)
    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res.body).error).toMatch(/Missing or invalid/)
    expect(logger.warn).toHaveBeenCalled()
  })

  it('should return cached response if present', async () => {
    const event = { headers: { 'Idempotency-Key': 'key' } }
    idempotency.validateIdempotencyKey.mockReturnValue(true)
    dynamodb.getIdempotencyRecord.mockResolvedValue({ response: '{"message":"Cached"}' })
    const res = await handler(event)
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).message).toBe('Cached')
    expect(logger.info).toHaveBeenCalledWith('Returning cached response', { idempotencyKey: 'key' })
  })

  it('should process and store new request if not cached', async () => {
    const event = { headers: { 'Idempotency-Key': 'key' } }
    idempotency.validateIdempotencyKey.mockReturnValue(true)
    dynamodb.getIdempotencyRecord.mockResolvedValue(undefined)
    dynamodb.storeIdempotencyRecord.mockResolvedValue()
    const res = await handler(event)
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).message).toBe('Processed')
    expect(logger.info).toHaveBeenCalledWith('Processing new request', { idempotencyKey: 'key' })
    expect(logger.info).toHaveBeenCalledWith('Stored idempotency record', { idempotencyKey: 'key' })
    expect(dynamodb.storeIdempotencyRecord).toHaveBeenCalled()
  })
}) 