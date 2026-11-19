import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'

function profile(email: string, role: 'user' | 'admin' = 'user') {
  return { data: { id: 1, name: 'Mittens', email, role, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }, message: 'User retrieved successfully.' }
}

function renderAuthRoute(path: string) {
  return render(<AppProviders><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

async function completeLogin(user: ReturnType<typeof userEvent.setup>, email = 'guildmaster@example.test') {
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), 'password')
  await user.click(screen.getByRole('button', { name: 'Enter the Guild Hall' }))
}

describe('authentication', () => {
  it('registers a guild and displays Laravel validation errors', async () => {
    const user = userEvent.setup()
    server.use(http.post(`${apiUrl}/register`, () => HttpResponse.json({ message: 'The given data was invalid.', errors: { email: ['This email is already taken.'] } }, { status: 422 })))
    renderAuthRoute('/register')

    await user.type(screen.getByLabelText('Guildmaster name'), 'Mittens')
    await user.type(screen.getByLabelText('Email'), 'mittens@example.test')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText('Confirm password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Register the guild' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('This email is already taken.')
  })

  it('sends a successful registration to login and routes that account to onboarding', async () => {
    const user = userEvent.setup()
    const email = 'guildmaster@example.test'
    server.use(
      http.post(`${apiUrl}/register`, () => HttpResponse.json({ id: 2, name: 'New Guildmaster', email, role: 'user', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }, { status: 201 })),
      http.post(`${apiUrl}/login`, () => HttpResponse.json({ access_token: 'new-token', token_type: 'Bearer' })),
      http.get(`${apiUrl}/users/me`, () => HttpResponse.json(profile(email))),
    )
    renderAuthRoute('/register')

    await user.type(screen.getByLabelText('Guildmaster name'), 'New Guildmaster')
    await user.type(screen.getByLabelText('Email'), email)
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.type(screen.getByLabelText('Confirm password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Register the guild' }))
    expect(await screen.findByText('Your guild is registered. Log in to receive the keys.')).toBeInTheDocument()

    await completeLogin(user, email)
    expect(await screen.findByRole('heading', { name: 'A warm welcome' })).toBeInTheDocument()
  })

  it('attaches a bearer token, retrieves the profile, and enters the Guild Hall on a normal login', async () => {
    const user = userEvent.setup()
    let authorization: string | null = null
    server.use(
      http.post(`${apiUrl}/login`, () => HttpResponse.json({ access_token: 'passport-token', token_type: 'Bearer' })),
      http.get(`${apiUrl}/users/me`, ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json(profile('guildmaster@example.test'))
      }),
    )
    renderAuthRoute('/login')

    await completeLogin(user)
    expect(await screen.findByRole('heading', { name: 'Guild Hall' })).toBeInTheDocument()
    expect(authorization).toBe('Bearer passport-token')
  })

  it('explains invalid credentials without authenticating', async () => {
    const user = userEvent.setup()
    server.use(http.post(`${apiUrl}/login`, () => HttpResponse.json({ message: 'Invalid credentials.' }, { status: 401 })))
    renderAuthRoute('/login')

    await completeLogin(user)
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials.')
    expect(screen.queryByRole('heading', { name: 'Guild Hall' })).not.toBeInTheDocument()
  })

  it('logs out, revokes the token, and clears the authenticated interface', async () => {
    const user = userEvent.setup()
    let authorization: string | null = null
    server.use(
      http.post(`${apiUrl}/login`, () => HttpResponse.json({ access_token: 'logout-token', token_type: 'Bearer' })),
      http.post(`${apiUrl}/logout`, ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json({ message: 'Logged out.' })
      }),
    )
    renderAuthRoute('/login')

    await completeLogin(user)
    await user.click(await screen.findByRole('button', { name: 'Log out' }))
    expect(await screen.findByRole('heading', { name: 'A Guild of Whiskers & Wonder' })).toBeInTheDocument()
    expect(authorization).toBe('Bearer logout-token')
  })

  it('returns to the guest login route after a refresh because no token is persisted', () => {
    renderAuthRoute('/guild')
    expect(screen.getByRole('heading', { name: 'Welcome back, guildmaster' })).toBeInTheDocument()
  })
})
