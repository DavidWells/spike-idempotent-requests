import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRequestCache } from './useRequestCache'

describe('useRequestCache', () => {
  let hook
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn()
  }

  beforeEach(() => {
    hook = useRequestCache()
    global.localStorage = mockLocalStorage
    mockLocalStorage.getItem.mockReset()
    mockLocalStorage.setItem.mockReset()
  })

  it('returns null for non-existent cache key', () => {
    mockLocalStorage.getItem.mockReturnValue('{}')
    expect(hook.getCachedResponse('test-key')).toBeNull()
  })

  it('returns cached response for existing key', () => {
    const mockCache = { 'test-key': { data: 'test' } }
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCache))
    expect(hook.getCachedResponse('test-key')).toEqual({ data: 'test' })
  })

  it('sets cached response', () => {
    mockLocalStorage.getItem.mockReturnValue('{}')
    hook.setCachedResponse('test-key', { data: 'test' })
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'idempotent-request-cache',
      JSON.stringify({ 'test-key': { data: 'test' } })
    )
  })

  it('returns correct cache count', () => {
    const mockCache = { 'key1': {}, 'key2': {} }
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCache))
    expect(hook.getCacheCount()).toBe(2)
  })
}) 