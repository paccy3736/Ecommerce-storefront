import apiClient from './client'
import type { RegisterRequest, LoginRequest, AuthResponse, User } from '../types'

export const register = (data: RegisterRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/users/register', data).then((r) => r.data)

export const login = (data: LoginRequest): Promise<AuthResponse> =>
  apiClient.post<AuthResponse>('/api/auth/users/login', data).then((r) => r.data)

export const getMe = (): Promise<User> =>
  apiClient.get<User>('/api/auth/users/me').then((r) => r.data)
