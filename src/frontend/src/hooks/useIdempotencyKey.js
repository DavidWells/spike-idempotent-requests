/**
 * Hook for generating idempotency keys
 * @returns {Object} Key generation utilities
 */
export function useIdempotencyKey() {
  let counter = 0
  let lastTimestamp = 0

  /**
   * Simple string hash function
   * @param {string} str - String to hash
   * @returns {number} Hash value
   */
  const simpleHash = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  /**
   * Generate a unique idempotency key
   * @param {string} data - Request data to hash
   * @returns {string} Unique idempotency key
   */
  const generateKey = (data) => {
    console.log('Generating idempotency key for data:', data)
    const hash = simpleHash(data)
    const timestamp = Date.now()
    
    // If we're in the same millisecond, increment counter
    if (timestamp === lastTimestamp) {
      counter++
    } else {
      counter = 0
      lastTimestamp = timestamp
    }
    
    const negativeHash = -Math.abs(hash)
    return `req_${negativeHash}_${timestamp}_${counter}`
  }

  return { generateKey }
} 