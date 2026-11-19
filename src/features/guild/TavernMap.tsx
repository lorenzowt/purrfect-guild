import { Link } from 'react-router-dom'

interface TavernLocation {
  name: string
  description: string
  to: string
  icon: string
  className: string
}

const locations: TavernLocation[] = [
  { name: 'Adventurers’ Corner', description: 'Visit your feline adventurers.', to: '/heroes', icon: '⚔', className: 'tavern-location--heroes' },
  { name: 'Quest Board', description: 'Browse available adventures.', to: '/quests', icon: '✦', className: 'tavern-location--quests' },
  { name: 'Mission Desk', description: 'Review the mission journal.', to: '/missions', icon: '⌘', className: 'tavern-location--missions' },
  { name: 'Retired Tavern Keeper', description: 'Replay the welcome tour.', to: '/onboarding', icon: '♟', className: 'tavern-location--keeper' },
]

export function TavernMap() {
  return (
    <section className="tavern-map pixel-border overflow-hidden rounded-panel" aria-labelledby="tavern-map-heading">
      <div className="tavern-map__sky" aria-hidden="true" />
      <div className="tavern-map__sign">
        <h2 id="tavern-map-heading" className="pixel-heading text-[0.65rem] sm:text-xs">The Purring Hearth</h2>
        <p>Temporary CSS tavern illustration</p>
      </div>
      <p className="sr-only">Choose a location in the temporary illustrated Guild Hall.</p>
      <div className="tavern-map__floor" aria-hidden="true" />
      {locations.map((location) => (
        <Link key={location.to} to={location.to} className={`tavern-location ${location.className}`} aria-label={`Visit ${location.name}: ${location.description}`}>
          <span className="tavern-location__icon" aria-hidden="true">{location.icon}</span>
          <span className="tavern-location__label">{location.name}</span>
          <span className="tavern-location__hint">{location.description}</span>
        </Link>
      ))}
      <span className="tavern-map__sparkle tavern-map__sparkle--one" aria-hidden="true">✦</span>
      <span className="tavern-map__sparkle tavern-map__sparkle--two" aria-hidden="true">✧</span>
    </section>
  )
}
