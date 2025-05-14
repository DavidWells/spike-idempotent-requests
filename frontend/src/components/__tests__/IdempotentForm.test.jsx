import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MantineProvider } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import IdempotentForm from '../IdempotentForm'
import { makeIdempotentRequest, getCacheCount, clearCache } from '../../utils/idempotency'

// Mock the idempotency utilities
vi.mock('../../utils/idempotency', () => ({
  makeIdempotentRequest: vi.fn(),
  makeNormalRequest: vi.fn(),
  getCacheCount: vi.fn(),
  clearCache: vi.fn()
}))

// Mock notifications
vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn()
  }
}))

const renderWithMantine = (component) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  )
}

describe('IdempotentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCacheCount).mockReturnValue(0)
  })

  it('renders form with all required fields', () => {
    renderWithMantine(<IdempotentForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const mockResponse = { success: true }
    makeIdempotentRequest.mockResolvedValueOnce(mockResponse)
    
    renderWithMantine(<IdempotentForm />)
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(makeIdempotentRequest).toHaveBeenCalledWith(
        expect.any(String),
        {
          name: 'John Doe',
          email: 'john@example.com'
        }
      )
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          color: 'green'
        })
      )
    })
  })

  it('handles form submission error', async () => {
    const errorMessage = 'Network error'
    makeIdempotentRequest.mockRejectedValueOnce(new Error(errorMessage))
    
    renderWithMantine(<IdempotentForm />)
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(notifications.show).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          message: errorMessage,
          color: 'red'
        })
      )
    })
  })

  it('clears cache when clear cache button is clicked', async () => {
    vi.mocked(getCacheCount).mockReturnValue(2)
    
    renderWithMantine(<IdempotentForm />)
    
    const clearCacheButton = screen.getByRole('button', { name: /clear cache/i })
    fireEvent.click(clearCacheButton)

    expect(clearCache).toHaveBeenCalled()
    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Cache Cleared',
        color: 'blue'
      })
    )
  })

  it('disables clear cache button when cache is empty', () => {
    vi.mocked(getCacheCount).mockReturnValue(0)
    
    renderWithMantine(<IdempotentForm />)
    
    const clearCacheButton = screen.getByRole('button', { name: /clear cache/i })
    expect(clearCacheButton).toBeDisabled()
  })
}) 