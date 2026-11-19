import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

let accessToken: string | null = null
let unauthorizedHandler: (() => void) | undefined

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { Accept: 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) unauthorizedHandler?.()
    return Promise.reject(error)
  },
)

export function setAccessToken(token: string) {
  accessToken = token
}

export function clearAccessToken() {
  accessToken = null
}

export function setUnauthorizedHandler(handler: (() => void) | undefined) {
  unauthorizedHandler = handler
}
