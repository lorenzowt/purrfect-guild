import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { clearAccessToken, setAccessToken } from '../src/lib/api/client'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }
const profile = { id: 1, name: 'Mittens', email: 'mittens@example.test', role: 'user' as const, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }

function renderRoute(path = '/profile') {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

function useProfileHandler(response = profile) {
  server.use(http.get(`${apiUrl}/users/me`, () => HttpResponse.json({ data: response, message: 'Profile retrieved successfully.' })))
}

afterEach(() => {
  clearAccessToken()
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-reduced-motion')
})

describe('Player Profile', () => {
  it('renders authenticated profile information from Laravel and sends the bearer token', async () => {
    let authorization: string | null = null
    setAccessToken('profile-token')
    server.use(http.get(`${apiUrl}/users/me`, ({ request }) => {
      authorization = request.headers.get('authorization')
      return HttpResponse.json({ data: profile, message: 'Profile retrieved successfully.' })
    }))
    renderRoute()

    expect(await screen.findByRole('heading', { name: 'My Profile' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mittens' })).toBeInTheDocument()
    expect(screen.getByText('mittens@example.test')).toBeInTheDocument()
    expect(screen.getByText('Guild member')).toBeInTheDocument()
    expect(authorization).toBe('Bearer profile-token')
  })

  it('shows loading and error states', async () => {
    server.use(http.get(`${apiUrl}/users/me`, async () => new Promise<never>(() => {})))
    const loading = renderRoute()
    expect(screen.getByRole('status')).toHaveTextContent('Opening your guild membership card…')
    loading.unmount()

    server.use(http.get(`${apiUrl}/users/me`, () => HttpResponse.json({ message: 'Unavailable.' }, { status: 500 })))
    renderRoute()
    expect(await screen.findByRole('heading', { name: 'Your membership card is misplaced' }, { timeout: 2_500 })).toBeInTheDocument()
  })

  it('updates only documented profile fields and refreshes the membership card', async () => {
    const user = userEvent.setup()
    let submitted: unknown
    useProfileHandler()
    server.use(http.patch(`${apiUrl}/users/me`, async ({ request }) => {
      submitted = await request.json()
      return HttpResponse.json({ data: { ...profile, name: 'Captain Mittens', email: 'captain@example.test' }, message: 'Profile updated successfully.' })
    }))
    renderRoute()

    await screen.findByRole('heading', { name: 'Mittens' })
    await user.click(screen.getByRole('button', { name: 'Edit membership card' }))
    await user.clear(screen.getByLabelText('Guildmaster name'))
    await user.type(screen.getByLabelText('Guildmaster name'), 'Captain Mittens')
    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'captain@example.test')
    await user.click(screen.getByRole('button', { name: 'Save membership card' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Your guild membership card has been updated.')
    expect(screen.getByRole('heading', { name: 'Captain Mittens' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(submitted).toEqual({ name: 'Captain Mittens', email: 'captain@example.test' })
  })

  it('keeps the edit dialog open for Laravel validation errors', async () => {
    const user = userEvent.setup()
    useProfileHandler()
    server.use(http.patch(`${apiUrl}/users/me`, () => HttpResponse.json({ message: 'The given data was invalid.', errors: { email: ['This email is already in use.'] } }, { status: 422 })))
    renderRoute()

    await screen.findByRole('heading', { name: 'Mittens' })
    await user.click(screen.getByRole('button', { name: 'Edit membership card' }))
    await user.click(screen.getByRole('button', { name: 'Save membership card' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('This email is already in use.')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('stores sound and reduced-motion preferences locally and applies the motion override', async () => {
    const user = userEvent.setup()
    useProfileHandler()
    renderRoute()

    await screen.findByRole('heading', { name: 'Mittens' })
    const sound = screen.getByRole('checkbox', { name: /Optional sound effects/i })
    const motion = screen.getByRole('checkbox', { name: /Reduce motion/i })
    await user.click(sound)
    await user.click(motion)

    expect(sound).not.toBeChecked()
    expect(motion).toBeChecked()
    expect(JSON.parse(window.localStorage.getItem('purrfect-guild:preferences') ?? '{}')).toEqual({ soundEffects: false, reduceMotion: true })
    expect(document.documentElement).toHaveAttribute('data-reduced-motion')
  })

  it('replays the existing tutorial and exposes the existing logout action', async () => {
    const user = userEvent.setup()
    useProfileHandler()
    renderRoute()

    await screen.findByRole('heading', { name: 'Mittens' })
    await user.click(screen.getByRole('link', { name: 'Replay Freeona’s welcome tour' }))
    expect(await screen.findByRole('heading', { name: 'A warm welcome' })).toBeInTheDocument()

    const profilePage = renderRoute()
    await screen.findByRole('heading', { name: 'Mittens' })
    await user.click(screen.getAllByRole('button', { name: 'Log out' })[0])
    expect(await screen.findByRole('heading', { name: 'A Guild of Whiskers & Wonder' })).toBeInTheDocument()
    profilePage.unmount()
  })
})
