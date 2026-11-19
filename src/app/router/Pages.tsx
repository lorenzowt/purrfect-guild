import { Link, useLocation } from 'react-router-dom'
import { Card, EmptyState, Panel } from '../../components/ui'

interface PlaceholderPageProps { title: string; description: string }

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return <Panel className="max-w-3xl"><h1 className="pixel-heading text-base text-cocoa-plum sm:text-lg">{title}</h1><p className="mt-5 max-w-2xl text-lg text-cocoa-plum/80">{description}</p><p className="mt-4 text-cocoa-plum/70">This area is ready for its feature implementation.</p></Panel>
}

export function WelcomePage() {
  const location = useLocation()
  const logoutWarning = (location.state as { logoutWarning?: string } | null)?.logoutWarning
  return <section className="grid gap-6 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"><div><span className="pixel-sparkle text-soft-lavender" aria-hidden="true" /><h1 className="pixel-heading mt-4 text-xl text-cocoa-plum sm:text-2xl">A Guild of Whiskers & Wonder</h1><p className="mt-5 max-w-xl text-lg text-cocoa-plum/80">A cozy home for feline adventurers is waiting just beyond the tavern door.</p>{logoutWarning && <p role="alert" className="mt-4 rounded-lg bg-dusty-pink/40 p-3 font-semibold text-cocoa-plum">{logoutWarning}</p>}<div className="mt-7 flex flex-wrap gap-3"><Link to="/register" className="rounded-panel border-2 border-cocoa-plum bg-dusty-pink px-4 py-2.5 font-bold text-cocoa-plum-dark shadow-pixel-sm no-underline transition hover:-translate-y-0.5 motion-reduce:transition-none">Start adventure</Link><Link to="/login" className="rounded-panel border-2 border-cocoa-plum bg-soft-caramel px-4 py-2.5 font-bold text-cocoa-plum-dark shadow-pixel-sm no-underline transition hover:-translate-y-0.5 motion-reduce:transition-none">Log in</Link></div></div><Card className="text-center"><span className="text-5xl" aria-hidden="true">🐾</span><p className="mt-4 font-bold text-cocoa-plum">The guild hall will grow here.</p></Card></section>
}

export function NotFoundPage() {
  return <div className="mx-auto max-w-xl py-12"><EmptyState title="This path leads nowhere" description="That corner of the guild hall has not been built yet." action={<Link to="/" className="font-bold text-cocoa-plum underline">Return to the welcome hall</Link>} /></div>
}
