import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { Badge, Button, Dialog, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { getHero, heroQueryKeys, type Hero } from '../heroes/heroesApi'
import { MissionOutcome } from './MissionOutcome'
import { HeroNames } from './MissionCard'
import { getMission, missionQueryKeys } from './missionsApi'
import { formatMissionDate, formatMissionStatus, missionStatusVariant } from './missionPresentation'
import { useMissionResolution } from './useMissionResolution'

export function MissionDetailPage() {
  const { missionId } = useParams()
  const queryClient = useQueryClient()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [resolutionError, setResolutionError] = useState<string | null>(null)
  const [resolving, setResolving] = useState(false)
  const [cancellationNotice, setCancellationNotice] = useState<string | null>(null)
  const [outcomeHeroes, setOutcomeHeroes] = useState<{ before: Hero[]; after: Hero[] } | null>(null)
  const missionQuery = useQuery({ queryKey: missionQueryKeys.detail(missionId ?? ''), queryFn: () => getMission(missionId!), enabled: Boolean(missionId) })
  const { completeMutation, cancelMutation } = useMissionResolution(missionId ?? '')

  useEffect(() => {
    if (!cancellationNotice) return undefined
    const timer = window.setTimeout(() => setCancellationNotice(null), 4_000)
    return () => window.clearTimeout(timer)
  }, [cancellationNotice])

  if (!missionId || missionQuery.isError) return <EmptyState title="This mission entry is unavailable" description="It may have been removed or the journal reference is incomplete." action={<Link className="font-bold text-cocoa-plum underline" to="/missions">Return to Mission Journal</Link>} />
  if (missionQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Finding the journal entry…" size="lg" /></section>
  if (!missionQuery.data) return <EmptyState title="This mission entry is unavailable" description="It may have been removed or the journal reference is incomplete." action={<Link className="font-bold text-cocoa-plum underline" to="/missions">Return to Mission Journal</Link>} />

  const mission = missionQuery.data
  const actionsAllowed = mission.status === 'assigned'

  async function readConfirmedHeroes() {
    const heroes = await Promise.all(mission.heroes.map(async (hero) => {
      try {
        return await queryClient.fetchQuery({ queryKey: heroQueryKeys.detail(String(hero.id)), queryFn: () => getHero(String(hero.id)), staleTime: 0 })
      } catch {
        return null
      }
    }))
    return heroes.filter((hero): hero is Hero => hero !== null)
  }

  async function resolveMission() {
    if (resolving || completeMutation.isPending) return
    setResolving(true)
    setResolutionError(null)
    const before = await readConfirmedHeroes()
    try {
      const resolvedMission = await completeMutation.mutateAsync()
      const after = await readConfirmedHeroes()
      setOutcomeHeroes({ before, after })
      queryClient.setQueryData(missionQueryKeys.detail(String(resolvedMission.id)), resolvedMission)
    } catch (error) {
      setResolutionError(missionActionError(error, 'We could not complete this mission. Please try again.'))
    } finally {
      setResolving(false)
    }
  }

  async function confirmCancellation() {
    try {
      await cancelMutation.mutateAsync()
      setCancelOpen(false)
      setCancellationNotice('Mission canceled. The adventurers are back at the guild.')
    } catch { /* The confirmation dialog retains and renders the mutation error. */ }
  }

  return (
    <section className="mx-auto max-w-3xl" aria-labelledby="mission-detail-heading">
      <Link className="font-bold text-cocoa-plum underline" to="/missions">Back to Mission Journal</Link>
      <Panel className="mission-detail mt-5">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-cocoa-plum/70">Quest</p><h1 id="mission-detail-heading" className="pixel-heading mt-2 text-sm sm:text-lg">{mission.quest?.title ?? 'Quest record unavailable'}</h1></div><Badge variant={missionStatusVariant[mission.status]}>Status: {formatMissionStatus(mission.status)}</Badge></div>
        <dl className="mt-7 grid gap-4 rounded-panel border-2 border-soft-caramel bg-soft-caramel/20 p-4 sm:grid-cols-2"><div><dt className="font-bold">Created</dt><dd className="mt-1">{formatMissionDate(mission.created_at)}</dd></div><div><dt className="font-bold">Completed</dt><dd className="mt-1">{formatMissionDate(mission.completed_at)}</dd></div></dl>
        <section className="mt-7" aria-labelledby="mission-heroes-heading"><h2 id="mission-heroes-heading" className="font-extrabold">Assigned adventurers</h2><HeroNames heroes={mission.heroes} /></section>
        {resolutionError && <p role="alert" className="mission-action-error mt-6">{resolutionError}</p>}
        {cancellationNotice && <p role="status" className="mission-cancellation-notice mt-6">{cancellationNotice}</p>}
        {outcomeHeroes && <MissionOutcome mission={mission} beforeHeroes={outcomeHeroes.before} afterHeroes={outcomeHeroes.after} />}
        {actionsAllowed ? <section className="mt-7 rounded-panel border-2 border-dashed border-soft-lavender bg-soft-lavender/20 p-4" aria-labelledby="mission-actions-heading"><h2 id="mission-actions-heading" className="font-extrabold">Mission actions</h2><p className="mt-2 text-sm text-cocoa-plum/80">Laravel will determine the expedition’s result when you complete it.</p><div className="mt-4 flex flex-wrap gap-3"><Button loading={resolving} disabled={cancelMutation.isPending} onClick={() => void resolveMission()}>Complete adventure</Button><Button variant="danger" disabled={resolving || cancelMutation.isPending} onClick={() => setCancelOpen(true)}>Cancel mission</Button></div></section> : <section className="mt-7 rounded-panel border-2 border-dashed border-soft-lavender bg-soft-lavender/20 p-4" aria-labelledby="mission-actions-heading"><h2 id="mission-actions-heading" className="font-extrabold">Mission actions</h2><p className="mt-2 text-sm text-cocoa-plum/80">This mission is no longer assigned, so no further actions are available.</p></section>}
      </Panel>
      <Link className="mission-detail__quest-link mt-5" to="/quests">Prepare another adventure</Link>
      <Dialog open={cancelOpen} title="Cancel this mission?" onClose={() => !cancelMutation.isPending && setCancelOpen(false)} footer={<><Button variant="ghost" disabled={cancelMutation.isPending} onClick={() => setCancelOpen(false)}>Keep mission</Button><Button variant="danger" loading={cancelMutation.isPending} onClick={() => void confirmCancellation()}>Confirm cancellation</Button></>}><p>Canceling will ask Laravel to release this party from the expedition.</p>{cancelMutation.isError && <p role="alert" className="mission-action-error mt-4">{missionActionError(cancelMutation.error, 'We could not cancel this mission. Please try again.')}</p>}</Dialog>
    </section>
  )
}

function missionActionError(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback
  return (error.response?.data as { message?: string } | undefined)?.message ?? fallback
}
