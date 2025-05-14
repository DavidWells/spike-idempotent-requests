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

function responseHook(response, record) {
  console.log('responseHook response')
  console.log(response)
  console.log('responseHook record')
  console.log(record)
  // Return inserted Header data into the Idempotent Response
  // response.headers = {
  //   'x-idempotency-key': record.idempotencyKey
  // }

  const currentBody = JSON.parse(response.body)
  const newBody = JSON.stringify(Object.assign({}, currentBody, {
    serverCacheHit: true
  }))

  response.body = newBody
  // Must return the response here
  return response
}

const idempotencyConfig = new IdempotencyConfig({
  eventKeyJmesPath: 'headers."idempotency-key"',
  expiresAfterSeconds: 24 * 60 * 60, // 24 hours
  throwOnNoIdempotencyKey: true,
  useLocalCache: true,
  maxLocalCacheSize: 512,
  responseHook,
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

/**
 * Lambda handler for idempotent requests
 * @param {import('aws-lambda').APIGatewayProxyEvent} event - The request event
 * @returns {Promise<Response>} The response
 */
export const handler = makeIdempotent(
  async (event) => {
    try {
      logger.info('Processing request', { event })
      // Check for idempotency key
      const idempotencyKey = event.headers?.['Idempotency-Key'] || event.headers?.['idempotency-key']
      if (!idempotencyKey) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Idempotency key is required' })
        }
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          message: 'Processed', 
          requestId: idempotencyKey
        })
      }
    } catch (err) {
      logger.error('Handler error', { error: err })
      
      // Handle missing idempotency key error
      if (err.message?.includes('No idempotency key found')) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Idempotency key is required' })
        }
      }

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