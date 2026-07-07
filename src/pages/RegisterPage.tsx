import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuthStore } from '../store/auth.store'

export default function RegisterPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSuccess = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">🛍️</span>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-1 text-sm text-gray-500">Join E-Comus today</p>
          </div>

          <RegisterForm onSuccess={handleSuccess} />

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
