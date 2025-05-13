import { storeIdempotencyRecord, getIdempotencyRecord } from '../lib/dynamodb.js'
import { logger } from '../lib/logger.js'
import { generateIdempotencyKey, validateIdempotencyKey } from '../lib/idempotency.js'

/**
 * Lambda handler for idempotent requests
 * @param {object} event
 * @returns {object}
 */
export async function handler(event) {
  logger.info('Received request', { event })
  const idempotencyKey = event.headers?.['Idempotency-Key']

  if (!idempotencyKey || !validateIdempotencyKey(idempotencyKey)) {
    logger.warn('Missing or invalid idempotency key', { idempotencyKey })
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid Idempotency-Key header' })
    }
  }

  // Check for existing record
  const cached = await getIdempotencyRecord(idempotencyKey)
  if (cached && cached.response) {
    logger.info('Returning cached response', { idempotencyKey })
    return {
      statusCode: 200,
      body: cached.response
    }
  }

  // Simulate business logic
  const response = JSON.stringify({ message: 'Processed', requestId: idempotencyKey })
  logger.info('Processing new request', { idempotencyKey })

  // Store result with TTL (24h)
  await storeIdempotencyRecord(idempotencyKey, { response }, 24 * 60 * 60)
  logger.info('Stored idempotency record', { idempotencyKey })

  return {
    statusCode: 200,
    body: response
  }
} 