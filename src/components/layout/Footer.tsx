import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">🛍️ E-Comus</h3>
            <p className="text-sm text-gray-500">Your one-stop shop for everything.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Categories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Register</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">My Orders</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-400">© {year} E-Comus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
