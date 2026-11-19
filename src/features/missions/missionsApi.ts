import { apiClient } from '../../lib/api/client'
import type { components } from '../../types/api.generated'

export type Mission = components['schemas']['Mission']
export type MissionCreateInput = components['schemas']['MissionCreateRequest']

export async function createMission(input: MissionCreateInput) {
  const { data } = await apiClient.post<components['schemas']['MissionCreatedResponse']>('/missions', input)
  return data.data
}
