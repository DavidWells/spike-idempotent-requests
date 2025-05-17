import { createHash } from 'crypto'
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

// Helper function to generate ETag from response body
function generateETag(responseBody) {
  return `"${createHash('md5').update(responseBody).digest('hex')}"`
}

// Add cache headers to the response
function addCacheHeaders(response, etag) {
  // Get cache TTL from env or use default (3600 seconds = 1 hour)
  const cacheTtl = process.env.CACHE_TIME_IN_SECONDS || 3600
  
  // Create new headers object - don't mutate corsHeaders directly
  response.headers = {
    ...response.headers,
    'ETag': etag,
    'Cache-Control': `max-age=${cacheTtl}`,
    'Vary': 'Accept-Encoding, Accept'
  }
  
  return response
}

function responseHook(response, record) {
  console.log('responseHook response')
  console.log(response)
  console.log('responseHook record')
  console.log(record)
  // Return inserted Header data into the Idempotent Response
  // response.headers = {
  //   'x-idempotency-key': record.idempotencyKey
  // }

  // Parse the current body
  const currentBody = JSON.parse(response.body)
  
  // Add serverCacheHit flag to indicate this is from the idempotency cache
  const newBody = JSON.stringify(Object.assign({}, currentBody, {
    serverCacheHit: true
  }))
  
  // Generate ETag from the new response body
  // const etag = record.responseData.headers.etag || generateETag(currentBody)
  
  // Update the response body
  response.body = newBody
  
  
  // Return modified response
  return response
}

const idempotencyConfig = new IdempotencyConfig({
  eventKeyJmesPath: 'headers."Idempotency-Key" || headers."idempotency-key"',
  expiresAfterSeconds: parseInt(process.env.CACHE_TIME_IN_SECONDS), // 24 * 60 * 60, // 24 hours
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
      
      // Check if the request includes an If-None-Match header
      const ifNoneMatch = event.headers?.['If-None-Match'] || event.headers?.['if-none-match']
      
      // Create the response body
      const responseBody = JSON.stringify({ 
        message: 'Processed', 
        requestId: idempotencyKey
      })
      
      // Generate an ETag for this response
      const etag = generateETag(responseBody)
      console.log('etag', etag)
      
      // If client sent If-None-Match header that matches our ETag, return 304
      if (ifNoneMatch && ifNoneMatch === etag) {
        logger.info('ETag match - returning 304', { etag, ifNoneMatch })
        return {
          statusCode: 304, // Not Modified
          headers: addCacheHeaders({ headers: corsHeaders }, etag)
        }
      }
      
      // Otherwise, return full response with ETag
      logger.info('Returning full response with ETag', { etag })
      return addCacheHeaders({
        statusCode: 200,
        headers: corsHeaders,
        body: responseBody
      }, etag)
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