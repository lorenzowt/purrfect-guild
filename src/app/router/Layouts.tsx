import { NavLink, Outlet } from 'react-router-dom'

const playerLinks = [
  { to: '/guild', label: 'Guild Hall' },
  { to: '/heroes', label: 'Adventurers' },
  { to: '/quests', label: 'Quest Board' },
  { to: '/missions', label: 'Journal' },
  { to: '/profile', label: 'Profile' },
]

const adminLinks = [
  { to: '/admin', label: 'Guild Office' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/quests', label: 'Quests' },
  { to: '/admin/heroes', label: 'Heroes' },
  { to: '/admin/missions', label: 'Missions' },
]

function Brand() {
  return <NavLink to="/" className="pixel-heading text-xs text-cocoa-plum no-underline">Purrfect Guild</NavLink>
}

function Navigation({ links, label }: { links: typeof playerLinks; label: string }) {
  return <nav aria-label={label} className="flex gap-2 overflow-x-auto py-2 md:flex-col md:overflow-visible">
    {links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-2 font-bold no-underline transition-colors motion-reduce:transition-none ${isActive ? 'bg-dusty-pink text-cocoa-plum-dark' : 'text-cocoa-plum hover:bg-soft-caramel/50'}`}>{link.label}</NavLink>)}
  </nav>
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-vanilla-cream">
      <header className="border-b-2 border-soft-caramel bg-vanilla-cream px-5 py-4 sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><Brand /><Navigation label="Public navigation" links={[{ to: '/', label: 'Welcome' }, { to: '/login', label: 'Log in' }, { to: '/register', label: 'Register' }]} /></div></header>
      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8"><Outlet /></main>
    </div>
  )
}

export function PlayerLayout() {
  return <div className="min-h-screen bg-vanilla-cream md:grid md:grid-cols-[15rem_1fr]"><aside className="border-b-2 border-soft-caramel bg-soft-caramel/35 px-5 py-4 md:border-r-2 md:border-b-0 md:px-6 md:py-8"><Brand /><Navigation label="Player navigation" links={playerLinks} /></aside><main className="min-w-0 px-5 py-8 pb-24 sm:px-8 md:pb-8"><Outlet /></main></div>
}

export function AdminLayout() {
  return <div className="min-h-screen bg-vanilla-cream md:grid md:grid-cols-[15rem_1fr]"><aside className="border-b-2 border-soft-lavender bg-soft-lavender/35 px-5 py-4 md:border-r-2 md:border-b-0 md:px-6 md:py-8"><Brand /><p className="mt-4 text-sm font-bold text-cocoa-plum/80">Guild Master’s Office</p><Navigation label="Administrator navigation" links={adminLinks} /></aside><main className="min-w-0 px-5 py-8 sm:px-8"><Outlet /></main></div>
}
