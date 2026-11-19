import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { AppProviders } from '../src/app/providers/AppProviders'
import type { AuthState } from '../src/app/providers/AuthStateProvider'

function renderRoute(path: string, authState: AuthState = { status: 'guest' }) {
  return render(
    <AppProviders authState={authState}>
      <MemoryRouter initialEntries={[path]}>
        <ApplicationRoutes />
      </MemoryRouter>
    </AppProviders>,
  )
}

describe('application routing', () => {
  it('matches the public welcome route', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { name: 'A Guild of Whiskers & Wonder' })).toBeInTheDocument()
  })

  it('redirects guests from protected player routes to login', () => {
    renderRoute('/heroes')
    expect(screen.getByRole('heading', { name: 'Welcome back, guildmaster' })).toBeInTheDocument()
  })

  it('shows a loading state while authentication status is being resolved', () => {
    renderRoute('/guild', { status: 'loading' })
    expect(screen.getByRole('status')).toHaveTextContent('Opening the guild gates…')
  })

  it('redirects authenticated players away from guest-only routes', async () => {
    renderRoute('/login', { status: 'authenticated', user: { role: 'user' } })
    expect(await screen.findByRole('heading', { name: 'Guild Hall' })).toBeInTheDocument()
  })

  it('navigates between authenticated player pages', async () => {
    const user = userEvent.setup()
    renderRoute('/guild', { status: 'authenticated', user: { role: 'user' } })

    await user.click(screen.getByRole('link', { name: 'Quest Board' }))
    expect(screen.getByRole('heading', { name: 'Quest Board' })).toBeInTheDocument()
  })

  it('shows access denied to non-administrators on administrator routes', () => {
    renderRoute('/admin/users', { status: 'authenticated', user: { role: 'user' } })
    expect(screen.getByRole('heading', { name: 'Guild doors locked' })).toBeInTheDocument()
  })

  it('allows administrators to access administrator routes', () => {
    renderRoute('/admin/users', { status: 'authenticated', user: { role: 'admin' } })
    expect(screen.getByRole('heading', { name: 'User Management' })).toBeInTheDocument()
  })

  it('shows a not-found page for unknown paths', () => {
    renderRoute('/unmapped-hallway')
    expect(screen.getByRole('heading', { name: 'This path leads nowhere' })).toBeInTheDocument()
  })
})
