import type { components } from '../../types/api.generated'
import { apiClient } from '../../lib/api/client'

export type GuildHeroes = components['schemas']['PaginatedHeroesResponse']
export type GuildQuests = components['schemas']['PaginatedQuestsResponse']
export type GuildMissions = components['schemas']['PaginatedMissionsResponse']

// This is deliberately a generous page size, not a promise that every record is loaded.
// Status totals are only shown when the response confirms the full collection is present.
const overviewPageSize = 100

export const guildQueryKeys = {
  heroes: ['guild', 'heroes', { perPage: overviewPageSize }] as const,
  quests: ['guild', 'quests', { perPage: overviewPageSize }] as const,
  missions: ['guild', 'missions', { perPage: overviewPageSize }] as const,
}

export async function getGuildHeroes() {
  const { data } = await apiClient.get<GuildHeroes>('/heroes', { params: { per_page: overviewPageSize } })
  return data
}

export async function getGuildQuests() {
  const { data } = await apiClient.get<GuildQuests>('/quests', { params: { per_page: overviewPageSize } })
  return data
}

export async function getGuildMissions() {
  const { data } = await apiClient.get<GuildMissions>('/missions', { params: { per_page: overviewPageSize } })
  return data
}
