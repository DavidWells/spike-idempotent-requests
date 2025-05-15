import { randomUUID } from 'node:crypto'
import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBPersistenceLayer } from '@aws-lambda-powertools/idempotency/dynamodb'
import { makeHandlerIdempotent } from '@aws-lambda-powertools/idempotency/middleware'
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { IdempotencyConfig } from '@aws-lambda-powertools/idempotency'
import middy from '@middy/core'

const logger = new Logger({ serviceName: "middytest" });

console.log('process.env.IDEMPOTENCY_TABLE', process.env.IDEMPOTENCY_TABLE)
const persistenceStore = new DynamoDBPersistenceLayer({
  tableName: process.env.IDEMPOTENCY_TABLE,
  keyAttr: 'id',
  expiryAttr: 'expiration',
})

const idempotencyConfig = new IdempotencyConfig({
  eventKeyJmesPath: 'headers."idempotency-key"',
  expiresAfterSeconds: 24 * 60 * 60, // 24 hours
  // throwOnNoIdempotencyKey: true,
  useLocalCache: true,
  maxLocalCacheSize: 512,
})

/**
 * @typedef {Object} Response
 * @property {string} paymentId - The payment ID
 * @property {string} message - Response message
 * @property {number} statusCode - HTTP status code
 */

/**
 * Business logic for creating subscription payments
 * @param {import('aws-lambda').APIGatewayProxyEvent} event - The request event
 * @param {import('aws-lambda').Context} _context - The Lambda context
 * @returns {Promise<Response>} The response
 */
async function businessLogic(event, _context) {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2))
    
    if (!event.body) {
      console.error('Missing request body')
      throw new Error('Request body is required')
    }

    const request = JSON.parse(event.body)
    console.log('Parsed request:', request)
    
    const payment = await createSubscriptionPayment(request)
    console.log('Created payment:', payment)

    return {
      paymentId: payment.id,
      message: 'success',
      statusCode: 200
    }
  } catch (error) {
    console.error('Error in businessLogic:', error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

/**
 * @typedef {Object} Request
 * @property {string} productId - The ID of the product
 * @property {string} [idempotencyKey] - Optional idempotency key for the request
 */

/**
 * @typedef {Object} SubscriptionResult
 * @property {string} id - The subscription ID
 * @property {string} productId - The product ID
 */


/**
 * Creates a subscription payment
 * @param {Request} event - The request event
 * @returns {Promise<SubscriptionResult>} The subscription result
 */
async function createSubscriptionPayment(event) {
  // Simulate payment creation
  return {
    id: randomUUID(),
    productId: event.productId
  }
}

export const handler = middy(businessLogic)
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(makeHandlerIdempotent({ persistenceStore, config: idempotencyConfig })
)