import { vi } from 'vitest'
const mockSend = vi.fn()
vi.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: vi.fn(() => ({
      send: mockSend
    }))
  },
  PutCommand: vi.fn(),
  GetCommand: vi.fn()
}))
import { describe, it, expect, beforeEach } from 'vitest'
import { storeIdempotencyRecord, getIdempotencyRecord } from '../../src/lib/dynamodb.js'
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

describe('DynamoDB Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockReset()
  })

  it('should store idempotency record', async () => {
    const id = 'test-id'
    const data = { foo: 'bar' }
    const ttl = 3600

    mockSend.mockResolvedValueOnce({})
    await storeIdempotencyRecord(id, data, ttl)

    expect(PutCommand).toHaveBeenCalledWith({
      TableName: process.env.IDEMPOTENCY_TABLE,
      Item: {
        id,
        ...data,
        ttl: expect.any(Number)
      }
    })
    expect(mockSend).toHaveBeenCalled()
  })

  it('should get idempotency record', async () => {
    const id = 'test-id'
    const mockItem = { id, foo: 'bar' }
    mockSend.mockResolvedValueOnce({ Item: mockItem })

    const result = await getIdempotencyRecord(id)

    expect(GetCommand).toHaveBeenCalledWith({
      TableName: process.env.IDEMPOTENCY_TABLE,
      Key: { id }
    })
    expect(mockSend).toHaveBeenCalled()
    expect(result).toEqual(mockItem)
  })
}) 