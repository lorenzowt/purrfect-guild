import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelMission, completeMission, missionQueryKeys, type Mission } from './missionsApi'

export function useMissionResolution(missionId: string) {
  const queryClient = useQueryClient()

  function synchronize(mission: Mission) {
    queryClient.setQueryData(missionQueryKeys.detail(String(mission.id)), mission)
    queryClient.setQueryData(['admin', 'missions', 'detail', String(mission.id)], mission)
    void queryClient.invalidateQueries({ queryKey: ['missions'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'missions'] })
    void queryClient.invalidateQueries({ queryKey: ['admin', 'heroes'] })
    void queryClient.invalidateQueries({ queryKey: ['heroes', 'roster'] })
    void queryClient.invalidateQueries({ queryKey: ['heroes', 'detail'] })
    void queryClient.invalidateQueries({ queryKey: ['guild', 'heroes'] })
    void queryClient.invalidateQueries({ queryKey: ['guild', 'missions'] })
  }

  const completeMutation = useMutation({ mutationFn: () => completeMission(missionId), onSuccess: synchronize })
  const cancelMutation = useMutation({ mutationFn: () => cancelMission(missionId), onSuccess: synchronize })
  return { completeMutation, cancelMutation }
}
