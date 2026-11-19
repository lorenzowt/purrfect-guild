import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import { HeroPortrait } from '../heroes/HeroPortrait'
import type { Mission } from './missionsApi'
import { formatMissionDate, formatMissionStatus, missionStatusVariant } from './missionPresentation'

export function MissionCard({ mission }: { mission: Mission }) {
  return (
    <Link className="mission-entry flex h-full flex-col" to={`/missions/${mission.id}`} aria-label={`Open mission ${mission.id} journal entry`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-bold text-cocoa-plum/70">Quest</p>
        <Badge variant={missionStatusVariant[mission.status]}>Status: {formatMissionStatus(mission.status)}</Badge>
      </div>
      <h2 className="pixel-heading mt-3 text-xs leading-6">{mission.quest?.title ?? 'Quest record unavailable'}</h2>
      <p className="mt-4 text-sm font-bold">Adventurers</p>
      <HeroNames heroes={mission.heroes} />
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t-2 border-dashed border-soft-caramel pt-4 text-sm">
        <div><dt className="font-bold text-cocoa-plum/75">Created</dt><dd className="mt-1">{formatMissionDate(mission.created_at)}</dd></div>
        <div><dt className="font-bold text-cocoa-plum/75">Completed</dt><dd className="mt-1">{formatMissionDate(mission.completed_at)}</dd></div>
      </dl>
      {mission.status === 'assigned' && <span className="mission-entry__complete mt-5">Complete quest</span>}
    </Link>
  )
}

export function HeroNames({ heroes }: { heroes: Mission['heroes'] }) {
  if (heroes.length === 0) return <p className="mt-2 text-sm text-cocoa-plum/75">No adventurers are recorded for this mission.</p>
  return <ul className="mt-2 flex flex-wrap gap-2" aria-label="Assigned adventurers">{heroes.map((hero) => <li key={hero.id} className="mission-hero-name"><HeroPortrait hero={hero} size="xs" />{hero.name}</li>)}</ul>
}
