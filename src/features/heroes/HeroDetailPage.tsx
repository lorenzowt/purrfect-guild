import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, LoadingIndicator, Panel } from '../../components/ui'
import { heroClassLabel, HeroPortrait } from './HeroPortrait'
import { getHero, heroQueryKeys } from './heroesApi'

const statusLabels = { available: 'Available', on_mission: 'On mission', injured: 'Injured', deactivated: 'Retired' } as const

export function HeroDetailPage() {
  const { heroId } = useParams()
  const heroQuery = useQuery({ queryKey: heroQueryKeys.detail(heroId ?? ''), queryFn: () => getHero(heroId ?? ''), enabled: Boolean(heroId) })

  if (heroQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Opening the adventurer ledger…" size="lg" /></section>
  if (heroQuery.isError || !heroQuery.data) return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">This adventurer is hard to find</h1><p className="mt-4 text-cocoa-plum/80">Their ledger entry could not be opened.</p><Button className="mt-5" onClick={() => void heroQuery.refetch()}>Try again</Button><Link to="/heroes" className="ml-4 font-bold text-cocoa-plum underline">Return to roster</Link></Panel>

  const hero = heroQuery.data
  return (
    <section className="mx-auto max-w-3xl" aria-labelledby="hero-detail-heading">
      <Link className="font-bold text-cocoa-plum underline" to="/heroes">← Back to Adventurers’ Corner</Link>
      <Panel className="mt-5 overflow-hidden p-0">
        <div className="grid md:grid-cols-[15rem_1fr]">
          <div className="hero-detail-portrait grid place-items-center border-b-2 border-soft-caramel p-8 md:border-r-2 md:border-b-0"><HeroPortrait hero={hero} size="lg" /></div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-cocoa-plum/70">Guild adventurer</p><h1 id="hero-detail-heading" className="pixel-heading mt-2 text-base sm:text-lg">{hero.name}</h1></div><Badge variant={hero.status}>{statusLabels[hero.status]}</Badge></div>
            <dl className="mt-7 grid gap-4 sm:grid-cols-2"><Detail label="Class" value={heroClassLabel(hero.hero_class)} /><Detail label="Level" value={hero.level} /><Detail label="Status" value={statusLabels[hero.status]} /></dl>
            <p className="mt-8 text-sm text-cocoa-plum/70">Management actions will appear here once the adventurer workshop opens.</p>
          </div>
        </div>
      </Panel>
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-soft-caramel/25 p-4"><dt className="text-sm font-bold text-cocoa-plum/70">{label}</dt><dd className="mt-1 font-extrabold">{value}</dd></div>
}
