import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { clearAccessToken, setAccessToken } from '../src/lib/api/client'
import { HeroPortrait, portraitVariant } from '../src/features/heroes/HeroPortrait'
import type { Hero } from '../src/features/heroes/heroesApi'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }

const heroes: Hero[] = [
  { id: 1, name: 'Biscuit', hero_class: 'warrior', level: 4, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Pebble', hero_class: 'mage', level: 3, status: 'on_mission', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, name: 'Clover', hero_class: 'rogue', level: 2, status: 'injured', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 4, name: 'Mallow', hero_class: 'cleric', level: 5, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

function paginated(data: Hero[], options: { currentPage?: number; lastPage?: number; total?: number; next?: string | null; prev?: string | null } = {}) {
  const { currentPage = 1, lastPage = 1, total = data.length, next = null, prev = null } = options
  return { data, links: { first: null, last: null, prev, next }, meta: { current_page: currentPage, from: data.length ? 1 : null, last_page: lastPage, per_page: 12, to: data.length || null, total }, message: 'Heroes retrieved successfully.' }
}

function renderRoute(path: string) {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

function useRosterHandler(response = paginated(heroes)) {
  server.use(http.get(`${apiUrl}/heroes`, () => HttpResponse.json(response)))
}

afterEach(() => clearAccessToken())

describe('Hero Roster', () => {
  it('renders a collectible roster with class, level, status, and accessible portraits', async () => {
    useRosterHandler()
    renderRoute('/heroes')

    expect(await screen.findByRole('heading', { name: 'Adventurers’ Corner' })).toBeInTheDocument()
    expect(screen.getByText('Biscuit')).toBeInTheDocument()
    expect(screen.getByText('Warrior')).toBeInTheDocument()
    expect(screen.getAllByText(/Level/)).toHaveLength(4)
    expect(screen.getByText('On Mission')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Pebble, Mage portrait' })).toBeInTheDocument()
  })

  it('selects the same CSS portrait variation for a hero on every render', () => {
    const { rerender } = render(<HeroPortrait hero={heroes[1]} />)
    const portrait = screen.getByRole('img', { name: 'Pebble, Mage portrait' })
    expect(portrait).toHaveClass('hero-portrait--variant-2')
    expect(portraitVariant(heroes[1])).toBe(2)
    rerender(<HeroPortrait hero={heroes[1]} />)
    expect(screen.getByRole('img', { name: 'Pebble, Mage portrait' })).toHaveClass('hero-portrait--variant-2')
  })

  it('follows API pagination links without inventing a page parameter', async () => {
    const user = userEvent.setup()
    const nextUrl = `${apiUrl}/heroes?page=2&per_page=12`
    let firstRequestUrl = ''
    server.use(http.get(`${apiUrl}/heroes`, ({ request }) => {
      const url = new URL(request.url)
      if (url.searchParams.get('page') === '2') return HttpResponse.json(paginated([heroes[1]], { currentPage: 2, lastPage: 2, total: 2, prev: `${apiUrl}/heroes?per_page=12` }))
      firstRequestUrl = url.toString()
      return HttpResponse.json(paginated([heroes[0]], { currentPage: 1, lastPage: 2, total: 2, next: nextUrl }))
    }))
    renderRoute('/heroes')

    expect(await screen.findByText('Biscuit')).toBeInTheDocument()
    expect(firstRequestUrl).toContain('per_page=12')
    expect(new URL(firstRequestUrl).searchParams.has('page')).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Pebble')).toBeInTheDocument()
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
  })

  it('shows an empty roster state', async () => {
    useRosterHandler(paginated([]))
    renderRoute('/heroes')
    expect(await screen.findByRole('heading', { name: 'No adventurers yet' })).toBeInTheDocument()
  })

  it('shows loading and API error states', async () => {
    server.use(http.get(`${apiUrl}/heroes`, async () => new Promise<never>(() => {})))
    const loading = renderRoute('/heroes')
    expect(screen.getByRole('status')).toHaveTextContent('Gathering your adventurers…')
    loading.unmount()

    server.use(http.get(`${apiUrl}/heroes`, () => HttpResponse.json({ message: 'Ledger unavailable.' }, { status: 500 })))
    renderRoute('/heroes')
    expect(await screen.findByRole('heading', { name: 'The roster is out on patrol' }, { timeout: 2_500 })).toBeInTheDocument()
  })

  it('opens a typed hero detail view from the roster', async () => {
    const user = userEvent.setup()
    useRosterHandler(paginated([heroes[0]]))
    server.use(http.get(`${apiUrl}/heroes/1`, () => HttpResponse.json({ data: heroes[0], message: 'Hero retrieved successfully.' })))
    renderRoute('/heroes')

    await user.click(await screen.findByRole('link', { name: 'View adventurer details' }))
    expect(await screen.findByRole('heading', { name: 'Biscuit' })).toBeInTheDocument()
    expect(screen.getByText('Guild adventurer')).toBeInTheDocument()
    expect(screen.getAllByText('Available')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Back to Adventurers’ Corner/i })).toBeInTheDocument()
  })

  it('sends the in-memory bearer token with roster requests', async () => {
    let authorization: string | null = null
    setAccessToken('roster-token')
    server.use(http.get(`${apiUrl}/heroes`, ({ request }) => {
      authorization = request.headers.get('authorization')
      return HttpResponse.json(paginated([]))
    }))
    renderRoute('/heroes')
    await screen.findByRole('heading', { name: 'No adventurers yet' })
    expect(authorization).toBe('Bearer roster-token')
  })
})
