import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Badge, Button, Dialog, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { HeroForm } from '../heroes/HeroForm'
import { HeroPortrait, heroClassLabel } from '../heroes/HeroPortrait'
import { heroErrorMessage, heroValidationErrors, useHeroMutations } from '../heroes/useHeroMutations'
import { formatMissionDate, formatMissionStatus, missionStatusVariant } from '../missions/missionPresentation'
import { useMissionResolution } from '../missions/useMissionResolution'
import { adminQueryKeys, getAdminHero, getAdminMission } from './adminApi'

const heroStatusLabels = { available: 'Available', on_mission: 'On Mission', injured: 'Injured', deactivated: 'Retired' } as const

function AdminBackLink({ fallback, children }: { fallback: string; children: string }) {
  const location = useLocation()
  const from = typeof location.state?.from === 'string' && location.state.from.startsWith('/admin/') ? location.state.from : fallback
  return <Link className="font-bold text-cocoa-plum underline" to={from}>← {children}</Link>
}

export function AdminHeroDetailPage() {
  const { heroId } = useParams()
  const navigate = useNavigate()
  const query = useQuery({ queryKey: adminQueryKeys.heroDetail(heroId ?? ''), queryFn: () => getAdminHero(heroId ?? ''), enabled: Boolean(heroId) })
  const { updateMutation, healMutation, deactivateMutation } = useHeroMutations(heroId)
  const [editing, setEditing] = useState(false)
  const [confirmingRetirement, setConfirmingRetirement] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  useTemporaryMessage(message, setMessage)

  if (query.isPending) return <Loading label="Opening the hero record…" />
  if (query.isError || !query.data) return <Unavailable fallback="/admin/heroes" label="Back to Hero oversight" title="This hero record is unavailable" />
  const hero = query.data
  const mutationPending = updateMutation.isPending || healMutation.isPending || deactivateMutation.isPending
  function editHero(input: { name: string; hero_class: 'warrior' | 'cleric' | 'mage' | 'rogue' }) {
    setErrors({}); setMessage(null)
    updateMutation.mutate(input, { onSuccess: () => { setEditing(false); setMessage(`${hero.name}'s administrative record was updated.`) }, onError: (error) => { const validation = heroValidationErrors(error); setErrors(validation); if (Object.keys(validation).length === 0) setMessage(heroErrorMessage(error, 'The hero record could not be updated.')) } })
  }
  function healHero() { setMessage(null); healMutation.mutate(undefined, { onSuccess: () => setMessage(`${hero.name} has been cleared for duty.`), onError: (error) => setMessage(heroErrorMessage(error, 'Laravel could not heal this hero.')) }) }
  function retireHero() { deactivateMutation.mutate(undefined, { onSuccess: () => { setConfirmingRetirement(false); navigate('/admin/heroes', { replace: true }) }, onError: (error) => { setConfirmingRetirement(false); setMessage(heroErrorMessage(error, 'Laravel could not deactivate this hero.')) } }) }

  return <section className="admin-ledger mx-auto max-w-3xl" aria-labelledby="admin-hero-detail-heading"><AdminBackLink fallback="/admin/heroes">Back to Hero oversight</AdminBackLink><Panel className="mt-5 overflow-hidden p-0"><div className="grid md:grid-cols-[14rem_1fr]"><div className="hero-detail-portrait grid place-items-center border-b-2 border-soft-caramel p-7 md:border-r-2 md:border-b-0"><HeroPortrait hero={hero} size="lg" /></div><div className="p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-cocoa-plum/70">Guild-wide hero record</p><h1 id="admin-hero-detail-heading" className="pixel-heading mt-2 text-base sm:text-lg">{hero.name}</h1></div><Badge variant={hero.status}>{heroStatusLabels[hero.status]}</Badge></div><dl className="mt-7 grid gap-4 sm:grid-cols-2"><Record label="Class" value={heroClassLabel(hero.hero_class)} /><Record label="Level" value={hero.level} /><Record label="Status" value={heroStatusLabels[hero.status]} /></dl>{message && <p role="status" className="profile-notice mt-6">{message}</p>}<div className="mt-8 flex flex-wrap gap-3 border-t-2 border-soft-caramel pt-6"><Button variant="secondary" disabled={mutationPending} onClick={() => setEditing(true)}>Edit hero</Button><Button variant="success" disabled={hero.status !== 'injured' || mutationPending} onClick={healHero}>Heal hero</Button><Button variant="danger" disabled={mutationPending} onClick={() => setConfirmingRetirement(true)}>Deactivate hero</Button></div>{hero.status !== 'injured' && <p className="mt-3 text-sm text-cocoa-plum/70">Healing is available only for heroes Laravel currently marks as injured.</p>}</div></div></Panel><Dialog open={editing} title={`Edit ${hero.name}`} onClose={() => !updateMutation.isPending && setEditing(false)}><HeroForm initialValues={{ name: hero.name, hero_class: hero.hero_class }} submitLabel="Save hero" isSubmitting={updateMutation.isPending} errors={errors} onSubmit={editHero} /></Dialog><Dialog open={confirmingRetirement} title={`Deactivate ${hero.name}?`} onClose={() => !deactivateMutation.isPending && setConfirmingRetirement(false)} footer={<><Button variant="ghost" disabled={deactivateMutation.isPending} onClick={() => setConfirmingRetirement(false)}>Keep hero</Button><Button variant="danger" loading={deactivateMutation.isPending} onClick={retireHero}>Deactivate hero</Button></>}><p>This asks Laravel to deactivate this hero. The hero will no longer appear in active rosters.</p>{deactivateMutation.isError && <p role="alert" className="mt-4 font-bold text-berry-red">{heroErrorMessage(deactivateMutation.error, 'Laravel could not deactivate this hero.')}</p>}</Dialog></section>
}

export function AdminMissionDetailPage() {
  const { missionId } = useParams()
  const query = useQuery({ queryKey: adminQueryKeys.missionDetail(missionId ?? ''), queryFn: () => getAdminMission(missionId ?? ''), enabled: Boolean(missionId) })
  const { completeMutation, cancelMutation } = useMissionResolution(missionId ?? '')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  useTemporaryMessage(message, setMessage)
  if (query.isPending) return <Loading label="Opening the mission record…" />
  if (query.isError || !query.data) return <Unavailable fallback="/admin/missions" label="Back to Mission archive" title="This mission record is unavailable" />
  const mission = query.data
  const actionPending = completeMutation.isPending || cancelMutation.isPending
  const actionError = completeMutation.isError ? missionError(completeMutation.error, 'Laravel could not complete this mission.') : cancelMutation.isError ? missionError(cancelMutation.error, 'Laravel could not cancel this mission.') : null
  function completeMission() { completeMutation.mutate(undefined, { onSuccess: () => setMessage('Mission completed. Laravel returned the confirmed result.') }) }
  function cancelMission() { cancelMutation.mutate(undefined, { onSuccess: () => { setConfirmCancel(false); setMessage('Mission canceled. Laravel released the assigned heroes.') } }) }
  return <section className="admin-ledger mx-auto max-w-3xl" aria-labelledby="admin-mission-detail-heading"><AdminBackLink fallback="/admin/missions">Back to Mission archive</AdminBackLink><Panel className="mt-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-cocoa-plum/70">Guild-wide mission record</p><h1 id="admin-mission-detail-heading" className="pixel-heading mt-2 text-sm sm:text-lg">{mission.quest?.title ?? 'Quest record unavailable'}</h1></div><Badge variant={missionStatusVariant[mission.status]}>{formatMissionStatus(mission.status)}</Badge></div><dl className="mt-7 grid gap-4 rounded-panel border-2 border-soft-caramel bg-soft-caramel/20 p-4 sm:grid-cols-2"><Record label="Created" value={formatMissionDate(mission.created_at)} /><Record label="Completed" value={formatMissionDate(mission.completed_at)} /></dl><section className="mt-7" aria-labelledby="admin-mission-heroes-heading"><h2 id="admin-mission-heroes-heading" className="font-extrabold">Assigned adventurers</h2><ul className="mt-3 grid gap-3 sm:grid-cols-2">{mission.heroes.map((hero) => <li key={hero.id} className="flex items-center gap-3 rounded-panel border-2 border-soft-caramel bg-vanilla-cream p-3"><HeroPortrait hero={hero} size="sm" /><span className="font-extrabold">{hero.name}</span><span className="text-sm text-cocoa-plum/70">{heroClassLabel(hero.hero_class)}</span></li>)}</ul></section>{message && <p role="status" className="profile-notice mt-6">{message}</p>}{actionError && <p role="alert" className="mt-6 font-bold text-berry-red">{actionError}</p>}{mission.status === 'assigned' && <section className="mt-7 border-t-2 border-soft-caramel pt-6"><h2 className="font-extrabold">Administrative mission actions</h2><p className="mt-2 text-sm text-cocoa-plum/80">Laravel confirms whether this action is authorized and valid for the mission.</p><div className="mt-4 flex flex-wrap gap-3"><Button loading={completeMutation.isPending} disabled={actionPending} onClick={completeMission}>Complete mission</Button><Button variant="danger" disabled={actionPending} onClick={() => setConfirmCancel(true)}>Cancel mission</Button></div></section>}</Panel><Dialog open={confirmCancel} title="Cancel this mission?" onClose={() => !cancelMutation.isPending && setConfirmCancel(false)} footer={<><Button variant="ghost" disabled={cancelMutation.isPending} onClick={() => setConfirmCancel(false)}>Keep mission</Button><Button variant="danger" loading={cancelMutation.isPending} onClick={cancelMission}>Confirm cancellation</Button></>}><p>This asks Laravel to release the mission party. The dialog stays open if Laravel rejects the action.</p></Dialog></section>
}

function useTemporaryMessage(message: string | null, setMessage: (message: string | null) => void) { useEffect(() => { if (!message) return undefined; const timer = window.setTimeout(() => setMessage(null), 4_000); return () => window.clearTimeout(timer) }, [message, setMessage]) }
function missionError(error: unknown, fallback: string) { return isAxiosError(error) ? (error.response?.data as { message?: string } | undefined)?.message ?? fallback : fallback }
function Loading({ label }: { label: string }) { return <section className="grid min-h-80 place-items-center"><LoadingIndicator label={label} size="lg" /></section> }
function Unavailable({ fallback, label, title }: { fallback: string; label: string; title: string }) { return <EmptyState title={title} description="The Guild Master’s Office could not open this record." action={<Link className="font-bold text-cocoa-plum underline" to={fallback}>{label}</Link>} /> }
function Record({ label, value }: { label: string; value: string | number }) { return <div><dt className="text-sm font-bold text-cocoa-plum/70">{label}</dt><dd className="mt-1 font-extrabold">{value}</dd></div> }
