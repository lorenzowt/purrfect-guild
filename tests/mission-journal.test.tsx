import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { clearAccessToken, setAccessToken } from '../src/lib/api/client'
import type { Mission } from '../src/features/missions/missionsApi'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }
const missions: Mission[] = [
  { id: 1, status: 'assigned', quest: { id: 11, title: 'The Moonlit Mice' }, heroes: [{ id: 1, name: 'Biscuit' }, { id: 2, name: 'Mallow' }], completed_at: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, status: 'success', quest: { id: 12, title: 'Lantern Marsh' }, heroes: [{ id: 3, name: 'Pebble' }], completed_at: '2026-01-02T00:00:00Z', created_at: '2026-01-01T00:00:00Z' },
  { id: 3, status: 'failure', quest: { id: 13, title: 'Tower of Yarn' }, heroes: [{ id: 4, name: 'Clover' }], completed_at: '2026-01-03T00:00:00Z', created_at: '2026-01-01T00:00:00Z' },
  { id: 4, status: 'canceled', quest: { id: 14, title: 'Whisker Woods' }, heroes: [], completed_at: '2026-01-04T00:00:00Z', created_at: '2026-01-01T00:00:00Z' },
]

function paginated(data: Mission[], options: { currentPage?: number; lastPage?: number; total?: number; next?: string | null; prev?: string | null } = {}) {
  const { currentPage = 1, lastPage = 1, total = data.length, next = null, prev = null } = options
  return { data, links: { first: null, last: null, prev, next }, meta: { current_page: currentPage, from: data.length ? 1 : null, last_page: lastPage, per_page: 12, to: data.length || null, total }, message: 'Missions retrieved successfully.' }
}

function renderRoute(path: string) {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

function useJournalHandler(response = paginated(missions)) {
  server.use(http.get(`${apiUrl}/missions`, () => HttpResponse.json(response)))
}

afterEach(() => clearAccessToken())

describe('Mission Journal', () => {
  it('renders mission quest, heroes, dates, and every documented status', async () => {
    useJournalHandler()
    renderRoute('/missions')

    expect(await screen.findByRole('heading', { name: 'Mission Journal' })).toBeInTheDocument()
    expect(screen.getByText('The Moonlit Mice')).toBeInTheDocument()
    expect(screen.getByText(/Biscuit/)).toBeInTheDocument()
    expect(screen.getByText(/Mallow/)).toBeInTheDocument()
    expect(screen.getByText('Status: Assigned')).toBeInTheDocument()
    expect(screen.getByText('Status: Success')).toBeInTheDocument()
    expect(screen.getByText('Status: Failure')).toBeInTheDocument()
    expect(screen.getByText('Status: Canceled')).toBeInTheDocument()
    expect(screen.getByText('Not completed')).toBeInTheDocument()
  })

  it('opens a keyboard-accessible detail view with recorded information only', async () => {
    const user = userEvent.setup()
    useJournalHandler(paginated([missions[0]]))
    server.use(http.get(`${apiUrl}/missions/1`, () => HttpResponse.json({ data: missions[0], message: 'Mission retrieved successfully.' })))
    renderRoute('/missions')

    const entry = await screen.findByRole('link', { name: 'Open mission 1 journal entry' })
    entry.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('heading', { name: 'The Moonlit Mice' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Assigned adventurers' })).toBeInTheDocument()
    expect(screen.getByText(/Biscuit/)).toBeInTheDocument()
    expect(screen.getByText(/Laravel will determine the expedition’s result/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Complete adventure' })).toBeInTheDocument()
  })

  it('shows newest missions first within the API page and highlights the completion path', async () => {
    useJournalHandler(paginated([{ ...missions[0], created_at: '2026-01-01T00:00:00Z' }, { ...missions[1], created_at: '2026-02-01T00:00:00Z' }]))
    renderRoute('/missions')

    const entries = await screen.findAllByRole('link', { name: /Open mission .* journal entry/ })
    expect(entries[0]).toHaveTextContent('Lantern Marsh')
    expect(entries[1]).toHaveTextContent('The Moonlit Mice')
    expect(entries[1]).toHaveTextContent('Complete quest')
  })

  it('follows mission pagination links without assuming an undocumented page parameter', async () => {
    const user = userEvent.setup()
    const nextUrl = `${apiUrl}/missions?page=2&per_page=12`
    let firstRequestUrl = ''
    server.use(http.get(`${apiUrl}/missions`, ({ request }) => {
      const url = new URL(request.url)
      if (url.searchParams.get('page') === '2') return HttpResponse.json(paginated([missions[1]], { currentPage: 2, lastPage: 2, total: 2, prev: `${apiUrl}/missions?per_page=12` }))
      firstRequestUrl = url.toString()
      return HttpResponse.json(paginated([missions[0]], { currentPage: 1, lastPage: 2, total: 2, next: nextUrl }))
    }))
    renderRoute('/missions')

    expect(await screen.findByText('The Moonlit Mice')).toBeInTheDocument()
    expect(firstRequestUrl).toContain('per_page=12')
    expect(new URL(firstRequestUrl).searchParams.has('page')).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Lantern Marsh')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
  })

  it('shows empty, loading, and API error states', async () => {
    server.use(http.get(`${apiUrl}/missions`, async () => new Promise<never>(() => {})))
    const loading = renderRoute('/missions')
    expect(screen.getByRole('status')).toHaveTextContent('Opening the mission journal…')
    loading.unmount()

    useJournalHandler(paginated([]))
    const empty = renderRoute('/missions')
    expect(await screen.findByRole('heading', { name: 'No adventures recorded' })).toBeInTheDocument()
    empty.unmount()

    server.use(http.get(`${apiUrl}/missions`, () => HttpResponse.json({ message: 'Journal unavailable.' }, { status: 500 })))
    renderRoute('/missions')
    expect(await screen.findByRole('heading', { name: 'The journal is misplaced' }, { timeout: 2_500 })).toBeInTheDocument()
  })

  it('handles unavailable entries and includes the in-memory bearer token', async () => {
    let authorization: string | null = null
    setAccessToken('journal-token')
    server.use(http.get(`${apiUrl}/missions`, ({ request }) => { authorization = request.headers.get('authorization'); return HttpResponse.json(paginated([])) }))
    const journal = renderRoute('/missions')
    await screen.findByRole('heading', { name: 'No adventures recorded' })
    expect(authorization).toBe('Bearer journal-token')
    journal.unmount()

    server.use(http.get(`${apiUrl}/missions/404`, () => HttpResponse.json({ message: 'Not found.' }, { status: 404 })))
    renderRoute('/missions/404')
    expect(await screen.findByRole('heading', { name: 'This mission entry is unavailable' }, { timeout: 2_500 })).toBeInTheDocument()
  })
})
