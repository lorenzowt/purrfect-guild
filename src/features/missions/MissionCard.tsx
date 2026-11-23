import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'
import { HeroPortrait } from '../heroes/HeroPortrait'
import type { Mission } from './missionsApi'
import { formatMissionDate, formatMissionStatus, missionStatusVariant } from './missionPresentation'

export function MissionCard({ mission }: { mission: Mission }) {
  const statusLabel = formatMissionStatus(mission.status)

  return (
    <Link className="mission-entry flex flex-col" to={`/missions/${mission.id}`} aria-label={`Open mission ${mission.id} journal entry`}>
      <div className="mission-entry__summary">
        <h2 className="mission-entry__title pixel-heading text-xs leading-6">{mission.quest?.title ?? 'Quest record unavailable'}</h2>
        <Badge variant={missionStatusVariant[mission.status]} aria-label={`Mission status: ${statusLabel}`}>{statusLabel}</Badge>
      </div>
      <HeroNames heroes={mission.heroes} />
      <dl className="mission-entry__dates" aria-label="Mission dates">
        <div><dt>Created</dt><dd>{formatMissionDate(mission.created_at)}</dd></div>
        <div><dt>Completed</dt><dd>{formatMissionDate(mission.completed_at)}</dd></div>
      </dl>
      {mission.status === 'assigned' && <span className="mission-entry__complete">Complete quest</span>}
    </Link>
  )
}

export function HeroNames({ heroes }: { heroes: Mission['heroes'] }) {
  if (heroes.length === 0) return <p className="mt-2 text-sm text-cocoa-plum/75">No adventurers are recorded for this mission.</p>
  return <ul className="mt-2 flex flex-wrap gap-2" aria-label="Assigned adventurers">{heroes.map((hero) => <li key={hero.id} className="mission-hero-name"><HeroPortrait hero={hero} size="xs" />{hero.name}</li>)}</ul>
}
