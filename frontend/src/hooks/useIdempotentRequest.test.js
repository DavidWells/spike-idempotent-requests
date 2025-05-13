import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIdempotentRequest } from './useIdempotentRequest'

describe('useIdempotentRequest', () => {
  let hook

  beforeEach(() => {
    hook = useIdempotentRequest()
    global.fetch = vi.fn()
  })

  it('makes request with idempotency key', async () => {
    const mockResponse = { data: 'test' }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await hook.makeRequest('/api/test', {
      idempotencyKey: 'test-key',
      method: 'POST'
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Idempotency-Key': 'test-key'
      }
    })
    expect(result).toEqual(mockResponse)
  })

  it('throws error on failed request', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    })

    await expect(hook.makeRequest('/api/test')).rejects.toThrow('Request failed: Not Found')
  })
}) 