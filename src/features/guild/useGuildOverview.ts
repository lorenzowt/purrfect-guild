import { useQueries } from '@tanstack/react-query'
import { getCurrentUser } from '../auth/authApi'
import { getGuildHeroes, getGuildMissions, getGuildQuests, guildQueryKeys } from './guildApi'

export function useGuildOverview() {
  const [user, heroes, quests, missions] = useQueries({
    queries: [
      { queryKey: ['auth', 'user'], queryFn: getCurrentUser },
      { queryKey: guildQueryKeys.heroes, queryFn: getGuildHeroes },
      { queryKey: guildQueryKeys.quests, queryFn: getGuildQuests },
      { queryKey: guildQueryKeys.missions, queryFn: getGuildMissions },
    ],
  })

  return { user, heroes, quests, missions }
}
