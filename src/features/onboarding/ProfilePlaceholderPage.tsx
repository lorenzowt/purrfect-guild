import { Link } from 'react-router-dom'
import { Panel } from '../../components/ui'

export function ProfilePlaceholderPage() {
  return (
    <Panel className="max-w-3xl">
      <h1 className="pixel-heading text-base text-cocoa-plum sm:text-lg">My Profile</h1>
      <p className="mt-5 max-w-2xl text-lg text-cocoa-plum/80">Account settings will appear here.</p>
      <p className="mt-4 text-cocoa-plum/70">Need a refresher before managing your guild?</p>
      <Link to="/onboarding" className="mt-5 inline-block font-bold text-cocoa-plum underline">Replay Bramble’s welcome tour</Link>
    </Panel>
  )
}
