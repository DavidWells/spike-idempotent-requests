const CACHE_PREFIX = 'idempotent_cache_'
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export const getCacheKey = (idempotencyKey) => {
  return `${CACHE_PREFIX}${idempotencyKey}`
}

export const getCachedData = (idempotencyKey) => {
  const key = getCacheKey(idempotencyKey)
  const cachedData = localStorage.getItem(key)
  
  if (!cachedData) return null
  
  try {
    const { data, timestamp } = JSON.parse(cachedData)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key)
      return null
    }
    return data
  } catch (error) {
    console.error('Error parsing cached data:', error)
    return null
  }
}

export const setCachedData = (idempotencyKey, data) => {
  const key = getCacheKey(idempotencyKey)
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error caching data:', error)
  }
}

export const clearCache = () => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

export const getCacheSize = () => {
  try {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .length
  } catch (error) {
    console.error('Error getting cache size:', error)
    return 0
  }
} 