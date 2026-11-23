import { NavLink, Outlet } from 'react-router-dom'
import { LogoutAction } from '../../features/auth/AuthPages'

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

function Navigation({ links, label, className = '' }: { links: typeof playerLinks; label: string; className?: string }) {
  return <nav aria-label={label} className={`flex gap-2 py-2 ${className}`}>
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
  return <div className="app-shell min-h-screen bg-vanilla-cream md:grid md:grid-cols-[15rem_1fr]"><aside className="desktop-sidebar hidden md:block"><Brand /><Navigation label="Player navigation" links={playerLinks} className="flex-col" /><div className="mt-3"><LogoutAction /></div></aside><main className="min-w-0 px-5 py-8 pb-24 sm:px-8 md:pb-8"><Outlet /></main><MobileNavigation links={playerLinks} label="Player navigation" /></div>
}

export function AdminLayout() {
  return <div className="admin-theme app-shell min-h-screen bg-vanilla-cream md:grid md:grid-cols-[15rem_1fr]"><aside className="desktop-sidebar hidden md:block"><Brand /><p className="mt-4 text-sm font-bold text-cocoa-plum/80">Guild Master’s Office</p><Navigation label="Administrator navigation" links={adminLinks} className="flex-col" /><div className="mt-3"><LogoutAction /></div></aside><main className="min-w-0 px-5 py-8 pb-24 sm:px-8 md:pb-8"><Outlet /></main><MobileNavigation links={adminLinks} label="Administrator navigation" /></div>
}

function MobileNavigation({ links, label }: { links: typeof playerLinks; label: string }) {
  return <nav className="mobile-navigation md:hidden" aria-label={`${label} mobile`}><div>{links.map((link) => <NavLink key={link.to} to={link.to}><MobileIcon destination={link.to} /><span>{mobileLabel(link.label)}</span></NavLink>)}</div></nav>
}

function mobileLabel(label: string) { return { 'Guild Hall': 'Guild', Adventurers: 'Heroes', 'Quest Board': 'Quests', Journal: 'Journal', Profile: 'Profile', 'Guild Office': 'Office', Users: 'Users', Quests: 'Quests', Heroes: 'Heroes', Missions: 'Missions' }[label] ?? label }
function MobileIcon({ destination }: { destination: string }) { const glyph = destination === '/guild' || destination === '/admin' ? '⌂' : destination.includes('heroes') ? '♙' : destination.includes('quests') ? '▤' : destination.includes('missions') ? '☷' : destination.includes('profile') ? '◉' : '•'; return <span className="mobile-navigation__icon" aria-hidden="true">{glyph}</span> }
