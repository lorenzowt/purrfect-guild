import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Badge, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { HeroNames } from './MissionCard'
import { getMission, missionQueryKeys } from './missionsApi'
import { formatMissionDate, missionStatusVariant } from './missionPresentation'

export function MissionDetailPage() {
  const { missionId } = useParams()
  const missionQuery = useQuery({ queryKey: missionQueryKeys.detail(missionId ?? ''), queryFn: () => getMission(missionId!), enabled: Boolean(missionId) })

  if (!missionId || missionQuery.isError) return <EmptyState title="This mission entry is unavailable" description="It may have been removed or the journal reference is incomplete." action={<Link className="font-bold text-cocoa-plum underline" to="/missions">Return to Mission Journal</Link>} />
  if (missionQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Finding the journal entry…" size="lg" /></section>
  if (!missionQuery.data) return <EmptyState title="This mission entry is unavailable" description="It may have been removed or the journal reference is incomplete." action={<Link className="font-bold text-cocoa-plum underline" to="/missions">Return to Mission Journal</Link>} />

  const mission = missionQuery.data
  return (
    <section className="mx-auto max-w-3xl" aria-labelledby="mission-detail-heading">
      <Link className="font-bold text-cocoa-plum underline" to="/missions">Back to Mission Journal</Link>
      <Panel className="mission-detail mt-5">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-cocoa-plum/70">Quest</p><h1 id="mission-detail-heading" className="pixel-heading mt-2 text-sm sm:text-lg">{mission.quest?.title ?? 'Quest record unavailable'}</h1></div><Badge variant={missionStatusVariant[mission.status]}>Status: {mission.status}</Badge></div>
        <dl className="mt-7 grid gap-4 rounded-panel border-2 border-soft-caramel bg-soft-caramel/20 p-4 sm:grid-cols-2"><div><dt className="font-bold">Created</dt><dd className="mt-1">{formatMissionDate(mission.created_at)}</dd></div><div><dt className="font-bold">Completed</dt><dd className="mt-1">{formatMissionDate(mission.completed_at)}</dd></div></dl>
        <section className="mt-7" aria-labelledby="mission-heroes-heading"><h2 id="mission-heroes-heading" className="font-extrabold">Assigned adventurers</h2><HeroNames heroes={mission.heroes} /></section>
        <section className="mt-7 rounded-panel border-2 border-dashed border-soft-lavender bg-soft-lavender/20 p-4" aria-labelledby="future-actions-heading"><h2 id="future-actions-heading" className="font-extrabold">Mission actions</h2><p className="mt-2 text-sm text-cocoa-plum/80">Completion and cancellation controls will arrive in the next journal update.</p></section>
      </Panel>
      <Link className="mission-detail__quest-link mt-5" to="/quests">Prepare another adventure</Link>
    </section>
  )
}
