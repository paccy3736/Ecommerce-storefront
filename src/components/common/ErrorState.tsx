import { Link } from 'react-router-dom'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  actionLabel?: string
  actionHref?: string
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  actionLabel,
  actionHref,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
        )}
        {actionLabel && actionHref && (
          <Link
            to={actionHref}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
