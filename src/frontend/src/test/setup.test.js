import './setup.js'
import { describe, it, expect } from 'vitest'

describe('test environment', () => {
  it('is properly configured', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
    expect(typeof navigator).toBe('object')
  })
}) 