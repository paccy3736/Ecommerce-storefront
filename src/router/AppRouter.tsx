import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { Layout } from '../components/layout/Layout'
import SkeletonLoader from '../components/common/SkeletonLoader'

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/HomePage'))
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'))
const CategoryPage = lazy(() => import('../pages/CategoryPage'))
const CategoryProductsPage = lazy(() => import('../pages/CategoryProductsPage'))
const SearchPage = lazy(() => import('../pages/SearchPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const CartPage = lazy(() => import('../pages/CartPage'))
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'))
const OrderHistoryPage = lazy(() => import('../pages/OrderHistoryPage'))
const OrderDetailPage = lazy(() => import('../pages/OrderDetailPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          {/* All routes share the Layout (Header + Footer + CartDrawer) */}
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/categories/:id" element={<CategoryProductsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
