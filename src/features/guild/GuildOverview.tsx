import { Link } from 'react-router-dom'
import { Badge, Card } from '../../components/ui'
import type { GuildHeroes, GuildMissions, GuildQuests } from './guildApi'
import type { AuthUser } from '../auth/authApi'

interface GuildOverviewProps {
  user: AuthUser
  heroes: GuildHeroes
  quests: GuildQuests
  missions: GuildMissions
}

function hasCompletePage(response: { data: unknown[]; meta: { total?: number } }) {
  return typeof response.meta.total === 'number' && response.data.length >= response.meta.total
}

export function GuildOverview({ user, heroes, quests, missions }: GuildOverviewProps) {
  const canCountAvailableHeroes = hasCompletePage(heroes)
  const canCountAssignedMissions = hasCompletePage(missions)
  const availableHeroes = canCountAvailableHeroes ? heroes.data.filter((hero) => hero.status === 'available').length : null
  const assignedMissions = canCountAssignedMissions ? missions.data.filter((mission) => mission.status === 'assigned').length : null

  return (
    <section aria-labelledby="guild-overview-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-bold text-cocoa-plum/70">Welcome back, {user.name}</p>
          <h2 id="guild-overview-heading" className="pixel-heading mt-1 text-sm sm:text-base">Guild Overview</h2>
        </div>
        <Badge variant="magic">Guild ledger</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard label="Heroes" value={heroes.meta.total ?? '—'} detail={heroes.meta.total === undefined ? 'Roster total unavailable' : 'in your active roster'} />
        <OverviewCard label="Available" value={availableHeroes ?? '—'} detail={availableHeroes === null ? 'Roster spans more than one page' : 'ready for adventure'} />
        <OverviewCard label="Quest notices" value={quests.meta.total ?? '—'} detail={quests.meta.total === undefined ? 'Board total unavailable' : 'available on the board'} />
        <OverviewCard label="Assigned missions" value={assignedMissions ?? '—'} detail={assignedMissions === null ? 'Journal spans more than one page' : 'currently underway'} />
      </div>

      <Card className="mt-5 bg-soft-caramel/25">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold">Choose your next stop</h3>
            <p className="mt-1 text-sm text-cocoa-plum/75">The tavern doors and these shortcuts lead to the same places.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Shortcut to="/heroes" label="Adventurers" />
            <Shortcut to="/quests" label="Quest Board" />
            <Shortcut to="/missions" label="Mission Journal" />
          </div>
        </div>
      </Card>
    </section>
  )
}

function OverviewCard({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return <Card className="p-4"><p className="text-sm font-bold text-cocoa-plum/75">{label}</p><p className="pixel-heading mt-3 text-lg">{value}</p><p className="mt-2 text-sm text-cocoa-plum/70">{detail}</p></Card>
}

function Shortcut({ to, label }: { to: string; label: string }) {
  return <Link to={to} className="rounded-lg border-2 border-cocoa-plum bg-dusty-pink px-3 py-2 text-sm font-bold text-cocoa-plum no-underline shadow-pixel-sm transition hover:-translate-y-0.5 hover:shadow-pixel motion-reduce:transition-none">{label}</Link>
}
