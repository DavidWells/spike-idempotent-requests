/**
 * Hook for making idempotent API requests
 * @returns {Object} Request utilities
 */
export function useIdempotentRequest() {
  /**
   * Make an idempotent request
   * @param {string} url - API endpoint
   * @param {Object} options - Request options
   * @param {string} options.idempotencyKey - Unique key for request
   * @returns {Promise<Object>} Response data
   */
  const makeRequest = async (url, { idempotencyKey, ...options } = {}) => {
    console.log('Making idempotent request:', { url, idempotencyKey })
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Idempotency-Key': idempotencyKey
      }
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`)
    }

    return response.json()
  }

  return { makeRequest }
} 