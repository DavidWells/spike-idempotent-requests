/**
 * Hook for managing request cache in localStorage
 * @returns {Object} Cache utilities
 */
export function useRequestCache() {
  const CACHE_KEY = 'idempotent-request-cache'

  /**
   * Get cached response
   * @param {string} key - Cache key
   * @returns {Object|null} Cached response or null
   */
  const getCachedResponse = (key) => {
    console.log('Getting cached response for key:', key)
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
      return cache[key] || null
    } catch (error) {
      console.error('Error reading from cache:', error)
      return null
    }
  }

  /**
   * Set cached response
   * @param {string} key - Cache key
   * @param {Object} response - Response to cache
   */
  const setCachedResponse = (key, response) => {
    console.log('Setting cached response for key:', key)
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
      cache[key] = response
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    } catch (error) {
      console.error('Error writing to cache:', error)
    }
  }

  /**
   * Get cache count
   * @returns {number} Number of cached items
   */
  const getCacheCount = () => {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
      return Object.keys(cache).length
    } catch (error) {
      console.error('Error getting cache count:', error)
      return 0
    }
  }

  return {
    getCachedResponse,
    setCachedResponse,
    getCacheCount
  }
} 