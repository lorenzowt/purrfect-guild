import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, Dialog, LoadingIndicator, Panel } from '../../components/ui'
import { heroClassLabel, HeroPortrait } from './HeroPortrait'
import { getHero, heroQueryKeys } from './heroesApi'
import { HeroForm } from './HeroForm'
import { heroErrorMessage, heroValidationErrors, useHeroMutations } from './useHeroMutations'

const statusLabels = { available: 'Available', on_mission: 'On Mission', injured: 'Injured', deactivated: 'Retired' } as const

export function HeroDetailPage() {
  const { heroId } = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [confirmingRetirement, setConfirmingRetirement] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const heroQuery = useQuery({ queryKey: heroQueryKeys.detail(heroId ?? ''), queryFn: () => getHero(heroId ?? ''), enabled: Boolean(heroId) })
  const { updateMutation, healMutation, deactivateMutation } = useHeroMutations(heroId)

  if (heroQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Opening the adventurer ledger…" size="lg" /></section>
  if (heroQuery.isError || !heroQuery.data) return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">This adventurer is hard to find</h1><p className="mt-4 text-cocoa-plum/80">Their ledger entry could not be opened.</p><Button className="mt-5" onClick={() => void heroQuery.refetch()}>Try again</Button><Link to="/heroes" className="ml-4 font-bold text-cocoa-plum underline">Return to roster</Link></Panel>

  const hero = heroQuery.data
  const mutationPending = updateMutation.isPending || healMutation.isPending || deactivateMutation.isPending

  function editHero(input: { name: string; hero_class: 'warrior' | 'cleric' | 'mage' | 'rogue' }) {
    setErrors({})
    setMessage(null)
    updateMutation.mutate(input, {
      onSuccess: () => { setEditing(false); setMessage('The adventurer ledger has been updated.') },
      onError: (error) => { const validation = heroValidationErrors(error); setErrors(validation); if (Object.keys(validation).length === 0) setMessage(heroErrorMessage(error, 'The ledger could not be updated.')) },
    })
  }

  function heal() {
    setMessage(null)
    healMutation.mutate(undefined, { onSuccess: () => setMessage(`${hero.name} is feeling spry again!`), onError: (error) => setMessage(heroErrorMessage(error, 'The healing could not be completed.')) })
  }

  function retire() {
    deactivateMutation.mutate(undefined, { onSuccess: () => navigate('/heroes', { replace: true }), onError: (error) => { setConfirmingRetirement(false); setMessage(heroErrorMessage(error, 'The adventurer could not be retired.')) } })
  }

  return (
    <section className="mx-auto max-w-3xl" aria-labelledby="hero-detail-heading">
      <Link className="font-bold text-cocoa-plum underline" to="/heroes">← Back to Adventurers’ Corner</Link>
      <Panel className="mt-5 overflow-hidden p-0">
        <div className="grid md:grid-cols-[15rem_1fr]">
          <div className="hero-detail-portrait grid place-items-center border-b-2 border-soft-caramel p-8 md:border-r-2 md:border-b-0"><HeroPortrait hero={hero} size="lg" /></div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-bold text-cocoa-plum/70">Guild adventurer</p><h1 id="hero-detail-heading" className="pixel-heading mt-2 text-base sm:text-lg">{hero.name}</h1></div><Badge variant={hero.status}>{statusLabels[hero.status]}</Badge></div>
            <dl className="mt-7 grid gap-4 sm:grid-cols-2"><Detail label="Class" value={heroClassLabel(hero.hero_class)} /><Detail label="Level" value={hero.level} /><Detail label="Status" value={statusLabels[hero.status]} /></dl>
            {message && <p role="status" className={`mt-6 rounded-lg p-3 font-bold ${healMutation.isSuccess ? 'healing-glow bg-mint-sage/60' : 'bg-soft-caramel/40'}`}>{message}</p>}
            <div className="mt-8 flex flex-wrap gap-3 border-t-2 border-soft-caramel pt-6"><Button variant="secondary" onClick={() => setEditing(true)} disabled={mutationPending}>Edit adventurer</Button><Button variant="success" onClick={heal} disabled={hero.status !== 'injured' || mutationPending}>Heal adventurer</Button><Button variant="danger" onClick={() => setConfirmingRetirement(true)} disabled={mutationPending}>Retire adventurer</Button></div>
            {hero.status !== 'injured' && <p className="mt-3 text-sm text-cocoa-plum/70">Healing is available only when an adventurer is injured.</p>}
          </div>
        </div>
      </Panel>
      <Dialog open={editing} title={`Edit ${hero.name}`} onClose={() => !updateMutation.isPending && setEditing(false)}><HeroForm initialValues={{ name: hero.name, hero_class: hero.hero_class }} submitLabel="Save changes" isSubmitting={updateMutation.isPending} errors={errors} onSubmit={editHero} /></Dialog>
      <Dialog open={confirmingRetirement} title={`Retire ${hero.name}?`} onClose={() => !deactivateMutation.isPending && setConfirmingRetirement(false)} footer={<><Button variant="ghost" onClick={() => setConfirmingRetirement(false)} disabled={deactivateMutation.isPending}>Keep adventurer</Button><Button variant="danger" loading={deactivateMutation.isPending} onClick={retire}>Confirm retirement</Button></>}><p>Retiring deactivates this adventurer. They will no longer appear in your active roster.</p></Dialog>
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-soft-caramel/25 p-4"><dt className="text-sm font-bold text-cocoa-plum/70">{label}</dt><dd className="mt-1 font-extrabold">{value}</dd></div>
}
