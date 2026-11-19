import type { components } from '../../types/api.generated'
import { apiClient } from '../../lib/api/client'

export type Hero = components['schemas']['Hero']
export type PaginatedHeroes = components['schemas']['PaginatedHeroesResponse']
export type HeroCreateInput = components['schemas']['HeroCreateRequest']
export type HeroUpdateInput = components['schemas']['HeroUpdateRequest']

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

export async function createHero(input: HeroCreateInput) {
  const { data } = await apiClient.post<components['schemas']['HeroResponse']>('/heroes', input)
  return data.data
}

export async function updateHero(heroId: string, input: HeroUpdateInput) {
  const { data } = await apiClient.patch<components['schemas']['HeroResponse']>(`/heroes/${heroId}`, input)
  return data.data
}

export async function healHero(heroId: string) {
  const { data } = await apiClient.post<components['schemas']['HeroResponse']>(`/heroes/${heroId}/heal`)
  return data.data
}

/** The API deactivates this hero; it does not permanently delete the record. */
export async function deactivateHero(heroId: string) {
  const { data } = await apiClient.delete<components['schemas']['HeroResponse']>(`/heroes/${heroId}`)
  return data.data
}
