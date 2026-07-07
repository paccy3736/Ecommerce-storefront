/**
 * Returns true if email is a valid RFC 5322-like format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Returns true if password meets minimum requirements (min 6 chars).
 */
export function isValidPassword(pwd: string): boolean {
  return pwd.length >= 6
}

/**
 * Returns true if name meets minimum requirements (min 2 chars, non-empty after trim).
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2
}
