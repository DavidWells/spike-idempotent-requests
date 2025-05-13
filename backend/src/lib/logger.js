const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toLowerCase() || 'info']

function log(level, message, data = {}) {
  if (LOG_LEVELS[level] <= currentLevel) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data
    }
    console.log(JSON.stringify(logEntry))
  }
}

export const logger = {
  error: (message, data) => log('error', message, data),
  warn: (message, data) => log('warn', message, data),
  info: (message, data) => log('info', message, data),
  debug: (message, data) => log('debug', message, data)
} 