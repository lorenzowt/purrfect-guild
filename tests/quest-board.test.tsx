import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { clearAccessToken, setAccessToken } from '../src/lib/api/client'
import type { Quest } from '../src/features/quests/questsApi'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }
const quests: Quest[] = [
  { id: 1, title: 'The Moonlit Mice', description: 'A moonlit swarm has taken over the village granary.', boss: 'The Cheese Baron', difficulty: 3, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, title: 'Lantern Marsh', description: 'Follow the friendly lights into a very suspicious marsh.', boss: 'Bogwhisker', difficulty: 6, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

function paginated(data: Quest[], options: { currentPage?: number; lastPage?: number; total?: number; next?: string | null; prev?: string | null } = {}) {
  const { currentPage = 1, lastPage = 1, total = data.length, next = null, prev = null } = options
  return { data, links: { first: null, last: null, prev, next }, meta: { current_page: currentPage, from: data.length ? 1 : null, last_page: lastPage, per_page: 12, to: data.length || null, total }, message: 'Quests retrieved successfully.' }
}

function renderRoute(path: string) {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

function useQuestHandler(response = paginated(quests)) {
  server.use(http.get(`${apiUrl}/quests`, () => HttpResponse.json(response)))
}

afterEach(() => clearAccessToken())

describe('Quest Board', () => {
  it('renders backend quest information as parchment notices', async () => {
    useQuestHandler()
    renderRoute('/quests')

    expect(await screen.findByRole('heading', { name: 'Quest Board' })).toBeInTheDocument()
    expect(screen.getByText('The Moonlit Mice')).toBeInTheDocument()
    expect(screen.getByText('A moonlit swarm has taken over the village granary.')).toBeInTheDocument()
    expect(screen.getByText('The Cheese Baron')).toBeInTheDocument()
    expect(screen.getByText('Difficulty 3/10')).toBeInTheDocument()
  })

  it('opens accessible full quest details and navigates to the party-builder contract', async () => {
    const user = userEvent.setup()
    useQuestHandler(paginated([quests[0]]))
    server.use(http.get(`${apiUrl}/quests/1`, () => HttpResponse.json({ data: quests[0], message: 'Quest retrieved successfully.' })))
    renderRoute('/quests')

    await user.click(await screen.findByRole('button', { name: 'Inspect quest' }))
    expect(await screen.findByRole('dialog', { name: 'The Moonlit Mice' })).toBeInTheDocument()
    expect(screen.getByText('Challenge')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Assemble your party' }))
    expect(await screen.findByRole('heading', { name: 'Party Builder' })).toBeInTheDocument()
  })

  it('supports keyboard opening and closing of quest details', async () => {
    const user = userEvent.setup()
    useQuestHandler(paginated([quests[0]]))
    server.use(http.get(`${apiUrl}/quests/1`, () => HttpResponse.json({ data: quests[0], message: 'Quest retrieved successfully.' })))
    renderRoute('/quests')

    const inspect = await screen.findByRole('button', { name: 'Inspect quest' })
    inspect.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('follows API pagination links without assuming an undocumented page parameter', async () => {
    const user = userEvent.setup()
    const nextUrl = `${apiUrl}/quests?page=2&per_page=12`
    let firstRequestUrl = ''
    server.use(http.get(`${apiUrl}/quests`, ({ request }) => {
      const url = new URL(request.url)
      if (url.searchParams.get('page') === '2') return HttpResponse.json(paginated([quests[1]], { currentPage: 2, lastPage: 2, total: 2, prev: `${apiUrl}/quests?per_page=12` }))
      firstRequestUrl = url.toString()
      return HttpResponse.json(paginated([quests[0]], { currentPage: 1, lastPage: 2, total: 2, next: nextUrl }))
    }))
    renderRoute('/quests')

    expect(await screen.findByText('The Moonlit Mice')).toBeInTheDocument()
    expect(firstRequestUrl).toContain('per_page=8')
    expect(new URL(firstRequestUrl).searchParams.has('page')).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Lantern Marsh')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
  })

  it('shows loading, empty, and API error states', async () => {
    server.use(http.get(`${apiUrl}/quests`, async () => new Promise<never>(() => {})))
    const loading = renderRoute('/quests')
    expect(screen.getByRole('status')).toHaveTextContent('Pinning up available quests…')
    loading.unmount()

    useQuestHandler(paginated([]))
    const empty = renderRoute('/quests')
    expect(await screen.findByRole('heading', { name: 'No quests on the board' })).toBeInTheDocument()
    empty.unmount()

    server.use(http.get(`${apiUrl}/quests`, () => HttpResponse.json({ message: 'Board unavailable.' }, { status: 500 })))
    renderRoute('/quests')
    expect(await screen.findByRole('heading', { name: 'The quest board is being repaired' }, { timeout: 2_500 })).toBeInTheDocument()
  })

  it('sends the in-memory bearer token with quest requests', async () => {
    let authorization: string | null = null
    setAccessToken('quest-token')
    server.use(http.get(`${apiUrl}/quests`, ({ request }) => {
      authorization = request.headers.get('authorization')
      return HttpResponse.json(paginated([]))
    }))
    renderRoute('/quests')
    await screen.findByRole('heading', { name: 'No quests on the board' })
    expect(authorization).toBe('Bearer quest-token')
  })
})
