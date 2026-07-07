import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../../router/ProtectedRoute'
import { useAuthStore } from '../../store/auth.store'

const TestChild = () => <div>Protected Content</div>
const LoginPage = () => <div>Login Page</div>

const renderWithRouter = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <TestChild />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Reset auth store state
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false, isLoading: false, error: null })
  })

  it('redirects to /login when unauthenticated', () => {
    renderWithRouter('/protected')
    expect(screen.getByText('Login Page')).toBeDefined()
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('renders children when authenticated', () => {
    useAuthStore.setState({ isAuthenticated: true, token: 'fake-token', user: null, isLoading: false, error: null })
    renderWithRouter('/protected')
    expect(screen.getByText('Protected Content')).toBeDefined()
    expect(screen.queryByText('Login Page')).toBeNull()
  })
})
