import React from 'react'
import { useState } from 'react'
import { Container, Title, Stack } from '@mantine/core'
import IdempotentForm from '../components/IdempotentForm/IdempotentForm'
import RequestHistory from '../components/RequestHistory/RequestHistory'
import CacheStatus from '../components/CacheStatus/CacheStatus'
import { useIdempotentRequest } from '../hooks/useIdempotentRequest'
import { useRequestCache } from '../hooks/useRequestCache'
import { useIdempotencyKey } from '../hooks/useIdempotencyKey'

/**
 * Main demo page component
 */
export default function Home() {
  const [history, setHistory] = useState([])
  const { makeRequest } = useIdempotentRequest()
  const { getCachedResponse, setCachedResponse, getCacheCount } = useRequestCache()
  const { generateKey } = useIdempotencyKey()

  /**
   * Handle form submission
   * @param {string} data - Form data
   */
  const handleSubmit = async (data) => {
    console.log('Handling form submission:', data)
    const idempotencyKey = generateKey(data)
    
    // Check cache first
    const cachedResponse = getCachedResponse(idempotencyKey)
    if (cachedResponse) {
      console.log('Using cached response:', cachedResponse)
      setHistory(prev => [...prev, {
        id: idempotencyKey,
        data,
        status: 'cached'
      }])
      return
    }

    try {
      // Make request
      const response = await makeRequest('/api/test', {
        method: 'POST',
        idempotencyKey,
        body: JSON.stringify({ data })
      })

      // Cache successful response
      setCachedResponse(idempotencyKey, response)
      
      // Update history
      setHistory(prev => [...prev, {
        id: idempotencyKey,
        data,
        status: 'success'
      }])
    } catch (error) {
      console.error('Request failed:', error)
      setHistory(prev => [...prev, {
        id: idempotencyKey,
        data,
        status: 'failed'
      }])
    }
  }

  return (
    <Container size="sm" py="xl">
      <Stack spacing="xl">
        <Title order={1} align="center">Idempotent Requests Demo</Title>
        <IdempotentForm onSubmit={handleSubmit} />
        <CacheStatus isCached={getCacheCount() > 0} cacheCount={getCacheCount()} />
        <RequestHistory history={history} />
      </Stack>
    </Container>
  )
} 