import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { components } from '../../types/api.generated'
import { createHero, deactivateHero, healHero, heroQueryKeys, type Hero, type HeroCreateInput, type HeroUpdateInput, updateHero } from './heroesApi'

export function heroErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback
  return (error.response?.data as components['schemas']['Error'] | undefined)?.message ?? fallback
}

export function heroValidationErrors(error: unknown): Record<string, string> {
  if (!isAxiosError(error) || error.response?.status !== 422) return {}
  const errors = (error.response.data as components['schemas']['ValidationError'] | undefined)?.errors
  return Object.fromEntries(Object.entries(errors ?? {}).map(([field, messages]) => [field, messages[0] ?? 'Invalid value.']))
}

export function useHeroMutations(heroId?: string) {
  const queryClient = useQueryClient()

  function refreshHero(hero: Hero) {
    queryClient.setQueryData(heroQueryKeys.detail(String(hero.id)), hero)
    queryClient.setQueryData(['admin', 'heroes', 'detail', String(hero.id)], hero)
    void queryClient.invalidateQueries({ queryKey: ['heroes', 'roster'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'heroes'] })
    void queryClient.invalidateQueries({ queryKey: ['guild', 'heroes'] })
  }

  const createMutation = useMutation({
    mutationFn: (input: HeroCreateInput) => createHero(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['heroes', 'roster'] })
      void queryClient.invalidateQueries({ queryKey: ['guild', 'heroes'] })
    },
  })
  const updateMutation = useMutation({ mutationFn: (input: HeroUpdateInput) => updateHero(heroId ?? '', input), onSuccess: refreshHero })
  const healMutation = useMutation({ mutationFn: () => healHero(heroId ?? ''), onSuccess: refreshHero })
  const deactivateMutation = useMutation({ mutationFn: () => deactivateHero(heroId ?? ''), onSuccess: refreshHero })

  return { createMutation, updateMutation, healMutation, deactivateMutation }
}
