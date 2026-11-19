import { useState } from 'react'
import warrior1 from '../../assets/portraits/warrior/warrior-1.png'
import warrior2 from '../../assets/portraits/warrior/warrior-2.png'
import warrior3 from '../../assets/portraits/warrior/warrior-3.png'
import mage1 from '../../assets/portraits/mage/mage-1.png'
import mage2 from '../../assets/portraits/mage/mage-2.png'
import mage3 from '../../assets/portraits/mage/mage-3.png'
import rogue1 from '../../assets/portraits/rogue/rogue-1.png'
import rogue2 from '../../assets/portraits/rogue/rogue-2.png'
import rogue3 from '../../assets/portraits/rogue/rogue-3.png'
import cleric1 from '../../assets/portraits/cleric/cleric-1.png'
import cleric2 from '../../assets/portraits/cleric/cleric-2.png'
import cleric3 from '../../assets/portraits/cleric/cleric-3.png'
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

const portraitAssets = {
  warrior: [warrior1, warrior2, warrior3],
  mage: [mage1, mage2, mage3],
  rogue: [rogue1, rogue2, rogue3],
  cleric: [cleric1, cleric2, cleric3],
} as const

type PortraitHero = Pick<Hero, 'id' | 'name' | 'hero_class'>
type HeroClass = keyof typeof classLabels

/** Assigns one class-specific asset from a stable numeric hero identifier. */
export function portraitVariant(hero: Pick<PortraitHero, 'id'>) {
  return Math.abs(hero.id) % portraitAssets.warrior.length
}

export function portraitSource(hero: PortraitHero) {
  return portraitAssets[hero.hero_class][portraitVariant(hero)]
}

export function heroClassLabel(heroClass: Hero['hero_class']) {
  return classLabels[heroClass]
}

export function HeroPortrait({ hero, size = 'md' }: { hero: PortraitHero; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const heroClass: HeroClass = hero.hero_class
  const label = `${hero.name}, ${heroClassLabel(heroClass)} portrait`
  const sizes = { xs: 'size-9', sm: 'size-16', md: 'size-24', lg: 'size-36' }
  const className = `hero-portrait hero-portrait--${heroClass} hero-portrait--variant-${portraitVariant(hero)} ${sizes[size]}`

  if (imageFailed) {
    return <div className={`${className} hero-portrait--fallback`} role="img" aria-label={label} data-testid="hero-portrait-fallback"><span aria-hidden="true">🐱</span><span className="hero-portrait__class" aria-hidden="true">{classSymbols[heroClass]}</span></div>
  }

  return <img className={className} src={portraitSource(hero)} alt={label} onError={() => setImageFailed(true)} />
}
