import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMission, type MissionCreateInput } from './missionsApi'

export function useMissionCreation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: MissionCreateInput) => createMission(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['heroes', 'roster'] })
      void queryClient.invalidateQueries({ queryKey: ['heroes', 'detail'] })
      void queryClient.invalidateQueries({ queryKey: ['guild', 'heroes'] })
      void queryClient.invalidateQueries({ queryKey: ['missions'] })
      void queryClient.invalidateQueries({ queryKey: ['guild', 'missions'] })
    },
  })
}
