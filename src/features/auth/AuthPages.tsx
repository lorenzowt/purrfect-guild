import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { FormEvent, ReactNode } from 'react'
import { Button, Card, Field, Input, Panel } from '../../components/ui'
import { apiErrorMessage, validationErrors } from './authApi'
import { useAuth } from '../../app/providers/AuthStateProvider'

type FormErrors = Record<string, string>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState<string | null>((location.state as { registrationComplete?: boolean } | null)?.registrationComplete ? 'Your guild is registered. Log in to receive the keys.' : null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setErrors({})
    setMessage(null)
    setIsSubmitting(true)
    try {
      const result = await login({ email: String(form.get('email')), password: String(form.get('password')) })
      const onboardingEmail = (location.state as { onboardingEmail?: string } | null)?.onboardingEmail
      const redirectTo = onboardingEmail?.toLowerCase() === String(form.get('email')).toLowerCase() ? '/onboarding' : result.redirectTo
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const fieldErrors = validationErrors(error)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length === 0) setMessage(apiErrorMessage(error, 'The guild gates are quiet. Please check your connection and try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthShell title="Welcome back, guildmaster" subtitle="Your adventurers have kept a warm seat by the hearth."><form className="grid gap-4" onSubmit={handleSubmit} noValidate><Field label="Email" error={errors.email}><Input name="email" type="email" autoComplete="email" required /></Field><Field label="Password" error={errors.password}><Input name="password" type="password" autoComplete="current-password" required /></Field>{message && <p role="alert" className="rounded-lg bg-dusty-pink/40 p-3 font-semibold text-cocoa-plum">{message}</p>}<Button type="submit" loading={isSubmitting}>Enter the Guild Hall</Button></form><p className="mt-5 text-center text-cocoa-plum/80">New to the guild? <Link className="font-bold text-cocoa-plum underline" to="/register">Create your guild</Link>.</p></AuthShell>
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setErrors({})
    setMessage(null)
    setIsSubmitting(true)
    try {
      await register({ name: String(form.get('name')), email: String(form.get('email')), password: String(form.get('password')), password_confirmation: String(form.get('password_confirmation')) })
      navigate('/login', { replace: true, state: { registrationComplete: true, onboardingEmail: String(form.get('email')) } })
    } catch (error) {
      const fieldErrors = validationErrors(error)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length === 0) setMessage(apiErrorMessage(error, 'We could not register your guild. Please try again shortly.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthShell title="Claim your guild hall" subtitle="Choose a name and gather your first band of whiskered heroes."><form className="grid gap-4" onSubmit={handleSubmit} noValidate><Field label="Guildmaster name" error={errors.name}><Input name="name" autoComplete="name" required /></Field><Field label="Email" error={errors.email}><Input name="email" type="email" autoComplete="email" required /></Field><Field label="Password" hint="Use at least the security requirements set by the guild." error={errors.password}><Input name="password" type="password" autoComplete="new-password" required /></Field><Field label="Confirm password" error={errors.password_confirmation}><Input name="password_confirmation" type="password" autoComplete="new-password" required /></Field>{message && <p role="alert" className="rounded-lg bg-dusty-pink/40 p-3 font-semibold text-cocoa-plum">{message}</p>}<Button type="submit" loading={isSubmitting}>Register the guild</Button></form><p className="mt-5 text-center text-cocoa-plum/80">Already a guildmaster? <Link className="font-bold text-cocoa-plum underline" to="/login">Log in</Link>.</p></AuthShell>
}

export function OnboardingPlaceholderPage() {
  return <Panel className="max-w-3xl"><span className="text-3xl" aria-hidden="true">🐾</span><h1 className="pixel-heading mt-4 text-base text-cocoa-plum sm:text-lg">The tavern keeper is waiting</h1><p className="mt-5 text-lg text-cocoa-plum/80">Your new guild is ready. The full welcome tour arrives in Phase 4.</p><Link className="mt-6 inline-block font-bold text-cocoa-plum underline" to="/guild">Explore the Guild Hall</Link></Panel>
}

export function LogoutAction() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogout() {
    setIsSubmitting(true)
    const logoutPromise = logout()
    navigate('/', { replace: true })
    const result = await logoutPromise
    if (!result.serverRevoked) navigate('/', { replace: true, state: { logoutWarning: 'You were signed out on this device, but the guild could not confirm server-side token revocation.' } })
    setIsSubmitting(false)
  }

  return <Button variant="ghost" size="sm" loading={isSubmitting} onClick={handleLogout}>Log out</Button>
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <section className="mx-auto grid max-w-md gap-5 py-4"><Card className="pixel-border"><h1 className="pixel-heading text-sm text-cocoa-plum">{title}</h1><p className="mt-4 text-cocoa-plum/80">{subtitle}</p><div className="mt-6">{children}</div></Card></section>
}
