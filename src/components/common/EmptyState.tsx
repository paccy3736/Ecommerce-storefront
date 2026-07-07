import { Link } from 'react-router-dom'

interface EmptyStateProps {
  message?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  icon?: string
}

export function EmptyState({
  message = 'Nothing here yet.',
  description,
  actionLabel,
  actionHref,
  icon = '📭',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
      {description && <p className="text-gray-500 mb-6 max-w-md">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
