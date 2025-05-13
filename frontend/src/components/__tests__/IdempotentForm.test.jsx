import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import IdempotentForm from '../IdempotentForm'
import { makeIdempotentRequest } from '../../utils/idempotency'
import { getCacheSize, clearCache } from '../../utils/cache'

// Mock the idempotency and cache utilities
vi.mock('../../utils/idempotency', () => ({
  makeIdempotentRequest: vi.fn()
}))

vi.mock('../../utils/cache', () => ({
  getCacheSize: vi.fn(),
  clearCache: vi.fn()
}))

describe('IdempotentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getCacheSize.mockReturnValue(0)
  })

  it('renders form with all required fields', () => {
    render(<IdempotentForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('validates form fields', async () => {
    render(<IdempotentForm />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockResponse = { success: true }
    makeIdempotentRequest.mockResolvedValueOnce(mockResponse)
    
    render(<IdempotentForm />)
    
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
      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument()
    })
  })

  it('handles form submission error', async () => {
    const errorMessage = 'Network error'
    makeIdempotentRequest.mockRejectedValueOnce(new Error(errorMessage))
    
    render(<IdempotentForm />)
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('clears cache when clear cache button is clicked', async () => {
    getCacheSize.mockReturnValue(2)
    
    render(<IdempotentForm />)
    
    const clearCacheButton = screen.getByRole('button', { name: /clear cache/i })
    fireEvent.click(clearCacheButton)

    expect(clearCache).toHaveBeenCalled()
    expect(screen.getByText(/cache size: 0/i)).toBeInTheDocument()
  })

  it('disables clear cache button when cache is empty', () => {
    getCacheSize.mockReturnValue(0)
    
    render(<IdempotentForm />)
    
    const clearCacheButton = screen.getByRole('button', { name: /clear cache/i })
    expect(clearCacheButton).toBeDisabled()
  })
}) 