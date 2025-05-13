import '../../test/setup'
import React from 'react'
import { render, screen } from '@testing-library/react'
import RequestHistory from './RequestHistory'
import { describe, it, expect } from 'vitest'
import { MantineProvider } from '@mantine/core'

describe('RequestHistory', () => {
  it('shows no requests message when empty', () => {
    render(
      <MantineProvider>
        <RequestHistory history={[]} />
      </MantineProvider>
    )
    expect(screen.getByText(/No requests yet/i)).toBeInTheDocument()
  })
  it('renders request items', () => {
    const history = [
      { id: '1', data: 'foo', status: 'success' },
      { id: '2', data: 'bar', status: 'failed' }
    ]
    render(
      <MantineProvider>
        <RequestHistory history={history} />
      </MantineProvider>
    )
    expect(screen.getByText(/foo/i)).toBeInTheDocument()
    expect(screen.getByText(/bar/i)).toBeInTheDocument()
  })
}) 