import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { logger } from './logger.js'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export async function storeIdempotencyRecord(id, data, ttl) {
  const params = {
    TableName: process.env.IDEMPOTENCY_TABLE,
    Item: {
      id,
      ...data,
      ttl: Math.floor(Date.now() / 1000) + ttl
    }
  }

  logger.debug('Storing idempotency record', { id, ttl })
  await docClient.send(new PutCommand(params))
}

export async function getIdempotencyRecord(id) {
  const params = {
    TableName: process.env.IDEMPOTENCY_TABLE,
    Key: { id }
  }

  logger.debug('Getting idempotency record', { id })
  const result = await docClient.send(new GetCommand(params))
  return result.Item
} 