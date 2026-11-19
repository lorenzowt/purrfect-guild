import { useState } from 'react'
import { Button, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { useQuery } from '@tanstack/react-query'
import { HeroCard } from './HeroCard'
import { getHeroes, heroQueryKeys } from './heroesApi'

export function HeroRosterPage() {
  const [pageUrl, setPageUrl] = useState<string | undefined>()
  const heroesQuery = useQuery({ queryKey: heroQueryKeys.roster(pageUrl), queryFn: () => getHeroes(pageUrl) })

  if (heroesQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Gathering your adventurers…" size="lg" /></section>

  if (heroesQuery.isError || !heroesQuery.data) {
    return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">The roster is out on patrol</h1><p className="mt-4 text-cocoa-plum/80">We could not open the adventurer ledger. Please try again.</p><Button className="mt-5" onClick={() => void heroesQuery.refetch()}>Try again</Button></Panel>
  }

  const { data: heroes, meta, links } = heroesQuery.data
  if (heroes.length === 0) return <EmptyState title="No adventurers yet" description="Your first kitten hero will appear here after recruitment. For now, the corner is wonderfully quiet." />

  return (
    <section className="mx-auto max-w-7xl" aria-labelledby="hero-roster-heading">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-bold text-cocoa-plum/70">Meet the brave whiskers of your guild</p><h1 id="hero-roster-heading" className="pixel-heading mt-2 text-base sm:text-xl">Adventurers’ Corner</h1></div>
        {typeof meta.total === 'number' && <p className="rounded-full bg-soft-caramel/45 px-3 py-1 text-sm font-bold">{meta.total} {meta.total === 1 ? 'adventurer' : 'adventurers'}</p>}
      </header>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {heroes.map((hero) => <HeroCard key={hero.id} hero={hero} />)}
      </div>
      <nav className="mt-8 flex flex-wrap items-center justify-between gap-4" aria-label="Hero roster pages">
        <p className="text-sm font-bold text-cocoa-plum/75">Page {meta.current_page ?? 1}{meta.last_page ? ` of ${meta.last_page}` : ''}</p>
        <div className="flex gap-3">
          <Button variant="secondary" disabled={!links.prev} onClick={() => setPageUrl(links.prev ?? undefined)}>Previous</Button>
          <Button disabled={!links.next} onClick={() => setPageUrl(links.next ?? undefined)}>Next</Button>
        </div>
      </nav>
    </section>
  )
}
