import type { components } from '../../types/api.generated'
import { apiClient } from '../../lib/api/client'

export type Hero = components['schemas']['Hero']
export type PaginatedHeroes = components['schemas']['PaginatedHeroesResponse']

const rosterPageSize = 12

export const heroQueryKeys = {
  roster: (pageUrl?: string) => ['heroes', 'roster', pageUrl ?? 'first'] as const,
  detail: (heroId: string) => ['heroes', 'detail', heroId] as const,
}

/** Follows the API pagination URLs instead of assuming an undocumented page parameter. */
export async function getHeroes(pageUrl?: string) {
  const { data } = await apiClient.get<PaginatedHeroes>(pageUrl ?? '/heroes', pageUrl ? undefined : { params: { per_page: rosterPageSize } })
  return data
}

export async function getHero(heroId: string) {
  const { data } = await apiClient.get<components['schemas']['HeroResponse']>(`/heroes/${heroId}`)
  return data.data
}
