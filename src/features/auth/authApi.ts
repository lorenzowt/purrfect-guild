import { isAxiosError } from 'axios'
import type { components } from '../../types/api.generated'
import { apiClient } from '../../lib/api/client'

export type LoginInput = components['schemas']['LoginRequest']
export type RegisterInput = components['schemas']['RegisterRequest']
export type AuthUser = components['schemas']['User']

export async function register(input: RegisterInput) {
  const { data } = await apiClient.post<AuthUser>('/register', input)
  return data
}

export async function login(input: LoginInput) {
  const { data } = await apiClient.post<components['schemas']['AuthToken']>('/login', input)
  return data
}

export async function logout() {
  const { data } = await apiClient.post<components['schemas']['MessageResponse']>('/logout')
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<components['schemas']['UserResponse']>('/users/me')
  return data.data
}

export function validationErrors(error: unknown): Record<string, string> {
  if (!isAxiosError(error) || error.response?.status !== 422) return {}
  const errors = (error.response.data as components['schemas']['ValidationError'] | undefined)?.errors
  return Object.fromEntries(Object.entries(errors ?? {}).map(([field, messages]) => [field, messages[0] ?? 'Invalid value.']))
}

export function apiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback
  const message = (error.response?.data as components['schemas']['Error'] | undefined)?.message
  return message ?? fallback
}
