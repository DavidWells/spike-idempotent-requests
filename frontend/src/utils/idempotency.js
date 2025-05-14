const IDEMPOTENCY_KEY_PREFIX = 'idempotency_'
const CACHE_COUNT_KEY = 'idempotent-cache-count'

// Hash the request data to create a deterministic idempotency key
const hashData = (data) => {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16)
}

export const generateIdempotencyKey = (data) => {
  const dataHash = hashData(data)
  return `${IDEMPOTENCY_KEY_PREFIX}${dataHash}`
}

export const getCachedResponse = (key) => {
  const cachedData = localStorage.getItem(key)
  if (!cachedData) return null
  
  try {
    const { response, timestamp } = JSON.parse(cachedData)
    const HOURS_TO_EXPIRE = 24
    // Cache expires after 24 hours
    if (Date.now() - timestamp > HOURS_TO_EXPIRE * 60 * 60 * 1000) {
      localStorage.removeItem(key)
      decrementCacheCount()
      return null
    }
    // Return the full response object including the timestamp
    return {
      ...response,
      timestamp: new Date(timestamp).toISOString()
    }
  } catch (error) {
    console.error('Error parsing cached response:', error)
    return null
  }
}

const incrementCacheCount = () => {
  try {
    const count = parseInt(localStorage.getItem(CACHE_COUNT_KEY) || '0')
    localStorage.setItem(CACHE_COUNT_KEY, (count + 1).toString())
  } catch (error) {
    console.error('Error incrementing cache count:', error)
  }
}

const decrementCacheCount = () => {
  try {
    const count = parseInt(localStorage.getItem(CACHE_COUNT_KEY) || '0')
    if (count > 0) {
      localStorage.setItem(CACHE_COUNT_KEY, (count - 1).toString())
    }
  } catch (error) {
    console.error('Error decrementing cache count:', error)
  }
}

export const cacheResponse = (key, response) => {
  try {
    const data = {
      response,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(data))
    incrementCacheCount()
  } catch (error) {
    console.error('Error caching response:', error)
  }
}

export const getCacheCount = () => {
  try {
    return parseInt(localStorage.getItem(CACHE_COUNT_KEY) || '0')
  } catch (error) {
    console.error('Error getting cache count:', error)
    return 0
  }
}

export const clearCache = () => {
  try {
    // Remove all cache entries
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(IDEMPOTENCY_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    // Reset count
    localStorage.setItem(CACHE_COUNT_KEY, '0')
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

export const makeNormalRequest = async (url, data, options = {}) => {
  const idempotencyKey = generateIdempotencyKey(data)
  
  const response = await fetch(url, {
    method: 'POST',
    ...options,
    headers: {
      ...options.headers,
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const responseData = await response.json()
  const responseWithTimestamp = Object.assign({}, responseData, {
    timestamp: new Date().toISOString()
  })
  return Object.assign({}, { isCached: false }, responseWithTimestamp)
}

export const makeIdempotentRequest = async (url, data, options = {}) => {
  const idempotencyKey = generateIdempotencyKey(data)
  const cachedResponse = getCachedResponse(idempotencyKey)
  
  if (cachedResponse) {
    return Object.assign({}, { isCached: true }, cachedResponse)
  }

  const response = await fetch(url, {
    method: 'POST',
    ...options,
    headers: {
      ...options.headers,
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const responseData = await response.json()
  const responseWithTimestamp = Object.assign({}, responseData, {
    timestamp: new Date().toISOString()
  })
  cacheResponse(idempotencyKey, responseWithTimestamp)
  
  return Object.assign({}, { isCached: false }, responseWithTimestamp)
} 