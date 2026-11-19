import type { Hero } from './heroesApi'

const classLabels = {
  warrior: 'Warrior',
  mage: 'Mage',
  rogue: 'Rogue',
  cleric: 'Cleric',
} as const

const classSymbols = {
  warrior: '⚔',
  mage: '✦',
  rogue: '◈',
  cleric: '✚',
} as const

type HeroClass = keyof typeof classLabels

function isHeroClass(value: string): value is HeroClass {
  return value in classLabels
}

/** A stable class-specific variation for future local portrait assets and the current CSS fallback. */
export function portraitVariant(hero: Pick<Hero, 'id' | 'hero_class'>) {
  return Math.abs(hero.id) % 3
}

export function heroClassLabel(heroClass: Hero['hero_class']) {
  return classLabels[heroClass]
}

export function HeroPortrait({ hero, size = 'md' }: { hero: Hero; size?: 'sm' | 'md' | 'lg' }) {
  const variant = portraitVariant(hero)
  const heroClass = hero.hero_class
  const className = isHeroClass(heroClass) ? heroClass : 'warrior'
  const label = `${hero.name}, ${heroClassLabel(heroClass)} portrait`
  const sizes = { sm: 'size-16 text-2xl', md: 'size-24 text-4xl', lg: 'size-36 text-6xl' }

  return (
    <div className={`hero-portrait hero-portrait--${className} hero-portrait--variant-${variant} ${sizes[size]}`} role="img" aria-label={label}>
      <span className="hero-portrait__ears" aria-hidden="true">⌃⌃</span>
      <span className="hero-portrait__cat" aria-hidden="true">🐱</span>
      <span className="hero-portrait__class" aria-hidden="true">{classSymbols[className]}</span>
    </div>
  )
}
