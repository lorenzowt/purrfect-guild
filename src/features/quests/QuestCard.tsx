import { Badge, Button } from '../../components/ui'
import type { Quest } from './questsApi'

interface QuestCardProps {
  quest: Quest
  onInspect: (questId: string) => void
}

export function QuestCard({ quest, onInspect }: QuestCardProps) {
  return (
    <article className="quest-notice" aria-labelledby={`quest-${quest.id}-title`}>
      <div className="flex items-start justify-between gap-3">
        <h2 id={`quest-${quest.id}-title`} className="pixel-heading text-xs leading-6">{quest.title}</h2>
        <Badge variant="magic" className="justify-center text-center">Difficulty {quest.difficulty}/10</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-cocoa-plum/85">{quest.description}</p>
      <dl className="mt-5 border-t-2 border-dashed border-soft-caramel pt-3 text-sm">
        <div className="flex justify-between gap-4"><dt className="font-bold">Boss</dt><dd>{quest.boss}</dd></div>
      </dl>
      <Button className="mt-5 w-full" size="sm" onClick={() => onInspect(String(quest.id))}>Inspect quest</Button>
    </article>
  )
}
