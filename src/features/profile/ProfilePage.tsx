import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button, Dialog, Field, Input, LoadingIndicator, Panel } from '../../components/ui'
import { LogoutAction } from '../auth/AuthPages'
import { apiErrorMessage, validationErrors } from '../auth/authApi'
import { usePlayerPreferences } from '../../app/providers/PreferencesProvider'
import { getProfile, profileQueryKeys, updateProfile } from './profileApi'

type FormErrors = Record<string, string>

export function ProfilePage() {
  const queryClient = useQueryClient()
  const { soundEffects, reduceMotion, setSoundEffects, setReduceMotion } = usePlayerPreferences()
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const profileQuery = useQuery({ queryKey: profileQueryKeys.current, queryFn: getProfile })
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKeys.current, profile)
      setEditing(false)
      setNotice('Your guild membership card has been updated.')
    },
    onError: (error) => {
      const fieldErrors = validationErrors(error)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length === 0) setNotice(apiErrorMessage(error, 'Your guild membership card could not be updated.'))
    },
  })

  useEffect(() => {
    if (!notice || updateMutation.isError) return undefined
    const timer = window.setTimeout(() => setNotice(null), 4_000)
    return () => window.clearTimeout(timer)
  }, [notice, updateMutation.isError])

  if (profileQuery.isPending) return <section className="grid min-h-80 place-items-center"><LoadingIndicator label="Opening your guild membership card…" size="lg" /></section>
  if (profileQuery.isError || !profileQuery.data) return <Panel className="mx-auto max-w-xl text-center"><h1 className="pixel-heading text-sm">Your membership card is misplaced</h1><p className="mt-4 text-cocoa-plum/80">We could not retrieve your guild identity. Please try again.</p><Button className="mt-5" onClick={() => void profileQuery.refetch()}>Try again</Button></Panel>

  const profile = profileQuery.data

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') ?? '')
    const passwordConfirmation = String(form.get('password_confirmation') ?? '')
    setErrors({})
    setNotice(null)

    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: 'The new password confirmation does not match.' })
      return
    }

    updateMutation.mutate({
      name: String(form.get('name')),
      email: String(form.get('email')),
      ...(password ? { password, password_confirmation: passwordConfirmation } : {}),
    })
  }

  return (
    <section className="profile-page mx-auto max-w-5xl" aria-labelledby="profile-heading">
      <header><p className="font-bold text-cocoa-plum/70">The keeper’s record of your guild</p><h1 id="profile-heading" className="pixel-heading mt-2 text-base sm:text-xl">My Profile</h1></header>
      {notice && <p role="status" className={`profile-notice mt-5 ${updateMutation.isError ? 'bg-dusty-pink' : 'bg-mint-sage'}`}>{notice}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,.9fr)]">
        <Panel className="profile-membership-card overflow-hidden p-0">
          <div className="profile-membership-card__seal" aria-hidden="true">🐾</div>
          <div className="p-6 sm:p-8"><p className="font-bold text-cocoa-plum/70">Purrfect Guild membership</p><h2 className="pixel-heading mt-3 text-sm sm:text-lg">{profile.name}</h2><dl className="mt-7 grid gap-4 sm:grid-cols-2"><ProfileDetail label="Guild address" value={profile.email} /><ProfileDetail label="Standing" value={profile.role === 'admin' ? 'Guild Master' : 'Guild member'} /><ProfileDetail label="Member since" value={formatProfileDate(profile.created_at)} /></dl><Button className="mt-8" onClick={() => { setErrors({}); setNotice(null); setEditing(true) }}>Edit membership card</Button></div>
        </Panel>
        <div className="grid gap-6">
          <Panel><h2 className="pixel-heading text-xs">Guild preferences</h2><div className="mt-5 grid gap-4"><PreferenceToggle id="sound-effects" label="Optional sound effects" description="Allow future guild sound effects when they are available." checked={soundEffects} onChange={setSoundEffects} /><PreferenceToggle id="reduced-motion" label="Reduce motion" description="Minimize interface animations in addition to your operating system preference." checked={reduceMotion} onChange={setReduceMotion} /></div></Panel>
          <Panel><h2 className="pixel-heading text-xs">Need a refresher?</h2><p className="mt-4 text-cocoa-plum/80">Freeona is always happy to show you around again.</p><Link to="/onboarding" className="profile-replay-link mt-5">Replay Freeona’s welcome tour</Link></Panel>
          <Panel><h2 className="pixel-heading text-xs">Leave the guild hall</h2><p className="mt-4 text-cocoa-plum/80">This signs you out on this device and asks Laravel to revoke the current token.</p><div className="mt-5"><LogoutAction /></div></Panel>
        </div>
      </div>
      <Dialog open={editing} title="Edit membership card" onClose={() => !updateMutation.isPending && setEditing(false)}><form className="grid gap-4" onSubmit={submitProfile} noValidate><Field label="Guildmaster name" error={errors.name}><Input name="name" defaultValue={profile.name} autoComplete="name" required /></Field><Field label="Email" error={errors.email}><Input name="email" type="email" defaultValue={profile.email} autoComplete="email" required /></Field><Field label="New password" hint="Leave blank to keep your current password." error={errors.password}><Input name="password" type="password" autoComplete="new-password" /></Field><Field label="Confirm new password" error={errors.password_confirmation}><Input name="password_confirmation" type="password" autoComplete="new-password" /></Field><div className="mt-2 flex flex-wrap justify-end gap-3"><Button variant="ghost" onClick={() => setEditing(false)} disabled={updateMutation.isPending}>Cancel</Button><Button type="submit" loading={updateMutation.isPending}>Save membership card</Button></div></form></Dialog>
    </section>
  )
}

function PreferenceToggle({ id, label, description, checked, onChange }: { id: string; label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label htmlFor={id} className="profile-preference"><input id={id} type="checkbox" className="size-5 accent-dusty-pink" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span><span className="block font-extrabold">{label}</span><span className="mt-1 block text-sm text-cocoa-plum/75">{description}</span></span></label>
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border-2 border-soft-caramel bg-vanilla-cream/70 p-4"><dt className="text-sm font-bold text-cocoa-plum/70">{label}</dt><dd className="mt-1 break-words font-extrabold">{value}</dd></div>
}

export function formatProfileDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
}
