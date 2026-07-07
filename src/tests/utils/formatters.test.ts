import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate, truncate } from '../../utils/formatters'

describe('formatPrice', () => {
  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('formats positive integer', () => {
    expect(formatPrice(100)).toBe('$100.00')
  })

  it('formats decimal price', () => {
    expect(formatPrice(19.99)).toBe('$19.99')
  })

  it('formats large price with comma', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })
})

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-01-15T10:00:00Z')
    expect(result).toContain('2024')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
  })
})

describe('truncate', () => {
  it('returns string unchanged when shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('returns string unchanged when equal to maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('truncates and adds ellipsis when longer', () => {
    const result = truncate('hello world', 8)
    expect(result).toHaveLength(8)
    expect(result.endsWith('...')).toBe(true)
  })
})
