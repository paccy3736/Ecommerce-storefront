import { useState } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { isValidEmail, isValidPassword, isValidName } from '../../utils/validators'

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!name) errors.name = 'Name is required'
    else if (!isValidName(name)) errors.name = 'Name must be at least 2 characters'
    if (!email) errors.email = 'Email is required'
    else if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
    if (!password) errors.password = 'Password is required'
    else if (!isValidPassword(password)) errors.password = 'Password must be at least 6 characters'
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
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
      await register({ name, email, password })
      onSuccess?.()
    } catch {
      // error is in store
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className={inputClass('name')}
          aria-invalid={!!fieldErrors.name}
        />
        {fieldErrors.name && <p className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className={inputClass('email')}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && <p className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className={inputClass('password')}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && <p className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.password}</p>}
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          id="reg-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          className={inputClass('confirmPassword')}
          aria-invalid={!!fieldErrors.confirmPassword}
        />
        {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        aria-busy={isLoading}
      >
        {isLoading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}
