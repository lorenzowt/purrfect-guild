import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { QuestCard } from './QuestCard'
import { QuestDetailsDialog } from './QuestDetailsDialog'
import { getQuests, questQueryKeys } from './questsApi'

export function QuestBoardPage() {
  const [pageUrl, setPageUrl] = useState<string | undefined>()
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null)
  const questsQuery = useQuery({ queryKey: questQueryKeys.board(pageUrl), queryFn: () => getQuests(pageUrl) })

  if (questsQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Pinning up available quests…" size="lg" /></section>

  if (questsQuery.isError || !questsQuery.data) {
    return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">The quest board is being repaired</h1><p className="mt-4 text-cocoa-plum/80">We could not retrieve the available adventures. Please try again.</p><Button className="mt-5" onClick={() => void questsQuery.refetch()}>Try again</Button></Panel>
  }

  const { data: quests, links, meta } = questsQuery.data
  return (
    <section className="collection-page quest-board mx-auto max-w-7xl" aria-labelledby="quest-board-heading">
      <header className="quest-board__header">
        <p className="font-bold text-vanilla-cream/85">Fresh adventures, pinned with care</p>
        <h1 id="quest-board-heading" className="pixel-heading mt-2 text-sm text-vanilla-cream sm:text-xl">Quest Board</h1>
      </header>

      {quests.length === 0 ? (
        <div className="quest-board__empty"><EmptyState title="No quests on the board" description="The ink is still drying. Check back when the guild receives its next call for brave whiskers." /></div>
      ) : (
        <div className="quest-board__notices">
          {quests.map((quest) => <QuestCard key={quest.id} quest={quest} onInspect={setSelectedQuestId} />)}
        </div>
      )}

      {quests.length > 0 && <nav className="mt-8 flex flex-wrap items-center justify-between gap-4 text-vanilla-cream" aria-label="Quest board pages">
        <p className="text-sm font-bold">Page {meta.current_page ?? 1}{meta.last_page ? ` of ${meta.last_page}` : ''}</p>
        <div className="flex gap-3">
          <Button variant="secondary" disabled={!links.prev} onClick={() => setPageUrl(links.prev ?? undefined)}>Previous</Button>
          <Button disabled={!links.next} onClick={() => setPageUrl(links.next ?? undefined)}>Next</Button>
        </div>
      </nav>}
      <QuestDetailsDialog questId={selectedQuestId} onClose={() => setSelectedQuestId(null)} />
    </section>
  )
}
