import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let logger = require('../../src/lib/logger.js').logger

describe('Logger', () => {
  const originalConsoleLog = console.log
  const originalEnv = process.env

  beforeEach(() => {
    console.log = vi.fn()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    console.log = originalConsoleLog
    process.env = originalEnv
  })

  it('should log at info level by default', () => {
    logger.info('test message', { foo: 'bar' })
    
    expect(console.log).toHaveBeenCalled()
    const logEntry = JSON.parse(console.log.mock.calls[0][0])
    expect(logEntry).toMatchObject({
      level: 'info',
      message: 'test message',
      foo: 'bar'
    })
  })

  it('should not log debug messages by default', () => {
    logger.debug('debug message')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('should log debug messages when LOG_LEVEL is debug', async () => {
    process.env.LOG_LEVEL = 'debug'
    logger = (await import('../../src/lib/logger.js')).logger
    logger.debug('debug message', { test: true })
    
    expect(console.log).toHaveBeenCalled()
    const logEntry = JSON.parse(console.log.mock.calls[0][0])
    expect(logEntry).toMatchObject({
      level: 'debug',
      message: 'debug message',
      test: true
    })
  })

  it('should include timestamp in log entries', () => {
    logger.info('test message')
    
    const logEntry = JSON.parse(console.log.mock.calls[0][0])
    expect(logEntry).toHaveProperty('timestamp')
    expect(new Date(logEntry.timestamp)).toBeInstanceOf(Date)
  })
}) 