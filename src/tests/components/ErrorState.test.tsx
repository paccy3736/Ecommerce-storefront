import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorState } from '../../components/common/ErrorState'
import { EmptyState } from '../../components/common/EmptyState'

const wrap = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>)

describe('ErrorState', () => {
  it('renders default message', () => {
    wrap(<ErrorState />)
    expect(screen.getByText(/something went wrong/i)).toBeDefined()
  })

  it('renders custom message', () => {
    wrap(<ErrorState message="Product not found" />)
    expect(screen.getByText('Product not found')).toBeDefined()
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = vi.fn()
    wrap(<ErrorState onRetry={onRetry} />)
    const btn = screen.getByText('Try Again')
    fireEvent.click(btn)
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('renders action link when actionLabel and actionHref are provided', () => {
    wrap(<ErrorState actionLabel="Go Home" actionHref="/" />)
    expect(screen.getByText('Go Home')).toBeDefined()
  })
})

describe('EmptyState', () => {
  it('renders message', () => {
    wrap(<EmptyState message="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeDefined()
  })

  it('renders action link', () => {
    wrap(<EmptyState message="Empty" actionLabel="Shop Now" actionHref="/" />)
    expect(screen.getByText('Shop Now')).toBeDefined()
  })

  it('renders custom icon', () => {
    wrap(<EmptyState message="Test" icon="🎉" />)
    expect(screen.getByText('🎉')).toBeDefined()
  })
})
