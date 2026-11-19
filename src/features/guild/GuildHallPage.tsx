import { Button, EmptyState, LoadingIndicator, Panel } from '../../components/ui'
import { GuildOverview } from './GuildOverview'
import { TavernMap } from './TavernMap'
import { useGuildOverview } from './useGuildOverview'

export function GuildHallPage() {
  const overview = useGuildOverview()
  const queries = [overview.user, overview.heroes, overview.quests, overview.missions]

  if (queries.some((query) => query.isPending)) {
    return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Warming the Guild Hall hearth…" size="lg" /></section>
  }

  if (queries.some((query) => query.isError) || !overview.user.data || !overview.heroes.data || !overview.quests.data || !overview.missions.data) {
    return (
      <Panel className="mx-auto max-w-xl text-center">
        <h1 className="pixel-heading text-sm">Guild Hall unavailable</h1>
        <p className="mt-4 text-cocoa-plum/80">The guild ledger could not be opened. Please try again.</p>
        <Button className="mt-5" onClick={() => queries.forEach((query) => void query.refetch())}>Try again</Button>
      </Panel>
    )
  }

  const isEmpty = overview.heroes.data.meta.total === 0 && overview.quests.data.meta.total === 0 && overview.missions.data.meta.total === 0

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <p className="font-bold text-cocoa-plum/70">Your cozy corner of the realm</p>
        <h1 className="pixel-heading mt-2 text-base sm:text-xl">Guild Hall</h1>
      </header>
      <TavernMap />
      {isEmpty ? <EmptyState title="A quiet guild hall" description="This is a peaceful beginning. Visit the Adventurers’ Corner or Quest Board when you are ready to grow the guild." /> : <GuildOverview user={overview.user.data} heroes={overview.heroes.data} quests={overview.quests.data} missions={overview.missions.data} />}
    </div>
  )
}
