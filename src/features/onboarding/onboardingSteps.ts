export interface OnboardingStep {
  title: string
  dialogue: string
  highlight: string
  destination?: { to: string; label: string }
}

export const onboardingSteps: OnboardingStep[] = [
  {
    title: 'A warm welcome',
    dialogue: 'Ah, the new guildmaster! I am Bramble, former keeper of this tavern. The keys are yours now — do try not to lose them under the rug.',
    highlight: 'The Purring Hearth',
  },
  {
    title: 'Adventurers’ Corner',
    dialogue: 'This is where feline heroes answer the call. Soon you will recruit your first brave little whisker with a very large sword.',
    highlight: 'Adventurers’ Corner',
    destination: { to: '/heroes', label: 'Visit Adventurers’ Corner' },
  },
  {
    title: 'Choose a class',
    dialogue: 'Warriors defend, mages make a fuss with magic, rogues skulk magnificently, and clerics keep everyone from using up all nine lives at once.',
    highlight: 'Warrior · Mage · Rogue · Cleric',
  },
  {
    title: 'The Quest Board',
    dialogue: 'When adventure calls, it leaves a note on the Quest Board. Read the details before sending anyone after a suspiciously large mouse.',
    highlight: 'Quest Board',
    destination: { to: '/quests', label: 'Visit Quest Board' },
  },
  {
    title: 'Build a party',
    dialogue: 'Choose one to four available heroes for each mission. A hero already on a mission cannot be in two places at once — even cats have limits.',
    highlight: '1–4 available heroes',
  },
  {
    title: 'Every mission counts',
    dialogue: 'The guild decides mission outcomes fairly. Success helps heroes grow; failure may leave them injured and in need of a quiet nap.',
    highlight: 'Levels and injuries',
  },
  {
    title: 'Mission Journal',
    dialogue: 'Keep an eye on ongoing adventures and their results in the Mission Journal. It is less dusty than it looks. Usually.',
    highlight: 'Mission Journal',
    destination: { to: '/missions', label: 'Visit Mission Journal' },
  },
  {
    title: 'The guild is yours',
    dialogue: 'That is the tour, guildmaster. Explore at your own pace, make kind choices, and remember: a well-timed treat solves nearly everything.',
    highlight: 'Explore the Guild Hall',
  },
]
