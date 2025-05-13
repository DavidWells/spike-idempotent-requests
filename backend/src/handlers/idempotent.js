import { makeIdempotent } from '@aws-lambda-powertools/idempotency'
import { DynamoDBPersistenceLayer } from '@aws-lambda-powertools/idempotency/dynamodb'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger()

const persistenceStore = new DynamoDBPersistenceLayer({
  tableName: process.env.IDEMPOTENCY_TABLE
})

/**
 * Lambda handler for idempotent requests
 * @param {object} event
 * @returns {object}
 */
export const handler = makeIdempotent(
  async (event) => {
    logger.info('Processing new request', { event })

    // Simulate business logic
    const response = JSON.stringify({ 
      message: 'Processed', 
      requestId: event.headers?.['Idempotency-Key'] 
    })

    return {
      statusCode: 200,
      body: response
    }
  },
  {
    persistenceStore,
    config: {
      eventKeyJmesPath: 'headers."Idempotency-Key"',
      throwOnNoIdempotencyKey: true,
      expiresAfterSeconds: 24 * 60 * 60 // 24 hours
    }
  }
) 