import { apiClient } from '../../lib/api/client'
import type { components } from '../../types/api.generated'

export type Mission = components['schemas']['Mission']
export type MissionCreateInput = components['schemas']['MissionCreateRequest']

export type PaginatedMissions = components['schemas']['PaginatedMissionsResponse']

const journalPageSize = 12

export const missionQueryKeys = {
  journal: (pageUrl?: string) => ['missions', 'journal', pageUrl ?? 'first'] as const,
  detail: (missionId: string) => ['missions', 'detail', missionId] as const,
}

/** Follows Laravel pagination links rather than assuming an undocumented page parameter. */
export async function getMissions(pageUrl?: string) {
  const { data } = await apiClient.get<PaginatedMissions>(
    pageUrl ?? '/missions',
    pageUrl ? undefined : { params: { per_page: journalPageSize } },
  )
  return data
}

export async function getMission(missionId: string) {
  const { data } = await apiClient.get<components['schemas']['MissionResponse']>(`/missions/${missionId}`)
  return data.data
}

export async function completeMission(missionId: string) {
  const { data } = await apiClient.post<components['schemas']['MissionResponse']>(`/missions/${missionId}/complete`)
  return data.data
}

export async function cancelMission(missionId: string) {
  const { data } = await apiClient.post<components['schemas']['MissionResponse']>(`/missions/${missionId}/cancel`)
  return data.data
}

export async function createMission(input: MissionCreateInput) {
  const { data } = await apiClient.post<components['schemas']['MissionCreatedResponse']>('/missions', input)
  return data.data
}
