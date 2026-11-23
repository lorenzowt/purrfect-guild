import { apiClient } from '../../lib/api/client'
import type { components } from '../../types/api.generated'

export type Quest = components['schemas']['Quest']
export type PaginatedQuests = components['schemas']['PaginatedQuestsResponse']

const boardPageSize = 8

export const questQueryKeys = {
  board: (pageUrl?: string) => ['quests', 'board', pageUrl ?? 'first'] as const,
  detail: (questId: string) => ['quests', 'detail', questId] as const,
}

/** Uses links returned by Laravel so pagination remains compatible with the API contract. */
export async function getQuests(pageUrl?: string) {
  const { data } = await apiClient.get<PaginatedQuests>(
    pageUrl ?? '/quests',
    pageUrl ? undefined : { params: { per_page: boardPageSize } },
  )
  return data
}

export async function getQuest(questId: string) {
  const { data } = await apiClient.get<components['schemas']['QuestResponse']>(`/quests/${questId}`)
  return data.data
}
