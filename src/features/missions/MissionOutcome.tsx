import { motion, useReducedMotion } from 'motion/react'
import { HeroPortrait } from '../heroes/HeroPortrait'
import type { Hero } from '../heroes/heroesApi'
import type { Mission } from './missionsApi'

interface MissionOutcomeProps {
  mission: Mission
  beforeHeroes: Hero[]
  afterHeroes: Hero[]
  /** Test seam; production callers use Motion's system preference. */
  reducedMotion?: boolean
}

export function MissionOutcome({ mission, beforeHeroes, afterHeroes, reducedMotion }: MissionOutcomeProps) {
  const systemReducedMotion = useReducedMotion()
  const reduceMotion = reducedMotion ?? systemReducedMotion
  if (mission.status !== 'success' && mission.status !== 'failure') return null

  const victorious = mission.status === 'success'
  const beforeById = new Map(beforeHeroes.map((hero) => [hero.id, hero]))
  const changes = afterHeroes.map((hero) => ({ before: beforeById.get(hero.id), after: hero })).filter(({ before, after }) => !before || before.level !== after.level || before.status !== after.status)

  return (
    <motion.section
      className={`mission-outcome mission-outcome--${mission.status} mt-7`}
      role="status"
      data-reduced-motion={reduceMotion ? 'true' : 'false'}
      aria-labelledby="mission-outcome-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: .98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
    >
      <motion.span className="mission-outcome__icon" aria-hidden="true" animate={reduceMotion ? undefined : { rotate: victorious ? [0, -8, 8, 0] : [0, 4, -4, 0] }} transition={{ duration: .65 }}>{victorious ? '✦' : '☂'}</motion.span>
      <div><h2 id="mission-outcome-heading" className="pixel-heading text-xs">{victorious ? 'Adventure complete!' : 'A brave attempt'}</h2><p className="mt-3">{victorious ? 'The guild’s brave whiskers returned victorious.' : 'The expedition did not prevail this time, but every whisker gets to rest and regroup.'}</p></div>
      {changes.length > 0 && <section className="mt-5" aria-labelledby="hero-changes-heading"><h3 id="hero-changes-heading" className="font-extrabold">Confirmed adventurer updates</h3><ul className="mt-3 grid gap-3 sm:grid-cols-2">{changes.map(({ before, after }) => <li key={after.id} className="mission-outcome__hero"><HeroPortrait hero={after} size="sm" /><div><p className="font-extrabold">{after.name}</p>{before && before.level !== after.level && <p className="text-sm">Level {before.level} → {after.level}</p>}{before && before.status !== after.status && <p className="text-sm">Status: {formatStatus(before.status)} → {formatStatus(after.status)}</p>}{!before && <p className="text-sm">Level {after.level} · Status: {formatStatus(after.status)}</p>}</div></li>)}</ul></section>}
    </motion.section>
  )
}

function formatStatus(status: string) {
  return status.split('_').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ')
}
