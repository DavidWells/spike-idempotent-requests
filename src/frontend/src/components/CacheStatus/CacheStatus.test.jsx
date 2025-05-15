import React from 'react'
import '@testing-library/jest-dom'
import '../../test/setup'
import { render, screen } from '@testing-library/react'
import CacheStatus from './CacheStatus'
import { describe, it, expect } from 'vitest'
import { MantineProvider } from '@mantine/core'

describe('CacheStatus', () => {
  it('shows inactive badge and zero count by default', () => {
    render(
      <MantineProvider>
        <CacheStatus />
      </MantineProvider>
    )
    
    expect(screen.getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByText('Cached Responses: 0')).toBeInTheDocument()
  })

  it('shows active badge and correct count', () => {
    render(
      <MantineProvider>
        <CacheStatus isCached={true} cacheCount={3} />
      </MantineProvider>
    )
    
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Cached Responses: 3')).toBeInTheDocument()
  })
}) 