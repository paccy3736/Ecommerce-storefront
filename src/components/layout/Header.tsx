import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { useCartStore } from '../../store/cart.store'
import { useDebounce } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'

export function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  // Use selectors for stable references — avoids re-render on every cart change
  const toggleDrawer = useCartStore((s) => s.toggleDrawer)
  const cartCount = useCartStore((s) =>
    s.cart ? s.cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 350)

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery('')
      }
    },
    [searchQuery, navigate]
  )

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (debouncedSearch.trim()) {
        navigate(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`)
        setSearchQuery('')
      }
    },
    [debouncedSearch, navigate]
  )

  const handleLogout = useCallback(() => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMobileMenuOpen(false)
  }, [logout, navigate])

  return (
    <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:text-indigo-300 transition-colors flex-shrink-0"
          >
            <span className="text-2xl">🛍️</span>
            <span className="hidden sm:block font-extrabold tracking-tight">E-Comus</span>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                🔍
              </span>
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5" aria-label="Main navigation">
            <Link
              to="/categories"
              className="text-sm text-slate-300 hover:text-white transition-colors font-semibold"
            >
              Categories
            </Link>

            {/* Cart icon */}
            <button
              onClick={toggleDrawer}
              aria-label={`Shopping cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              className="relative p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Auth links */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
                <Link
                  to="/orders"
                  className="text-sm text-slate-300 hover:text-white transition-colors font-semibold"
                >
                  Orders
                </Link>
                <span className="text-sm font-semibold text-indigo-300 truncate max-w-[120px]">
                  {user?.name ?? 'Account'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-rose-400 hover:text-rose-300 transition-colors font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
                <Link
                  to="/login"
                  className="text-sm text-slate-300 hover:text-white transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-900/30 transition-all font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDrawer}
              aria-label={`Cart, ${cartCount} items`}
              className="relative p-2 text-slate-300 hover:text-white"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 text-slate-300 hover:text-white"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-850 py-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="pb-2">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  🔍
                </span>
              </div>
            </form>
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              <Link
                to="/categories"
                className="text-slate-300 hover:text-white font-semibold py-2 px-1 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="text-slate-300 hover:text-white font-semibold py-2 px-1 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-rose-400 hover:text-rose-300 font-semibold py-2 px-1 transition-colors cursor-pointer"
                  >
                    Logout ({user?.name})
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white font-semibold py-2 px-1 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-slate-300 hover:text-white font-semibold py-2 px-1 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
