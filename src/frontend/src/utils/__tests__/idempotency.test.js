import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateIdempotencyKey, getCachedResponse, cacheResponse, makeIdempotentRequest } from '../idempotency'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value
    }),
    removeItem: vi.fn(key => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
const mockFetch = vi.fn()
Object.defineProperty(window, 'fetch', {
  value: mockFetch
})

describe('Idempotency Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  describe('generateIdempotencyKey', () => {
    it('generates a key with the correct prefix', () => {
      const key = generateIdempotencyKey({ name: 'test', email: 'test@test.com' })
      expect(key).toMatch(/^idempotency_/)
    })

    it('generates unique keys', () => {
      const key1 = generateIdempotencyKey({ name: 'test', email: 'test@test.com' })
      const key2 = generateIdempotencyKey({ name: 'test', email: 'test@2test.com' })
      expect(key1).not.toBe(key2)
    })
  })

  describe('getCachedResponse', () => {
    it('returns null for non-existent key', () => {
      const result = getCachedResponse('nonexistent')
      expect(result).toBeNull()
    })

    it('returns cached response for valid key', () => {
      const mockResponse = { data: 'test' }
      const mockData = {
        response: mockResponse,
        timestamp: Date.now()
      }
      localStorageMock.setItem('test_key', JSON.stringify(mockData))

      const result = getCachedResponse('test_key')
      expect(result).toEqual(mockResponse)
    })

    it('returns null for expired cache', () => {
      const mockResponse = { data: 'test' }
      const mockData = {
        response: mockResponse,
        timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
      }
      localStorageMock.setItem('test_key', JSON.stringify(mockData))

      const result = getCachedResponse('test_key')
      expect(result).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_key')
    })
  })

  describe('cacheResponse', () => {
    it('stores response with timestamp', () => {
      const mockResponse = { data: 'test' }
      cacheResponse('test_key', mockResponse)

      const storedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(storedData.response).toEqual(mockResponse)
      expect(storedData.timestamp).toBeDefined()
    })
  })

  describe('makeIdempotentRequest', () => {
    it('makes a new request when no cache exists', async () => {
      const mockResponse = { data: 'test' }
      const mockJsonResponse = Promise.resolve(mockResponse)
      const mockFetchResponse = {
        ok: true,
        json: () => mockJsonResponse
      }
      mockFetch.mockResolvedValueOnce(mockFetchResponse)

      const result = await makeIdempotentRequest('/api/test', { test: 'data' })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Idempotency-Key': expect.any(String),
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ test: 'data' })
        })
      )
      expect(result).toEqual({ ...mockResponse, isCached: false })
    })

    it('returns cached response when available', async () => {
      const mockResponse = { data: 'cached' }
      const mockData = {
        response: mockResponse,
        timestamp: Date.now()
      }
      const idempotencyKey = generateIdempotencyKey({ test: 'data' })
      localStorageMock.setItem(idempotencyKey, JSON.stringify(mockData))

      const result = await makeIdempotentRequest('/api/test', { test: 'data' })

      expect(mockFetch).not.toHaveBeenCalled()
      expect(result).toEqual({ ...mockResponse, isCached: true })
    })

    it('throws error for failed requests', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error' })
      }
      mockFetch.mockResolvedValueOnce(mockFetchResponse)

      await expect(makeIdempotentRequest('/api/test', { test: 'data' }))
        .rejects
        .toThrow('HTTP error! status: 500')
    })
  })
}) 