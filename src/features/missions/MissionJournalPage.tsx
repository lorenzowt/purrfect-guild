import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { MissionCard } from './MissionCard'
import { getMissions, missionQueryKeys } from './missionsApi'

export function MissionJournalPage() {
  const [pageUrl, setPageUrl] = useState<string | undefined>()
  const missionsQuery = useQuery({ queryKey: missionQueryKeys.journal(pageUrl), queryFn: () => getMissions(pageUrl) })

  if (missionsQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Opening the mission journal…" size="lg" /></section>
  if (missionsQuery.isError || !missionsQuery.data) return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">The journal is misplaced</h1><p className="mt-4 text-cocoa-plum/80">We could not retrieve your adventures. Please try again.</p><Button className="mt-5" onClick={() => void missionsQuery.refetch()}>Try again</Button></Panel>

  const { data, links, meta } = missionsQuery.data
  const missions = [...data].sort((first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime())
  return (
    <section className="mission-journal mx-auto max-w-7xl" aria-labelledby="mission-journal-heading">
      <header className="mission-journal__header"><p className="font-bold text-cocoa-plum/70">A handwritten account of every brave expedition</p><h1 id="mission-journal-heading" className="pixel-heading mt-2 text-sm sm:text-xl">Mission Journal</h1></header>
      {missions.length === 0 ? <div className="mt-7"><EmptyState title="No adventures recorded" description="Choose a quest and send a party out to begin your guild’s first journal entry." action={<Link className="font-bold text-cocoa-plum underline" to="/quests">Visit the Quest Board</Link>} /></div> : <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{missions.map((mission) => <MissionCard key={mission.id} mission={mission} />)}</div>}
      {missions.length > 0 && <nav className="mt-8 flex flex-wrap items-center justify-between gap-4" aria-label="Mission journal pages"><p className="text-sm font-bold">Page {meta.current_page ?? 1}{meta.last_page ? ` of ${meta.last_page}` : ''}</p><div className="flex gap-3"><Button variant="secondary" disabled={!links.prev} onClick={() => setPageUrl(links.prev ?? undefined)}>Previous</Button><Button disabled={!links.next} onClick={() => setPageUrl(links.next ?? undefined)}>Next</Button></div></nav>}
    </section>
  )
}
