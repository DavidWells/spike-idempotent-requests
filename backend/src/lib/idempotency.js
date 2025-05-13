import { logger } from './logger.js'
import crypto from 'crypto'

/**
 * Generate a UUID v4 idempotency key
 * @returns {string}
 */
export function generateIdempotencyKey() {
  const key = crypto.randomUUID()
  logger.debug('Generated idempotency key', { key })
  return key
}

/**
 * Validate idempotency key format (UUID v4)
 * @param {string} key
 * @returns {boolean}
 */
export function validateIdempotencyKey(key) {
  const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)
  logger.debug('Validated idempotency key', { key, isValid })
  return isValid
} 