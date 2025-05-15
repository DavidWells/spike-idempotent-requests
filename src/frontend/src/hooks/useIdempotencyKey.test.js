import { describe, it, expect } from 'vitest'
import { useIdempotencyKey } from './useIdempotencyKey'

describe('useIdempotencyKey', () => {
  const hook = useIdempotencyKey()

  it('generates unique keys for different inputs', () => {
    const key1 = hook.generateKey('test1')
    const key2 = hook.generateKey('test2')
    expect(key1).not.toBe(key2)
  })

  it('generates consistent keys for same input', () => {
    const key1 = hook.generateKey('test')
    const key2 = hook.generateKey('test')
    // Keys should be different due to timestamp and counter
    const parts1 = key1.split('_')
    const parts2 = key2.split('_')
    expect(parts1[2] + '_' + parts1[3]).not.toBe(parts2[2] + '_' + parts2[3])
    // But should have same hash prefix
    expect(parts1[1]).toBe(parts2[1])
  })

  it('generates keys with correct format', () => {
    const key = hook.generateKey('test')
    expect(key).toMatch(/^req_-\d+_\d+_\d+$/)
  })
}) 