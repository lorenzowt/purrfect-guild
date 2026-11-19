import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { AppProviders } from '../src/app/providers/AppProviders'
import type { AuthState } from '../src/app/providers/AuthStateProvider'
import { ApplicationRoutes } from '../src/app/router/AppRouter'
import { server } from './mocks/server'

const apiUrl = 'http://127.0.0.1:8000/api'
const admin = { status: 'authenticated' as const, user: { role: 'admin' as const } }
const user = { status: 'authenticated' as const, user: { role: 'user' as const } }
const member = { id: 2, name: 'Mittens', email: 'mittens@example.test', role: 'user' as const, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
const quest = { id: 4, title: 'The Moonlit Mice', description: 'A squeaky mystery.', boss: 'Moon Mouse', difficulty: 3, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
const hero = { id: 8, name: 'Captain Whiskers', hero_class: 'warrior' as const, level: 4, status: 'available' as const, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
const mission = { id: 9, status: 'assigned' as const, quest: { id: quest.id, title: quest.title }, heroes: [{ id: hero.id, name: hero.name, hero_class: hero.hero_class }], created_at: '2026-01-02T00:00:00Z', completed_at: null }
function page<T>(data: T[]) { return { data, links: { first: null, last: null, prev: null, next: null }, meta: { current_page: 1, last_page: 1, per_page: 12, total: data.length }, message: 'Retrieved.' } }
function renderRoute(path: string, state: AuthState = admin) { return render(<AppProviders authState={state}><MemoryRouter initialEntries={[path]}><ApplicationRoutes /></MemoryRouter></AppProviders>) }

describe('Guild Master’s Office', () => {
  it('shows office navigation to administrators and denies regular players', async () => {
    renderRoute('/guild')
    expect(await screen.findByRole('heading', { name: 'Guild Master’s Office' })).toBeInTheDocument()
    renderRoute('/admin/users', user)
    expect(screen.getByRole('heading', { name: 'Guild doors locked' })).toBeInTheDocument()
  })

  it('uses the scoped office theme, local SVG icons, and no player navigation', () => {
    renderRoute('/admin')
    expect(screen.getByRole('heading', { name: 'Guild Master’s Office' }).closest('.admin-theme')).toBeInTheDocument()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(document.querySelectorAll('.admin-office__icon')).toHaveLength(4)
    expect(screen.queryByLabelText('Player navigation')).not.toBeInTheDocument()
  })

  it('redirects administrators from normal gameplay routes into the office', async () => {
    renderRoute('/heroes')
    expect(await screen.findByRole('heading', { name: 'Guild Master’s Office' })).toBeInTheDocument()
    expect(screen.getByLabelText('Administrator navigation')).toBeInTheDocument()
    expect(screen.queryByLabelText('Player navigation')).not.toBeInTheDocument()
  })

  it('lists and updates users through documented administrator endpoints', async () => {
    const interaction = userEvent.setup(); let body: unknown
    server.use(http.get(`${apiUrl}/users`, () => HttpResponse.json(page([member]))), http.patch(`${apiUrl}/users/2`, async ({ request }) => { body = await request.json(); return HttpResponse.json({ data: { ...member, name: 'Captain Mittens' }, message: 'Updated.' }) }))
    renderRoute('/admin/users')
    expect(await screen.findByText('mittens@example.test')).toBeInTheDocument()
    await interaction.click(screen.getByRole('button', { name: 'Manage' }))
    await interaction.clear(screen.getByLabelText('Member name')); await interaction.type(screen.getByLabelText('Member name'), 'Captain Mittens')
    await interaction.click(screen.getByRole('button', { name: 'Save member' }))
    expect(body).toEqual({ name: 'Captain Mittens', email: 'mittens@example.test' })
  })

  it('requires confirmation before deleting a member', async () => {
    const interaction = userEvent.setup(); let deletes = 0
    server.use(http.get(`${apiUrl}/users`, () => HttpResponse.json(page([member]))), http.delete(`${apiUrl}/users/2`, () => { deletes += 1; return HttpResponse.json({ message: 'Deleted.' }) }))
    renderRoute('/admin/users'); await screen.findByText('Mittens'); await interaction.click(screen.getByRole('button', { name: 'Manage' })); await interaction.click(screen.getByRole('button', { name: 'Delete account' }))
    expect(deletes).toBe(0); expect(screen.getByRole('dialog')).toHaveTextContent('Deleting this account also removes its heroes and missions.')
  })

  it('creates and retires quest notices', async () => {
    const interaction = userEvent.setup(); let created: unknown
    server.use(http.get(`${apiUrl}/quests`, () => HttpResponse.json(page([quest]))), http.post(`${apiUrl}/quests`, async ({ request }) => { created = await request.json(); return HttpResponse.json({ data: quest, message: 'Created.' }, { status: 201 }) }), http.delete(`${apiUrl}/quests/4`, () => HttpResponse.json({ data: { ...quest, is_active: false }, message: 'Retired.' })))
    renderRoute('/admin/quests'); await screen.findByText('The Moonlit Mice'); await interaction.click(screen.getByRole('button', { name: 'Create quest' })); await interaction.type(screen.getByLabelText('Quest title'), 'Yarn Tower'); await interaction.type(screen.getByLabelText('Description'), 'A tall problem.'); await interaction.type(screen.getByLabelText('Boss'), 'Tower Cat'); const difficulty = screen.getByLabelText('Difficulty'); await interaction.clear(difficulty); await interaction.type(difficulty, '5'); await interaction.click(screen.getByRole('button', { name: 'Save quest' })); expect(created).toEqual({ title: 'Yarn Tower', description: 'A tall problem.', boss: 'Tower Cat', difficulty: 5 })
  })

  it('opens a hero record inside the office and returns to hero oversight', async () => {
    const interaction = userEvent.setup()
    server.use(http.get(`${apiUrl}/heroes`, () => HttpResponse.json(page([hero]))), http.get(`${apiUrl}/heroes/8`, () => HttpResponse.json({ data: hero, message: 'Hero retrieved.' })))
    renderRoute('/admin/heroes')
    await interaction.click(await screen.findByRole('link', { name: 'Inspect' }))
    expect(await screen.findByRole('heading', { name: hero.name })).toBeInTheDocument()
    expect(screen.getByText('Guild-wide hero record').closest('.admin-theme')).toBeInTheDocument()
    await interaction.click(screen.getByRole('link', { name: '← Back to Hero oversight' }))
    expect(await screen.findByRole('heading', { name: 'Hero oversight' })).toBeInTheDocument()
  })

  it('opens a mission record inside the office and returns to the mission archive', async () => {
    const interaction = userEvent.setup()
    server.use(http.get(`${apiUrl}/missions`, () => HttpResponse.json(page([mission]))), http.get(`${apiUrl}/missions/9`, () => HttpResponse.json({ data: mission, message: 'Mission retrieved.' })))
    renderRoute('/admin/missions')
    await interaction.click(await screen.findByRole('link', { name: 'Inspect' }))
    expect(await screen.findByRole('heading', { name: quest.title })).toBeInTheDocument()
    expect(screen.getByText('Guild-wide mission record').closest('.admin-theme')).toBeInTheDocument()
    await interaction.click(screen.getByRole('link', { name: '← Back to Mission archive' }))
    expect(await screen.findByRole('heading', { name: 'Mission archive' })).toBeInTheDocument()
  })

  it('lets an administrator edit and heal another user’s hero within the office', async () => {
    const interaction = userEvent.setup(); let patchBody: unknown; let heals = 0
    const injuredHero = { ...hero, status: 'injured' as const }
    server.use(
      http.get(`${apiUrl}/heroes/8`, () => HttpResponse.json({ data: injuredHero, message: 'Hero retrieved.' })),
      http.patch(`${apiUrl}/heroes/8`, async ({ request }) => { patchBody = await request.json(); return HttpResponse.json({ data: { ...injuredHero, name: 'Captain Paws' }, message: 'Updated.' }) }),
      http.post(`${apiUrl}/heroes/8/heal`, () => { heals += 1; return HttpResponse.json({ data: { ...injuredHero, status: 'available' }, message: 'Healed.' }) }),
    )
    renderRoute('/admin/heroes/8')
    await screen.findByRole('heading', { name: hero.name })
    await interaction.click(screen.getByRole('button', { name: 'Edit hero' }))
    await interaction.clear(screen.getByLabelText('Adventurer name')); await interaction.type(screen.getByLabelText('Adventurer name'), 'Captain Paws')
    await interaction.click(screen.getByRole('button', { name: 'Save hero' }))
    expect(patchBody).toEqual({ name: 'Captain Paws', hero_class: 'warrior' })
    await interaction.click(screen.getByRole('button', { name: 'Heal hero' }))
    expect(await screen.findByRole('status')).toHaveTextContent('cleared for duty')
    expect(heals).toBe(1)
  })

  it('keeps an administrative hero record open when Laravel rejects healing', async () => {
    const interaction = userEvent.setup()
    const injuredHero = { ...hero, status: 'injured' as const }
    server.use(http.get(`${apiUrl}/heroes/8`, () => HttpResponse.json({ data: injuredHero, message: 'Hero retrieved.' })), http.post(`${apiUrl}/heroes/8/heal`, () => HttpResponse.json({ message: 'Hero is not injured.' }, { status: 409 })))
    renderRoute('/admin/heroes/8')
    await screen.findByRole('heading', { name: hero.name })
    await interaction.click(screen.getByRole('button', { name: 'Heal hero' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Hero is not injured.')
    expect(screen.getByLabelText('Administrator navigation')).toBeInTheDocument()
  })

  it('requires confirmation before an administrator deactivates another user’s hero', async () => {
    const interaction = userEvent.setup(); let deactivations = 0
    server.use(http.get(`${apiUrl}/heroes/8`, () => HttpResponse.json({ data: hero, message: 'Hero retrieved.' })), http.delete(`${apiUrl}/heroes/8`, () => { deactivations += 1; return HttpResponse.json({ data: { ...hero, status: 'deactivated' }, message: 'Deactivated.' }) }))
    renderRoute('/admin/heroes/8')
    await screen.findByRole('heading', { name: hero.name })
    await interaction.click(screen.getByRole('button', { name: 'Deactivate hero' }))
    expect(deactivations).toBe(0)
    await interaction.click(screen.getAllByRole('button', { name: 'Deactivate hero' })[1])
    await waitFor(() => expect(deactivations).toBe(1))
    expect(screen.getByLabelText('Administrator navigation').closest('.admin-theme')).toBeInTheDocument()
  })

  it('keeps mission cancellation in the office and closes its confirmation after Laravel accepts it', async () => {
    const interaction = userEvent.setup(); let cancellations = 0
    server.use(http.get(`${apiUrl}/missions/9`, () => HttpResponse.json({ data: mission, message: 'Mission retrieved.' })), http.post(`${apiUrl}/missions/9/cancel`, () => { cancellations += 1; return HttpResponse.json({ data: { ...mission, status: 'canceled' }, message: 'Canceled.' }) }))
    renderRoute('/admin/missions/9')
    await screen.findByRole('heading', { name: quest.title })
    await interaction.click(screen.getByRole('button', { name: 'Cancel mission' }))
    expect(cancellations).toBe(0)
    await interaction.click(screen.getByRole('button', { name: 'Confirm cancellation' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Mission canceled')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(cancellations).toBe(1)
    expect(screen.getByLabelText('Administrator navigation')).toBeInTheDocument()
  })
})
