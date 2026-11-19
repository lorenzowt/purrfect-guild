import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/ui'
import type { Hero } from './heroesApi'
import { heroClassLabel, HeroPortrait } from './HeroPortrait'

const statusLabels: Record<Hero['status'], string> = {
  available: 'Available',
  on_mission: 'On mission',
  injured: 'Injured',
  deactivated: 'Retired',
}

export function HeroCard({ hero }: { hero: Hero }) {
  return (
    <Card interactive className="flex h-full flex-col bg-vanilla-cream p-4">
      <div className="flex items-start justify-between gap-3">
        <HeroPortrait hero={hero} />
        <Badge variant={hero.status}>{statusLabels[hero.status]}</Badge>
      </div>
      <div className="mt-4 flex-1">
        <h2 className="text-lg font-extrabold">{hero.name}</h2>
        <p className="mt-1 font-bold text-cocoa-plum/75">{heroClassLabel(hero.hero_class)}</p>
        <p className="mt-3 text-sm text-cocoa-plum/80">Level <span className="font-extrabold">{hero.level}</span></p>
      </div>
      <Link className="mt-5 w-fit font-bold text-cocoa-plum underline" to={`/heroes/${hero.id}`}>View adventurer details</Link>
    </Card>
  )
}
