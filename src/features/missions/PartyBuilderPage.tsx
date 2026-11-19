import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { Badge, Button, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { HeroPortrait, heroClassLabel } from '../heroes/HeroPortrait'
import { getHeroes, heroQueryKeys, type Hero } from '../heroes/heroesApi'
import { getQuest, questQueryKeys } from '../quests/questsApi'
import { apiErrorMessage } from '../auth/authApi'
import { useMissionCreation } from './useMissionCreation'

const partyLimit = 4

function heroStatusLabel(status: Hero['status']) {
  return { available: 'Available', on_mission: 'On Mission', injured: 'Injured', deactivated: 'Retired' }[status]
}

export function PartyBuilderPage() {
  const { questId } = useParams()
  const navigate = useNavigate()
  const [pageUrl, setPageUrl] = useState<string | undefined>()
  const [selectedHeroes, setSelectedHeroes] = useState<Hero[]>([])
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [createdMissionId, setCreatedMissionId] = useState<number | null>(null)
  const questQuery = useQuery({ queryKey: questQueryKeys.detail(questId ?? ''), queryFn: () => getQuest(questId!), enabled: Boolean(questId) })
  const heroesQuery = useQuery({ queryKey: heroQueryKeys.roster(pageUrl), queryFn: () => getHeroes(pageUrl) })
  const createMission = useMissionCreation()

  const heroes = heroesQuery.data?.data ?? []
  const selectedHeroIds = useMemo(() => selectedHeroes.map((hero) => hero.id), [selectedHeroes])
  const totalLevel = selectedHeroes.reduce((total, hero) => total + hero.level, 0)
  const classDiversity = new Set(selectedHeroes.map((hero) => hero.hero_class)).size

  useEffect(() => {
    if (!createdMissionId) return undefined
    const timer = window.setTimeout(() => navigate(`/missions/${createdMissionId}`, { replace: true }), 900)
    return () => window.clearTimeout(timer)
  }, [createdMissionId, navigate])

  function addHero(hero: Hero) {
    if (hero.status !== 'available') return setSelectionError(`${hero.name} is ${heroStatusLabel(hero.status).toLowerCase()} and cannot join this party.`)
    if (selectedHeroIds.includes(hero.id)) return
    if (selectedHeroes.length >= partyLimit) return setSelectionError(`A party can include up to ${partyLimit} adventurers.`)
    setSelectionError(null)
    setSelectedHeroes((currentHeroes) => [...currentHeroes, hero])
  }

  function removeHero(heroId: number) {
    setSelectionError(null)
    setSelectedHeroes((currentHeroes) => currentHeroes.filter((hero) => hero.id !== heroId))
  }

  async function submitParty() {
    if (!questId || !questQuery.data?.is_active) return
    if (selectedHeroIds.length === 0) {
      setSelectionError('Choose at least one available adventurer before sending the party out.')
      return
    }
    if (selectedHeroIds.length > partyLimit) {
      setSelectionError(`A party can include at most ${partyLimit} adventurers.`)
      return
    }
    setSelectionError(null)
    try {
      const mission = await createMission.mutateAsync({ quest_id: Number(questId), hero_ids: selectedHeroIds })
      setSelectedHeroes([])
      setCreatedMissionId(mission.id)
    } catch {
      // The mutation error is rendered below while the current party stays selectable.
    }
  }

  if (!questId || questQuery.isError) return <MissingQuest />
  if (questQuery.isPending || heroesQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Preparing the adventure table…" size="lg" /></section>
  if (!questQuery.data) return <MissingQuest />
  if (heroesQuery.isError || !heroesQuery.data) return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">The adventurer ledger is unavailable</h1><p className="mt-4 text-cocoa-plum/80">We could not gather your roster. Please try again.</p><Button className="mt-5" onClick={() => void heroesQuery.refetch()}>Try again</Button></Panel>

  const quest = questQuery.data
  const missionError = createMission.isError ? missionErrorMessage(createMission.error) : null
  const canSubmit = quest.is_active && selectedHeroIds.length > 0 && !createMission.isPending && !createdMissionId

  return (
    <section className="party-builder mx-auto max-w-7xl" aria-labelledby="party-builder-heading">
      <header className="party-builder__quest">
        <div><h1 id="party-builder-heading" className="pixel-heading text-sm sm:text-lg">Party Builder</h1><p className="mt-4 font-bold text-cocoa-plum/75">Quest selected</p><h2 className="pixel-heading mt-2 text-xs sm:text-sm">{quest.title}</h2><p className="mt-3 max-w-3xl text-cocoa-plum/80">{quest.description}</p></div>
        <div className="flex flex-wrap gap-2"><Badge variant="magic">Difficulty {quest.difficulty}/10</Badge><Badge>Boss: {quest.boss}</Badge></div>
      </header>

      {!quest.is_active && <p role="alert" className="party-builder__alert">This quest is no longer available. Choose another notice from the Quest Board.</p>}
      {createdMissionId && <p role="status" className="party-builder__success">Your party is on its way! Opening the mission journal…</p>}
      {(selectionError || missionError) && <p role="alert" className="party-builder__alert">{selectionError ?? missionError}</p>}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div>
          <h2 className="pixel-heading text-xs">Your party</h2>
          <div className="party-slots mt-4" aria-label={`Party slots: ${selectedHeroIds.length} of ${partyLimit} filled`}>
            {Array.from({ length: partyLimit }, (_, index) => {
              const hero = selectedHeroes[index]
              return hero ? <SelectedHeroSlot key={hero.id} hero={hero} onRemove={removeHero} disabled={Boolean(createdMissionId) || createMission.isPending} /> : <EmptyPartySlot key={index} number={index + 1} />
            })}
          </div>
          <PartySummary selectedHeroes={selectedHeroes} totalLevel={totalLevel} classDiversity={classDiversity} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button loading={createMission.isPending} disabled={!canSubmit} onClick={() => void submitParty()}>Send on adventure!</Button>
            <Link className="party-builder__back-link" to="/quests">Back to Quest Board</Link>
          </div>
        </div>

        <aside className="party-builder__roster" aria-labelledby="available-heroes-heading">
          <h2 id="available-heroes-heading" className="pixel-heading text-xs">Choose adventurers</h2>
          {heroes.length === 0 ? <div className="mt-4"><EmptyState title="No adventurers in this page" description="Recruit an adventurer before you can form a party." /></div> : <div className="mt-4 grid gap-3">{heroes.map((hero) => <HeroChoice key={hero.id} hero={hero} selected={selectedHeroIds.includes(hero.id)} partyFull={selectedHeroIds.length >= partyLimit} onChoose={addHero} />)}</div>}
          <nav className="mt-5 flex items-center justify-between gap-3" aria-label="Available heroes pages">
            <Button size="sm" variant="secondary" disabled={!heroesQuery.data.links.prev} onClick={() => setPageUrl(heroesQuery.data?.links.prev ?? undefined)}>Previous</Button>
            <p className="text-sm font-bold">Page {heroesQuery.data.meta.current_page ?? 1}</p>
            <Button size="sm" disabled={!heroesQuery.data.links.next} onClick={() => setPageUrl(heroesQuery.data?.links.next ?? undefined)}>Next</Button>
          </nav>
        </aside>
      </div>
    </section>
  )
}

function HeroChoice({ hero, selected, partyFull, onChoose }: { hero: Hero; selected: boolean; partyFull: boolean; onChoose: (hero: Hero) => void }) {
  const available = hero.status === 'available'
  const disabled = !available || selected || partyFull
  const explanation = selected ? 'Selected' : available ? partyFull ? 'Party full' : 'Available' : `${heroStatusLabel(hero.status)} — unavailable`
  return <button type="button" className="party-hero-choice" disabled={disabled} aria-pressed={selected} onClick={() => onChoose(hero)}><HeroPortrait hero={hero} size="sm" /><span className="min-w-0 flex-1 text-left"><span className="block truncate font-extrabold">{hero.name}</span><span className="mt-1 block text-sm">{heroClassLabel(hero.hero_class)} · Level {hero.level}</span><span className="mt-1 block text-xs font-bold">{explanation}</span></span></button>
}

function SelectedHeroSlot({ hero, onRemove, disabled }: { hero: Hero; onRemove: (id: number) => void; disabled: boolean }) {
  return <article className="party-slot party-slot--filled"><HeroPortrait hero={hero} size="sm" /><div className="min-w-0 flex-1"><h3 className="truncate font-extrabold">{hero.name}</h3><p className="mt-1 text-sm">{heroClassLabel(hero.hero_class)} · Level {hero.level}</p></div><Button size="sm" variant="ghost" disabled={disabled} onClick={() => onRemove(hero.id)} aria-label={`Remove ${hero.name} from party`}>Remove</Button></article>
}

function EmptyPartySlot({ number }: { number: number }) {
  return <article className="party-slot party-slot--empty"><span aria-hidden="true">🐾</span><div><h3 className="font-extrabold">Slot {number}</h3><p className="text-sm">Choose an available adventurer.</p></div></article>
}

function PartySummary({ selectedHeroes, totalLevel, classDiversity }: { selectedHeroes: Hero[]; totalLevel: number; classDiversity: number }) {
  return <section className="party-summary mt-5" aria-labelledby="party-summary-heading"><h2 id="party-summary-heading" className="font-extrabold">Party summary</h2><dl className="mt-3 grid grid-cols-3 gap-3 text-center"><div><dt>Heroes</dt><dd>{selectedHeroes.length}/4</dd></div><div><dt>Combined levels</dt><dd>{totalLevel}</dd></div><div><dt>Classes</dt><dd>{classDiversity}</dd></div></dl></section>
}

function MissingQuest() {
  return <EmptyState title="This quest notice is unavailable" description="It may have been removed from the board or the address is incomplete." action={<Link className="font-bold text-cocoa-plum underline" to="/quests">Return to Quest Board</Link>} />
}

function missionErrorMessage(error: unknown) {
  if (!isAxiosError(error)) return 'We could not send the party out. Please try again.'
  const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined
  const validationMessage = Object.values(data?.errors ?? {}).flat()[0]
  return validationMessage ?? apiErrorMessage(error, 'We could not send the party out. Please try again.')
}
