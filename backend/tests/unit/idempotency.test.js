import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateIdempotencyKey, validateIdempotencyKey } from '../../src/lib/idempotency.js'
import { logger } from '../../src/lib/logger.js'

describe('Idempotency Utilities', () => {
  beforeEach(() => {
    vi.spyOn(logger, 'debug').mockImplementation(() => {})
  })

  it('should generate a valid UUID v4 idempotency key', () => {
    const key = generateIdempotencyKey()
    expect(validateIdempotencyKey(key)).toBe(true)
    expect(logger.debug).toHaveBeenCalledWith('Generated idempotency key', { key })
  })

  it('should validate correct UUID v4 format', () => {
    const validKey = '123e4567-e89b-42d3-a456-426614174000'
    expect(validateIdempotencyKey(validKey)).toBe(true)
    expect(logger.debug).toHaveBeenCalledWith('Validated idempotency key', { key: validKey, isValid: true })
  })

  it('should invalidate incorrect key format', () => {
    const invalidKey = 'not-a-uuid'
    expect(validateIdempotencyKey(invalidKey)).toBe(false)
    expect(logger.debug).toHaveBeenCalledWith('Validated idempotency key', { key: invalidKey, isValid: false })
  })
}) 