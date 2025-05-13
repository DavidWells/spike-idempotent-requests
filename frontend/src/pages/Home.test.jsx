import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MantineProvider } from '@mantine/core'
import Home from './Home'
import { useIdempotentRequest } from '../hooks/useIdempotentRequest'
import { useRequestCache } from '../hooks/useRequestCache'
import { useIdempotencyKey } from '../hooks/useIdempotencyKey'

// Mock hooks
const mockMakeRequest = vi.fn()
const mockGetCachedResponse = vi.fn()
const mockSetCachedResponse = vi.fn()
const mockGetCacheCount = vi.fn()
const mockGenerateKey = vi.fn()

vi.mock('../hooks/useIdempotentRequest', () => ({
  useIdempotentRequest: () => ({
    makeRequest: mockMakeRequest
  })
}))

vi.mock('../hooks/useRequestCache', () => ({
  useRequestCache: () => ({
    getCachedResponse: mockGetCachedResponse,
    setCachedResponse: mockSetCachedResponse,
    getCacheCount: mockGetCacheCount
  })
}))

vi.mock('../hooks/useIdempotencyKey', () => ({
  useIdempotencyKey: () => ({
    generateKey: mockGenerateKey
  })
}))

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGenerateKey.mockReturnValue('test-key')
  })

  it('renders all components', () => {
    render(
      <MantineProvider>
        <Home />
      </MantineProvider>
    )

    expect(screen.getByText('Idempotent Requests Demo')).toBeInTheDocument()
    expect(screen.getByLabelText(/Request Data/i)).toBeInTheDocument()
    expect(screen.getByText(/Cache Status/i)).toBeInTheDocument()
    expect(screen.getByText(/Request History/i)).toBeInTheDocument()
  })

  it('handles form submission with cached response', async () => {
    mockGetCachedResponse.mockReturnValue({ data: 'cached' })
    mockGetCacheCount.mockReturnValue(1)

    render(
      <MantineProvider>
        <Home />
      </MantineProvider>
    )

    const input = screen.getByLabelText(/Request Data/i)
    fireEvent.change(input, { target: { value: 'test data' } })
    fireEvent.submit(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText(/test data/i)).toBeInTheDocument()
      expect(screen.getByText(/cached/i)).toBeInTheDocument()
    })
  })

  it('handles form submission with new request', async () => {
    mockGetCachedResponse.mockReturnValue(null)
    mockMakeRequest.mockResolvedValue({ data: 'success' })

    render(
      <MantineProvider>
        <Home />
      </MantineProvider>
    )

    const input = screen.getByLabelText(/Request Data/i)
    fireEvent.change(input, { target: { value: 'test data' } })
    fireEvent.submit(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText(/test data/i)).toBeInTheDocument()
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
}) 