import { v4 as uuidv4 } from 'uuid'

const IDEMPOTENCY_KEY_PREFIX = 'idempotency_'

export const generateIdempotencyKey = () => {
  return `${IDEMPOTENCY_KEY_PREFIX}${uuidv4()}`
}

export const getCachedResponse = (key) => {
  const cachedData = localStorage.getItem(key)
  if (!cachedData) return null
  
  try {
    const { response, timestamp } = JSON.parse(cachedData)
    // Cache expires after 24 hours
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key)
      return null
    }
    return response
  } catch (error) {
    console.error('Error parsing cached response:', error)
    return null
  }
}

export const cacheResponse = (key, response) => {
  try {
    const data = {
      response,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error caching response:', error)
  }
}

export const makeIdempotentRequest = async (url, data, options = {}) => {
  const idempotencyKey = generateIdempotencyKey()
  const cachedResponse = getCachedResponse(idempotencyKey)
  
  if (cachedResponse) {
    return cachedResponse
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
  cacheResponse(idempotencyKey, responseData)
  
  return responseData
} 