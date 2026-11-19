import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }

function paginated<T>(data: T[], total = data.length, message = 'Retrieved successfully.') {
  return {
    data,
    links: { first: null, last: null, prev: null, next: null },
    meta: { current_page: 1, from: data.length ? 1 : null, last_page: Math.max(1, Math.ceil(total / 100)), links: [], path: apiUrl, per_page: 100, to: data.length || null, total },
    message,
  }
}

function renderGuildHall() {
  return render(
    <AppProviders authState={authenticatedUser}>
      <MemoryRouter initialEntries={['/guild']}><ApplicationRoutes /></MemoryRouter>
    </AppProviders>,
  )
}

interface OverviewResponses {
  heroes?: ReturnType<typeof paginated<unknown>>
  quests?: ReturnType<typeof paginated<unknown>>
  missions?: ReturnType<typeof paginated<unknown>>
}

function useOverviewHandlers({ heroes = paginated<unknown>([]), quests = paginated<unknown>([]), missions = paginated<unknown>([]) }: OverviewResponses = {}) {
  server.use(
    http.get(`${apiUrl}/heroes`, ({ request }) => {
      expect(new URL(request.url).searchParams.get('per_page')).toBe('100')
      return HttpResponse.json(heroes)
    }),
    http.get(`${apiUrl}/quests`, () => HttpResponse.json(quests)),
    http.get(`${apiUrl}/missions`, () => HttpResponse.json(missions)),
  )
}

describe('Guild Hall', () => {
  it('renders the temporary tavern and API-backed overview', async () => {
    useOverviewHandlers({
      heroes: paginated([{ id: 1, name: 'Mittens', hero_class: 'warrior', level: 2, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }]),
      quests: paginated([{ id: 2, title: 'Mouse in the Moonlight', description: 'A tiny mystery.', difficulty: 1, boss: 'Moon Mouse', active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }]),
      missions: paginated([{ id: 3, status: 'assigned', quest: { id: 2, title: 'Mouse in the Moonlight' }, heroes: [{ id: 1, name: 'Mittens' }], completed_at: null, created_at: '2026-01-01T00:00:00Z' }]),
    })
    renderGuildHall()

    expect(await screen.findByRole('heading', { name: 'Guild Overview' })).toBeInTheDocument()
    expect(screen.getByText('Welcome back, Test Guildmaster')).toBeInTheDocument()
    expect(screen.getByText('Temporary CSS tavern illustration')).toBeInTheDocument()
    expect(screen.getAllByText('1', { selector: 'p' })).toHaveLength(4)
    expect(screen.getByText('ready for adventure')).toBeInTheDocument()
    expect(screen.getByText('currently underway')).toBeInTheDocument()
  })

  it('uses native links that support keyboard navigation to a route placeholder', async () => {
    const user = userEvent.setup()
    useOverviewHandlers()
    renderGuildHall()

    const adventurers = await screen.findByRole('link', { name: /Visit Adventurers’ Corner/i })
    adventurers.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { name: 'Adventurers’ Corner' })).toBeInTheDocument()
  })

  it('shows a loading state while the guild data is being retrieved', () => {
    server.use(
      http.get(`${apiUrl}/heroes`, async () => new Promise<never>(() => {})),
      http.get(`${apiUrl}/quests`, async () => new Promise<never>(() => {})),
      http.get(`${apiUrl}/missions`, async () => new Promise<never>(() => {})),
    )
    renderGuildHall()
    expect(screen.getByRole('status')).toHaveTextContent('Warming the Guild Hall hearth…')
  })

  it('shows the quiet-hall empty state when all paginated totals are zero', async () => {
    useOverviewHandlers()
    renderGuildHall()
    expect(await screen.findByRole('heading', { name: 'A quiet guild hall' })).toBeInTheDocument()
  })

  it('shows a recoverable error state when an overview request fails', async () => {
    server.use(http.get(`${apiUrl}/heroes`, () => HttpResponse.json({ message: 'No ledger today.' }, { status: 500 })))
    renderGuildHall()
    expect(await screen.findByRole('heading', { name: 'Guild Hall unavailable' }, { timeout: 2_500 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('does not turn a partial page into an inaccurate available-hero total', async () => {
    useOverviewHandlers({
      heroes: paginated([{ id: 1, name: 'Mittens', hero_class: 'warrior', level: 2, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }], 101),
    })
    renderGuildHall()

    expect(await screen.findByText('Roster spans more than one page')).toBeInTheDocument()
    expect(screen.queryByText('ready for adventure')).not.toBeInTheDocument()
  })
})
