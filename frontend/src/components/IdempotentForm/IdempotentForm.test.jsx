import '../../test/setupTests.js'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import IdempotentForm from './IdempotentForm'
import { describe, it, expect, vi } from 'vitest'
import { MantineProvider } from '@mantine/core'

describe('IdempotentForm', () => {
  it('renders and submits form', () => {
    const handleSubmit = vi.fn()
    render(
      <MantineProvider>
        <IdempotentForm onSubmit={handleSubmit} />
      </MantineProvider>
    )
    const input = screen.getByLabelText(/Request Data/i)
    fireEvent.change(input, { target: { value: 'test data' } })
    fireEvent.submit(screen.getByRole('button', { name: /send/i }))
    expect(handleSubmit).toHaveBeenCalledWith('test data')
  })
}) 