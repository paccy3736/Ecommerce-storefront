import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidPassword, isValidName } from '../../utils/validators'

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('user+tag@domain.co.uk')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('accepts passwords >= 6 chars', () => {
    expect(isValidPassword('abc123')).toBe(true)
    expect(isValidPassword('longpassword')).toBe(true)
  })

  it('rejects passwords < 6 chars', () => {
    expect(isValidPassword('')).toBe(false)
    expect(isValidPassword('abc')).toBe(false)
    expect(isValidPassword('12345')).toBe(false)
  })
})

describe('isValidName', () => {
  it('accepts names with 2+ non-whitespace chars', () => {
    expect(isValidName('Jo')).toBe(true)
    expect(isValidName('John Doe')).toBe(true)
  })

  it('rejects names that are too short', () => {
    expect(isValidName('')).toBe(false)
    expect(isValidName('J')).toBe(false)
    expect(isValidName('  ')).toBe(false)
  })
})
