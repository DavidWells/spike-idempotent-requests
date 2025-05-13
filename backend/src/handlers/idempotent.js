import { makeIdempotent, IdempotencyConfig } from '@aws-lambda-powertools/idempotency';
import { DynamoDBPersistenceLayer } from '@aws-lambda-powertools/idempotency/dynamodb'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger()

if (!process.env.IDEMPOTENCY_TABLE) {
  throw new Error('IDEMPOTENCY_TABLE is not set in environment variables')
}

const persistenceStore = new DynamoDBPersistenceLayer({
  tableName: process.env.IDEMPOTENCY_TABLE,
  keyAttr: 'id',
  expiryAttr: 'expiration',
})

const idempotencyConfig = new IdempotencyConfig({
  eventKeyJmesPath: 'headers."idempotency-key"',
  expiresAfterSeconds: 24 * 60 * 60, // 24 hours
  throwOnNoIdempotencyKey: true,
  useLocalCache: true,
  maxLocalCacheSize: 512,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

/**
 * Lambda handler for idempotent requests
 * @param {object} event
 * @returns {object}
 */
export const handler = makeIdempotent(
  async (event) => {
    try {
      logger.info('Processing request', { event })

      // Handle OPTIONS request for CORS preflight
      if (event.httpMethod === 'OPTIONS') {
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: ''
        }
      }

      // Simulate business logic
      const response = JSON.stringify({ 
        message: 'Processed', 
        requestId: event.headers?.['Idempotency-Key'] || event.headers?.['idempotency-key']
      })

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: response
      }
    } catch (err) {
      logger.error('Handler error', { error: err })
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: err.message })
      }
    }
  },
  {
    persistenceStore,
    config: idempotencyConfig
  }
) 