import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Badge, Dialog, LoadingIndicator, Panel } from '../../components/ui'
import { getQuest, questQueryKeys } from './questsApi'

interface QuestDetailsDialogProps {
  questId: string | null
  onClose: () => void
}

export function QuestDetailsDialog({ questId, onClose }: QuestDetailsDialogProps) {
  const questQuery = useQuery({
    queryKey: questQueryKeys.detail(questId ?? ''),
    queryFn: () => getQuest(questId!),
    enabled: Boolean(questId),
  })

  const quest = questQuery.data
  return (
    <Dialog
      open={Boolean(questId)}
      title={quest?.title ?? 'Quest details'}
      onClose={onClose}
      footer={quest ? <Link className="quest-action-link" to={`/quests/${quest.id}/party`} onClick={onClose}>Assemble your party</Link> : undefined}
    >
      {questQuery.isPending && <div className="grid min-h-36 place-items-center"><LoadingIndicator label="Unrolling quest notice…" /></div>}
      {questQuery.isError && (
        <Panel className="text-center">
          <p className="font-bold">This notice slipped off the board.</p>
          <p className="mt-2 text-sm text-cocoa-plum/80">Please close it and try again.</p>
        </Panel>
      )}
      {quest && (
        <div className="space-y-5">
          <p className="leading-7">{quest.description}</p>
          <dl className="grid gap-3 rounded-panel border-2 border-soft-caramel bg-soft-caramel/20 p-4 sm:grid-cols-2">
            <div><dt className="text-sm font-bold">Boss</dt><dd className="mt-1">{quest.boss}</dd></div>
            <div><dt className="text-sm font-bold">Challenge</dt><dd className="mt-1"><Badge variant="magic">Difficulty {quest.difficulty}/10</Badge></dd></div>
          </dl>
        </div>
      )}
    </Dialog>
  )
}
