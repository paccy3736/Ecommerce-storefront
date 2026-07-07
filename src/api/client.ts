import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach JWT Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Import dynamically to avoid circular dependency
    const storedData = localStorage.getItem('ecomus_auth_token')
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as { state?: { token?: string } }
        const token = parsed?.state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {
        // ignore parse errors
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

const PRODUCT_IMAGE_FALLBACKS: Record<string, string[]> = {
  'classic white t-shirt': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
  ],
  'silk scarf': [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80'
  ],
  'knit beanie': [
    'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80'
  ],
  'linen shirt': [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1620012253295-c05cb12de1ad?auto=format&fit=crop&w=600&q=80'
  ],
  'floral summer dress': [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80'
  ],
  'leather crossbody bag': [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
  ],
  'running sneakers': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
  ],
  'slim fit jeans': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80'
  ],
  'denim jacket': [
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80'
  ],
  'stainless steel watch': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80'
  ],
  'wool blend coat': [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80'
  ],
  'chelsea boots': [
    'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80'
  ]
}

function populateImagesDeep(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(populateImagesDeep)
  }

  // If this object represents a product
  if (typeof obj.name === 'string' && Array.isArray(obj.images) && obj.id) {
    if (obj.images.length === 0 || !obj.images[0]) {
      const key = obj.name.toLowerCase().trim()
      const fallbacks = PRODUCT_IMAGE_FALLBACKS[key] ?? [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'
      ]
      obj.images = fallbacks
    }
  }

  for (const key of Object.keys(obj)) {
    obj[key] = populateImagesDeep(obj[key])
  }

  return obj
}

// Response interceptor: handle 401 and normalize errors
apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = populateImagesDeep(response.data)
    }
    return response
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecomus_auth_token')
      window.location.href = '/login'
    }
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred'
    return Promise.reject(new ApiError(message, error.response?.status ?? 0))
  }
)

export default apiClient
