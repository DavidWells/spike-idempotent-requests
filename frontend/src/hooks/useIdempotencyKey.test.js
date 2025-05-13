import { describe, it, expect } from 'vitest'
import { useIdempotencyKey } from './useIdempotencyKey'
import { vi } from 'vitest'

describe('useIdempotencyKey', () => {
  const hook = useIdempotencyKey()

  it('generates unique keys for different inputs', () => {
    const key1 = hook.generateKey('test1')
    const key2 = hook.generateKey('test2')
    expect(key1).not.toBe(key2)
  })

  it('generates consistent keys for same input', () => {
    // Mock Date.now to return incrementing values
    let now = 1000
    const spy = vi.spyOn(Date, 'now').mockImplementation(() => now++)
    const key1 = hook.generateKey('test')
    const key2 = hook.generateKey('test')
    spy.mockRestore()
    // Keys should be different due to timestamp
    const timestamp1 = key1.split('_')[2]
    const timestamp2 = key2.split('_')[2]
    expect(timestamp1).not.toBe(timestamp2) // Timestamps should differ
    // But should have same hash prefix
    expect(key1.split('_')[1]).toBe(key2.split('_')[1]) // Hash part should match
  })

  it('generates keys with correct format', () => {
    const key = hook.generateKey('test')
    // Format: req_<negative number>_<timestamp>
    expect(key).toMatch(/^req_-\d+_\d+$/)
  })
}) 