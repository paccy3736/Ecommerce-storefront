import { useState } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { isValidEmail } from '../../utils/validators'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errors: { email?: string; password?: string } = {}
    if (!email) errors.email = 'Email is required'
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    try {
      await login({ email, password })
      onSuccess?.()
    } catch {
      // error is in store
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <p id="login-email-error" className="mt-1 text-xs text-red-600" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
          aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <p id="login-password-error" className="mt-1 text-xs text-red-600" role="alert">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        aria-busy={isLoading}
      >
        {isLoading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}
