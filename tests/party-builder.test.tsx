import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import type { Hero } from '../src/features/heroes/heroesApi'
import type { Quest } from '../src/features/quests/questsApi'
import { clearAccessToken, setAccessToken } from '../src/lib/api/client'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const authenticatedUser = { status: 'authenticated' as const, user: { role: 'user' as const } }
const quest: Quest = { id: 7, title: 'The Clockwork Catacombs', description: 'A curious clockwork noise echoes beneath the village.', boss: 'The Brass Tom', difficulty: 5, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
const heroes: Hero[] = [
  { id: 1, name: 'Biscuit', hero_class: 'warrior', level: 3, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Mallow', hero_class: 'cleric', level: 4, status: 'available', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, name: 'Clover', hero_class: 'rogue', level: 2, status: 'injured', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 4, name: 'Pebble', hero_class: 'mage', level: 6, status: 'on_mission', user_id: 1, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

function roster(data: Hero[]) {
  return { data, links: { first: null, last: null, prev: null, next: null }, meta: { current_page: 1, from: data.length ? 1 : null, last_page: 1, per_page: 12, to: data.length || null, total: data.length }, message: 'Heroes retrieved successfully.' }
}

function renderRoute(path = '/quests/7/party') {
  return render(<AppProviders authState={authenticatedUser}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>)
}

function useBuilderHandlers(rosterHeroes = heroes) {
  server.use(
    http.get(`${apiUrl}/quests/7`, () => HttpResponse.json({ data: quest, message: 'Quest retrieved successfully.' })),
    http.get(`${apiUrl}/heroes`, () => HttpResponse.json(roster(rosterHeroes))),
  )
}

afterEach(() => clearAccessToken())

describe('Party Builder', () => {
  it('displays the selected quest and makes availability clear', async () => {
    useBuilderHandlers()
    renderRoute()

    expect(await screen.findByRole('heading', { name: 'Party Builder' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The Clockwork Catacombs' })).toBeInTheDocument()
    expect(screen.getByText('Difficulty 5/10')).toBeInTheDocument()
    expect(screen.getByText('Boss: The Brass Tom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Clover.*Injured — unavailable/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Pebble.*On Mission — unavailable/i })).toBeDisabled()
  })

  it('adds and removes heroes, prevents duplicates, and enforces four slots', async () => {
    const user = userEvent.setup()
    const manyHeroes = [...heroes.slice(0, 2),
      { ...heroes[0], id: 5, name: 'Nori', hero_class: 'mage' as const },
      { ...heroes[1], id: 6, name: 'Juniper', hero_class: 'rogue' as const },
      { ...heroes[0], id: 7, name: 'Toast', hero_class: 'warrior' as const },
    ]
    useBuilderHandlers(manyHeroes)
    renderRoute()

    await user.click(await screen.findByRole('button', { name: /Biscuit.*Available/i }))
    expect(screen.getByLabelText('Party slots: 1 of 4 filled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Biscuit.*Selected/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /Mallow.*Available/i }))
    await user.click(screen.getByRole('button', { name: /Nori.*Available/i }))
    await user.click(screen.getByRole('button', { name: /Juniper.*Available/i }))
    expect(screen.getByLabelText('Party slots: 4 of 4 filled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Toast.*Party full/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Remove Biscuit from party' }))
    expect(screen.getByLabelText('Party slots: 3 of 4 filled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Biscuit.*Available/i })).not.toBeDisabled()
  })

  it('requires at least one hero before creation', async () => {
    useBuilderHandlers()
    renderRoute()

    await screen.findByRole('heading', { name: 'Party Builder' })
    expect(screen.getByRole('button', { name: 'Send on adventure!' })).toBeDisabled()
    // The disabled action makes the minimum requirement clear without issuing a mutation.
    expect(screen.getByText('0/4')).toBeInTheDocument()
  })

  it('sends the documented mission payload, refreshes caches, and redirects after success', async () => {
    const user = userEvent.setup()
    let requestCount = 0
    let submitted: unknown
    let heroRequests = 0
    server.use(
      http.get(`${apiUrl}/quests/7`, () => HttpResponse.json({ data: quest, message: 'Quest retrieved successfully.' })),
      http.get(`${apiUrl}/heroes`, () => { heroRequests += 1; return HttpResponse.json(roster(heroes)) }),
      http.post(`${apiUrl}/missions`, async ({ request }) => {
        requestCount += 1
        submitted = await request.json()
        return HttpResponse.json({ data: { id: 44, status: 'assigned', quest: { id: 7, title: quest.title }, heroes: [{ id: 1, name: 'Biscuit', hero_class: 'warrior' }], completed_at: null, created_at: '2026-01-01T00:00:00Z' } }, { status: 201 })
      }),
      http.get(`${apiUrl}/missions/44`, () => HttpResponse.json({ data: { id: 44, status: 'assigned', quest: { id: 7, title: quest.title }, heroes: [{ id: 1, name: 'Biscuit', hero_class: 'warrior' }], completed_at: null, created_at: '2026-01-01T00:00:00Z' }, message: 'Mission retrieved successfully.' })),
    )
    renderRoute()

    await user.click(await screen.findByRole('button', { name: /Biscuit.*Available/i }))
    await user.click(screen.getByRole('button', { name: 'Send on adventure!' }))
    expect(submitted).toEqual({ quest_id: 7, hero_ids: [1] })
    expect(requestCount).toBe(1)
    expect(await screen.findByRole('status')).toHaveTextContent('Your party is on its way!')
    expect(heroRequests).toBeGreaterThanOrEqual(2)
    expect(await screen.findByRole('heading', { name: 'The Clockwork Catacombs' }, { timeout: 1_500 })).toBeInTheDocument()
  })

  it('keeps selections when Laravel rejects a mission', async () => {
    const user = userEvent.setup()
    let calls = 0
    useBuilderHandlers()
    server.use(http.post(`${apiUrl}/missions`, () => { calls += 1; return HttpResponse.json({ message: 'The selected hero is no longer available.', errors: { hero_ids: ['The selected hero is no longer available.'] } }, { status: 422 }) }))
    renderRoute()

    await user.click(await screen.findByRole('button', { name: /Biscuit.*Available/i }))
    await user.click(screen.getByRole('button', { name: 'Send on adventure!' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('The selected hero is no longer available.')
    expect(screen.getByLabelText('Party slots: 1 of 4 filled')).toBeInTheDocument()
    expect(calls).toBe(1)
  })

  it('prevents a duplicate submission while mission creation is pending', async () => {
    const user = userEvent.setup()
    let calls = 0
    useBuilderHandlers()
    server.use(http.post(`${apiUrl}/missions`, async () => { calls += 1; return new Promise<never>(() => {}) }))
    renderRoute()

    await user.click(await screen.findByRole('button', { name: /Biscuit.*Available/i }))
    const submit = screen.getByRole('button', { name: 'Send on adventure!' })
    await user.click(submit)
    expect(submit).toBeDisabled()
    await user.click(submit)
    expect(calls).toBe(1)
  })

  it('shows builder loading and hero API error states', async () => {
    server.use(
      http.get(`${apiUrl}/quests/7`, async () => new Promise<never>(() => {})),
      http.get(`${apiUrl}/heroes`, async () => new Promise<never>(() => {})),
    )
    const loading = renderRoute()
    expect(screen.getByRole('status')).toHaveTextContent('Preparing the adventure table…')
    loading.unmount()

    useBuilderHandlers()
    server.use(http.get(`${apiUrl}/heroes`, () => HttpResponse.json({ message: 'Ledger unavailable.' }, { status: 500 })))
    renderRoute()
    expect(await screen.findByRole('heading', { name: 'The adventurer ledger is unavailable' }, { timeout: 2_500 })).toBeInTheDocument()
  })

  it('handles an empty roster, unavailable direct quest, API failures, and bearer authorization', async () => {
    useBuilderHandlers([])
    let authorization: string | null = null
    setAccessToken('party-token')
    server.use(http.get(`${apiUrl}/heroes`, ({ request }) => { authorization = request.headers.get('authorization'); return HttpResponse.json(roster([])) }))
    const empty = renderRoute()
    expect(await screen.findByRole('heading', { name: 'No adventurers in this page' })).toBeInTheDocument()
    expect(authorization).toBe('Bearer party-token')
    empty.unmount()

    server.use(http.get(`${apiUrl}/quests/404`, () => HttpResponse.json({ message: 'Not found.' }, { status: 404 })))
    renderRoute('/quests/404/party')
    expect(await screen.findByRole('heading', { name: 'This quest notice is unavailable' }, { timeout: 2_500 })).toBeInTheDocument()
  })
})
