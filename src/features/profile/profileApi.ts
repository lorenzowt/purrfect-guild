import type { components } from '../../types/api.generated'
import { apiClient } from '../../lib/api/client'

export type Profile = components['schemas']['User']
export type ProfileUpdateInput = components['schemas']['ProfileUpdateRequest']

export const profileQueryKeys = {
  current: ['auth', 'user'] as const,
}

export async function getProfile() {
  const { data } = await apiClient.get<components['schemas']['UserResponse']>('/users/me')
  return data.data
}

export async function updateProfile(input: ProfileUpdateInput) {
  const { data } = await apiClient.patch<components['schemas']['UserResponse']>('/users/me', input)
  return data.data
}
