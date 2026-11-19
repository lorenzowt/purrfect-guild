import type { components } from '../../types/api.generated'
import { apiClient } from '../../lib/api/client'

export type AdminUser = components['schemas']['User']
export type AdminQuest = components['schemas']['Quest']
export type AdminHero = components['schemas']['Hero']
export type AdminMission = components['schemas']['Mission']
export type UserUpdateInput = components['schemas']['AdminUserUpdateRequest']
export type QuestInput = components['schemas']['QuestCreateRequest']

export const adminQueryKeys = {
  users: (url?: string) => ['admin', 'users', url ?? 'first'] as const,
  quests: (url?: string) => ['admin', 'quests', url ?? 'first'] as const,
  heroes: (url?: string) => ['admin', 'heroes', url ?? 'first'] as const,
  missions: (url?: string) => ['admin', 'missions', url ?? 'first'] as const,
  heroDetail: (id: string) => ['admin', 'heroes', 'detail', id] as const,
  missionDetail: (id: string) => ['admin', 'missions', 'detail', id] as const,
}

function list<T>(url: string | undefined, path: string) {
  return apiClient.get<T>(url ?? path, url ? undefined : { params: { per_page: 12 } }).then(({ data }) => data)
}

export const getUsers = (url?: string) => list<components['schemas']['PaginatedUsersResponse']>(url, '/users')
export const getAdminQuests = (url?: string) => list<components['schemas']['PaginatedQuestsResponse']>(url, '/quests')
export const getAdminHeroes = (url?: string) => list<components['schemas']['PaginatedHeroesResponse']>(url, '/heroes')
export const getAdminMissions = (url?: string) => list<components['schemas']['PaginatedMissionsResponse']>(url, '/missions')
export async function getAdminHero(id: string) { return (await apiClient.get<components['schemas']['HeroResponse']>(`/heroes/${id}`)).data.data }
export async function getAdminMission(id: string) { return (await apiClient.get<components['schemas']['MissionResponse']>(`/missions/${id}`)).data.data }

export async function updateUser(id: number, input: UserUpdateInput) { return (await apiClient.patch<components['schemas']['UserResponse']>(`/users/${id}`, input)).data.data }
export async function deleteUser(id: number) { return (await apiClient.delete<components['schemas']['MessageResponse']>(`/users/${id}`)).data }
export async function createQuest(input: QuestInput) { return (await apiClient.post<components['schemas']['QuestResponse']>('/quests', input)).data.data }
export async function updateQuest(id: number, input: components['schemas']['QuestUpdateRequest']) { return (await apiClient.patch<components['schemas']['QuestResponse']>(`/quests/${id}`, input)).data.data }
export async function deactivateQuest(id: number) { return (await apiClient.delete<components['schemas']['QuestResponse']>(`/quests/${id}`)).data.data }
